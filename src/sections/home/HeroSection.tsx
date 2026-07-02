import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FadeIn } from '@/components/ui/FadeIn'
import { useAsyncData } from '@/hooks'
import { getHomeHero } from '@/services/contentService'
import { DEFAULT_HOME_HERO } from '@/constants/hero'
import { cn } from '@/utils'

const SLIDE_INTERVAL_MS = 6000

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)
  const { data: hero } = useAsyncData(() => getHomeHero(), [])

  const content = hero ?? {
    badge: DEFAULT_HOME_HERO.badge,
    titleBefore: DEFAULT_HOME_HERO.titleBefore,
    titleAccent: DEFAULT_HOME_HERO.titleAccent,
    titleAfter: DEFAULT_HOME_HERO.titleAfter,
    slides: DEFAULT_HOME_HERO.slides.map((slide) => ({ ...slide })),
  }
  const slides = content.slides

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  useEffect(() => {
    setActive((prev) => (prev >= slides.length ? 0 : prev))
  }, [slides.length])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || slides.length <= 1) return

    const timer = window.setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length)
    }, SLIDE_INTERVAL_MS)

    return () => window.clearInterval(timer)
  }, [slides.length])

  const activeSlide = slides[active] ?? slides[0]

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink"
      aria-label="Hero"
    >
      <motion.div className="absolute inset-0" style={{ y }} aria-hidden>
        {slides.map((slide, index) => (
          <motion.img
            key={`${index}-${slide.src}`}
            src={slide.src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-center"
            animate={{
              opacity: index === active ? 1 : 0,
              scale: index === active ? 1 : 1.04,
            }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            fetchPriority={index === 0 ? 'high' : 'low'}
            loading={index === 0 ? 'eager' : 'lazy'}
            draggable={false}
          />
        ))}
        <div className="hero-overlay absolute inset-0" aria-hidden />
      </motion.div>

      <motion.div
        className="relative z-10 w-full section-padding !py-32 text-center"
        style={{ opacity }}
      >
        <div className="container-premium mx-auto max-w-4xl">
          <FadeIn delay={0.05}>
            <div className="mb-8 inline-flex items-center gap-2 border border-white/15 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/80">
              <MapPin className="h-3 w-3 text-accent" aria-hidden />
              {content.badge}
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h1 className="heading-xl text-white">
              {content.titleBefore}{' '}
              <span className="italic text-accent">{content.titleAccent}</span>{' '}
              {content.titleAfter}
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="gold-rule my-8 bg-accent" />
            <div className="mx-auto min-h-[4.5rem] max-w-2xl">
              <AnimatePresence mode="wait">
                <motion.p
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="text-lg leading-relaxed text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.92),0_1px_4px_rgba(0,0,0,0.8)]"
                >
                  {activeSlide?.description}
                </motion.p>
              </AnimatePresence>
            </div>
          </FadeIn>

          <FadeIn delay={0.45}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button to="/contact" size="lg" variant="secondary">
                Book Consultation <ArrowRight className="h-4 w-4" />
              </Button>
              <Button to="/services" variant="outline" size="lg" className="!border-white/25 !text-white hover:!bg-white/10">
                View Services
              </Button>
            </div>
          </FadeIn>
        </div>
      </motion.div>

      {slides.length > 1 && (
        <div
          className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2"
          role="tablist"
          aria-label="Hero image slides"
        >
          {slides.map((slide, index) => (
            <button
              key={`${index}-${slide.src}`}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={slide.alt}
              onClick={() => setActive(index)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                index === active
                  ? 'w-8 bg-accent'
                  : 'w-2 bg-white/40 hover:bg-white/60'
              )}
            />
          ))}
        </div>
      )}
    </section>
  )
}
