import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/utils'

const variants = {
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  },
} as const

type AnimationVariant = keyof typeof variants

interface FadeInProps extends HTMLMotionProps<'div'> {
  variant?: AnimationVariant
  delay?: number
  duration?: number
  className?: string
  children?: React.ReactNode
}

/** Reusable scroll-triggered fade animation wrapper */
export function FadeIn({
  variant = 'fadeUp',
  delay = 0,
  duration = 0.6,
  className,
  children,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={variants[variant]}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  className?: string
  children?: React.ReactNode
  stagger?: number
}

/** Stagger children animations on scroll */
export function StaggerContainer({ className, children, stagger = 0.1 }: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  className,
  children,
  variant = 'fadeUp',
}: {
  className?: string
  children?: React.ReactNode
  variant?: AnimationVariant
}) {
  return (
    <motion.div
      variants={variants[variant]}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/** Image reveal animation on scroll */
export function ImageReveal({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn('overflow-hidden', className)}
    >
      {children}
    </motion.div>
  )
}
