import { createClient, type SanityClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'
import type { SanityImage } from '@/types'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01'
const token = import.meta.env.VITE_SANITY_WRITE_TOKEN

/** Whether Sanity CMS is configured with a valid project ID */
export const isSanityConfigured = Boolean(projectId && projectId !== 'your_project_id')

/** Valid Sanity asset ref, e.g. image-Tb9Ew8CXIwaY6R1kjMvI0uRR-2000x3000-jpg */
const SANITY_ASSET_REF = /^image-[A-Za-z0-9]+-\d+x\d+-[a-z0-9]+$/

function getDirectAssetUrl(source: SanityImage | undefined): string | null {
  const url = source?.asset?.url
  if (!url || !/^https?:\/\//.test(url)) return null
  return url
}

function hasValidSanityRef(source: SanityImage | undefined): boolean {
  const ref = source?.asset?._ref || source?.asset?._id
  return Boolean(ref && SANITY_ASSET_REF.test(ref))
}

/**
 * Proxy Sanity API through same origin to avoid CORS.
 * Dev: Vite proxy → /sanity-api
 * Prod: Netlify redirect → apicdn/api
 */
function getApiHost(): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/sanity-api`
  }
  return `https://${projectId}.api.sanity.io`
}

/** Sanity client — uses proxied API host + token for reliable browser access */
export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({
      projectId: projectId!,
      dataset,
      apiVersion,
      useCdn: false,
      useProjectHostname: false,
      apiHost: getApiHost(),
      token: token || undefined,
      ignoreBrowserTokenWarning: true,
    })
  : null

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null

/** Build optimized image URL from Sanity image reference */
export function urlFor(source: SanityImage | undefined) {
  if (!builder || !source?.asset || !hasValidSanityRef(source)) return null
  try {
    return builder.image(source)
  } catch {
    return null
  }
}

/** Get image URL with optional width/height/quality transforms */
export function getImageUrl(
  source: SanityImage | undefined,
  options?: { width?: number; height?: number; quality?: number }
): string | null {
  const directUrl = getDirectAssetUrl(source)
  if (!hasValidSanityRef(source)) {
    return directUrl
  }

  const img = urlFor(source)
  if (!img) return directUrl

  try {
    let built = img.auto('format')
    if (options?.width) built = built.width(options.width)
    if (options?.height) built = built.height(options.height)
    if (options?.quality) built = built.quality(options.quality)
    return built.url()
  } catch {
    return directUrl
  }
}
