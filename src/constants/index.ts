import type { StatItem } from '@/types'
import {
  CONTACT,
  NAV_LINKS,
  FOOTER_LINKS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SOCIAL_LINKS,
  WHY_CHOOSE_US,
  WORKING_HOURS,
  SERVICE_SLUGS,
  PARENT_COMPANY,
  SITE_CREDITS,
} from '@/data/siteData'

export {
  CONTACT,
  NAV_LINKS,
  FOOTER_LINKS,
  SOCIAL_LINKS,
  WHY_CHOOSE_US,
  WORKING_HOURS,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  SERVICE_SLUGS,
  PARENT_COMPANY,
  SITE_CREDITS,
}

export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://skidmo.com'

/** Contact page quote / enquiry form anchor */
export const CONTACT_FORM_ID = 'quote-form'
export const CONTACT_FORM_LINK = `/contact#${CONTACT_FORM_ID}`

/** Quote / offer CTAs should land on the contact form, not the page footer. */
export function resolveContactLink(link: string): string {
  const trimmed = link.trim()
  if (trimmed === '/contact' || trimmed === '/contact/') return CONTACT_FORM_LINK
  return trimmed
}

export const DEFAULT_STATS: StatItem[] = [
  { value: 12, suffix: '+', label: 'Years Experience' },
  { value: 3500, suffix: '+', label: 'Cars Protected' },
  { value: 4800, suffix: '+', label: 'Happy Customers' },
  { value: 10, suffix: ' Yrs', label: 'Warranty' },
]

/** @deprecated Use DEFAULT_STATS */
export const STATS = DEFAULT_STATS
