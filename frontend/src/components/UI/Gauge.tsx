interface GaugeProps {
  value: number // 0-100
  label: string
  color?: 'green' | 'blue' | 'purple' | 'amber' | 'red'
  size?: 'sm' | 'md' | 'lg'
}

const colorClasses = {
  green: 'stroke-green-500',
  blue: 'stroke-blue-500',
  purple: 'stroke-purple-500',
  amber: 'stroke-amber-500',
  red: 'stroke-red-500'
}

const sizeClasses = {
  sm: { size: 80, strokeWidth: 8 },
  md: { size: 120, strokeWidth: 10 },
  lg: { size: 160, strokeWidth: 12 }
}

export function Gauge({ value, label, color = 'green', size = 'md' }: GaugeProps) {
  const { size: gaugeSize, strokeWidth } = sizeClasses[size]
  const radius = (gaugeSize - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: gaugeSize, height: gaugeSize }}>
        <svg width={gaugeSize} height={gaugeSize} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={gaugeSize / 2}
            cy={gaugeSize / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-800"
          />
          {/* Progress circle */}
          <circle
            cx={gaugeSize / 2}
            cy={gaugeSize / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${colorClasses[color]} transition-all duration-500`}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-2xl font-mono font-bold ${colorClasses[color].replace('stroke', 'text')}`}>
            {value}%
          </span>
        </div>
      </div>
      <p className="text-sm text-slate-400 mt-2">{label}</p>
    </div>
  )
}