import { useEffect, useState } from 'react'

/**
 * Cursor-based spotlight effect — subtle radial gradient that follows the mouse.
 */
export default function CursorSpotlight() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handler = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  if (!mounted) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
      aria-hidden
    >
      <div
        className="absolute h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-violet-500/10 via-transparent to-transparent blur-3xl"
        style={{
          left: pos.x,
          top: pos.y,
        }}
      />
    </div>
  )
}
