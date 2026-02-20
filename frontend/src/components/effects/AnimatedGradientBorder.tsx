import { motion } from 'framer-motion'

interface AnimatedGradientBorderProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

/**
 * Card/container with animated gradient border and soft glow.
 */
export default function AnimatedGradientBorder({
  children,
  className = '',
  hover = true,
}: AnimatedGradientBorderProps) {
  return (
    <motion.div
      className={`group relative rounded-2xl p-[1px] ${className}`}
      initial={false}
      whileHover={hover ? { scale: 1.01 } : undefined}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 opacity-60 blur-sm transition-opacity duration-300 group-hover:opacity-80"
        style={{
          backgroundSize: '200% 200%',
          animation: 'gradient-shift 8s ease infinite',
        }}
      />
      <div className="relative rounded-2xl bg-slate-900/80 backdrop-blur-[12px] border border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
        {children}
      </div>
    </motion.div>
  )
}
