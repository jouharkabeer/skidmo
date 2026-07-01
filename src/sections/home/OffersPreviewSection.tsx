import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import { getOffers } from '@/services/contentService'
import type { Offer } from '@/types'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { OfferBanner } from '@/components/ui/OfferBanner'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/FadeIn'
import { Button } from '@/components/ui/Button'
import { resolveContactLink } from '@/constants'
import { formatDate, isOfferActive } from '@/utils'

export function OffersPreviewSection() {
  const [offers, setOffers] = useState<Offer[]>([])

  useEffect(() => {
    getOffers().then((data) => setOffers(data.filter(isOfferActive).slice(0, 3)))
  }, [])

  if (!offers.length) return null

  return (
    <section className="section-padding bg-stone" aria-label="Latest Offers">
      <div className="container-premium">
        <FadeIn>
          <SectionHeader
            label="Promotions"
            title="Current Offers"
            description="Limited packages on our most sought-after protection services."
          />
        </FadeIn>

        <StaggerContainer className="grid gap-6 lg:grid-cols-3">
          {offers.map((offer) => {
            const buttonLink = resolveContactLink(offer.buttonLink)
            return (
            <StaggerItem key={offer._id}>
              <article className="card-luxe group flex h-full flex-col">
                <div className="relative overflow-hidden">
                  <OfferBanner offer={offer} className="transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-2xl text-ink">{offer.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">{offer.description}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs uppercase tracking-wider text-text-muted">
                    <Clock className="h-3.5 w-3.5" />
                    Until {formatDate(offer.expiryDate)}
                  </div>
                  <Button
                    to={buttonLink.startsWith('/') ? buttonLink : undefined}
                    href={!buttonLink.startsWith('/') ? buttonLink : undefined}
                    className="mt-5 w-full"
                    size="sm"
                    variant="primary"
                  >
                    {offer.buttonText}
                  </Button>
                </div>
              </article>
            </StaggerItem>
            )
          })}
        </StaggerContainer>

        <FadeIn className="mt-10 text-center">
          <Link to="/offers" className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink hover:text-brand">
            All offers <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeIn>
      </div>
    </section>
  )
}
