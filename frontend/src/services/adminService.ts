import { apiRequest, setAdminToken, clearAdminToken } from './api'
import type {
  GalleryImage,
  Offer,
  Testimonial,
  StatItem,
  HomeHero,
  VehicleWarranty,
  VehicleWarrantyInput,
  CmsImage,
} from '@/types'
import { getGalleryImages, getTestimonials, getHomeStats } from './contentService'

export async function adminLogin(password: string): Promise<boolean> {
  const data = await apiRequest<{ token: string; expiresInHours: number }>('/api/admin/login/', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
  setAdminToken(data.token, data.expiresInHours)
  return true
}

export async function adminLogout(): Promise<void> {
  try {
    await apiRequest('/api/admin/logout/', { method: 'POST', auth: true })
  } catch {
    /* ignore */
  }
  clearAdminToken()
}

export async function adminGetGallery(): Promise<GalleryImage[]> {
  return getGalleryImages()
}

export async function adminCreateGallery(data: {
  title: string
  category: string
  altText: string
  description?: string
  image: File
}) {
  const form = new FormData()
  form.append('title', data.title)
  form.append('category', data.category)
  form.append('altText', data.altText)
  form.append('description', data.description || '')
  form.append('image', data.image)
  return apiRequest('/api/gallery/', { method: 'POST', body: form, auth: true })
}

export async function adminDeleteGallery(id: string) {
  return apiRequest(`/api/gallery/${id}/`, { method: 'DELETE', auth: true })
}

export async function adminGetOffers(): Promise<Offer[]> {
  const data = await apiRequest<Record<string, unknown>[]>('/api/offers/', { auth: true })
  return (data || []).map((item) => ({
    _id: String(item.id),
    title: String(item.title || ''),
    description: String(item.description || ''),
    bannerWeb: item.bannerWebUrl ? { asset: { url: String(item.bannerWebUrl) } } : { asset: { url: '' } },
    bannerMobile: item.bannerMobileUrl ? { asset: { url: String(item.bannerMobileUrl) } } : { asset: { url: '' } },
    startDate: String(item.startDate || ''),
    expiryDate: String(item.expiryDate || ''),
    buttonText: String(item.buttonText || 'Claim Offer'),
    buttonLink: String(item.buttonLink || '/contact'),
    status: (item.status as Offer['status']) || 'active',
    priority: Number(item.priority) || 0,
  }))
}

export async function adminCreateOffer(data: {
  title: string
  description: string
  startDate: string
  expiryDate: string
  buttonText: string
  buttonLink: string
  status: string
  priority: number
  bannerWeb: File
  bannerMobile: File
}) {
  const form = new FormData()
  form.append('title', data.title)
  form.append('description', data.description)
  form.append('startDate', data.startDate)
  form.append('expiryDate', data.expiryDate)
  form.append('buttonText', data.buttonText)
  form.append('buttonLink', data.buttonLink)
  form.append('status', data.status)
  form.append('priority', String(data.priority))
  form.append('banner_web', data.bannerWeb)
  form.append('banner_mobile', data.bannerMobile)
  return apiRequest('/api/offers/', { method: 'POST', body: form, auth: true })
}

export async function adminDeleteOffer(id: string) {
  return apiRequest(`/api/offers/${id}/`, { method: 'DELETE', auth: true })
}

export async function adminGetTestimonials(): Promise<Testimonial[]> {
  return getTestimonials()
}

export async function adminCreateTestimonial(data: {
  name: string
  role?: string
  content: string
  rating: number
  date?: string
  source?: string
  avatar?: File
}) {
  const form = new FormData()
  form.append('name', data.name)
  form.append('role', data.role || '')
  form.append('content', data.content)
  form.append('rating', String(data.rating))
  form.append('source', data.source || 'Direct')
  if (data.date) form.append('date', data.date)
  if (data.avatar) form.append('avatar', data.avatar)
  return apiRequest('/api/testimonials/', { method: 'POST', body: form, auth: true })
}

export async function adminDeleteTestimonial(id: string) {
  return apiRequest(`/api/testimonials/${id}/`, { method: 'DELETE', auth: true })
}

export async function adminGetHomeStats() {
  const stats = await getHomeStats()
  return { stats }
}

export async function adminSaveHomeStats(stats: StatItem[]) {
  return apiRequest('/api/home-stats/', {
    method: 'PUT',
    auth: true,
    body: JSON.stringify({ stats }),
  })
}

export type HeroSlideSaveInput = {
  description: string
  alt: string
  imageUrl?: string
  image?: File | null
  existingImage?: CmsImage
}

export async function adminGetHomeHero(): Promise<HomeHero | null> {
  try {
    return await apiRequest<HomeHero | null>('/api/home-hero/')
  } catch {
    return null
  }
}

export async function adminSaveHomeHero(data: {
  badge: string
  titleBefore: string
  titleAccent: string
  titleAfter: string
  slides: HeroSlideSaveInput[]
}) {
  const form = new FormData()
  form.append('badge', data.badge)
  form.append('titleBefore', data.titleBefore)
  form.append('titleAccent', data.titleAccent)
  form.append('titleAfter', data.titleAfter)

  const slides = data.slides.map((slide) => {
    const existingUrl = slide.existingImage?.asset?.url || ''
    return {
      description: slide.description,
      alt: slide.alt,
      imageUrl: slide.imageUrl?.trim() || (slide.image ? '' : existingUrl),
    }
  })
  form.append('slides', JSON.stringify(slides))

  data.slides.forEach((slide, index) => {
    if (slide.image) form.append(`slideImage${index}`, slide.image)
  })

  return apiRequest('/api/home-hero/', { method: 'PUT', body: form, auth: true })
}

export async function adminGetVehicles(): Promise<VehicleWarranty[]> {
  return apiRequest<VehicleWarranty[]>('/api/admin/vehicles/', { auth: true })
}

export async function adminCreateVehicle(data: VehicleWarrantyInput) {
  return apiRequest('/api/admin/vehicles/', {
    method: 'POST',
    auth: true,
    body: JSON.stringify(data),
  })
}

export async function adminUpdateVehicle(id: number, data: VehicleWarrantyInput) {
  return apiRequest(`/api/admin/vehicles/${id}/`, {
    method: 'PUT',
    auth: true,
    body: JSON.stringify(data),
  })
}

export async function adminDeleteVehicle(id: number) {
  return apiRequest(`/api/admin/vehicles/${id}/`, { method: 'DELETE', auth: true })
}
