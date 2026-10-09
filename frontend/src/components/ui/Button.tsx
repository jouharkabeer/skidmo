import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { cn } from '@/utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'white'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  href?: string
  to?: string
  external?: boolean
  loading?: boolean
}

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-mid border border-brand',
  secondary: 'bg-ink text-white hover:bg-dark-elevated border border-ink',
  outline: 'border border-brand/35 text-brand bg-transparent hover:bg-brand/8',
  ghost: 'text-ink bg-transparent hover:bg-stone',
  white: 'bg-white text-ink border border-white/30 hover:bg-white/90',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-xs tracking-wide uppercase',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-3.5 text-sm tracking-wide',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', href, to, external, loading, disabled, children, ...props },
    ref
  ) => {
    const classes = cn(
      'inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
      variants[variant],
      sizes[size],
      className
    )

    if (to) return <Link to={to} className={classes}>{children}</Link>
    if (href) {
      return (
        <a href={href} className={classes} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
          {children}
        </a>
      )
    }
    return (
      <button ref={ref} className={classes} disabled={disabled || loading} {...props}>
        {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
