import { Helmet } from 'react-helmet-async'
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, CONTACT, SOCIAL_LINKS, PARENT_COMPANY } from '@/constants'
import {
  SEO_KEYWORDS,
  OG_IMAGE_URL,
  OG_IMAGE_ALT,
  buildFullTitle,
  buildCanonical,
  type PageSEO,
} from '@/constants/seo'
import type { BreadcrumbItem, FAQ } from '@/types'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogImageAlt?: string
  ogType?: string
  noIndex?: boolean
  breadcrumbs?: BreadcrumbItem[]
  structuredData?: Record<string, unknown> | Record<string, unknown>[]
}

function absoluteUrl(url: string): string {
  if (url.startsWith('http')) return url
  return `${SITE_URL.replace(/\/$/, '')}${url.startsWith('/') ? url : `/${url}`}`
}

export function SEO({
  title,
  description = SITE_DESCRIPTION,
  keywords = [...SEO_KEYWORDS],
  canonical,
  ogImage = OG_IMAGE_URL,
  ogImageAlt = OG_IMAGE_ALT,
  ogType = 'website',
  noIndex = false,
  breadcrumbs,
  structuredData,
}: SEOProps) {
  const fullTitle = buildFullTitle(title, SITE_NAME)
  const canonicalUrl = canonical || SITE_URL
  const imageUrl = absoluteUrl(ogImage)
  const fbAppId = import.meta.env.VITE_FB_APP_ID

  const breadcrumbSchema = breadcrumbs?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          ...(item.path ? { item: buildCanonical(item.path) } : {}),
        })),
      }
    : null

  const schemas = [
    ...(Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : []),
    ...(breadcrumbSchema ? [breadcrumbSchema] : []),
  ]

  return (
    <Helmet>
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={SITE_NAME} />
      <meta name="geo.region" content="SA-01" />
      <meta name="geo.placename" content="Riyadh" />
      <link rel="canonical" href={canonicalUrl} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow, max-image-preview:large" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_SA" />
      {fbAppId && <meta property="fb:app_id" content={fbAppId} />}

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={ogImageAlt} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  )
}

/** Apply centralized page SEO config */
export function PageSEO({ page, ...rest }: { page: PageSEO } & Omit<SEOProps, 'title' | 'description' | 'keywords' | 'canonical' | 'ogImage' | 'ogImageAlt'>) {
  return (
    <SEO
      title={page.title}
      description={page.description}
      keywords={page.keywords}
      canonical={buildCanonical(page.path)}
      ogImage={page.ogImage ? absoluteUrl(page.ogImage) : OG_IMAGE_URL}
      ogImageAlt={page.ogImageAlt ?? OG_IMAGE_ALT}
      {...rest}
    />
  )
}

/** Organization + LocalBusiness + WebSite structured data */
export function getDefaultStructuredData() {
  const phone = CONTACT.phone.replace(/\s/g, '')
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      inLanguage: 'en-SA',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/services?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SITE_NAME,
      alternateName: ['SKIDMO KSA', 'SKIDMO Saudi Arabia', 'skidmosa.com'],
      url: SITE_URL,
      logo: absoluteUrl('/og-image.png'),
      description: SITE_DESCRIPTION,
      parentOrganization: {
        '@type': 'Organization',
        name: PARENT_COMPANY.name,
        url: PARENT_COMPANY.url,
      },
      sameAs: Object.values(SOCIAL_LINKS).filter(Boolean),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'AutoRepair',
      name: `${SITE_NAME} KSA — PPF & Paint Protection Film Riyadh`,
      image: OG_IMAGE_URL,
      '@id': SITE_URL,
      url: SITE_URL,
      telephone: phone,
      email: CONTACT.email,
      description:
        'Premium paint protection film (PPF), ceramic coating, window tinting, and car detailing in Riyadh, Saudi Arabia.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: CONTACT.address,
        addressLocality: 'Riyadh',
        addressRegion: 'Riyadh Province',
        postalCode: '12211',
        addressCountry: 'SA',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: CONTACT.coordinates.lat,
        longitude: CONTACT.coordinates.lng,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
          opens: '10:00',
          closes: '22:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: 'Friday',
          opens: '16:00',
          closes: '22:00',
        },
      ],
      priceRange: '$$$',
      areaServed: [
        { '@type': 'City', name: 'Riyadh' },
        { '@type': 'Country', name: 'Saudi Arabia' },
      ],
      knowsAbout: [
        'Colmo PPF',
        'Paint Protection Film',
        'PPF',
        'Ceramic Coating',
        'Window Tinting',
        'Paint Correction',
        'Car Detailing',
      ],
      parentOrganization: {
        '@type': 'Organization',
        name: PARENT_COMPANY.name,
        url: PARENT_COMPANY.url,
      },
    },
  ]
}

/** Service schema for individual service pages */
export function getServiceSchema(service: { title: string; description: string; slug: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `${service.title} in Riyadh`,
    description: service.description,
    serviceType: service.title,
    provider: {
      '@type': 'AutoRepair',
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: {
      '@type': 'City',
      name: 'Riyadh',
    },
    url: `${SITE_URL}/services#${service.slug}`,
  }
}

/** FAQPage schema for rich results */
export function getFAQSchema(faqs: FAQ[]) {
  if (!faqs.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}
