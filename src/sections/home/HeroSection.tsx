import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { FadeIn } from '@/components/ui/FadeIn'
import { MEDIA } from '@/constants/media'

export function HeroSection() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '15%'])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink"
      aria-label="Hero"
    >
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src={MEDIA.hero}
          alt={MEDIA.heroAlt}
          className="h-full w-full object-cover object-center opacity-90"
          fetchPriority="high"
        />
        <div className="hero-gradient absolute inset-0" />
      </motion.div>

      <motion.div
        className="relative z-10 w-full section-padding !py-32 text-center"
        style={{ opacity }}
      >
        <div className="container-premium mx-auto max-w-4xl">
          <FadeIn delay={0.05}>
            <div className="mb-8 inline-flex items-center gap-2 border border-white/15 px-4 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white/80">
              <MapPin className="h-3 w-3 text-accent" aria-hidden />
              Riyadh, Saudi Arabia
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <h1 className="heading-xl text-white">
              The Art of <span className="italic text-accent">Automotive</span> Protection
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="gold-rule my-8 bg-accent" />
            <p className="body-lg mx-auto max-w-2xl text-white/85" style={{ color: 'white !important' }}>
              Expert paint protection film (PPF), ceramic coating, and luxury car detailing in Riyadh — XPEL &amp; STEK certified for discerning owners across Saudi Arabia.
            </p>
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

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block" aria-hidden>
        <div className="h-12 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent" />
      </div>
    </section>
  )
}
