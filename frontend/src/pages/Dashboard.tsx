import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PageTransition from '../components/layout/PageTransition'
import Card from '../components/ui/Card'
import AIPulse from '../components/effects/AIPulse'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export default function Dashboard() {

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.section
        className="mb-16"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h1
          variants={item}
          className="font-display font-bold text-4xl sm:text-5xl text-slate-100 mb-4"
        >
          Dashboard
        </motion.h1>
        <motion.p
          variants={item}
          className="text-slate-400 text-lg max-w-2xl"
        >
          Upload your resume and paste a job description to see how well you match. AI-powered analysis in seconds.
        </motion.p>
      </motion.section>

      <motion.div
        className="grid md:grid-cols-2 gap-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <Link to="/analyze" className="block h-full">
            <AIPulse className="h-full">
              <Card gradientBorder hover className="h-full flex flex-col items-center justify-center min-h-[240px] group cursor-pointer">
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center mb-5 border border-white/10 group-hover:border-violet-500/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <svg className="w-8 h-8 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </motion.div>
                <h2 className="font-display font-semibold text-xl text-slate-100 mb-2">Upload & Analyze</h2>
                <p className="text-sm text-slate-400 text-center max-w-sm">
                  Upload a PDF or DOCX resume and paste the job description to get match score and suggestions.
                </p>
              </Card>
            </AIPulse>
          </Link>
        </motion.div>

        <motion.div variants={item}>
          <Link to="/history" className="block h-full">
            <Card gradientBorder hover className="h-full flex flex-col items-center justify-center min-h-[240px] group cursor-pointer">
              <motion.div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 flex items-center justify-center mb-5 border border-white/10 group-hover:border-cyan-500/30 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
              <h2 className="font-display font-semibold text-xl text-slate-100 mb-2">History</h2>
              <p className="text-sm text-slate-400 text-center max-w-sm">
                View and download past analysis reports.
              </p>
            </Card>
          </Link>
        </motion.div>
      </motion.div>
    </PageTransition>
  )
}
