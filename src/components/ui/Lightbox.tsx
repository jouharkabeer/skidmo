import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLockBody } from '@/hooks'
import { cn } from '@/utils'

interface LightboxImage {
  src: string
  alt: string
  title?: string
  description?: string
}

interface LightboxProps {
  images: LightboxImage[]
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNavigate: (index: number) => void
}

export function Lightbox({ images, currentIndex, isOpen, onClose, onNavigate }: LightboxProps) {
  useLockBody(isOpen)
  const current = images[currentIndex]

  const goPrev = () => onNavigate(currentIndex > 0 ? currentIndex - 1 : images.length - 1)
  const goNext = () => onNavigate(currentIndex < images.length - 1 ? currentIndex + 1 : 0)

  return (
    <AnimatePresence>
      {isOpen && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-dark/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={goPrev}
            className="absolute left-4 z-10 hidden rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 sm:block"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={goNext}
            className="absolute right-4 z-10 hidden rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 sm:block sm:right-16"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex max-h-[85vh] max-w-5xl flex-col items-center"
          >
            <img
              src={current.src}
              alt={current.alt}
              className="max-h-[75vh] w-auto rounded-xl object-contain shadow-premium"
            />
            {(current.title || current.description) && (
              <div className="mt-4 text-center">
                {current.title && (
                  <h3 className="font-heading text-lg font-medium text-white">{current.title}</h3>
                )}
                {current.description && (
                  <p className="mt-1 text-sm text-white/70">{current.description}</p>
                )}
              </div>
            )}
          </motion.div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/60">
            {currentIndex + 1} / {images.length}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  className?: string
  wrapperClassName?: string
}

/** Lazy-loaded image with fade-in on intersection */
export function LazyImage({ src, alt, className, wrapperClassName, ...props }: LazyImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  return (
    <div className={cn('relative overflow-hidden bg-surface-muted', wrapperClassName)}>
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-surface-muted" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-500',
          loaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        {...props}
      />
    </div>
  )
}
