import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  title?: string
  subtitle?: string
  action?: React.ReactNode
  variant?: 'default' | 'cyber' | 'glow'
  glowColor?: 'cyan' | 'purple' | 'green' | 'pink'
  style?: React.CSSProperties
}

export function Card({ 
  children, 
  className = '', 
  title, 
  subtitle, 
  action,
  variant = 'default',
  glowColor = 'cyan',
  style
}: CardProps) {
  const variantClasses = {
    default: 'bg-slate-900/50 backdrop-blur-sm border border-slate-700/50',
    cyber: 'cyber-border bg-slate-900/70 backdrop-blur-md',
    glow: `bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 hover-glow neon-glow-${glowColor}`
  }
  
  return (
    <div className={`rounded-xl transition-all duration-300 ${variantClasses[variant]} ${className}`} style={style}>
      {(title || subtitle || action) && (
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <div>
            {title && (
              <h3 className="text-lg font-heading text-slate-200 flex items-center gap-2">
                {title}
                {variant === 'glow' && (
                  <span className={`w-2 h-2 rounded-full bg-neon-${glowColor} animate-pulse`}></span>
                )}
              </h3>
            )}
            {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}