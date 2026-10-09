import { useEffect, useState } from 'react'
import { getGalleryImages, getGalleryCategories } from '@/services/contentService'
import type { GalleryImage } from '@/types'
import { PageSEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/constants/seo'
import { FadeIn } from '@/components/ui/FadeIn'
import { LazyImage, Lightbox } from '@/components/ui/Lightbox'
import { MEDIA } from '@/constants/media'
import { getImageUrl } from '@/utils/media'
import { cn } from '@/utils'
import { useInView } from '@/hooks'

const PER_PAGE = 12

function getGallerySrc(item: GalleryImage, width = 600): string {
  return getImageUrl(item.image, { width, quality: 80 }) || item.image?.asset?.url || ''
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [activeCategory, setActiveCategory] = useState('All')
  const [page, setPage] = useState(1)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const { ref: loadMoreRef, isInView } = useInView()

  useEffect(() => {
    Promise.all([getGalleryImages(), getGalleryCategories()]).then(([imgs, cats]) => {
      setImages(imgs)
      setCategories(cats)
      setLoading(false)
    })
  }, [])

  const filtered = activeCategory === 'All'
    ? images
    : images.filter((img) => img.category === activeCategory)

  const visibleImages = filtered.slice(0, page * PER_PAGE)
  const hasMore = visibleImages.length < filtered.length

  useEffect(() => {
    if (isInView && hasMore) {
      setPage((p) => p + 1)
    }
  }, [isInView, hasMore])

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat)
    setPage(1)
  }

  const lightboxImages = visibleImages.map((img) => ({
    src: getGallerySrc(img, 1200),
    alt: img.altText || img.title,
    title: img.title,
    description: img.description,
  }))

  return (
    <>
      <PageSEO
        page={PAGE_SEO['/gallery']}
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Gallery' },
        ]}
      />

      {/* Hero */}
      <section className="dark-gradient relative flex min-h-[40vh] items-end pb-12 pt-32">
        <div className="absolute inset-0">
          <img
            src={MEDIA.galleryHero}
            alt="Gallery hero"
            className="h-full w-full object-cover opacity-30"
          />
          <div className="hero-gradient absolute inset-0" />
        </div>
        <div className="container-premium relative px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h1 className="heading-xl text-white">Our Gallery</h1>
            <p className="body-lg mt-4 max-w-xl text-white/70">
              Precision craftsmanship captured in every frame.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-premium">
          {/* Category Filter */}
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryChange(cat)}
                className={cn(
                  'rounded-full px-5 py-2 text-sm font-medium transition-all duration-300',
                  activeCategory === cat
                    ? 'bg-dark text-white shadow-soft'
                    : 'bg-surface text-text-secondary hover:bg-surface-muted'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square animate-pulse bg-stone" />
              ))}
            </div>
          ) : (
            <div className="columns-2 gap-4 md:columns-3 lg:columns-4">
              {visibleImages.map((item, index) => (
                <FadeIn key={item._id} delay={(index % 4) * 0.05}>
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(index)}
                    className="group mb-4 block w-full break-inside-avoid overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                  >
                    <div className="relative">
                      <LazyImage
                        src={getGallerySrc(item)}
                        alt={item.altText || item.title}
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
                        <p className="text-left text-sm font-medium text-white">{item.title}</p>
                        <p className="text-left text-xs text-white/60">{item.category}</p>
                      </div>
                    </div>
                  </button>
                </FadeIn>
              ))}
            </div>
          )}

          {/* Infinite scroll trigger */}
          {hasMore && (
            <div ref={loadMoreRef} className="mt-8 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </div>
      </section>

      <Lightbox
        images={lightboxImages}
        currentIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  )
}
