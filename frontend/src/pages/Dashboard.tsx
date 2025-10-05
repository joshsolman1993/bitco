import { useEffect, useState } from 'react'
import { useGameStore } from '../store/useGameStore'
import { Card } from '../components/UI/Card'
import { StatCard } from '../components/UI/StatCard'
import { Gauge } from '../components/UI/Gauge'
import { 
  DollarSign, 
  Zap, 
  TrendingUp, 
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { playerApi, marketApi, siteApi } from '../services/api'

// Mock data for charts
const mockPnLData = [
  { time: '00:00', value: 10000 },
  { time: '04:00', value: 12000 },
  { time: '08:00', value: 11500 },
  { time: '12:00', value: 13000 },
  { time: '16:00', value: 14500 },
  { time: '20:00', value: 15000 },
  { time: '24:00', value: 16000 }
]

const mockHashrateData = [
  { time: '00:00', value: 100 },
  { time: '04:00', value: 105 },
  { time: '08:00', value: 103 },
  { time: '12:00', value: 110 },
  { time: '16:00', value: 115 },
  { time: '20:00', value: 112 },
  { time: '24:00', value: 118 }
]

export function Dashboard() {
  const { company, sites, positions, alerts, setCompany, setSites, addAlert } = useGameStore()
  const [loading, setLoading] = useState(true)
  const [btcPrice, setBtcPrice] = useState(0)
  
  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch company data
        const companyData = await playerApi.getCompany()
        setCompany(companyData)
        
        // Fetch sites
        const sitesData = await siteApi.getSites()
        setSites(sitesData)
        
        // Fetch market data for BTC price
        const marketData = await marketApi.getMarketData()
        setBtcPrice(marketData.btcPrice)
        
      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error)
        addAlert({
          type: 'critical',
          message: 'Failed to load dashboard data',
          timestamp: new Date()
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  // Calculate aggregate stats
  const totalHashrate = sites?.reduce((sum, site) => {
    const siteHashrate = site.rigs?.reduce((rigSum: number, rig: any) => rigSum + (rig.hashrate || 0), 0) || 0
    return sum + siteHashrate
  }, 0) || 0
  
  const totalPowerUsage = sites?.reduce((sum, site) => {
    const sitePower = site.rigs?.reduce((rigSum: number, rig: any) => {
      // Calculate power: hashrate (TH/s) * efficiency (J/TH) / 1000 = kW
      return rigSum + ((rig.hashrate || 0) * (rig.efficiency || 0) / 1000)
    }, 0) || 0
    return sum + sitePower
  }, 0) || 0
  
  const avgUptime = sites?.length > 0 
    ? sites.reduce((sum, site) => sum + (site.uptime || 100), 0) / sites.length 
    : 100
    
  const totalPnL = positions?.reduce((sum, pos) => sum + (pos.pnl || 0), 0) || 0
  
  const criticalAlerts = alerts?.filter(a => a.type === 'critical').length || 0
  const warningAlerts = alerts?.filter(a => a.type === 'warning').length || 0
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-neon-cyan rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-neon-purple rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-slate-400 mt-6 animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading text-neon-cyan text-glow-cyan">Dashboard</h1>
          <p className="text-slate-400 mt-1">Company overview and performance metrics</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-neon-cyan/30">
          <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
          <span className="text-sm text-neon-cyan font-mono">REAL-TIME</span>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          value={`$${((company?.balance ?? 0) + (company?.btcBalance ?? 0) * btcPrice).toLocaleString(undefined, { maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          color="green"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Total Hashrate"
          value={`${(totalHashrate / 1e12).toFixed(2)} TH/s`}
          icon={Activity}
          color="blue"
          trend={{ value: 8.3, isPositive: true }}
        />
        <StatCard
          title="Power Usage"
          value={`${totalPowerUsage.toFixed(0)} kW`}
          icon={Zap}
          color="amber"
        />
        <StatCard
          title="Trading P&L"
          value={`$${totalPnL.toLocaleString()}`}
          icon={TrendingUp}
          color={totalPnL >= 0 ? 'green' : 'red'}
          trend={{ value: 15.2, isPositive: totalPnL >= 0 }}
        />
      </div>
      
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Profit & Loss (24h)" subtitle="Cumulative P&L over time">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockPnLData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#22c55e" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        
        <Card title="Hashrate Trend (24h)" subtitle="Mining performance over time">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={mockHashrateData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #475569',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
      
      {/* Gauges and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gauges */}
        <Card title="System Health">
          <div className="flex justify-around">
            <Gauge value={avgUptime} label="Uptime" color="green" size="sm" />
            <Gauge value={85} label="Efficiency" color="blue" size="sm" />
            <Gauge value={92} label="Cooling" color="purple" size="sm" />
          </div>
        </Card>
        
        {/* Active Sites */}
        <Card title="Active Sites" subtitle={`${sites?.length || 0} sites operational`}>
          <div className="space-y-3">
            {sites?.slice(0, 3).map((site) => (
              <div key={site.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-slate-200">{site.name}</p>
                  <p className="text-xs text-slate-400">{site.region}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-green-400">
                    {((site.rigs?.reduce((sum, rig) => sum + (rig.hashrate || 0), 0) || 0) / 1e12).toFixed(2)} TH/s
                  </p>
                  <p className="text-xs text-slate-400">{site.uptime || 100}% uptime</p>
                </div>
              </div>
            ))}
            {(!sites || sites.length === 0) && (
              <p className="text-sm text-slate-400 text-center py-4">No active sites</p>
            )}
          </div>
        </Card>
        
        {/* Alerts */}
        <Card 
          title="Alerts" 
          subtitle={`${criticalAlerts + warningAlerts} active alerts`}
        >
          <div className="space-y-2">
            {alerts?.slice(0, 4).map((alert) => (
              <div 
                key={alert.id}
                className={`flex items-start gap-2 p-3 rounded-lg ${
                  alert.type === 'critical' 
                    ? 'bg-red-500/10 border border-red-500/30' 
                    : alert.type === 'warning'
                    ? 'bg-amber-500/10 border border-amber-500/30'
                    : 'bg-blue-500/10 border border-blue-500/30'
                }`}
              >
                {alert.type === 'critical' ? (
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-amber-400 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-sm text-slate-200">{alert.message}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {(!alerts || alerts.length === 0) && (
              <p className="text-sm text-slate-400 text-center py-4">No alerts</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}