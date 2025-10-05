interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  variant?: 'spinner' | 'pulse' | 'dots'
}

export function Loading({ size = 'md', text, variant = 'spinner' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }
  
  if (variant === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className={`${sizeClasses[size]} border-4 border-slate-700 border-t-neon-cyan rounded-full animate-spin`} />
          <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-r-neon-purple rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        {text && <p className="text-slate-400 text-sm animate-pulse">{text}</p>}
      </div>
    )
  }
  
  if (variant === 'pulse') {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className={`${sizeClasses[size]} rounded-full bg-neon-cyan/20 animate-ping`} />
        {text && <p className="text-slate-400 text-sm animate-pulse">{text}</p>}
      </div>
    )
  }
  
  if (variant === 'dots') {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 rounded-full bg-neon-purple animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 rounded-full bg-neon-pink animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        {text && <p className="text-slate-400 text-sm">{text}</p>}
      </div>
    )
  }
  
  return null
}