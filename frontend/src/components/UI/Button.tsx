import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'cyber'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode | React.ComponentType<any>
  iconPosition?: 'left' | 'right'
  isLoading?: boolean
  glowColor?: 'cyan' | 'purple' | 'green' | 'pink'
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  glowColor = 'cyan',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  }
  
  const variantClasses = {
    primary: `bg-neon-${glowColor} text-slate-900 hover:shadow-neon-${glowColor} hover:scale-105 font-bold`,
    secondary: 'bg-slate-700 text-slate-200 hover:bg-slate-600 border border-slate-600',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    ghost: 'bg-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50',
    cyber: `cyber-border bg-slate-900/50 text-neon-${glowColor} hover:bg-slate-800/70 hover:shadow-cyber`
  }
  
  // Render icon - handle both component references and JSX elements
  const renderIcon = () => {
    if (!icon) return null
    
    // Check if it's a React element (already rendered)
    if (React.isValidElement(icon)) {
      return icon
    }
    
    // If it's a function/component, render it as JSX
    if (typeof icon === 'function') {
      const IconComponent = icon as React.ComponentType<{ className?: string }>
      return <IconComponent className="w-4 h-4" />
    }
    
    // Check if it's an object with $$typeof (forwardRef, memo, etc.)
    if (typeof icon === 'object' && icon !== null && '$$typeof' in icon) {
      const IconComponent = icon as unknown as React.ComponentType<{ className?: string }>
      return <IconComponent className="w-4 h-4" />
    }
    
    // Fallback: return null to avoid rendering invalid objects
    console.warn('Button: Invalid icon type', icon)
    return null
  }
  
  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && renderIcon()}
          {children}
          {icon && iconPosition === 'right' && renderIcon()}
        </>
      )}
    </button>
  )
}