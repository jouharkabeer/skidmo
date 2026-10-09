import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Check, ArrowRight } from 'lucide-react'
import { SERVICES_DATA } from '@/constants/services'
import { PageSEO, getServiceSchema } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/constants/seo'
import { FadeIn, ImageReveal } from '@/components/ui/FadeIn'
import { LazyImage } from '@/components/ui/Lightbox'
import { Button } from '@/components/ui/Button'
import { CONTACT_FORM_LINK } from '@/constants'
import { MEDIA } from '@/constants/media'

export default function ServicesPage() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      }
    }
  }, [location.hash])

  const serviceSchemas = SERVICES_DATA.map(getServiceSchema)

  return (
    <>
      <PageSEO
        page={PAGE_SEO['/services']}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Services' },
        ]}
        structuredData={serviceSchemas}
      />

      {/* Hero */}
      <section className="dark-gradient relative flex min-h-[50vh] items-end pb-16 pt-32">
        <div className="absolute inset-0">
          <img
            src={MEDIA.servicesHero}
            alt="Luxury car protection"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="hero-gradient absolute inset-0" />
        </div>
        <div className="container-premium relative px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <span className="text-sm font-semibold uppercase tracking-widest text-accent">Our Services</span>
            <h1 className="heading-xl mt-2 text-white">Protection Redefined</h1>
            <p className="body-lg mt-4 max-w-2xl text-white/70">
              Every service is delivered with factory-certified precision using the world&apos;s finest automotive protection products.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Service Cards */}
      <div className="bg-canvas">
        {SERVICES_DATA.map((service, index) => (
          <section
            key={service.slug}
            id={service.slug}
            className={`section-padding scroll-mt-24 ${index % 2 === 1 ? 'bg-stone' : 'bg-canvas'}`}
          >
            <div className="container-premium">
              <div className={`grid items-center gap-12 lg:grid-cols-2 ${index % 2 === 1 ? 'lg:direction-rtl' : ''}`}>
                <FadeIn variant={index % 2 === 0 ? 'fadeRight' : 'fadeLeft'}>
                  <ImageReveal>
                    <LazyImage
                      src={service.heroImage}
                      alt={service.title}
                      wrapperClassName="aspect-[16/10]"
                    />
                  </ImageReveal>
                </FadeIn>

                <FadeIn variant={index % 2 === 0 ? 'fadeLeft' : 'fadeRight'}>
                  <span className="label-sm">{service.shortTitle}</span>
                  <h2 className="heading-md mt-2 font-display text-3xl">{service.title}</h2>
                  <p className="text-sm font-medium text-accent">{service.tagline}</p>
                  <p className="body-md mt-4">{service.description}</p>

                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    <div>
                      <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">Benefits</h3>
                      <ul className="mt-3 space-y-2">
                        {service.benefits.map((b) => (
                          <li key={b} className="flex items-start gap-2 text-sm text-text-secondary">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">Features</h3>
                      <ul className="mt-3 space-y-2">
                        {service.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-text-secondary">
                            <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button to={CONTACT_FORM_LINK} className="mt-8">
                    Get a Quote
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </FadeIn>
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
