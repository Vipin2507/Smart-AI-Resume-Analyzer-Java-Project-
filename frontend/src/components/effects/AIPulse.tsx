import { motion } from 'framer-motion'

interface AIPulseProps {
  children: React.ReactNode
  className?: string
}

/**
 * Subtle AI-style pulse glow around key features.
 */
export default function AIPulse({ children, className = '' }: AIPulseProps) {
  return (
    <div className={`relative inline-flex ${className}`}>
      <motion.div
        className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-violet-500/30 to-cyan-500/30 blur-lg"
        animate={{
          opacity: [0.4, 0.8, 0.4],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <div className="relative">{children}</div>
    </div>
  )
}
