import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { register as apiRegister } from '../api/client'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import AIPulse from '../components/effects/AIPulse'
import CursorSpotlight from '../components/effects/CursorSpotlight'

export default function Register() {
  const [name, setName] = useState('')
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
      const { data } = await apiRegister({ name, email, password })
      login(data)
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-surface">
      <CursorSpotlight />
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none" />
      <motion.div
        className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl"
        animate={{ y: [0, 15, 0], x: [0, -8, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-64 h-64 rounded-full bg-cyan-500/10 blur-3xl"
        animate={{ y: [0, -15, 0], x: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
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
              Create account
            </h1>
            <p className="text-slate-400 text-sm">Smart Resume Analyzer</p>
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
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Name"
              placeholder="Your name"
              required
              minLength={2}
            />
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
                {loading ? 'Creating account...' : 'Register'}
              </Button>
            </AIPulse>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-violet-400 hover:text-violet-300 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
