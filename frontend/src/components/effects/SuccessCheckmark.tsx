import { motion } from 'framer-motion'

interface SuccessCheckmarkProps {
  size?: number
  className?: string
}

/**
 * Animated success checkmark — stroke draw + scale.
 */
export default function SuccessCheckmark({ size = 64, className = '' }: SuccessCheckmarkProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, duration: 0.5 }}
    >
      <motion.circle
        cx="32"
        cy="32"
        r="30"
        stroke="url(#successGrad)"
        strokeWidth="3"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      />
      <motion.path
        d="M20 32 L28 40 L44 24"
        stroke="url(#successGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      />
      <defs>
        <linearGradient id="successGrad" x1="0" y1="0" x2="64" y2="64">
          <stop stopColor="#34D399" />
          <stop offset="1" stopColor="#22D3EE" />
        </linearGradient>
      </defs>
    </motion.svg>
  )
}
