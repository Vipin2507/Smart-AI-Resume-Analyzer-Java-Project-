import { Outlet } from 'react-router-dom'
import Navbar from './layout/Navbar'
import CursorSpotlight from './effects/CursorSpotlight'
import ParticleBackground from './effects/ParticleBackground'

export default function Layout() {
  return (
    <div className="min-h-screen bg-surface text-slate-100">
      <CursorSpotlight />
      <ParticleBackground />
      <div className="absolute inset-0 bg-gradient-mesh pointer-events-none z-0" />
      <Navbar />
      <main className="relative z-10 pt-16 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
