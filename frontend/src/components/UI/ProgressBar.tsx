interface ProgressBarProps {
  value: number // 0-100
  max?: number
  color?: 'green' | 'blue' | 'purple' | 'amber' | 'red'
  showLabel?: boolean
  label?: string
}

const colorClasses = {
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500'
}

export function ProgressBar({ 
  value, 
  max = 100, 
  color = 'green', 
  showLabel = true,
  label 
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>{label || 'Progress'}</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color]} transition-all duration-300 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}