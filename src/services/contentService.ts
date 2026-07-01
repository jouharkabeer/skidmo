import type {
  GalleryImage,
  Offer,
  Testimonial,
  FAQ,
  CompanyInfo,
  SiteSettings,
  SanityService,
  SEOData,
  StatItem,
  HomeStats,
} from '@/types'
import { sanityClient, isSanityConfigured } from '@/sanity/client'
import {
  galleryQuery,
  galleryPaginatedQuery,
  galleryCategoriesQuery,
  offersQuery,
  testimonialsQuery,
  faqsQuery,
  companyInfoQuery,
  homeStatsQuery,
  siteSettingsQuery,
  servicesQuery,
  seoQuery,
} from '@/sanity/queries'
import { MOCK_GALLERY, MOCK_OFFERS, MOCK_TESTIMONIALS, MOCK_FAQS, MOCK_COMPANY_INFO } from '@/sanity/mockData'
import { DEFAULT_STATS } from '@/constants'

async function fetchSanity<T>(query: string, params?: Record<string, unknown>): Promise<T | null> {
  if (!sanityClient) return null
  try {
    return await sanityClient.fetch<T>(query, params ?? {})
  } catch (error) {
    console.warn('Sanity fetch failed:', error)
    return null
  }
}

/** Use mock data only when Sanity is not configured (local dev) */
function withFallback<T>(data: T[] | null | undefined, mock: T[]): T[] {
  if (isSanityConfigured) return data ?? []
  return data?.length ? data : mock
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const data = await fetchSanity<GalleryImage[]>(galleryQuery)
  return withFallback(data, MOCK_GALLERY)
}

export async function getGalleryImagesPaginated(page: number, perPage = 12): Promise<GalleryImage[]> {
  const start = (page - 1) * perPage
  const end = start + perPage
  const data = await fetchSanity<GalleryImage[]>(galleryPaginatedQuery(start, end))
  if (isSanityConfigured) return data ?? []
  return data?.length ? data : MOCK_GALLERY.slice(start, end)
}

export async function getGalleryCategories(): Promise<string[]> {
  const data = await fetchSanity<string[]>(galleryCategoriesQuery)
  if (data?.length) return ['All', ...data]
  if (isSanityConfigured) return ['All']
  return ['All', ...new Set(MOCK_GALLERY.map((g) => g.category))]
}

export async function getOffers(): Promise<Offer[]> {
  const data = await fetchSanity<Offer[]>(offersQuery)
  return withFallback(data, MOCK_OFFERS)
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await fetchSanity<Testimonial[]>(testimonialsQuery)
  return withFallback(data, MOCK_TESTIMONIALS)
}

export async function getFAQs(): Promise<FAQ[]> {
  const data = await fetchSanity<FAQ[]>(faqsQuery)
  if (data?.length) return data
  return MOCK_FAQS
}

export async function getCompanyInfo(): Promise<CompanyInfo> {
  const data = await fetchSanity<CompanyInfo>(companyInfoQuery)
  return mergeCompanyInfo(data)
}

export async function getHomeStats(): Promise<StatItem[]> {
  const data = await fetchSanity<HomeStats>(homeStatsQuery)
  if (data?.stats?.length) return data.stats
  return DEFAULT_STATS
}

function mergeCompanyInfo(data: CompanyInfo | null | undefined): CompanyInfo {
  if (!data) return MOCK_COMPANY_INFO
  return {
    ...MOCK_COMPANY_INFO,
    ...data,
    values: data.values?.length ? data.values : MOCK_COMPANY_INFO.values,
    workshopImages: data.workshopImages?.length ? data.workshopImages : MOCK_COMPANY_INFO.workshopImages,
    about: data.about || MOCK_COMPANY_INFO.about,
    mission: data.mission || MOCK_COMPANY_INFO.mission,
    vision: data.vision || MOCK_COMPANY_INFO.vision,
    tagline: data.tagline || MOCK_COMPANY_INFO.tagline,
  }
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return fetchSanity<SiteSettings>(siteSettingsQuery)
}

export async function getSanityServices(): Promise<SanityService[] | null> {
  return fetchSanity<SanityService[]>(servicesQuery)
}

export async function getSEO(page: string): Promise<SEOData | null> {
  return fetchSanity<SEOData>(seoQuery, { page })
}

export { isSanityConfigured }
