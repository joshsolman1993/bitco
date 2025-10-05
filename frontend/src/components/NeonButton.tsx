import React from 'react'

interface NeonButtonProps {
  children: React.ReactNode
  color?: 'cyan' | 'purple' | 'magenta' | 'lime'
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function NeonButton({ 
  children, 
  color = 'cyan', 
  onClick, 
  disabled = false,
  className = ''
}: NeonButtonProps) {
  const colorClasses = {
    cyan: 'border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10',
    purple: 'border-neon-purple text-neon-purple hover:bg-neon-purple/10',
    magenta: 'border-neon-magenta text-neon-magenta hover:bg-neon-magenta/10',
    lime: 'border-neon-lime text-neon-lime hover:bg-neon-lime/10'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 border-2 rounded-md font-heading tracking-wider transition-all duration-300 bg-background/10 backdrop-blur-sm ${colorClasses[color]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:neon-glow'
      } ${className}`}
    >
      {children}
    </button>
  )
}