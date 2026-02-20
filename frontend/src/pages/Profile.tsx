import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { getProfile } from '../api/client'
import PageTransition from '../components/layout/PageTransition'
import Card from '../components/ui/Card'
import Skeleton from '../components/ui/Skeleton'

export default function Profile() {
  const [profile, setProfile] = useState<{ id: number; name: string; email: string; role: string; createdAt: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProfile()
      .then(({ data }) => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-100 mb-2" layout>
        Profile
      </motion.h1>
      <motion.p className="text-slate-400 mb-8" layout>
        Your account details.
      </motion.p>

      {loading ? (
        <Card gradientBorder={false}>
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-12 w-1/3" />
          </div>
        </Card>
      ) : !profile ? (
        <Card gradientBorder={false} className="text-center py-12">
          <p className="text-slate-400">Could not load profile.</p>
        </Card>
      ) : (
        <Card gradientBorder className="max-w-md">
          <dl className="space-y-6">
            <div>
              <dt className="text-sm font-medium text-slate-500">Name</dt>
              <dd className="mt-1 text-slate-100 font-medium text-lg">{profile.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Email</dt>
              <dd className="mt-1 text-slate-100">{profile.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Role</dt>
              <dd className="mt-1 text-slate-100 capitalize">{profile.role.toLowerCase()}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-slate-500">Member since</dt>
              <dd className="mt-1 text-slate-100">{new Date(profile.createdAt).toLocaleDateString()}</dd>
            </div>
          </dl>
        </Card>
      )}
    </PageTransition>
  )
}
