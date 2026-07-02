export type ServiceSlug =
  | 'ppf'
  | 'ceramic-coating'
  | 'window-tint'
  | 'paint-correction'
  | 'car-wash'
  | 'interior-detailing'

export interface ServiceItem {
  slug: ServiceSlug
  title: string
  shortTitle: string
  tagline: string
  description: string
  image: string
  heroImage: string
  benefits: string[]
  features: string[]
  icon: string
}

export interface SEOData {
  metaTitle?: string
  metaDescription?: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: { asset?: { url?: string } }
}

export interface SanityImage {
  asset?: {
    _id?: string
    _ref?: string
    url?: string
  }
  alt?: string
}

export interface GalleryImage {
  _id: string
  title: string
  image: SanityImage
  category: string
  description?: string
  altText?: string
  seo?: SEOData
}

export interface Offer {
  _id: string
  title: string
  bannerWeb: SanityImage
  bannerMobile: SanityImage
  description: string
  startDate: string
  expiryDate: string
  buttonText: string
  buttonLink: string
  status: 'active' | 'expired' | 'draft'
  priority: number
}

export interface Testimonial {
  _id: string
  name: string
  role?: string
  content: string
  rating: number
  avatar?: SanityImage
  date?: string
  source?: string
}

export interface FAQ {
  _id: string
  question: string
  answer: string
  category?: string
  order?: number
}

export interface StatItem {
  value: number
  suffix: string
  label: string
}

export interface HomeStats {
  _id: string
  stats: StatItem[]
}

export interface HeroSlideCms {
  description?: string
  alt?: string
  imageUrl?: string
  image?: SanityImage
}

export interface HomeHero {
  _id: string
  badge?: string
  titleBefore?: string
  titleAccent?: string
  titleAfter?: string
  slides?: HeroSlideCms[]
}

export interface ResolvedHeroSlide {
  src: string
  alt: string
  description: string
}

export interface ResolvedHomeHero {
  badge: string
  titleBefore: string
  titleAccent: string
  titleAfter: string
  slides: ResolvedHeroSlide[]
}

export interface CompanyInfo {
  _id: string
  name: string
  tagline?: string
  about?: string
  mission?: string
  vision?: string
  values?: { title: string; description: string }[]
  workshopImages?: SanityImage[]
}

export interface SiteSettings {
  _id: string
  siteName: string
  logo?: SanityImage
  heroVideo?: string
  heroImage?: SanityImage
  elfsightWidgetId?: string
  elfsightEmbedCode?: string
  socialLinks?: Record<string, string>
}

export interface SanityService {
  _id: string
  slug: string
  title: string
  shortTitle?: string
  tagline?: string
  description?: string
  image?: SanityImage
  heroImage?: SanityImage
  benefits?: string[]
  features?: string[]
  icon?: string
  order?: number
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

export interface ContactFormErrors {
  name?: string
  email?: string
  phone?: string
  service?: string
  message?: string
}

export interface BreadcrumbItem {
  name: string
  path?: string
}
