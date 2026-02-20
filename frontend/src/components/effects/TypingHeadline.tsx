import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const PHRASES = ['Resume Analyzer', 'AI-Powered', 'Match Better']
const TYPING_DURATION = 80
const PAUSE = 1500
const DELETE_DURATION = 50

/**
 * Animated typing headline effect.
 */
export default function TypingHeadline({ className = '' }: { className?: string }) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const phrase = PHRASES[phraseIndex]
    const timeout = isDeleting ? DELETE_DURATION : TYPING_DURATION

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          if (text.length < phrase.length) {
            setText(phrase.slice(0, text.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), PAUSE)
          }
        } else {
          if (text.length > 0) {
            setText(phrase.slice(0, text.length - 1))
          } else {
            setIsDeleting(false)
            setPhraseIndex((phraseIndex + 1) % PHRASES.length)
          }
        }
      },
      isDeleting && text.length === 0 ? 200 : timeout
    )
    return () => clearTimeout(timer)
  }, [text, isDeleting, phraseIndex])

  return (
    <span className={className}>
      {text}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-0.5 h-[1em] align-middle bg-violet-400 ml-0.5"
      />
    </span>
  )
}
