import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Building2, 
  TrendingUp, 
  FlaskConical, 
  Vote, 
  ScrollText, 
  Settings,
  Zap
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/sites', icon: Building2, label: 'Sites' },
  { path: '/market', icon: TrendingUp, label: 'Market' },
  { path: '/research', icon: FlaskConical, label: 'R&D' },
  { path: '/governance', icon: Vote, label: 'Governance' },
  { path: '/quests', icon: ScrollText, label: 'Quests' },
  { path: '/settings', icon: Settings, label: 'Settings' }
]

export function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900/50 backdrop-blur-sm border-r border-slate-700/50 flex flex-col relative overflow-hidden">
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      {/* Logo */}
      <div className="p-6 border-b border-slate-700/50 relative">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-neon-cyan animate-pulse" />
          <h1 className="text-2xl font-heading text-neon-cyan tracking-wider text-glow-cyan">
            Bitcoin Tycoon
          </h1>
        </div>
        <p className="text-xs text-slate-400 mt-2 ml-8">Build Your Empire</p>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 relative">
        {navItems.map((item, index) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative group ${
                isActive
                  ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 shadow-neon-cyan'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 hover:border-slate-600/50 border border-transparent'
              }`
            }
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 transition-all duration-300 ${
                  isActive ? 'text-neon-cyan drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]' : 'group-hover:scale-110'
                }`} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-neon-cyan rounded-r-full shadow-neon-cyan" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50 relative">
        <div className="text-xs text-slate-500 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>Version 0.1.0</span>
          </div>
          <div className="text-slate-600">© 2024 Bitcoin Tycoon</div>
        </div>
      </div>
    </aside>
  )
}