import { useMediaQuery } from '@/hooks'
import { getImageUrl } from '@/sanity/client'
import type { Offer } from '@/types'
import { OFFER_BANNER_SIZES } from '@/constants/cms'
import { cn } from '@/utils'

interface OfferBannerProps {
  offer: Offer
  alt?: string
  className?: string
  priority?: boolean
}

/** Picks the best banner for the current viewport — responsive, no size labels shown */
export function OfferBanner({ offer, alt, className, priority = false }: OfferBannerProps) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const banner = isMobile ? offer.bannerMobile : offer.bannerWeb
  const size = isMobile ? OFFER_BANNER_SIZES.mobile : OFFER_BANNER_SIZES.web

  const src =
    getImageUrl(banner, { width: size.width, quality: 85 }) ||
    banner?.asset?.url ||
    ''

  if (!src) return null

  return (
    <img
      src={src}
      alt={alt || offer.title}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={cn(
        'h-full w-full object-cover',
        isMobile ? 'aspect-[4/5]' : 'aspect-[8/3]',
        className
      )}
    />
  )
}
