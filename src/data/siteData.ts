import raw from './data.json'
import type { FAQ, ServiceItem } from '@/types'

export interface SiteJson {
  site: { name: string; tagline: string; description: string }
  parentCompany: { name: string; url: string }
  credits: { name: string; url: string; color: string }
  contact: {
    phone: string
    whatsapp: string
    email: string
    address: string
    addressShort: string
    mapUrl: string
    coordinates: { lat: number; lng: number }
  }
  workingHours: { day: string; hours: string }[]
  social: Record<string, string>
  nav: { label: string; path: string; hasMegaMenu?: boolean }[]
  footerLinks: { label: string; path: string }[]
  whyChooseUs: { icon: string; title: string; description: string }[]
  faqs: { id: string; question: string; answer: string; category?: string; order?: number }[]
  services: ServiceItem[]
  legal: {
    terms: LegalDocument
    privacy: LegalDocument
  }
}

export interface LegalSection {
  heading: string
  paragraphs: string[]
}

export interface LegalDocument {
  title: string
  lastUpdated: string
  sections: LegalSection[]
}

const data = raw as SiteJson

function digitsOnly(value: string) {
  return value.replace(/\D/g, '')
}

export const siteData = data

export const SITE_FAQS: FAQ[] = data.faqs
  .slice()
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  .map((faq) => ({
    _id: faq.id,
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    order: faq.order,
  }))

export const SERVICES_DATA: ServiceItem[] = data.services as ServiceItem[]

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return SERVICES_DATA.find((s) => s.slug === slug)
}

export const CONTACT = {
  phone: data.contact.phone,
  phoneHref: `tel:${data.contact.phone.replace(/\s/g, '')}`,
  whatsapp: data.contact.whatsapp,
  whatsappHref: `https://wa.me/${digitsOnly(data.contact.whatsapp)}`,
  email: data.contact.email,
  emailHref: `mailto:${data.contact.email}`,
  address: data.contact.address,
  addressShort: data.contact.addressShort,
  mapEmbedUrl: import.meta.env.VITE_GOOGLE_MAPS_EMBED_URL || '',
  mapUrl: import.meta.env.VITE_GOOGLE_MAPS_URL || data.contact.mapUrl,
  coordinates: data.contact.coordinates,
} as const

export const WORKING_HOURS = data.workingHours
export const SOCIAL_LINKS = data.social
export const NAV_LINKS = data.nav
export const FOOTER_LINKS = data.footerLinks
export const WHY_CHOOSE_US = data.whyChooseUs

export const SITE_NAME = data.site.name
export const SITE_TAGLINE = data.site.tagline
export const SITE_DESCRIPTION = data.site.description

export const PARENT_COMPANY = data.parentCompany
export const SITE_CREDITS = data.credits

export const SERVICE_SLUGS = data.services.map((s) => s.slug)

export const LEGAL_TERMS = data.legal.terms
export const LEGAL_PRIVACY = data.legal.privacy
