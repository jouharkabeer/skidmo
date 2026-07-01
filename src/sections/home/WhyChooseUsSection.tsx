import { Shield, Award, BadgeCheck, Zap, Users } from 'lucide-react'
import { WHY_CHOOSE_US } from '@/constants'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/FadeIn'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield, award: Award, 'badge-check': BadgeCheck, zap: Zap, users: Users,
}

export function WhyChooseUsSection() {
  return (
    <section className="section-padding bg-stone" aria-label="Why Choose SKIDMO">
      <div className="container-premium">
        <FadeIn>
          <SectionHeader
            label="Philosophy"
            title="Why SKIDMO"
            description="Every vehicle receives the same meticulous attention we would give our own."
          />
        </FadeIn>

        <StaggerContainer className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {WHY_CHOOSE_US.map((item) => {
            const Icon = iconMap[item.icon] || Shield
            return (
              <StaggerItem key={item.title}>
                <div className="h-full bg-canvas p-8">
                  <div className="mb-5 flex h-10 w-10 items-center justify-center border border-brand/30 text-brand">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-display text-xl text-ink">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">{item.description}</p>
                </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}
