import { useEffect, useRef } from 'react'
import { getSiteSettings } from '@/services/contentService'
import { useAsyncData } from '@/hooks'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FadeIn } from '@/components/ui/FadeIn'
import { cn } from '@/utils'

const ELFSIGHT_SCRIPT = 'https://elfsightcdn.com/platform.js'
let scriptLoaded = false

function loadElfsightScript(): Promise<void> {
  if (scriptLoaded || document.querySelector(`script[src="${ELFSIGHT_SCRIPT}"]`)) {
    scriptLoaded = true
    return Promise.resolve()
  }
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = ELFSIGHT_SCRIPT
    script.defer = true
    script.onload = () => {
      scriptLoaded = true
      resolve()
    }
    document.body.appendChild(script)
  })
}

function extractWidgetId(embedCode?: string, widgetId?: string): string | null {
  if (widgetId?.trim()) return widgetId.trim()
  if (!embedCode) return null
  const match = embedCode.match(/elfsight-app-([a-zA-Z0-9-]+)/)
  return match?.[1] ?? null
}

interface GoogleReviewsSectionProps {
  className?: string
  dark?: boolean
}

export function GoogleReviewsSection({ className, dark = false }: GoogleReviewsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { data: settings } = useAsyncData(() => getSiteSettings(), [])

  const widgetId = extractWidgetId(settings?.elfsightEmbedCode, settings?.elfsightWidgetId)
  const envWidgetId = import.meta.env.VITE_ELFSIGHT_WIDGET_ID
  const activeId = widgetId || envWidgetId || null

  useEffect(() => {
    if (!activeId) return

    loadElfsightScript().then(() => {
      if (typeof window !== 'undefined' && 'eapps' in window) {
        // @ts-expect-error Elfsight global
        window.eapps?.Platform?.init?.()
      }
    })
  }, [activeId])

  return (
    <section
      className={cn('section-padding', dark ? 'bg-ink' : 'bg-stone', className)}
      aria-label="Google Reviews"
    >
      <div className="container-premium">
        <FadeIn>
          <SectionHeader
            label="Google Reviews"
            title="Verified on Google"
            description="Live reviews from our Google Business profile."
            dark={dark}
          />
        </FadeIn>

        <FadeIn delay={0.15}>
          {activeId ? (
            <div
              ref={containerRef}
              className="mx-auto max-w-6xl overflow-hidden border border-border bg-white p-3"
            >
              <div className={`elfsight-app-${activeId}`} data-elfsight-app-lazy />
            </div>
          ) : (
            <div className="mx-auto max-w-2xl border border-dashed border-border bg-canvas p-12 text-center">
              <p className="font-display text-2xl text-ink">Google Reviews</p>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                Set <code className="bg-stone px-1.5 py-0.5 text-xs">VITE_ELFSIGHT_WIDGET_ID</code> in your .env file.
              </p>
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  )
}
