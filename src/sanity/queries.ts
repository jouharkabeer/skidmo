/** GROQ queries for fetching CMS content */

export const galleryQuery = `*[_type == "galleryImage"] | order(_createdAt desc) {
  _id,
  title,
  image,
  category,
  description,
  altText,
  seo
}`

export const galleryPaginatedQuery = (start: number, end: number) =>
  `*[_type == "galleryImage"] | order(_createdAt desc) [${start}...${end}] {
  _id,
  title,
  image,
  category,
  description,
  altText,
  seo
}`

export const galleryCategoriesQuery = `array::unique(*[_type == "galleryImage"].category)`

export const offersQuery = `*[_type == "offer" && status == "active"] | order(priority desc, expiryDate asc) {
  _id,
  title,
  bannerWeb,
  bannerMobile,
  description,
  startDate,
  expiryDate,
  buttonText,
  buttonLink,
  status,
  priority
}`

export const testimonialsQuery = `*[_type == "testimonial"] | order(date desc, _createdAt desc) {
  _id,
  name,
  role,
  content,
  rating,
  avatar,
  date,
  source
}`

export const faqsQuery = `*[_type == "faq"] | order(order asc) {
  _id,
  question,
  answer,
  category,
  order
}`

export const companyInfoQuery = `*[_type == "companyInfo"][0] {
  _id,
  name,
  tagline,
  about,
  mission,
  vision,
  values,
  workshopImages
}`

export const homeStatsQuery = `*[_type == "homeStats"][0] {
  _id,
  stats[] {
    value,
    suffix,
    label
  }
}`

export const homeHeroQuery = `*[_type == "homeHero"][0] {
  _id,
  badge,
  titleBefore,
  titleAccent,
  titleAfter,
  slides[] {
    description,
    alt,
    imageUrl,
    image
  }
}`

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  _id,
  siteName,
  logo,
  heroVideo,
  heroImage,
  elfsightWidgetId,
  elfsightEmbedCode,
  socialLinks
}`

export const servicesQuery = `*[_type == "service"] | order(order asc) {
  _id,
  slug,
  title,
  shortTitle,
  tagline,
  description,
  image,
  heroImage,
  benefits,
  features,
  icon,
  order
}`

export const seoQuery = `*[_type == "seoPage" && page == $page][0] {
  metaTitle,
  metaDescription,
  keywords,
  canonicalUrl,
  ogImage
}`
