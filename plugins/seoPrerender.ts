import type { Plugin } from 'vite'
import { mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'

interface PrerenderPage {
  path: string
  title: string
  description: string
  keywords: string
  canonical: string
  ogImage: string
  ogImageAlt: string
}

function injectMeta(html: string, page: PrerenderPage): string {
  const metaBlock = [
    `<title>${page.title}</title>`,
    `<meta name="description" content="${page.description}" />`,
    `<meta name="keywords" content="${page.keywords}" />`,
    `<link rel="canonical" href="${page.canonical}" />`,
    `<meta property="og:title" content="${page.title}" />`,
    `<meta property="og:description" content="${page.description}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:url" content="${page.canonical}" />`,
    `<meta property="og:image" content="${page.ogImage}" />`,
    `<meta property="og:image:secure_url" content="${page.ogImage}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${page.ogImageAlt}" />`,
    `<meta property="og:site_name" content="SKIDMO" />`,
    `<meta property="og:locale" content="en_SA" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${page.title}" />`,
    `<meta name="twitter:description" content="${page.description}" />`,
    `<meta name="twitter:image" content="${page.ogImage}" />`,
    `<meta name="twitter:image:alt" content="${page.ogImageAlt}" />`,
  ].join('\n    ')

  // Strip any existing SEO block from dev template
  let output = html.replace(/<!-- SEO:PRERENDER -->[\s\S]*?<!-- \/SEO:PRERENDER -->/, '')
  output = output.replace(/<title>[\s\S]*?<\/title>\s*/i, '')

  // Inject after theme-color (Vite keeps this in built HTML)
  if (output.includes('name="theme-color"')) {
    return output.replace(
      /(<meta name="theme-color"[^>]*>)/i,
      `$1\n    ${metaBlock}`
    )
  }

  return output.replace('</head>', `    ${metaBlock}\n  </head>`)
}

/** Writes per-route index.html with static meta for social crawlers (WhatsApp, Facebook, etc.) */
export function seoPrerenderPlugin(pages: PrerenderPage[]): Plugin {
  return {
    name: 'seo-prerender',
    closeBundle() {
      const outDir = join(process.cwd(), 'dist')
      const baseHtml = readFileSync(join(outDir, 'index.html'), 'utf-8')

      for (const page of pages) {
        if (page.path === '/') continue

        const html = injectMeta(baseHtml, page)
        const filePath = join(outDir, page.path.replace(/^\//, ''), 'index.html')
        mkdirSync(dirname(filePath), { recursive: true })
        writeFileSync(filePath, html, 'utf-8')
      }

      const home = pages.find((p) => p.path === '/')
      if (home) {
        writeFileSync(join(outDir, 'index.html'), injectMeta(baseHtml, home), 'utf-8')
      }
    },
  }
}
