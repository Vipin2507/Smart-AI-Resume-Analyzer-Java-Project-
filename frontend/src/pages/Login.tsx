import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { login as apiLogin } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import TypingHeadline from '../components/effects/TypingHeadline'
import AIPulse from '../components/effects/AIPulse'
import CursorSpotlight from '../components/effects/CursorSpotlight'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await apiLogin({ email, password })
      login(data)
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-surface">
      <CursorSpotlight />
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
      <motion.div
        className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-violet-500/10 blur-3xl"
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="glass rounded-3xl p-8 sm:p-10 border border-white/10 shadow-glass-lg">
          <div className="text-center mb-8">
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-100 mb-2">
              Smart <TypingHeadline className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent" />
            </h1>
            <p className="text-slate-400 text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3"
              >
                {error}
              </motion.div>
            )}
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="Email"
              placeholder="you@example.com"
              required
            />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              placeholder="••••••••"
              required
            />
            <AIPulse className="w-full">
              <Button type="submit" disabled={loading} fullWidth magnetic>
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </AIPulse>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
            >
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
