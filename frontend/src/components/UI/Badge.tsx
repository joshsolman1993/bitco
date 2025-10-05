import React from 'react'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'cyber'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  glow = false 
}: BadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  }
  
  const variantClasses = {
    default: 'bg-slate-700/50 text-slate-300 border-slate-600',
    success: 'bg-green-500/20 text-green-400 border-green-500/50',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
    danger: 'bg-red-500/20 text-red-400 border-red-500/50',
    info: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
    cyber: 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30'
  }
  
  const glowClasses = {
    default: '',
    success: 'neon-glow-green',
    warning: 'shadow-[0_0_10px_rgba(245,158,11,0.3)]',
    danger: 'shadow-[0_0_10px_rgba(239,68,68,0.3)]',
    info: 'shadow-[0_0_10px_rgba(59,130,246,0.3)]',
    cyber: 'neon-glow-cyan'
  }
  
  return (
    <span 
      className={`
        inline-flex items-center gap-1 rounded-full border font-medium
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        ${glow ? glowClasses[variant] : ''}
        transition-all duration-300
      `}
    >
      {children}
    </span>
  )
}