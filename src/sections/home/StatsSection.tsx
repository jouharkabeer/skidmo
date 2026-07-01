import { useCounter } from '@/hooks'
import { useAsyncData } from '@/hooks'
import { DEFAULT_STATS } from '@/constants'
import { getHomeStats } from '@/services/contentService'
import { StaggerContainer, StaggerItem } from '@/components/ui/FadeIn'

function StatCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { count, ref } = useCounter(value)
  return (
    <div ref={ref} className="border-l border-white/10 pl-6 text-left">
      <p className="font-display text-4xl font-medium text-white sm:text-5xl">
        {count.toLocaleString()}<span className="text-accent">{suffix}</span>
      </p>
      <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">{label}</p>
    </div>
  )
}

export function StatsSection() {
  const { data: stats } = useAsyncData(() => getHomeStats(), [])
  const items = stats ?? DEFAULT_STATS

  return (
    <section className="border-y border-border bg-ink py-14 sm:py-16" aria-label="Statistics">
      <div className="container-premium">
        <StaggerContainer className="grid grid-cols-2 gap-10 lg:grid-cols-4 lg:gap-0">
          {items.map((stat, index) => (
            <StaggerItem key={`${stat.label}-${index}`}>
              <StatCard value={stat.value} suffix={stat.suffix} label={stat.label} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
