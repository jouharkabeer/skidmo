import { Star } from 'lucide-react'
import { getTestimonials } from '@/services/contentService'
import { useAsyncData } from '@/hooks'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/FadeIn'
import { getImageUrl } from '@/sanity/client'
import { cn } from '@/utils'

interface TestimonialsSectionProps {
  className?: string
  dark?: boolean
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i < rating ? 'fill-brand text-brand' : 'fill-stone-deep text-stone-deep'
          )}
        />
      ))}
    </div>
  )
}

export function TestimonialsSection({ className, dark = false }: TestimonialsSectionProps) {
  const { data: testimonials, loading } = useAsyncData(() => getTestimonials(), [])

  if (!loading && !testimonials?.length) return null

  return (
    <section
      className={cn('section-padding', dark ? 'bg-ink' : 'bg-canvas', className)}
      aria-label="Client Testimonials"
    >
      <div className="container-premium">
        <FadeIn>
          <SectionHeader
            label="Testimonials"
            title="Client Experiences"
            description="Stories from owners who trust SKIDMO with their most valued vehicles."
            dark={dark}
          />
        </FadeIn>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          </div>
        ) : (
          <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials!.map((item) => {
              const avatarUrl = getImageUrl(item.avatar, { width: 80, height: 80 })
              const initials = item.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()

              return (
                <StaggerItem key={item._id}>
                  <article
                    className={cn(
                      'border p-6',
                      dark ? 'border-white/10 bg-dark-elevated text-white' : 'border-border bg-white text-ink'
                    )}
                  >
                    <StarRating rating={item.rating} />
                    <blockquote
                      className={cn(
                        'mt-5 font-display text-xl leading-snug',
                        dark ? 'text-white' : 'text-ink'
                      )}
                    >
                      &ldquo;{item.content}&rdquo;
                    </blockquote>
                    <footer
                      className={cn(
                        'mt-6 flex items-center gap-3 border-t pt-5',
                        dark ? 'border-white/10' : 'border-border'
                      )}
                    >
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={item.name} className="h-10 w-10 object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center bg-stone text-xs font-semibold text-brand">
                          {initials}
                        </div>
                      )}
                      <div>
                        <p className={cn('text-sm font-semibold', dark ? 'text-white' : 'text-ink')}>
                          {item.name}
                        </p>
                        {item.role && (
                          <p className={cn('text-xs', dark ? 'text-white/60' : 'text-text-secondary')}>
                            {item.role}
                          </p>
                        )}
                      </div>
                    </footer>
                  </article>
                </StaggerItem>
              )
            })}
          </StaggerContainer>
        )}
      </div>
    </section>
  )
}
