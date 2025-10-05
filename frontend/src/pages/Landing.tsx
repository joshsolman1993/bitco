import { useNavigate } from 'react-router-dom'
import { NeonButton } from '../components/NeonButton'
import { 
  Cpu, 
  TrendingUp, 
  FlaskConical, 
  Vote,
  Activity,
  Zap,
  DollarSign
} from 'lucide-react'

export function Landing() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        
        <div className="relative container mx-auto px-6 py-20">
          {/* Header */}
          <div className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-3">
              <div className="text-3xl">₿</div>
              <h1 className="text-2xl font-heading text-green-400">Bitcoin Tycoon</h1>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => navigate('/login')}
                className="px-6 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Login
              </button>
              <NeonButton color="cyan" onClick={() => navigate('/register')}>
                Sign Up
              </NeonButton>
            </div>
          </div>
          
          {/* Hero Content */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-5xl md:text-6xl font-heading text-slate-100 mb-6 leading-tight">
              Build the World's Most
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                Efficient Bitcoin Empire
              </span>
            </h2>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Master the art of cryptocurrency mining, trading, and governance in this 
              real-time strategy tycoon game. Build infrastructure, manage resources, 
              and dominate the market.
            </p>
            <div className="flex gap-4 justify-center">
              <NeonButton color="lime" onClick={() => navigate('/register')}>
                Play Free Now
              </NeonButton>
              <NeonButton color="purple">
                Watch Trailer
              </NeonButton>
            </div>
          </div>
          
          {/* Live Stats Banner */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6">
              <p className="text-sm text-slate-400 text-center mb-4">Live Simulation</p>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-1">BTC Price</p>
                  <p className="text-2xl font-mono text-green-400">$43,250</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-1">Network Difficulty</p>
                  <p className="text-2xl font-mono text-blue-400">62.5T</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-1">Active Players</p>
                  <p className="text-2xl font-mono text-purple-400">12,847</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <h3 className="text-3xl font-heading text-slate-200 text-center mb-12">
          Master Every Aspect of the Crypto Empire
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Mining */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/50 transition-colors">
            <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center mb-4">
              <Cpu className="w-6 h-6 text-blue-400" />
            </div>
            <h4 className="text-xl font-heading text-slate-200 mb-3">Mining</h4>
            <p className="text-sm text-slate-400">
              Build and manage mining sites, install ASICs, optimize cooling, 
              and maximize your hashrate efficiency.
            </p>
          </div>
          
          {/* Trading */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-green-500/50 transition-colors">
            <div className="w-12 h-12 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <h4 className="text-xl font-heading text-slate-200 mb-3">Trading</h4>
            <p className="text-sm text-slate-400">
              Trade Bitcoin spot, perpetuals, and options. Hedge your mining 
              revenue and manage market risk.
            </p>
          </div>
          
          {/* Research */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/50 transition-colors">
            <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center justify-center mb-4">
              <FlaskConical className="w-6 h-6 text-purple-400" />
            </div>
            <h4 className="text-xl font-heading text-slate-200 mb-3">Research</h4>
            <p className="text-sm text-slate-400">
              Unlock new technologies, improve efficiency, and gain competitive 
              advantages through R&D.
            </p>
          </div>
          
          {/* Governance */}
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-amber-500/50 transition-colors">
            <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/30 rounded-lg flex items-center justify-center mb-4">
              <Vote className="w-6 h-6 text-amber-400" />
            </div>
            <h4 className="text-xl font-heading text-slate-200 mb-3">Governance</h4>
            <p className="text-sm text-slate-400">
              Build reputation with factions, vote on proposals, and influence 
              the game world's direction.
            </p>
          </div>
        </div>
      </div>
      
      {/* Key Features */}
      <div className="bg-slate-900/30 py-20">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl font-heading text-slate-200 text-center mb-12">
            Real-Time Simulation
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="text-lg font-heading text-slate-200 mb-2">Live Updates</h4>
              <p className="text-sm text-slate-400">
                Real-time tick engine updates mining, markets, and events every few seconds
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="text-lg font-heading text-slate-200 mb-2">Dynamic Events</h4>
              <p className="text-sm text-slate-400">
                Respond to power outages, market crashes, and regulatory changes
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="text-lg font-heading text-slate-200 mb-2">Complex Economy</h4>
              <p className="text-sm text-slate-400">
                Manage resources, balance budgets, and optimize for maximum ROI
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-4xl font-heading text-slate-200 mb-6">
            Ready to Build Your Empire?
          </h3>
          <p className="text-lg text-slate-400 mb-8">
            Join thousands of players competing to become the ultimate Bitcoin tycoon
          </p>
          <div className="flex gap-4 justify-center">
            <NeonButton color="lime" onClick={() => navigate('/register')}>
              Start Playing Free
            </NeonButton>
            <button className="px-8 py-3 text-slate-300 hover:text-white transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <div>© 2024 Bitcoin Tycoon. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-slate-300 transition-colors">Roadmap</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Discord</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}