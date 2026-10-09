# SKIDMO — Contabo VPS Docker deploy

Step-by-step guide to host the full stack (React frontend + Django API + Postgres + Nginx) on a Contabo Linux VPS with Docker.

## Architecture

```
Internet → Nginx (:80/:443)
              ├─ /           → frontend (React SPA)
              ├─ /api/       → backend (Django/Gunicorn)
              ├─ /media/     → uploaded images (volume)
              └─ /static/    → Django static files (volume)
         Postgres (internal only)
```

Files used:

| Path | Role |
|------|------|
| `docker-compose.yml` | Orchestrates db, backend, frontend, nginx |
| `deploy/nginx.conf` | Reverse proxy |
| `deploy/env.example` | Production env template |
| `backend/Dockerfile` | Django + Gunicorn |
| `frontend/Dockerfile` | Vite build + nginx for SPA |

---

## 1. Contabo VPS basics

1. Create a Contabo VPS (Ubuntu 22.04 or 24.04 LTS recommended).
2. Note the **public IP** from the Contabo panel.
3. In your domain DNS (for `skidmosa.com`):
   - **A** record `@` → VPS IP  
   - **A** record `www` → VPS IP  
4. Wait until DNS resolves (check with `ping skidmosa.com`).

Open Contabo firewall / security group if present:

- TCP **22** (SSH)
- TCP **80** (HTTP)
- TCP **443** (HTTPS)

---

## 2. SSH into the server

From your PC:

```bash
ssh root@YOUR_VPS_IP
```

Create a deploy user (optional but recommended):

```bash
adduser deploy
usermod -aG sudo deploy
su - deploy
```

---

## 3. Install Docker

On Ubuntu:

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

Log out and SSH back in so the `docker` group applies, then verify:

```bash
docker --version
docker compose version
```

---

## 4. Put the project on the VPS

### Option A — Git clone (recommended)

```bash
cd ~
git clone https://github.com/YOUR_ORG/Skidmo.git
cd Skidmo
```

### Option B — Upload with SCP (from your PC)

```bash
scp -r ./Skidmo deploy@YOUR_VPS_IP:~/
```

Then on the VPS:

```bash
cd ~/Skidmo
```

---

## 5. Create production `.env`

```bash
cp deploy/env.example .env
nano .env
```

Set at least:

```env
DJANGO_ENV=production
DJANGO_DEBUG=false
DJANGO_SECRET_KEY=<long-random-string>
DJANGO_ALLOWED_HOSTS=skidmosa.com,www.skidmosa.com,YOUR_VPS_IP
DJANGO_CORS_ORIGINS=https://skidmosa.com,https://www.skidmosa.com
VITE_ADMIN_PASSWORD=<your-admin-password>
VITE_SITE_URL=https://skidmosa.com

POSTGRES_DB=skidmo
POSTGRES_USER=skidmo
POSTGRES_PASSWORD=<strong-db-password>

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USE_TLS=true
SMTP_USER=skidmoksa@gmail.com
SMTP_PASSWORD=<gmail-app-password>
SMTP_FROM=skidmoksa@gmail.com
SMTP_TO=skidmoksa@gmail.com
```

Generate a secret key example:

```bash
openssl rand -hex 32
```

**Do not commit `.env`.** Keep it only on the server.

---

## 6. First deploy (HTTP)

From the project root:

```bash
docker compose build
docker compose up -d
```

Check status:

```bash
docker compose ps
docker compose logs -f --tail=100
```

Create a Django superuser (optional, for `/django-admin/`):

```bash
docker compose exec backend python manage.py createsuperuser
```

Open in a browser:

- `http://YOUR_VPS_IP`
- or `http://skidmosa.com` (after DNS)

Smoke checks:

- Home page loads  
- `/api/gallery/` returns JSON  
- Admin login at `/admin` works  
- Upload an image in admin → appears under `/media/...`  
- Contact form sends mail (SMTP must be correct)

---

## 7. HTTPS with Let’s Encrypt (Certbot)

### 7.1 Install Certbot on the host

```bash
sudo apt install -y certbot
```

### 7.2 Temporary HTTP challenge

Stop the stack briefly so Certbot can bind port 80:

```bash
cd ~/Skidmo
docker compose stop nginx
sudo certbot certonly --standalone -d skidmosa.com -d www.skidmosa.com
```

Certificates land in:

```text
/etc/letsencrypt/live/skidmosa.com/fullchain.pem
/etc/letsencrypt/live/skidmosa.com/privkey.pem
```

