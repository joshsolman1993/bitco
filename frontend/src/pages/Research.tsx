import { useEffect, useState } from 'react'
import { useGameStore } from '../store/useGameStore'
import { Card } from '../components/UI/Card'
import { ProgressBar } from '../components/UI/ProgressBar'
import { Button } from '../components/UI/Button'
import { Badge } from '../components/UI/Badge'
import { Loading } from '../components/UI/Loading'
import { FlaskConical, Cpu, TrendingUp, Cog, Shield, Sparkles } from 'lucide-react'
import { researchApi } from '../services/api'

const researchCategories = [
  { id: 'MINING', name: 'Mining', icon: Cpu, color: 'blue' },
  { id: 'TRADING', name: 'Trading', icon: TrendingUp, color: 'green' },
  { id: 'AUTOMATION', name: 'Automation', icon: Cog, color: 'purple' },
  { id: 'COMPLIANCE', name: 'Compliance', icon: Shield, color: 'amber' }
]

export function Research() {
  const { setResearch, addAlert } = useGameStore()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [availableNodes, setAvailableNodes] = useState<any[]>([])
  
  // Fetch research data on mount
  useEffect(() => {
    const fetchResearch = async () => {
      try {
        setLoading(true)
        
        // Fetch available research nodes
        const nodes = await researchApi.getAvailable()
        setAvailableNodes(nodes)
        
        // Fetch research progress
        const progress = await researchApi.getProgress()
        setResearch(progress)
        
      } catch (error: any) {
        console.error('Failed to fetch research data:', error)
        addAlert({
          type: 'critical',
          message: 'Failed to load research data',
          timestamp: new Date()
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchResearch()
  }, [])
  
  const filteredResearch = (selectedCategory === 'all' 
    ? availableNodes 
    : availableNodes.filter(r => r.category === selectedCategory)
  ).filter(node => {
    // Only include nodes with valid categories
    return researchCategories.some(c => c.id === node.category)
  })
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loading size="lg" text="Loading research..." variant="pulse" />
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading text-neon-blue neon-text-glow-blue animate-fade-in">
          Research & Development
        </h1>
        <p className="text-slate-400 mt-1 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
          Unlock new technologies and improvements
        </p>
      </div>
      
      {/* Category Filter */}
      <div className="flex gap-3">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            selectedCategory === 'all'
              ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
              : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
          }`}
        >
          All Research
        </button>
        {researchCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? `bg-${cat.color}-500/20 border border-${cat.color}-500/30 text-${cat.color}-400`
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.name}
          </button>
        ))}
      </div>
      
      {/* Research Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResearch.map((node, index) => {
          const category = researchCategories.find(c => c.id === node.category)!
          const Icon = category.icon
          const glowColors: Record<string, 'cyan' | 'green' | 'purple' | 'pink'> = {
            blue: 'cyan',
            green: 'green',
            purple: 'purple',
            amber: 'pink'
          }
          
          return (
            <Card 
              key={`research-${node.id}`}
              variant="glow"
              glowColor={glowColors[category.color] || 'cyan'}
              className="animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`group p-3 bg-${category.color}-500/20 border border-${category.color}-500/50 rounded-lg hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 text-${category.color}-400 group-hover:animate-pulse`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-heading text-slate-200">{node.name}</h3>
                      <Badge 
                        variant={category.color === 'green' ? 'success' : category.color === 'amber' ? 'warning' : 'info'} 
                        size="sm"
                      >
                        {category.name}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-400">Level</p>
                    <p className={`text-2xl font-mono font-bold text-${category.color}-400 neon-text-glow-${category.color === 'blue' ? 'cyan' : category.color}`}>
                      {node.level}
                    </p>
                  </div>
                </div>
                
                {/* Progress */}
                <ProgressBar 
                  value={node.progress} 
                  label="Research Progress"
                  color={category.color as any}
                />
                
                {/* Cost & Benefits */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 glass rounded-lg border border-amber-500/30">
                    <p className="text-xs text-slate-400 mb-1">Cost</p>
                    <p className="text-sm font-mono text-amber-400 font-bold">
                      ${node.cost.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 glass rounded-lg border border-blue-500/30">
                    <p className="text-xs text-slate-400 mb-1">Time</p>
                    <p className="text-sm font-mono text-blue-400 font-bold">
                      {Math.floor(Math.random() * 24) + 1}h
                    </p>
                  </div>
                </div>
                
                {/* Benefits */}
                <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-2">Benefits</p>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li key="benefit-efficiency">• +15% efficiency improvement</li>
                    <li key="benefit-energy">• -10% energy consumption</li>
                  </ul>
                </div>
                
                {/* Action Button */}
                {node.progress === 0 ? (
                  <Button variant="primary" size="md" className="w-full">
                    Start Research
                  </Button>
                ) : node.progress < 100 ? (
                  <Button variant="ghost" size="md" className="w-full" disabled>
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                      In Progress...
                    </span>
                  </Button>
                ) : (
                  <Button variant="primary" size="md" className="w-full">
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    Upgrade to Level {node.level + 1}
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>
      
      {/* Tech Tree Visualization */}
      <Card variant="cyber">
        <div className="mb-4">
          <h3 className="text-lg font-heading text-slate-200">Technology Tree</h3>
          <p className="text-sm text-slate-400">Visual research progression map</p>
        </div>
        <div className="relative bg-slate-800/30 rounded-lg p-8 min-h-[400px] flex items-center justify-center border-2 border-dashed border-slate-700 overflow-hidden">
          {/* Animated node network background */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full">
              {Array.from({ length: 6 }).map((_, i) => (
                <g key={i}>
                  <circle 
                    cx={`${(i + 1) * 15}%`} 
                    cy="30%" 
                    r="8" 
                    className="fill-blue-500 animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                  <circle 
                    cx={`${(i + 1) * 15}%`} 
                    cy="70%" 
                    r="8" 
                    className="fill-purple-500 animate-pulse"
                    style={{ animationDelay: `${i * 200 + 100}ms` }}
                  />
                  {i < 5 && (
                    <>
                      <line 
                        x1={`${(i + 1) * 15}%`} 
                        y1="30%" 
                        x2={`${(i + 2) * 15}%`} 
                        y2="30%" 
                        className="stroke-blue-500/50 stroke-2"
                      />
                      <line 
                        x1={`${(i + 1) * 15}%`} 
                        y1="70%" 
                        x2={`${(i + 2) * 15}%`} 
                        y2="70%" 
                        className="stroke-purple-500/50 stroke-2"
                      />
                    </>
                  )}
                </g>
              ))}
            </svg>
          </div>
          <div className="text-center relative z-10">
            <div className="relative inline-block mb-3">
              <FlaskConical className="w-12 h-12 text-blue-400 animate-float" />
              <div className="absolute inset-0 w-12 h-12 bg-blue-500/30 rounded-full blur-xl animate-glow-pulse" />
            </div>
            <p className="text-slate-300 font-medium mb-2">Interactive tech tree coming soon</p>
            <p className="text-sm text-slate-500">
              Visual representation of research dependencies and progression paths
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}