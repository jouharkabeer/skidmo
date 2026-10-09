import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { getOffers } from '@/services/contentService'
import type { Offer } from '@/types'
import { PageSEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/constants/seo'
import { OfferBanner } from '@/components/ui/OfferBanner'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/FadeIn'
import { Button } from '@/components/ui/Button'
import { CONTACT_FORM_LINK, resolveContactLink } from '@/constants'
import { MEDIA } from '@/constants/media'
import { formatDate, isOfferActive } from '@/utils'

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOffers().then((data) => {
      setOffers(data)
      setLoading(false)
    })
  }, [])

  const activeOffers = offers.filter(isOfferActive)

  return (
    <>
      <PageSEO
        page={PAGE_SEO['/offers']}
        breadcrumbs={[{ name: 'Home', path: '/' }, { name: 'Offers' }]}
      />

      <section className="relative flex min-h-[40vh] items-end overflow-hidden pb-12 pt-28">
        <img
          src={MEDIA.offersHero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
        <div className="hero-gradient absolute inset-0" />
        <div className="container-premium relative px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <p className="label-sm mb-3 text-white/50">Promotions</p>
            <h1 className="heading-xl text-white">Special Offers</h1>
            <p className="body-lg mt-3 max-w-lg text-white/60">
              Premium protection packages at exceptional value for Riyadh vehicle owners.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding bg-stone">
        <div className="container-premium">
          {loading ? (
            <div className="space-y-8">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="h-72 animate-pulse bg-white" />
              ))}
            </div>
          ) : activeOffers.length === 0 ? (
            <FadeIn>
              <div className="border border-border bg-white py-20 text-center">
                <p className="body-lg">No active offers at the moment. Check back soon.</p>
                <Button to={CONTACT_FORM_LINK} className="mt-6">Request a Quote</Button>
              </div>
            </FadeIn>
          ) : (
            <StaggerContainer className="space-y-10">
              {activeOffers.map((offer) => {
                const buttonLink = resolveContactLink(offer.buttonLink)
                return (
                <StaggerItem key={offer._id}>
                  <article className="card-pro overflow-hidden">
                    <div className="relative overflow-hidden bg-dark">
                      <OfferBanner offer={offer} priority className="max-h-[420px] sm:max-h-none" />
                      <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-dark shadow-sm">
                        Active Offer
                      </span>
                    </div>
                    <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
                      <div>
                        <h2 className="heading-md">{offer.title}</h2>
                        <p className="body-md mt-2 text-sm">{offer.description}</p>
                        <div className="mt-4 flex flex-wrap gap-4 text-xs text-text-muted">
                          <span>From {formatDate(offer.startDate)}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            Expires {formatDate(offer.expiryDate)}
                          </span>
                        </div>
                      </div>
                      <Button
                        to={buttonLink.startsWith('/') ? buttonLink : undefined}
                        href={!buttonLink.startsWith('/') ? buttonLink : undefined}
                        className="w-full shrink-0 lg:w-auto"
                        variant="secondary"
                        size="lg"
                      >
                        {offer.buttonText}
                      </Button>
                    </div>
                  </article>
                </StaggerItem>
                )
              })}
            </StaggerContainer>
          )}
        </div>
      </section>
    </>
  )
}
