import { sanityWriteClient } from '@/sanity/writeClient'
import type { GalleryImage, Offer, Testimonial, StatItem, HomeStats } from '@/types'

function client() {
  if (!sanityWriteClient) throw new Error('Sanity write client not configured. Check your .env file.')
  return sanityWriteClient
}

async function uploadImage(file: File) {
  return client().assets.upload('image', file, { filename: file.name })
}

// ─── Gallery ───────────────────────────────────────────────

export async function adminGetGallery(): Promise<GalleryImage[]> {
  return client().fetch(`*[_type == "galleryImage"] | order(_createdAt desc) {
    _id, title, image, category, description, altText
  }`)
}

export async function adminCreateGallery(data: {
  title: string
  category: string
  altText: string
  description?: string
  image: File
}) {
  const asset = await uploadImage(data.image)
  return client().create({
    _type: 'galleryImage',
    title: data.title,
    category: data.category,
    altText: data.altText,
    description: data.description || '',
    image: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
  })
}

export async function adminDeleteGallery(id: string) {
  return client().delete(id)
}

// ─── Offers ────────────────────────────────────────────────

export async function adminGetOffers(): Promise<Offer[]> {
  return client().fetch(`*[_type == "offer"] | order(priority desc) {
    _id, title, bannerWeb, bannerMobile, description,
    startDate, expiryDate, buttonText, buttonLink, status, priority
  }`)
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
  const [webAsset, mobileAsset] = await Promise.all([
    uploadImage(data.bannerWeb),
    uploadImage(data.bannerMobile),
  ])
  return client().create({
    _type: 'offer',
    title: data.title,
    description: data.description,
    startDate: data.startDate,
    expiryDate: data.expiryDate,
    buttonText: data.buttonText,
    buttonLink: data.buttonLink,
    status: data.status,
    priority: data.priority,
    bannerWeb: { _type: 'image', asset: { _type: 'reference', _ref: webAsset._id } },
    bannerMobile: { _type: 'image', asset: { _type: 'reference', _ref: mobileAsset._id } },
  })
}

export async function adminDeleteOffer(id: string) {
  return client().delete(id)
}

// ─── Testimonials ──────────────────────────────────────────

export async function adminGetTestimonials(): Promise<Testimonial[]> {
  return client().fetch(`*[_type == "testimonial"] | order(date desc, _createdAt desc) {
    _id, name, role, content, rating, avatar, date, source
  }`)
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
  const doc = {
    _type: 'testimonial' as const,
    name: data.name,
    role: data.role || '',
    content: data.content,
    rating: data.rating,
    date: data.date || undefined,
    source: data.source || 'Direct',
    avatar: undefined as { _type: 'image'; asset: { _type: 'reference'; _ref: string } } | undefined,
  }

  if (data.avatar) {
    const asset = await uploadImage(data.avatar)
    doc.avatar = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
  }

  return client().create(doc)
}

export async function adminDeleteTestimonial(id: string) {
  return client().delete(id)
}

// ─── Homepage stats (singleton) ───────────────────────────

export async function adminGetHomeStats(): Promise<HomeStats | null> {
  return client().fetch(`*[_type == "homeStats"][0] { _id, stats }`)
}

export async function adminSaveHomeStats(stats: StatItem[]) {
  return client().createOrReplace({
    _id: 'homeStats',
    _type: 'homeStats',
    stats,
  })
}
