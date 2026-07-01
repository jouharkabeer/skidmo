import { useEffect, useState } from 'react'
import { getFAQs } from '@/services/contentService'
import type { FAQ } from '@/types'
import { PageSEO, getFAQSchema } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/constants/seo'
import { SITE_FAQS } from '@/data/siteData'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FAQAccordion } from '@/components/ui/FAQAccordion'
import { FadeIn } from '@/components/ui/FadeIn'

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(SITE_FAQS)

  useEffect(() => {
    getFAQs().then((data) => {
      if (data.length) setFaqs(data)
    })
  }, [])

  const faqSchema = getFAQSchema(faqs)

  return (
    <>
      <PageSEO
        page={PAGE_SEO['/faq']}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'FAQ' },
        ]}
        structuredData={faqSchema ? [faqSchema] : undefined}
      />

      <section className="dark-gradient relative flex min-h-[40vh] items-end pb-12 pt-32">
        <div className="container-premium relative px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h1 className="heading-xl text-white">PPF &amp; Ceramic Coating FAQ</h1>
            <p className="body-lg mt-4 max-w-xl text-white/70">
              Expert answers about paint protection film, ceramic coating, and car care in Riyadh.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium max-w-3xl">
          <FadeIn>
            <SectionHeader
              label="Support"
              title="Got Questions?"
              description="Can't find what you're looking for? Contact our team for personalized assistance."
            />
          </FadeIn>
          <FadeIn>
            <FAQAccordion items={faqs} />
          </FadeIn>
        </div>
      </section>
    </>
  )
}
