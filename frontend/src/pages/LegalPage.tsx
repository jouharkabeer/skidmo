import { PageSEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/constants/seo'
import { FadeIn } from '@/components/ui/FadeIn'
import type { LegalDocument } from '@/data/siteData'

interface LegalPageProps {
  document: LegalDocument
  path: string
  breadcrumbLabel: string
}

export function LegalPage({ document, path, breadcrumbLabel }: LegalPageProps) {
  const page = PAGE_SEO[path] ?? {
    path,
    title: document.title,
    description: `${document.title} for SKIDMO — premium automotive protection in Riyadh.`,
  }

  return (
    <>
      <PageSEO
        page={page}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: breadcrumbLabel },
        ]}
      />

      <section className="dark-gradient relative flex min-h-[36vh] items-end pb-12 pt-32">
        <div className="container-premium relative">
          <FadeIn>
            <h1 className="heading-xl text-white">{document.title}</h1>
            <p className="mt-3 text-sm text-white/50">Last updated: {document.lastUpdated}</p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding bg-canvas">
        <div className="container-premium max-w-3xl">
          <FadeIn>
            <div className="space-y-10">
              {document.sections.map((section) => (
                <div key={section.heading}>
                  <h2 className="font-heading text-lg font-semibold text-ink">{section.heading}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="body-md mt-3 text-ink/75">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
