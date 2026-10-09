import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { getFAQs } from '@/services/contentService'
import type { FAQ } from '@/types'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FAQAccordion } from '@/components/ui/FAQAccordion'
import { FadeIn } from '@/components/ui/FadeIn'

export function FAQPreviewSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([])

  useEffect(() => {
    getFAQs().then((data) => setFaqs(data.slice(0, 4)))
  }, [])

  return (
    <section className="section-padding bg-stone" aria-label="FAQ Preview">
      <div className="container-premium max-w-3xl">
        <FadeIn>
          <SectionHeader
            label="FAQ"
            title="Common Questions"
            description="Everything you need to know about our protection services."
          />
        </FadeIn>

        <FadeIn>
          <FAQAccordion items={faqs} />
        </FadeIn>

        <FadeIn className="mt-8 text-center">
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink hover:text-brand"
          >
            View All FAQs <ArrowRight className="h-4 w-4" />
          </Link>
        </FadeIn>
      </div>
    </section>
  )
}