### 7.3 Switch Nginx to HTTPS

Replace `deploy/nginx.conf` with TLS (or edit in place). Example:

```nginx
upstream django_upstream {
  server backend:8000;
}

upstream frontend_upstream {
  server frontend:80;
}

server {
  listen 80;
  server_name skidmosa.com www.skidmosa.com;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  server_name skidmosa.com www.skidmosa.com;
  client_max_body_size 25M;

  ssl_certificate     /etc/letsencrypt/live/skidmosa.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/skidmosa.com/privkey.pem;

  location /api/ {
    proxy_pass http://django_upstream;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
  }

  location /media/ {
    alias /var/www/media/;
    access_log off;
    expires 7d;
  }

  location /static/ {
    alias /var/www/static/;
    access_log off;
    expires 7d;
  }

  location /django-admin/ {
    proxy_pass http://django_upstream;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
  }

  location / {
    proxy_pass http://frontend_upstream;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto https;
  }
}
```

Update `docker-compose.yml` nginx service ports and cert mounts:

```yaml
  nginx:
    image: nginx:1.27-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./deploy/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - media_data:/var/www/media:ro
      - static_data:/var/www/static:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - frontend
      - backend
```

Restart:

```bash
docker compose up -d
```

Visit `https://skidmosa.com`.

### 7.4 Auto-renew

Certbot installs a timer on Ubuntu. Test renew:

```bash
sudo certbot renew --dry-run
```

If renew uses `--standalone`, stop nginx before renew, or switch to a **webroot** challenge later. Simple cron that stops nginx briefly:

```bash
sudo crontab -e
```

```cron
0 3 * * * cd /home/deploy/Skidmo && docker compose stop nginx && certbot renew --quiet && docker compose start nginx
```

(Adjust the project path to yours.)

---

## 8. Updates / redeploy

After pulling code changes:

```bash
cd ~/Skidmo
git pull
docker compose build
docker compose up -d
```

Migrations run automatically in `backend/entrypoint.sh` on each start.

View logs:

```bash
docker compose logs -f backend
docker compose logs -f nginx
```

---

## 9. Useful commands

| Task | Command |
|------|---------|
| Stop stack | `docker compose down` |
| Stop + wipe DB volumes (destructive) | `docker compose down -v` |
| Shell into API | `docker compose exec backend sh` |
| Django shell | `docker compose exec backend python manage.py shell` |
| DB backup | see below |

### Postgres backup

```bash
docker compose exec -T db pg_dump -U skidmo skidmo > backup-$(date +%F).sql
```

### Restore

```bash
cat backup-YYYY-MM-DD.sql | docker compose exec -T db psql -U skidmo skidmo
```

Media files live in the Docker volume `media_data`. To back them up:

```bash
docker run --rm -v skidmo_media_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/media-backup.tgz -C /data .
```

(Volume name may be `skidmo_media_data` or `<folder>_media_data` — check with `docker volume ls`.)

---

## 10. Troubleshooting

| Symptom | Likely fix |
|---------|------------|
| `Bad Request (400)` from Django | Add domain/IP to `DJANGO_ALLOWED_HOSTS` |
| CORS errors | Set `DJANGO_CORS_ORIGINS` to exact `https://` URLs |
| Contact form fails | Check SMTP env vars; `docker compose logs backend` |
| Images 404 | Confirm nginx mounts `media_data` at `/var/www/media` |
| Blank admin / API | `docker compose logs backend` — often DB password or migrate error |
| Port 80 already in use | Stop Apache/Nginx on host: `sudo systemctl stop apache2 nginx` |
| Frontend shows old build | `docker compose build frontend --no-cache && docker compose up -d` |

---

## 11. Security checklist

- [ ] Strong `DJANGO_SECRET_KEY` and `POSTGRES_PASSWORD`
- [ ] `DJANGO_DEBUG=false`
- [ ] HTTPS enabled; HTTP redirects to HTTPS
- [ ] Firewall: only 22/80/443 open
- [ ] Change default admin password (`VITE_ADMIN_PASSWORD`)
- [ ] `.env` never committed or shared
- [ ] Regular DB + media backups

---

## Local Docker smoke test (optional)

On your machine (same compose file):

```bash
cp deploy/env.example .env
# edit secrets; you can use http://localhost in ALLOWED_HOSTS / CORS for a quick test
docker compose up --build
```

Open http://localhost
