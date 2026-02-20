import { motion } from 'framer-motion'
import AnimatedGradientBorder from '../effects/AnimatedGradientBorder'

interface CardProps {
  children: React.ReactNode
  className?: string
  gradientBorder?: boolean
  hover?: boolean
}

/**
 * Glass-style card with optional animated gradient border.
 */
export default function Card({
  children,
  className = '',
  gradientBorder = true,
  hover = true,
}: CardProps) {
  if (gradientBorder) {
    return (
      <AnimatedGradientBorder className={className} hover={hover}>
        <div className={`relative p-6 sm:p-8 ${className}`.trim()}>{children}</div>
      </AnimatedGradientBorder>
    )
  }

  return (
    <motion.div
      className={`rounded-2xl border border-white/10 bg-surface-elevated/80 backdrop-blur-glass p-6 sm:p-8 shadow-glass ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hover ? { y: -2, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' } : undefined}
    >
      {children}
    </motion.div>
  )
}
