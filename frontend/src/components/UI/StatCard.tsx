import React from 'react'

interface StatCardProps {
  title?: string
  label?: string
  value: string | number
  icon: React.ReactNode | React.ComponentType<any>
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'green' | 'blue' | 'purple' | 'amber' | 'red' | 'cyan' | 'pink'
}

const colorClasses = {
  green: {
    text: 'text-green-400',
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    glow: 'neon-glow-green'
  },
  blue: {
    text: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]'
  },
  purple: {
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    glow: 'neon-glow-purple'
  },
  amber: {
    text: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.3)]'
  },
  red: {
    text: 'text-red-400',
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]'
  },
  cyan: {
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    glow: 'neon-glow-cyan'
  },
  pink: {
    text: 'text-pink-400',
    bg: 'bg-pink-500/10',
    border: 'border-pink-500/30',
    glow: 'neon-glow-pink'
  }
}

export function StatCard({ title, label, value, icon, trend, color = 'green' }: StatCardProps) {
  const colors = colorClasses[color]
  const displayLabel = label || title
  
  // Render icon - handle both component references and JSX elements
  const renderIcon = () => {
    if (!icon) return null
    
    // Check if it's a React element (already rendered)
    if (React.isValidElement(icon)) {
      return icon
    }
    
    // If it's a function/component, use createElement
    if (typeof icon === 'function') {
      return React.createElement(icon as React.ComponentType<any>, { className: "w-6 h-6" })
    }
    
    // Check if it's an object (forwardRef, memo, etc.)
    if (typeof icon === 'object' && icon !== null) {
      return React.createElement(icon as any, { className: "w-6 h-6" })
    }
    
    // Fallback: return null to avoid rendering invalid objects
    return null
  }
  
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover-glow group transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-400 mb-2 group-hover:text-slate-300 transition-colors">
            {displayLabel}
          </p>
          <p className={`text-2xl font-mono font-bold ${colors.text} transition-all duration-300`}>
            {value}
          </p>
          {trend && (
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
              <div className={`h-1 flex-1 max-w-[60px] rounded-full overflow-hidden bg-slate-800`}>
                <div 
                  className={`h-full ${trend.isPositive ? 'bg-green-400' : 'bg-red-400'} transition-all duration-500`}
                  style={{ width: `${Math.min(Math.abs(trend.value), 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg border ${colors.bg} ${colors.border} ${colors.glow} transition-all duration-300 group-hover:scale-110`}>
          {renderIcon()}
        </div>
      </div>
    </div>
  )
}