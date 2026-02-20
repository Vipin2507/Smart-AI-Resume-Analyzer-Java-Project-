import { motion } from 'framer-motion'
import MagneticButton from '../effects/MagneticButton'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  variant?: ButtonVariant
  fullWidth?: boolean
  magnetic?: boolean
}

export default function Button({
  children,
  className = '',
  onClick,
  type = 'button',
  disabled,
  variant = 'primary',
  fullWidth,
  magnetic = true,
}: ButtonProps) {
  const base = fullWidth ? 'w-full py-3 px-6' : 'py-2.5 px-5'

  if (magnetic) {
    return (
      <MagneticButton
        type={type}
        disabled={disabled}
        variant={variant}
        className={`${base} ${className}`}
        onClick={onClick}
      >
        {children}
      </MagneticButton>
    )
  }

  const variants: Record<ButtonVariant, string> = {
    primary:
      'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-glow-sm hover:shadow-glow rounded-2xl',
    secondary: 'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 rounded-2xl',
    ghost: 'text-slate-300 hover:bg-white/5 rounded-2xl',
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      className={`font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 ${base} ${variants[variant]} ${className}`}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {children}
    </motion.button>
  )
}
