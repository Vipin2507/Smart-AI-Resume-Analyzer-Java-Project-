import { useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface SkillChartProps {
  matched: string[]
  missing: string[]
  dark?: boolean
}

export default function SkillChart({ matched, missing, dark }: SkillChartProps) {
  const labels = useMemo(() => {
    const all = [...matched.slice(0, 8), ...missing.slice(0, 8)]
    return all.length ? all : ['No skills']
  }, [matched, missing])

  const matchedCounts = useMemo(() => labels.map((l) => (matched.includes(l) ? 1 : 0)), [labels, matched])
  const missingCounts = useMemo(() => labels.map((l) => (missing.includes(l) ? 1 : 0)), [labels, missing])

  const options: ChartOptions<'bar'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' as const },
        title: { display: true, text: 'Skill match overview' },
      },
      scales: {
        x: {
          grid: { color: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
          ticks: { color: dark ? '#94a3b8' : '#64748b', maxRotation: 45 },
        },
        y: {
          grid: { color: dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' },
          ticks: { color: dark ? '#94a3b8' : '#64748b' },
          max: 1,
          stepSize: 1,
        },
      },
    }),
    [dark]
  )

  const data = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Matched',
          data: matchedCounts,
          backgroundColor: 'rgba(34, 197, 94, 0.7)',
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 1,
        },
        {
          label: 'Missing',
          data: missingCounts,
          backgroundColor: 'rgba(239, 68, 68, 0.7)',
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 1,
        },
      ],
    }),
    [labels, matchedCounts, missingCounts]
  )

  return (
    <div className="h-64 w-full">
      <Bar options={options} data={data} />
    </div>
  )
}
