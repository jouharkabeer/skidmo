import { apiRequest, mediaUrl, setAdminToken, clearAdminToken, getAdminToken } from './api'
import type {
  GalleryImage,
  Offer,
  Testimonial,
  FAQ,
  StatItem,
  HomeStats,
  HomeHero,
  ResolvedHomeHero,
  CompanyInfo,
  SiteSettings,
  VehicleWarranty,
} from '@/types'
import { DEFAULT_STATS } from '@/constants'
import { DEFAULT_HOME_HERO } from '@/constants/hero'

function asImage(url: string | null | undefined) {
  const src = mediaUrl(url)
  return src ? { asset: { url: src } } : undefined
}

function mapGallery(item: Record<string, unknown>): GalleryImage {
  return {
    _id: String(item.id),
    title: String(item.title || ''),
    image: asImage(item.imageUrl as string) || { asset: { url: '' } },
    category: String(item.category || ''),
    description: (item.description as string) || '',
    altText: (item.altText as string) || '',
  }
}

function mapOffer(item: Record<string, unknown>): Offer {
  return {
    _id: String(item.id),
    title: String(item.title || ''),
    description: String(item.description || ''),
    bannerWeb: asImage(item.bannerWebUrl as string) || { asset: { url: '' } },
    bannerMobile: asImage(item.bannerMobileUrl as string) || { asset: { url: '' } },
    startDate: String(item.startDate || ''),
    expiryDate: String(item.expiryDate || ''),
    buttonText: String(item.buttonText || 'Claim Offer'),
    buttonLink: String(item.buttonLink || '/contact'),
    status: (item.status as Offer['status']) || 'active',
    priority: Number(item.priority) || 0,
  }
}

function mapTestimonial(item: Record<string, unknown>): Testimonial {
  return {
    _id: String(item.id),
    name: String(item.name || ''),
    role: (item.role as string) || '',
    content: String(item.content || ''),
    rating: Number(item.rating) || 5,
    avatar: asImage(item.avatarUrl as string),
    date: (item.date as string) || undefined,
    source: (item.source as string) || 'Direct',
  }
}

function mapFaq(item: Record<string, unknown>): FAQ {
  return {
    _id: String(item.id),
    question: String(item.question || ''),
    answer: String(item.answer || ''),
    category: (item.category as string) || '',
    order: Number(item.order) || 0,
  }
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  try {
    const data = await apiRequest<Record<string, unknown>[]>('/api/gallery/')
    return (data || []).map(mapGallery)
  } catch {
    return []
  }
}

export async function getGalleryCategories(): Promise<string[]> {
  try {
    return await apiRequest<string[]>('/api/gallery/categories/')
  } catch {
    return ['All']
  }
}

export async function getOffers(): Promise<Offer[]> {
  try {
    const data = await apiRequest<Record<string, unknown>[]>('/api/offers/')
    return (data || []).map(mapOffer)
  } catch {
    return []
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const data = await apiRequest<Record<string, unknown>[]>('/api/testimonials/')
    return (data || []).map(mapTestimonial)
  } catch {
    return []
  }
}

export async function getFAQs(): Promise<FAQ[]> {
  try {
    const data = await apiRequest<Record<string, unknown>[]>('/api/faqs/')
    return (data || []).map(mapFaq)
  } catch {
    return []
  }
}

export async function getCompanyInfo(): Promise<CompanyInfo> {
  try {
    const data = await apiRequest<Record<string, unknown> | null>('/api/company/')
    if (!data) {
      return {
        _id: 'company',
        name: 'SKIDMO',
        tagline: '',
        about: '',
        mission: '',
        vision: '',
        values: [],
        workshopImages: [],
      }
    }
    return {
      _id: String(data.id || 'company'),
      name: String(data.name || 'SKIDMO'),
      tagline: (data.tagline as string) || '',
      about: (data.about as string) || '',
      mission: (data.mission as string) || '',
      vision: (data.vision as string) || '',
      values: (data.values as CompanyInfo['values']) || [],
      workshopImages: ((data.workshopImages as { url?: string }[]) || []).map((img) =>
        asImage(img.url) || { asset: { url: '' } }
      ),
    }
  } catch {
    return {
      _id: 'company',
      name: 'SKIDMO',
      tagline: '',
      about: '',
      mission: '',
      vision: '',
      values: [],
      workshopImages: [],
    }
  }
}

export async function getHomeStats(): Promise<StatItem[]> {
  try {
    const data = await apiRequest<HomeStats>('/api/home-stats/')
    if (data?.stats?.length) return data.stats
  } catch {
    /* fall through */
  }
  return DEFAULT_STATS
}

export async function getHomeHero(): Promise<ResolvedHomeHero> {
  const defaults = DEFAULT_HOME_HERO
  try {
    const data = await apiRequest<HomeHero | null>('/api/home-hero/')
    if (!data) {
      return {
        badge: defaults.badge,
        titleBefore: defaults.titleBefore,
        titleAccent: defaults.titleAccent,
        titleAfter: defaults.titleAfter,
        slides: defaults.slides.map((s) => ({ ...s })),
      }
    }
    const slides = defaults.slides.map((def, index) => {
      const cms = data.slides?.[index]
      return {
        src: mediaUrl(cms?.imageUrl) || def.src,
        alt: cms?.alt?.trim() || def.alt,
        description: cms?.description?.trim() || def.description,
      }
    })
    return {
      badge: data.badge?.trim() || defaults.badge,
      titleBefore: data.titleBefore?.trim() || defaults.titleBefore,
      titleAccent: data.titleAccent?.trim() || defaults.titleAccent,
      titleAfter: data.titleAfter?.trim() || defaults.titleAfter,
      slides,
    }
  } catch {
    return {
      badge: defaults.badge,
      titleBefore: defaults.titleBefore,
      titleAccent: defaults.titleAccent,
      titleAfter: defaults.titleAfter,
      slides: defaults.slides.map((s) => ({ ...s })),
    }
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const data = await apiRequest<Record<string, unknown> | null>('/api/site-settings/')
    if (!data) return null
    return {
      _id: String(data.id || 'settings'),
      siteName: String(data.siteName || 'SKIDMO'),
      elfsightWidgetId: (data.elfsightWidgetId as string) || '',
      elfsightEmbedCode: (data.elfsightEmbedCode as string) || '',
      socialLinks: (data.socialLinks as Record<string, string>) || {},
    }
  } catch {
    return null
  }
}

/** Public warranty lookup by barcode — no login */
export async function lookupWarranty(barcode: string): Promise<VehicleWarranty> {
  const code = encodeURIComponent(barcode.trim())
  return apiRequest<VehicleWarranty>(`/api/warranty/${code}/`)
}

export { getAdminToken, setAdminToken, clearAdminToken }
