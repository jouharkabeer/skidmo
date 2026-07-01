import { useState } from 'react'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { CONTACT } from '@/constants'
import { cn } from '@/utils'

interface MapLinkCardProps {
  className?: string
  dark?: boolean
  compact?: boolean
}

function MapPreview({ dark }: { dark?: boolean }) {
  const { lat, lng } = CONTACT.coordinates
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const [imgFailed, setImgFailed] = useState(false)

  const googleStatic = apiKey
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=600x320&scale=2&markers=color:0xB8955C%7C${lat},${lng}&key=${apiKey}`
    : null

  if (googleStatic && !imgFailed) {
    return (
      <img
        src={googleStatic}
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
        onError={() => setImgFailed(true)}
      />
    )
  }

  return (
    <div
      className={cn(
        'relative h-full w-full',
        dark ? 'bg-[#1c1b19]' : 'bg-stone-deep'
      )}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(184,149,92,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(184,149,92,0.12) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(135deg, transparent 45%, rgba(184,149,92,0.25) 46%, rgba(184,149,92,0.25) 48%, transparent 49%)',
        }}
      />
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
        <MapPin className="h-9 w-9 text-brand drop-shadow-md" fill="currentColor" strokeWidth={1.5} />
      </div>
    </div>
  )
}

/** Compact map card — entire surface opens Google Maps */
export function MapLinkCard({ className, dark = false, compact = false }: MapLinkCardProps) {
  return (
    <a
      href={CONTACT.mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group block overflow-hidden border transition-all duration-300',
        compact ? 'flex h-full flex-col' : 'block',
        dark
          ? 'border-white/10 bg-white/5 hover:border-accent/40 hover:bg-white/8'
          : 'border-border bg-white hover:border-brand/40 hover:shadow-md',
        className
      )}
      aria-label={`Open SKIDMO location in Google Maps — ${CONTACT.addressShort}`}
    >
      <div className={cn('relative shrink-0 overflow-hidden', compact ? 'h-24' : 'h-28 sm:h-32')}>
        <MapPreview dark={dark} />
        <div className="absolute inset-0 bg-ink/15 transition-colors group-hover:bg-ink/5" />
        <span
          className={cn(
            'absolute right-2 top-2 flex h-7 w-7 items-center justify-center border backdrop-blur-sm transition-colors',
            dark
              ? 'border-white/20 bg-ink/70 text-white group-hover:border-accent group-hover:text-accent'
              : 'border-white/80 bg-white/90 text-ink group-hover:text-brand'
          )}
        >
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className={cn('flex min-w-0 flex-1 items-start gap-2.5', compact ? 'p-3' : 'gap-3 p-4')}>
        <MapPin className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', dark ? 'text-accent' : 'text-brand')} />
        <div className="min-w-0">
          <p className={cn('text-xs font-medium sm:text-sm', dark ? 'text-white' : 'text-ink')}>
            {CONTACT.addressShort}
          </p>
          <p
            className={cn(
              'mt-1 text-[10px] font-semibold uppercase tracking-wider',
              dark ? 'text-accent group-hover:text-white' : 'text-brand'
            )}
          >
            Open in Google Maps
          </p>
        </div>
      </div>
    </a>
  )
}
