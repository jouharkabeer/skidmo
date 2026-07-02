import { SITE_URL } from '@/constants'

/** Primary SEO keywords — PPF / paint protection film Riyadh focus */
export const SEO_KEYWORDS = [
  'SKIDMO KSA',
  'SKIDMO Saudi Arabia',
  'SKIDMO Riyadh',
  'skidmo ksa',
  'skidmosa',
  'Colmo PPF',
  'Colmo PPF Riyadh',
  'Colmo Ventures PPF',
  'SKIDMO Colmo',
  'PPF Riyadh',
  'paint protection film Riyadh',
  'paint protection film Saudi Arabia',
  'PPF installation Riyadh',
  'ceramic coating Riyadh',
  'car detailing Riyadh',
  'window tinting Riyadh',
  'paint correction Riyadh',
  'luxury car protection Riyadh',
  'XPEL Riyadh',
  'STEK PPF Riyadh',
  'automotive protection Saudi Arabia',
  'SKIDMO',
] as const

/** Absolute URL for OG images — production domain when running locally */
function shareBaseUrl(): string {
  const url = SITE_URL.replace(/\/$/, '')
  if (url.includes('localhost') || url.includes('127.0.0.1')) return 'https://skidmosa.com'
  return url
}

export const OG_IMAGE_PATH = '/og-image.jpg'
export const OG_IMAGE_URL = `${shareBaseUrl()}${OG_IMAGE_PATH}`
export const OG_IMAGE_ALT =
  'SKIDMO by Colmo Ventures — Colmo PPF, paint protection film, ceramic coating and luxury car detailing in Riyadh'

export interface PageSEO {
  path: string
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  ogImageAlt?: string
}

export const HOME_SEO: PageSEO = {
  path: '/',
  title: 'SKIDMO KSA — Colmo PPF & Paint Protection Film Riyadh',
  description:
    'SKIDMO KSA by Colmo Ventures — Saudi Arabia\'s premium Colmo PPF studio in Riyadh for paint protection film, ceramic coating, window tint, paint correction & luxury car detailing. XPEL & STEK certified.',
  keywords: SEO_KEYWORDS as unknown as string[],
}

export const PAGE_SEO: Record<string, PageSEO> = {
  '/': HOME_SEO,
  '/about': {
    path: '/about',
    title: 'About SKIDMO — Automotive Protection Studio Riyadh',
    description:
      'Meet SKIDMO — certified PPF and ceramic coating specialists in Riyadh. Precision installation, premium products, and white-glove care for luxury vehicles across Saudi Arabia.',
    keywords: [...SEO_KEYWORDS, 'about SKIDMO', 'car protection studio Riyadh'],
  },
  '/services': {
    path: '/services',
    title: 'PPF, Ceramic Coating & Detailing Services Riyadh',
    description:
      'Paint protection film (PPF), ceramic coating, window tinting, paint correction, premium wash & interior detailing in Riyadh. Factory-certified installers with warranty-backed results.',
    keywords: [
      ...SEO_KEYWORDS,
      'full body PPF Riyadh',
      'Gtechniq ceramic Riyadh',
      'car wash Riyadh premium',
    ],
    ogImage: '/og-image.jpg',
    ogImageAlt: 'PPF and ceramic coating services at SKIDMO Riyadh',
  },
  '/gallery': {
    path: '/gallery',
    title: 'PPF & Detailing Gallery — SKIDMO Riyadh',
    description:
      'Browse SKIDMO\'s portfolio of PPF installations, ceramic coating finishes, paint correction, and detailing work on luxury vehicles in Riyadh.',
    keywords: [...SEO_KEYWORDS, 'PPF gallery Riyadh', 'ceramic coating results'],
  },
  '/offers': {
    path: '/offers',
    title: 'PPF & Ceramic Coating Offers Riyadh',
    description:
      'Current promotions on paint protection film, ceramic coating bundles, and window tint packages at SKIDMO Riyadh. Limited-time deals on premium protection.',
    keywords: [...SEO_KEYWORDS, 'PPF deals Riyadh', 'ceramic coating offer'],
  },
  '/faq': {
    path: '/faq',
    title: 'PPF & Ceramic Coating FAQ — Riyadh',
    description:
      'Answers about paint protection film (PPF), ceramic coating, window tint, warranties, and car care in Riyadh\'s climate. Expert guidance from SKIDMO.',
    keywords: [...SEO_KEYWORDS, 'PPF FAQ', 'ceramic coating questions Riyadh'],
  },
  '/contact': {
    path: '/contact',
    title: 'Book PPF & Ceramic Coating — Contact SKIDMO Riyadh',
    description:
      'Book paint protection film, ceramic coating, or detailing in Riyadh. Call, WhatsApp, or request a quote online. Al Olaya studio — open Sat–Thu 10AM–10PM.',
    keywords: [...SEO_KEYWORDS, 'book PPF Riyadh', 'SKIDMO contact'],
  },
  '/terms': {
    path: '/terms',
    title: 'Terms & Conditions',
    description: 'Terms and conditions for SKIDMO automotive protection services in Riyadh, Saudi Arabia.',
    keywords: ['SKIDMO terms', 'automotive service terms Riyadh'],
  },
  '/privacy': {
    path: '/privacy',
    title: 'Privacy Policy',
    description: 'How SKIDMO collects, uses, and protects your personal information.',
    keywords: ['SKIDMO privacy policy'],
  },
}

export function getPageSEO(path: string): PageSEO {
  return PAGE_SEO[path] ?? HOME_SEO
}

export function buildCanonical(path: string): string {
  if (path === '/') return SITE_URL
  return `${SITE_URL}${path}`
}

export function buildFullTitle(pageTitle?: string, siteName = 'SKIDMO'): string {
  if (!pageTitle) return `${siteName} KSA — Colmo PPF & Paint Protection Film Riyadh`
  return `${pageTitle} | ${siteName}`
}
