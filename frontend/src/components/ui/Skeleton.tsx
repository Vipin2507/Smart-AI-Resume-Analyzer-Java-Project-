import { motion } from 'framer-motion'

interface SkeletonProps {
  className?: string
}

/**
 * Animated loading skeleton with shimmer.
 */
export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <motion.div
      className={`rounded-xl bg-white/10 overflow-hidden ${className}`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.2, repeatType: 'reverse' }}
    >
      <div
        className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%]"
        style={{ animation: 'shimmer 1.5s infinite' }}
      />
    </motion.div>
  )
}
