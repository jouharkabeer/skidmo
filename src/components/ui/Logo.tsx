import { Link } from 'react-router-dom'
import { cn } from '@/utils'
import fullLogo from '@/assets/full-rbg.png'
import letterLogo from '@/assets/letter-rbg.png'
import iconLogo from '@/assets/logo-rbg.png'

type LogoVariant = 'full' | 'letter' | 'icon'

interface LogoProps {
  variant?: LogoVariant
  className?: string
  imgClassName?: string
  link?: boolean
}

const sources: Record<LogoVariant, string> = {
  full: fullLogo,
  letter: letterLogo,
  icon: iconLogo,
}

const defaultHeights: Record<LogoVariant, string> = {
  full: 'h-28 sm:h-32',
  letter: 'h-8 sm:h-9',
  icon: 'h-9 w-9',
}

export function Logo({
  variant = 'letter',
  className,
  imgClassName,
  link = true,
}: LogoProps) {
  const image = (
    <img
      src={sources[variant]}
      alt="SKIDMO"
      className={cn('w-auto object-contain', defaultHeights[variant], imgClassName)}
      draggable={false}
    />
  )

  if (!link) {
    return <div className={cn('inline-flex items-center', className)}>{image}</div>
  }

  return (
    <Link
      to="/"
      className={cn('inline-flex items-center transition-opacity hover:opacity-90', className)}
      aria-label="SKIDMO Home"
    >
      {image}
    </Link>
  )
}
