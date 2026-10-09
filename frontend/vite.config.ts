import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { sendContactEmail } from './lib/sendContactEmail.ts'
import { seoPrerenderPlugin } from './plugins/seoPrerender.ts'

const PRERENDER_PAGES = [
  {
    path: '/',
    title: 'SKIDMO KSA — Colmo PPF & Paint Protection Film Riyadh',
    description:
      "SKIDMO KSA by Colmo Ventures — Saudi Arabia's premium Colmo PPF studio in Riyadh for paint protection film, ceramic coating, window tint, paint correction & luxury car detailing. XPEL & STEK certified.",
    keywords: 'SKIDMO KSA, SKIDMO Saudi Arabia, skidmo ksa, Colmo PPF, Colmo PPF Riyadh, PPF Riyadh, paint protection film Riyadh, ceramic coating Riyadh, SKIDMO',
  },
  {
    path: '/about',
    title: 'About SKIDMO — Automotive Protection Studio Riyadh | SKIDMO',
    description:
      'Meet SKIDMO — certified PPF and ceramic coating specialists in Riyadh. Precision installation and premium products for luxury vehicles.',
    keywords: 'PPF Riyadh, paint protection film Riyadh, SKIDMO about',
  },
  {
    path: '/services',
    title: 'PPF, Ceramic Coating & Detailing Services Riyadh | SKIDMO',
    description:
      'Paint protection film (PPF), ceramic coating, window tinting, paint correction & interior detailing in Riyadh. Warranty-backed results.',
    keywords: 'PPF Riyadh, paint protection film Riyadh, ceramic coating Riyadh, window tint Riyadh',
  },
  {
    path: '/gallery',
    title: 'PPF & Detailing Gallery — SKIDMO Riyadh | SKIDMO',
    description: 'Portfolio of PPF, ceramic coating, and detailing work on luxury vehicles at SKIDMO Riyadh.',
    keywords: 'PPF gallery Riyadh, ceramic coating results, SKIDMO portfolio',
  },
  {
    path: '/offers',
    title: 'PPF & Ceramic Coating Offers Riyadh | SKIDMO',
    description: 'Promotions on paint protection film, ceramic coating, and window tint at SKIDMO Riyadh.',
    keywords: 'PPF deals Riyadh, ceramic coating offer, SKIDMO promotions',
  },
  {
    path: '/faq',
    title: 'PPF & Ceramic Coating FAQ — Riyadh | SKIDMO',
    description: 'Expert answers about paint protection film (PPF), ceramic coating, and car care in Riyadh.',
    keywords: 'PPF FAQ, paint protection film questions, ceramic coating Riyadh',
  },
  {
    path: '/contact',
    title: 'Book PPF & Ceramic Coating — Contact SKIDMO Riyadh | SKIDMO',
    description: 'Book paint protection film or ceramic coating in Riyadh. Call, WhatsApp, or request a quote online.',
    keywords: 'book PPF Riyadh, SKIDMO contact, paint protection film quote',
  },
  {
    path: '/warranty',
    title: 'Check Warranty | SKIDMO',
    description: 'Verify your SKIDMO vehicle protection warranty by barcode — no login required.',
    keywords: 'SKIDMO warranty, PPF warranty check Riyadh',
  },
  {
    path: '/terms',
    title: 'Terms & Conditions | SKIDMO',
    description: 'Terms and conditions for SKIDMO automotive protection services in Riyadh.',
    keywords: 'SKIDMO terms',
  },
  {
    path: '/privacy',
    title: 'Privacy Policy | SKIDMO',
    description: 'How SKIDMO collects, uses, and protects your personal information.',
    keywords: 'SKIDMO privacy policy',
  },
]

function escapeAttr(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

function buildPrerenderPages(siteUrl: string, fbAppId?: string) {
  const base = siteUrl.replace(/\/$/, '')
  const ogImage = `${base}/og-image.jpg`
  const ogAlt = 'SKIDMO by Colmo Ventures — Colmo PPF, paint protection film and car detailing in Riyadh'
  return PRERENDER_PAGES.map((page) => ({
    ...page,
    title: escapeAttr(page.title),
    description: escapeAttr(page.description),
    keywords: escapeAttr(page.keywords),
    canonical: `${base}${page.path === '/' ? '/' : page.path}`,
    ogImage,
    ogImageAlt: escapeAttr(ogAlt),
    ...(fbAppId ? { fbAppId } : {}),
  }))
}

function contactApiDevPlugin(): Plugin {
  return {
    name: 'contact-api-dev',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res, next) => {
        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          res.end()
          return
        }
        if (req.method !== 'POST') {
          next()
          return
        }

        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', async () => {
          try {
            const data = JSON.parse(body)
            const env = loadEnv(server.config.mode, process.cwd(), '')
            await sendContactEmail(data, env)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true }))
          } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to send message'
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: message }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const rawUrl = env.VITE_SITE_URL || 'https://skidmosa.com'
  const siteUrl = rawUrl.includes('localhost') || rawUrl.includes('127.0.0.1')
    ? 'https://skidmosa.com'
    : rawUrl.replace(/\/$/, '')
  const djangoTarget = env.VITE_DJANGO_PROXY || 'http://127.0.0.1:8000'

  return {
    plugins: [
      react(),
      tailwindcss(),
      contactApiDevPlugin(),
      seoPrerenderPlugin(buildPrerenderPages(siteUrl, env.VITE_FB_APP_ID || undefined)),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: djangoTarget,
          changeOrigin: true,
          bypass(req) {
            if (req.url?.startsWith('/api/contact')) return req.url
          },
        },
        '/media': {
          target: djangoTarget,
          changeOrigin: true,
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 2000,
    },
  }
})
