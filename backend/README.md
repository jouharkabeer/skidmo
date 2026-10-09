# SKIDMO Django API

## Setup

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\python manage.py migrate
.venv\Scripts\python manage.py runserver
```

## Environment (`backend/.env`)

```
VITE_ADMIN_PASSWORD=your-admin-password
DJANGO_SECRET_KEY=change-me

# development → SQLite (db.sqlite3)
# production  → PostgreSQL
DJANGO_ENV=development

DJANGO_DEBUG=true
DJANGO_CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Production Postgres

Set `DJANGO_ENV=production` and:

```
DJANGO_DEBUG=false
DJANGO_ALLOWED_HOSTS=api.yourdomain.com
POSTGRES_DB=skidmo
POSTGRES_USER=skidmo
POSTGRES_PASSWORD=strong-password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

Then migrate against Postgres:

```bash
.venv\Scripts\python manage.py migrate
```

## API overview

| Endpoint | Auth | Description |
|----------|------|-------------|
| `POST /api/admin/login/` | — | `{ password }` → `{ token }` |
| `GET/POST /api/gallery/` | write needs token | Gallery images |
| `GET/POST /api/offers/` | write needs token | Offers |
| `GET/POST /api/testimonials/` | write needs token | Testimonials |
| `GET/PUT /api/home-stats/` | write needs token | Homepage stats |
| `GET/PUT /api/home-hero/` | write needs token | Homepage hero |
| `GET/POST /api/admin/vehicles/` | token | Vehicle warranties |
| `GET /api/warranty/<barcode>/` | public | Warranty lookup |

Admin dashboard at `/admin` on the React site uses the same password and Bearer token.

Django admin: `python manage.py createsuperuser` then `/django-admin/`.
