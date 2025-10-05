import { useGameStore } from '../../store/useGameStore'
import { Bell, Wifi, WifiOff } from 'lucide-react'

export function Header() {
  const { company, tickData, wsConnected, alerts } = useGameStore()
  
  const unreadAlerts = alerts.filter(a => a.type === 'critical' || a.type === 'warning').length
  
  return (
    <header className="h-16 bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 flex items-center justify-between px-6 relative overflow-hidden">
      {/* Animated scan line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50" />
      
      {/* Left: Tick Data */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50">
          {wsConnected ? (
            <>
              <Wifi className="w-4 h-4 text-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">LIVE</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-400 font-medium">OFFLINE</span>
            </>
          )}
        </div>
        
        {tickData && (
          <>
            <div className="flex flex-col px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/30">
              <span className="text-xs text-slate-400">BTC Price</span>
              <span className="text-sm font-mono text-green-400 font-bold">
                ${tickData.btcPrice.toLocaleString()}
              </span>
            </div>
            
            <div className="flex flex-col px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <span className="text-xs text-slate-400">Difficulty</span>
              <span className="text-sm font-mono text-blue-400 font-bold">
                {(tickData.difficulty / 1e12).toFixed(2)}T
              </span>
            </div>
            
            <div className="flex flex-col px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <span className="text-xs text-slate-400">Network Hash</span>
              <span className="text-sm font-mono text-purple-400 font-bold">
                {(tickData.networkHashrate / 1e18).toFixed(2)} EH/s
              </span>
            </div>
          </>
        )}
      </div>
      
      {/* Right: Company Info & Alerts */}
      <div className="flex items-center gap-4">
        {company ? (
          <>
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-400">USD Balance</span>
                <span className="text-sm font-mono text-green-400 font-bold">
                  ${(company.balance || 0).toLocaleString()}
                </span>
              </div>
              
              <div className="w-px h-8 bg-slate-700" />
              
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-400">BTC Balance</span>
                <span className="text-sm font-mono text-amber-400 font-bold">
                  ₿ {(company.btcBalance || 0).toFixed(8)}
                </span>
              </div>
              
              <div className="w-px h-8 bg-slate-700" />
              
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-400">Reputation</span>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-mono text-neon-cyan font-bold">
                    {company.reputation 
                      ? Math.round((company.reputation.miners + company.reputation.traders + company.reputation.regulators + company.reputation.anarchists) / 4)
                      : 0}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                </div>
              </div>
            </div>
          </>
        ) : null}
        
        <button className="relative p-2 hover:bg-slate-800/50 rounded-lg transition-all duration-300 group border border-transparent hover:border-slate-600/50">
          <Bell className="w-5 h-5 text-slate-400 group-hover:text-neon-cyan transition-colors" />
          {unreadAlerts > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]">
              {unreadAlerts}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}