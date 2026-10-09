/** Resolve CMS media URLs (Django media or absolute URLs) */
export function getImageUrl(
  image: { asset?: { url?: string } } | string | null | undefined,
  _opts?: { width?: number; height?: number; quality?: number },
): string | null {
  if (!image) return null
  if (typeof image === 'string') return image
  return image.asset?.url || null
}
