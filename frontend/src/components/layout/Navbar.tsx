import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const nav = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/analyze', label: 'Analyze' },
  { to: '/history', label: 'History' },
  { to: '/profile', label: 'Profile' },
]

const EASTER_EGG_CLICKS = 5

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [logoClicks, setLogoClicks] = useState(0)
  const [easterEgg, setEasterEgg] = useState(false)
  const { scrollY } = useScroll()
  const navBg = useTransform(
    scrollY,
    [0, 60],
    ['rgba(15, 23, 42, 0.5)', 'rgba(15, 23, 42, 0.9)']
  )
  const navBlur = useTransform(scrollY, [0, 60], ['blur(12px)', 'blur(24px)'])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleLogoClick = () => {
    const next = logoClicks + 1
    setLogoClicks(next)
    if (next >= EASTER_EGG_CLICKS) {
      setEasterEgg(true)
      setLogoClicks(0)
      setTimeout(() => setEasterEgg(false), 3000)
    }
  }

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5"
      style={{
        backgroundColor: navBg,
        backdropFilter: navBlur,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink
            to="/dashboard"
            onClick={(e) => {
              if (e.detail === 1) handleLogoClick()
            }}
            className="flex items-center gap-2 font-display font-bold text-xl text-slate-100"
          >
            <motion.span
              animate={easterEgg ? { rotate: [0, 360], scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Smart
            </motion.span>
            <span>Resume Analyzer</span>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1">
            {nav.map(({ to, label }) => (
              <NavLink key={to} to={to} className="relative px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-100 transition-colors">
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors"
              aria-label="Toggle theme"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </motion.button>
            <span className="text-sm text-slate-500 hidden sm:inline truncate max-w-[120px]">{user?.name}</span>
            <motion.button
              type="button"
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-red-400 transition-colors rounded-xl hover:bg-white/5"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Logout
            </motion.button>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
