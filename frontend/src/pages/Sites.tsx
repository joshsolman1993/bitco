import { useEffect, useState } from 'react'
import { useGameStore } from '../store/useGameStore'
import { Card } from '../components/UI/Card'
import { ProgressBar } from '../components/UI/ProgressBar'
import { Button } from '../components/UI/Button'
import { Badge } from '../components/UI/Badge'
import { Loading } from '../components/UI/Loading'
import { 
  Building2, 
  Cpu, 
  Thermometer, 
  Zap, 
  Activity,
  Plus,
  MapPin
} from 'lucide-react'
import { siteApi } from '../services/api'

export function Sites() {
  const { sites, setSites, addAlert } = useGameStore()
  const [loading, setLoading] = useState(true)
  
  // Fetch sites on mount
  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoading(true)
        const sitesData = await siteApi.getSites()
        setSites(sitesData)
      } catch (error: any) {
        console.error('Failed to fetch sites:', error)
        addAlert({
          type: 'critical',
          message: 'Failed to load mining sites',
          timestamp: new Date()
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchSites()
  }, [])
  
  const getCoolingStatus = (coolingType: string): 'optimal' | 'warning' | 'critical' => {
    // Map cooling type to status (this is a placeholder logic)
    if (coolingType === 'liquid' || coolingType === 'immersion') return 'optimal'
    if (coolingType === 'air') return 'warning'
    return 'optimal'
  }
  
  const getCoolingColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'green'
      case 'warning': return 'amber'
      case 'critical': return 'red'
      default: return 'blue'
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loading size="lg" text="Loading mining sites..." />
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading text-neon-cyan neon-text-glow-cyan animate-fade-in">
            Mining Sites
          </h1>
          <p className="text-slate-400 mt-1 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Manage your infrastructure and mining operations
          </p>
        </div>
        <Button variant="primary" size="md" icon={<Plus className="w-4 h-4" />}>
          New Site
        </Button>
      </div>
      
      {/* Sites Grid */}
      {sites.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sites.map((site, index) => (
            <Card 
              key={site.id}
              variant="glow"
              glowColor="cyan"
              className="animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-heading text-slate-200 mb-1">{site.name}</h3>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-slate-400">{site.region}</span>
                  </div>
                </div>
                <Badge variant="cyber" glow>ACTIVE</Badge>
              </div>
              <div className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="group flex items-center gap-3 p-3 glass rounded-lg border border-blue-500/30 hover:border-blue-400/50 transition-all hover:neon-glow-blue">
                    <div className="p-2 bg-blue-500/20 border border-blue-500/50 rounded-lg group-hover:scale-110 transition-transform">
                      <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Hashrate</p>
                      <p className="text-sm font-mono text-blue-400 font-bold">
                        {((site.rigs || []).reduce((sum: number, rig: any) => sum + (rig.hashrate || 0), 0)).toFixed(2)} TH/s
                      </p>
                    </div>
                  </div>
                  
                  <div className="group flex items-center gap-3 p-3 glass rounded-lg border border-amber-500/30 hover:border-amber-400/50 transition-all hover:shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                    <div className="p-2 bg-amber-500/20 border border-amber-500/50 rounded-lg group-hover:scale-110 transition-transform">
                      <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Power Usage</p>
                      <p className="text-sm font-mono text-amber-400 font-bold">
                        {((site.rigs || []).reduce((sum: number, rig: any) => sum + ((rig.hashrate || 0) * (rig.efficiency || 0) / 1000), 0)).toFixed(1)} kW
                      </p>
                    </div>
                  </div>
                  
                  <div className={`group flex items-center gap-3 p-3 glass rounded-lg border border-${getCoolingColor(getCoolingStatus(site.coolingType))}-500/30 hover:border-${getCoolingColor(getCoolingStatus(site.coolingType))}-400/50 transition-all`}>
                    <div className={`p-2 bg-${getCoolingColor(getCoolingStatus(site.coolingType))}-500/20 border border-${getCoolingColor(getCoolingStatus(site.coolingType))}-500/50 rounded-lg group-hover:scale-110 transition-transform`}>
                      <Thermometer className={`w-5 h-5 text-${getCoolingColor(getCoolingStatus(site.coolingType))}-400`} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Cooling</p>
                      <p className={`text-sm font-mono text-${getCoolingColor(getCoolingStatus(site.coolingType))}-400 capitalize font-bold`}>
                        {getCoolingStatus(site.coolingType)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="group flex items-center gap-3 p-3 glass rounded-lg border border-green-500/30 hover:border-green-400/50 transition-all hover:neon-glow-green">
                    <div className="p-2 bg-green-500/20 border border-green-500/50 rounded-lg group-hover:scale-110 transition-transform">
                      <Cpu className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Rigs</p>
                      <p className="text-sm font-mono text-green-400 font-bold">
                        24 / 32
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Uptime Progress */}
                <div>
                  <ProgressBar 
                    value={site.uptime} 
                    label="Uptime" 
                    color="green"
                  />
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1">
                    Add Rigs
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card variant="cyber">
          <div className="text-center py-12">
            <div className="relative inline-block mb-4">
              <Building2 className="w-16 h-16 text-slate-600 animate-float" />
              <div className="absolute inset-0 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl animate-pulse" />
            </div>
            <h3 className="text-xl font-heading text-slate-300 mb-2">No Mining Sites</h3>
            <p className="text-slate-400 mb-6">
              Get started by creating your first mining site
            </p>
            <Button variant="primary" size="lg" icon={<Plus className="w-4 h-4" />}>
              Create Your First Site
            </Button>
          </div>
        </Card>
      )}
      
      {/* Site Layout Visualization (Placeholder) */}
      {sites.length > 0 && (
        <Card variant="cyber">
          <div className="mb-4">
            <h3 className="text-lg font-heading text-slate-200">Site Layout</h3>
            <p className="text-sm text-slate-400">Interactive rig placement and monitoring</p>
          </div>
          <div className="relative bg-slate-800/30 rounded-lg p-8 min-h-[400px] flex items-center justify-center border-2 border-dashed border-slate-700 overflow-hidden">
            {/* Animated grid background */}
            <div className="absolute inset-0 opacity-20">
              <div className="grid grid-cols-8 grid-rows-8 h-full w-full gap-4">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="border border-cyan-500/30 rounded animate-pulse"
                    style={{ animationDelay: `${i * 50}ms` }}
                  />
                ))}
              </div>
            </div>
            <div className="text-center relative z-10">
              <div className="relative inline-block mb-3">
                <Cpu className="w-12 h-12 text-cyan-400 animate-float" />
                <div className="absolute inset-0 w-12 h-12 bg-cyan-500/30 rounded-full blur-xl animate-glow-pulse" />
              </div>
              <p className="text-slate-300 font-medium mb-2">Interactive site layout coming soon</p>
              <p className="text-sm text-slate-500">
                Drag-and-drop rig placement, heatmap visualization, and real-time monitoring
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}