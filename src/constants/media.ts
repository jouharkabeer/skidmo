/** Curated imagery — verified Unsplash IDs (404-prone IDs removed) */

const u = (id: string, w = 1920) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=85&auto=format`

export const MEDIA = {
  hero: u('1503376780353-7e6692767b70'),
  heroAlt: 'Paint protection film PPF and luxury car detailing in Riyadh',
  servicesHero: u('1618843479313-40f8afb4b4d8'),
  galleryHero: u('1555215695-3004980ad54e'),
  aboutHero: u('1549317661-bd32c8ce0db2'),
  aboutHeroAlt: 'Premium luxury sports car in studio',
  aboutWorkshop: u('1619642751034-765dfdf7c58e', 1200),
  contactHero: u('1606664515524-ed2f786a0bd6'),
  offersHero: u('1492144534655-ae79c964c9d7'),
} as const
