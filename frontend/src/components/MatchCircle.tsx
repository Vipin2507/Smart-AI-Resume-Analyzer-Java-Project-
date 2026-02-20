interface MatchCircleProps {
  percentage: number
  size?: number
  strokeWidth?: number
  className?: string
}

export default function MatchCircle({ percentage, size = 160, strokeWidth = 10, className = '' }: MatchCircleProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference
  const color = percentage >= 70 ? '#22c55e' : percentage >= 40 ? '#eab308' : '#ef4444'

  return (
    <div className={`inline-flex items-center justify-center relative ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="circular-progress">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-white/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        />
      </svg>
      <span className="absolute text-2xl font-display font-bold text-slate-100">
        {Math.round(percentage)}%
      </span>
    </div>
  )
}
