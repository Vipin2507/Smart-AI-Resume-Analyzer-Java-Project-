import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { analyzeResume } from '../api/client'
import type { AnalysisResponse } from '../api/client'
import MatchCircle from '../components/MatchCircle'
import SkillChart from '../components/SkillChart'
import PageTransition from '../components/layout/PageTransition'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import SuccessCheckmark from '../components/effects/SuccessCheckmark'

export default function Analyze() {
  const [jobDescription, setJobDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<AnalysisResponse | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const navigate = useNavigate()

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) {
      const valid = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
      const validExt = /\.(pdf|docx|txt)$/i
      if (!valid.includes(f.type) && !validExt.test(f.name)) {
        setError('Please upload a PDF or DOCX file.')
        setFile(null)
        return
      }
      setFile(f)
      setError('')
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setResult(null)
    if (!file || !jobDescription.trim()) {
      setError('Please provide both job description and resume file.')
      return
    }
    setLoading(true)
    try {
      const { data } = await analyzeResume(jobDescription.trim(), file)
      setResult(data)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setFile(null)
    setJobDescription('')
    setError('')
  }

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.h1 className="font-display font-bold text-3xl sm:text-4xl text-slate-100 mb-2" layout>
        Upload & Analyze
      </motion.h1>
      <motion.p className="text-slate-400 mb-8" layout>
        Paste the job description and upload your resume (PDF or DOCX).
      </motion.p>

      {!result ? (
        <Card gradientBorder={false} className="mb-8">
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
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Job description</label>
              <Input
                id="jobDesc"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                multiline
                rows={6}
                placeholder="Paste the full job description here..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Resume (PDF or DOCX)</label>
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-violet-500/20 file:text-violet-300 file:font-medium file:border file:border-violet-500/30 hover:file:bg-violet-500/30 transition-colors"
              />
              {file && <p className="mt-2 text-sm text-slate-500">Selected: {file.name}</p>}
            </div>
            <Button type="submit" disabled={loading} fullWidth magnetic>
              {loading ? 'Analyzing...' : 'Analyze Resume'}
            </Button>
          </form>
        </Card>
      ) : (
        <>
          {showSuccess && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="flex flex-col items-center gap-4"
              >
                <SuccessCheckmark size={80} />
                <span className="text-slate-100 font-medium">Analysis complete</span>
              </motion.div>
            </motion.div>
          )}
          <div className="flex flex-wrap gap-4 mb-8">
            <Button variant="secondary" onClick={() => result.analysisId && navigate(`/history?open=${result.analysisId}`)}>
              View in History
            </Button>
            <Button variant="ghost" onClick={reset}>New Analysis</Button>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <Card>
              <div className="flex flex-col items-center">
                <h2 className="font-display font-semibold text-lg text-slate-100 mb-4">Match score</h2>
                <MatchCircle percentage={result.matchPercentage} />
                <p className="mt-4 text-slate-400 text-sm">Resume score: {result.resumeScore}/10</p>
                {result.readabilityScore != null && (
                  <p className="text-slate-400 text-sm">Readability: {result.readabilityScore}/100</p>
                )}
                {result.atsCompatible != null && (
                  <p className="text-slate-400 text-sm">ATS compatible: {result.atsCompatible ? 'Yes' : 'No'}</p>
                )}
              </div>
            </Card>
            <Card>
              <h2 className="font-display font-semibold text-lg text-slate-100 mb-4">Skill overview</h2>
              <SkillChart matched={result.matchedSkills} missing={result.missingSkills} dark />
            </Card>
          </div>
          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            <Card gradientBorder={false}>
              <h2 className="font-display font-semibold text-lg text-slate-100 mb-3">Matched skills</h2>
              <ul className="flex flex-wrap gap-2">
                {result.matchedSkills.length ? result.matchedSkills.map((s) => (
                  <li key={s} className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-sm border border-emerald-500/20">
                    {s}
                  </li>
                )) : <li className="text-slate-500 text-sm">None detected</li>}
              </ul>
            </Card>
            <Card gradientBorder={false}>
              <h2 className="font-display font-semibold text-lg text-slate-100 mb-3">Missing skills</h2>
              <ul className="flex flex-wrap gap-2">
                {result.missingSkills.length ? result.missingSkills.map((s) => (
                  <li key={s} className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 text-sm border border-red-500/20">
                    {s}
                  </li>
                )) : <li className="text-slate-500 text-sm">None</li>}
              </ul>
            </Card>
          </div>
          <Card gradientBorder={false} className="mt-8">
            <h2 className="font-display font-semibold text-lg text-slate-100 mb-3">Suggestions</h2>
            <ul className="space-y-2">
              {result.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-300">
                  <span className="text-violet-400 mt-0.5">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </PageTransition>
  )
}
