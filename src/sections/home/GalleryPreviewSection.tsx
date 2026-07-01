import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { getGalleryImages } from '@/services/contentService'
import type { GalleryImage } from '@/types'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { FadeIn, ImageReveal } from '@/components/ui/FadeIn'
import { LazyImage } from '@/components/ui/Lightbox'
import { Button } from '@/components/ui/Button'
import { getImageUrl } from '@/sanity/client'
import { isSanityConfigured } from '@/services/contentService'

function getGallerySrc(item: GalleryImage): string {
  return getImageUrl(item.image, { width: 600, quality: 80 }) || item.image?.asset?.url || ''
}

export function GalleryPreviewSection() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getGalleryImages().then((data) => {
      setImages(data.slice(0, 6))
      setLoading(false)
    })
  }, [])

  if (!loading && images.length === 0) return null

  return (
    <section className="section-padding bg-canvas" aria-label="Gallery Preview">
      <div className="container-premium">
        <FadeIn>
          <SectionHeader
            label="Portfolio"
            title="Selected Work"
            description={isSanityConfigured ? 'Recent installations from our Riyadh studio.' : 'A curated selection from our studio.'}
          />
        </FadeIn>

        {loading ? (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse bg-stone" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
            {images.map((item, i) => (
              <FadeIn key={item._id} delay={i * 0.05}>
                <ImageReveal>
                  <div className={`group relative overflow-hidden ${i === 0 ? 'col-span-2 aspect-[2/1] md:col-span-1 md:aspect-square' : 'aspect-square'}`}>
                    <LazyImage
                      src={getGallerySrc(item)}
                      alt={item.altText || item.title}
                      className="transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/40" />
                    <div className="absolute inset-x-0 bottom-0 translate-y-full p-5 transition-transform group-hover:translate-y-0">
                      <p className="font-display text-lg text-white">{item.title}</p>
                      <p className="text-xs uppercase tracking-widest text-accent">{item.category}</p>
                    </div>
                  </div>
                </ImageReveal>
              </FadeIn>
            ))}
          </div>
        )}

        <FadeIn className="mt-10 text-center">
          <Button to="/gallery" variant="outline">
            View Gallery <ArrowRight className="h-4 w-4" />
          </Button>
        </FadeIn>
      </div>
    </section>
  )
}
