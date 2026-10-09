import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Sparkles, Sun, Gem, Droplets, Armchair } from 'lucide-react'
import { SERVICES_DATA } from '@/constants/services'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/FadeIn'
import { LazyImage } from '@/components/ui/Lightbox'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield, sparkles: Sparkles, sun: Sun, gem: Gem, droplets: Droplets, armchair: Armchair,
}

export function ServicesSection() {
  return (
    <section className="section-padding bg-canvas" id="services" aria-label="Our Services">
      <div className="container-premium">
        <FadeIn>
          <SectionHeader
            label="Expertise"
            title="Protection & Detailing"
            description="XPEL, STEK, Gtechniq, and 3M — installed by certified specialists in a climate-controlled Riyadh studio."
          />
        </FadeIn>

        <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES_DATA.map((service, i) => {
            const Icon = iconMap[service.icon] || Shield
            return (
              <StaggerItem key={service.slug}>
                <Link to={`/services#${service.slug}`} className="card-luxe group flex h-full flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <LazyImage src={service.image} alt={service.title} className="transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute left-4 top-4 bg-ink/80 px-2 py-1 text-[10px] font-medium uppercase tracking-widest text-accent">
                      0{i + 1}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4 flex h-9 w-9 items-center justify-center border border-border text-brand">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="font-display text-2xl text-ink">{service.title}</h3>
                    <p className="mt-2 text-sm text-text-muted">{service.tagline}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-ink group-hover:text-brand">
                      Explore <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
