import { motion } from 'framer-motion'
import { useState } from 'react'

interface InputProps {
  id: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  label?: string
  placeholder?: string
  required?: boolean
  error?: string
  multiline?: boolean
  rows?: number
  minLength?: number
  className?: string
}

/**
 * Input with floating-label feel, focus glow, and optional error shake.
 */
export default function Input({
  id,
  type = 'text',
  value,
  onChange,
  label,
  placeholder,
  required,
  error,
  multiline,
  rows = 4,
  minLength,
  className = '',
}: InputProps) {
  const [focused, setFocused] = useState(false)
  const hasValue = value.length > 0
  const labelOffset = label ? (hasValue || focused ? 'pt-5' : 'pt-0') : ''

  const base =
    'w-full rounded-xl border bg-white/5 text-slate-100 placeholder-slate-500 transition-all duration-300 outline-none'
  const focusStyles =
    'focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 focus:bg-white/[0.07]'
  const errorStyles = error ? 'border-red-500/50 focus:ring-red-500/50' : 'border-white/10'
  const padding = label ? (multiline ? 'px-4 py-3 pt-6' : 'px-4 py-3 pt-6') : 'px-4 py-3'

  const content = multiline ? (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`${base} ${focusStyles} ${errorStyles} ${padding} resize-y ${className}`}
    />
  ) : (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      minLength={minLength}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`${base} ${focusStyles} ${errorStyles} ${padding} ${className}`}
    />
  )

  return (
    <div className="relative">
      {label && (
        <label
          htmlFor={id}
          className={`absolute left-4 transition-all duration-300 pointer-events-none ${
            hasValue || focused ? 'top-2 text-xs text-violet-400' : 'top-3.5 text-sm text-slate-400'
          }`}
        >
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      <motion.div
        animate={error ? { x: [0, -6, 6, -4, 4, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {content}
      </motion.div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 text-sm text-red-400"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}
