import { useRef, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'ghost'
}

/**
 * Button with subtle magnetic pull effect on hover.
 */
export default function MagneticButton({
  children,
  className = '',
  onClick,
  type = 'button',
  disabled,
  variant = 'primary',
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || disabled) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * 0.2
    const dy = (e.clientY - cy) * 0.2
    x.set(dx)
    y.set(dy)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setHovered(false)
  }

  const transform = useMotionTemplate`translate(${x}px, ${y}px)`

  const base =
    'relative rounded-2xl font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary:
      'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-glow-sm hover:shadow-glow hover:scale-[1.02] active:scale-[0.98]',
    secondary:
      'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:border-violet-500/30',
    ghost: 'text-slate-300 hover:bg-white/5 hover:text-white',
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  )
}
