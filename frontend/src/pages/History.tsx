import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getHistory, getAnalysis, deleteAnalysis, downloadReport } from '../api/client'
import type { AnalysisHistoryItem, AnalysisResponse } from '../api/client'
import MatchCircle from '../components/MatchCircle'
import PageTransition from '../components/layout/PageTransition'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'

export default function History() {
  const [items, setItems] = useState<AnalysisHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [detail, setDetail] = useState<AnalysisResponse | null>(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const openId = searchParams.get('open')

  useEffect(() => {
    let cancelled = false
    getHistory(0, 50)
      .then(({ data }) => { if (!cancelled) setItems(data) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!openId) return
    const id = parseInt(openId, 10)
    if (Number.isNaN(id)) return
    getAnalysis(id).then(({ data }) => setDetail(data)).catch(() => setDetail(null))
  }, [openId])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this analysis?')) return
    try {
      await deleteAnalysis(id)
      setItems((prev) => prev.filter((i) => i.id !== id))
      if (detail?.analysisId === id) setDetail(null)
    } catch {
      // ignore
    }
  }

  const handleDownload = async (id: number) => {
    try {
      const { data } = await downloadReport(id)
      const url = URL.createObjectURL(new Blob([data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `resume-analysis-report-${id}.pdf`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // ignore
    }
  }

  const closeDetail = () => {
    setDetail(null)
    setSearchParams({})
  }

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-100 mb-2" layout>
        History
      </motion.h1>
      <motion.p className="text-slate-400 mb-8" layout>
        Past analyses and download reports.
      </motion.p>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card gradientBorder={false} className="text-center py-16">
          <p className="text-slate-400 mb-4">No analyses yet.</p>
          <Link to="/analyze">
            <Button>Go to Analyze</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card gradientBorder={false} hover={false} className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <MatchCircle percentage={item.matchPercentage} size={80} strokeWidth={6} />
                  <div>
                    <p className="font-medium text-slate-100">Score: {item.resumeScore}/10</p>
                    <p className="text-sm text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" onClick={() => setSearchParams({ open: String(item.id) })}>
                    View
                  </Button>
                  <Button variant="secondary" onClick={() => handleDownload(item.id)}>PDF</Button>
                  <Button variant="ghost" onClick={() => handleDelete(item.id)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                    Delete
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {detail && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDetail}
          >
            <motion.div
              className="glass rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-6">
                <h2 className="font-display font-bold text-xl text-slate-100">Analysis detail</h2>
                <button
                  type="button"
                  onClick={closeDetail}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <MatchCircle percentage={detail.matchPercentage} size={100} strokeWidth={8} />
                <div className="text-slate-400 text-sm space-y-1">
                  <p>Resume score: {detail.resumeScore}/10</p>
                  {detail.readabilityScore != null && <p>Readability: {detail.readabilityScore}/100</p>}
                  {detail.atsCompatible != null && <p>ATS: {detail.atsCompatible ? 'Yes' : 'No'}</p>}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="font-medium text-slate-100 mb-2">Matched skills</h3>
                <div className="flex flex-wrap gap-2">
                  {detail.matchedSkills.map((s) => (
                    <span key={s} className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm border border-emerald-500/20">{s}</span>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="font-medium text-slate-100 mb-2">Missing skills</h3>
                <div className="flex flex-wrap gap-2">
                  {detail.missingSkills.map((s) => (
                    <span key={s} className="px-2 py-1 rounded-lg bg-red-500/20 text-red-300 text-sm border border-red-500/20">{s}</span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-slate-100 mb-2">Suggestions</h3>
                <ul className="list-disc list-inside text-slate-400 text-sm space-y-1">
                  {detail.suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <Button
                fullWidth
                className="mt-6"
                onClick={() => detail.analysisId && handleDownload(detail.analysisId)}
              >
                Download PDF report
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}
