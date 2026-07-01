import { useEffect, useState } from 'react'
import { getCompanyInfo } from '@/services/contentService'
import { MOCK_COMPANY_INFO } from '@/sanity/mockData'
import type { CompanyInfo } from '@/types'
import { PageSEO, getDefaultStructuredData } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/constants/seo'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FadeIn, ImageReveal, StaggerContainer, StaggerItem } from '@/components/ui/FadeIn'
import { LazyImage } from '@/components/ui/Lightbox'
import { MEDIA } from '@/constants/media'
import { getImageUrl } from '@/sanity/client'

export default function AboutPage() {
  const [company, setCompany] = useState<CompanyInfo>(MOCK_COMPANY_INFO)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCompanyInfo()
      .then(setCompany)
      .catch(() => setCompany(MOCK_COMPANY_INFO))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <PageSEO
        page={PAGE_SEO['/about']}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'About' },
        ]}
        structuredData={getDefaultStructuredData()}
      />

      <section className="relative flex min-h-[55vh] items-end overflow-hidden pb-16 pt-32">
        <img
          src={MEDIA.aboutHero}
          alt={MEDIA.aboutHeroAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="hero-gradient absolute inset-0" />
        <div className="container-premium relative">
          <FadeIn>
            <span className="label-sm text-accent">Our Story</span>
            <h1 className="heading-xl mt-3 text-white">Crafted with Precision</h1>
            <p className="body-lg mt-4 max-w-2xl text-white/80">{company.tagline}</p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding bg-canvas">
        <div className="container-premium">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <FadeIn variant="fadeRight">
              <SectionHeader label="Who We Are" title="The SKIDMO Story" align="left" />
              {loading ? (
                <div className="space-y-3">
                  <div className="h-4 animate-pulse bg-stone" />
                  <div className="h-4 animate-pulse bg-stone" />
                  <div className="h-4 w-3/4 animate-pulse bg-stone" />
                </div>
              ) : (
                <p className="body-md text-ink/80">{company.about}</p>
              )}
            </FadeIn>
            <FadeIn variant="fadeLeft">
              <ImageReveal>
                <LazyImage
                  src={MEDIA.aboutWorkshop}
                  alt="SKIDMO precision installation"
                  wrapperClassName="aspect-[4/3]"
                />
              </ImageReveal>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section-padding bg-stone">
        <div className="container-premium">
          <div className="grid gap-6 md:grid-cols-2">
            <FadeIn>
              <div className="border border-border bg-white p-8">
                <span className="label-sm">Mission</span>
                <h2 className="heading-md mt-3 text-ink">Our Purpose</h2>
                <p className="body-md mt-4 text-ink/75">{company.mission}</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="border border-border bg-white p-8">
                <span className="label-sm">Vision</span>
                <h2 className="heading-md mt-3 text-ink">Where We&apos;re Headed</h2>
                <p className="body-md mt-4 text-ink/75">{company.vision}</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="section-padding bg-ink">
        <div className="container-premium">
          <FadeIn>
            <SectionHeader label="Our Values" title="What Drives Us" dark />
          </FadeIn>
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {company.values?.map((value) => (
              <StaggerItem key={value.title}>
                <div className="border border-white/15 bg-white/5 p-6">
                  <h3 className="font-display text-xl text-white">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/75">{value.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {company.workshopImages && company.workshopImages.length > 0 && (
        <section className="section-padding bg-canvas">
          <div className="container-premium">
            <FadeIn>
              <SectionHeader
                label="Our Studio"
                title="Where Excellence Happens"
                description="Climate-controlled bays, precision lighting, and the finest tools — our workshop is designed for perfection."
              />
            </FadeIn>
            <div className="grid gap-4 md:grid-cols-3">
              {company.workshopImages.map((img, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <ImageReveal>
                    <LazyImage
                      src={getImageUrl(img, { width: 600 }) || img.asset?.url || ''}
                      alt={`SKIDMO workshop ${i + 1}`}
                      wrapperClassName="aspect-[4/3]"
                    />
                  </ImageReveal>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
