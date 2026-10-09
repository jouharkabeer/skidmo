import { cn } from '@/utils'

interface SectionHeaderProps {
  label?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  dark?: boolean
  className?: string
}

export function SectionHeader({
  label,
  title,
  description,
  align = 'center',
  dark = false,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        'mb-12 lg:mb-16',
        align === 'center' && 'mx-auto max-w-2xl text-center',
        align === 'left' && 'max-w-xl text-left',
        className
      )}
    >
      {label && (
        <div className={cn('label-line', align === 'center' && 'justify-center', dark && '[&::before]:bg-accent')}>
          <span className={cn('label-sm', dark && 'text-accent')}>{label}</span>
        </div>
      )}
      <h2 className={cn('heading-lg', dark ? 'text-white' : 'text-ink')}>
        {title}
      </h2>
      {description && (
        <>
          <div className={cn('gold-rule my-5', align === 'left' && 'mx-0', dark && 'bg-accent')} />
          <p className={cn('body-md', dark ? 'text-white/75' : 'text-ink/70')}>
            {description}
          </p>
        </>
      )}
    </div>
  )
}
