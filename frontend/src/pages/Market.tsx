import { useState, useEffect } from 'react'
import { useGameStore } from '../store/useGameStore'
import { Card } from '../components/UI/Card'
import { StatCard } from '../components/UI/StatCard'
import { Button } from '../components/UI/Button'
import { Badge } from '../components/UI/Badge'
import { Loading } from '../components/UI/Loading'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  AlertCircle,
  BarChart3
} from 'lucide-react'
import { marketApi } from '../services/api'

export function Market() {
  const { positions, tickData, setPositions, addAlert } = useGameStore()
  const [tradeType, setTradeType] = useState<'spot' | 'perps' | 'options'>('spot')
  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [amount, setAmount] = useState('')
  const [price, setPrice] = useState('')
  const [loading, setLoading] = useState(true)
  const [marketData, setMarketData] = useState<any>(null)
  
  // Fetch market data and positions on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Fetch market data
        const data = await marketApi.getMarketData()
        setMarketData(data)
        
        // Fetch positions
        const positionsData = await marketApi.getPositions()
        setPositions(positionsData)
        
      } catch (error: any) {
        console.error('Failed to fetch market data:', error)
        addAlert({
          type: 'critical',
          message: 'Failed to load market data',
          timestamp: new Date()
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])
  
  const totalPnL = (positions || []).reduce((sum, pos) => sum + (pos.pnl || 0), 0)
  const openPositions = (positions || []).filter(p => p.quantity > 0)
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loading size="lg" text="Loading market data..." />
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading text-neon-purple neon-text-glow-purple animate-fade-in">
          Market
        </h1>
        <p className="text-slate-400 mt-1 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Trade Bitcoin and manage your positions
        </p>
      </div>
      
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="BTC Price"
          value={`$${marketData?.btcPrice.toLocaleString() || tickData?.btcPrice.toLocaleString() || '0'}`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="green"
          trend={{ value: 5.2, isPositive: true }}
        />
        
        <StatCard
          label="Total P&L"
          value={`${totalPnL >= 0 ? '+' : ''}$${totalPnL.toLocaleString()}`}
          icon={totalPnL >= 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
          color={totalPnL >= 0 ? 'green' : 'pink'}
          trend={{ value: Math.abs(totalPnL / 1000), isPositive: totalPnL >= 0 }}
        />
        
        <StatCard
          label="Open Positions"
          value={openPositions.length.toString()}
          icon={<DollarSign className="w-6 h-6" />}
          color="purple"
        />
      </div>
      
      {/* Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trade Panel */}
        <Card variant="glow" glowColor="purple" className="lg:col-span-1">
          <div className="mb-4">
            <h3 className="text-lg font-heading text-slate-200">Trade</h3>
            <Badge variant="cyber" size="sm" glow>LIVE</Badge>
          </div>
          <div className="space-y-4">
            {/* Trade Type Selector */}
            <div className="flex gap-2">
              {(['spot', 'perps', 'options'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setTradeType(type)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tradeType === type
                      ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
            
            {/* Buy/Sell Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setSide('buy')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  side === 'buy'
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                }`}
              >
                Buy
              </button>
              <button
                onClick={() => setSide('sell')}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  side === 'sell'
                    ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
                }`}
              >
                Sell
              </button>
            </div>
            
            {/* Amount Input */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Amount (BTC)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            {/* Price Input */}
            <div>
              <label className="block text-sm text-slate-400 mb-2">Price (USD)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder={tickData?.btcPrice.toString() || '0'}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
            
            {/* Total */}
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total</span>
                <span className="text-slate-200 font-mono">
                  ${((parseFloat(amount) || 0) * (parseFloat(price) || tickData?.btcPrice || 0)).toLocaleString()}
                </span>
              </div>
            </div>
            
            {/* Submit Button */}
            <Button 
              variant={side === 'buy' ? 'primary' : 'danger'}
              size="lg"
              className="w-full"
            >
              {side === 'buy' ? 'Buy' : 'Sell'} {tradeType.toUpperCase()}
            </Button>
          </div>
        </Card>
        
        {/* Positions List */}
        <Card variant="glow" glowColor="cyan" className="lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-heading text-slate-200">Open Positions</h3>
            <p className="text-sm text-slate-400">Active trading positions</p>
          </div>
          {openPositions.length > 0 ? (
            <div className="space-y-3">
              {openPositions.map((position, index) => (
                <div 
                  key={position.id}
                  className="p-4 glass rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all hover:neon-glow-purple animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-mono text-slate-200">
                          {position.instrument}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          position.side === 'long'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {position.side.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 mt-1">
                        {position.quantity} @ ${position.entryPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-mono font-bold ${
                        (position.pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {(position.pnl || 0) >= 0 ? '+' : ''}${(position.pnl || 0).toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-400">
                        Current: ${(position.currentPrice || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Margin Health */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Margin Health</span>
                      <span>{position.marginHealth || 0}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          (position.marginHealth || 0) > 50 
                            ? 'bg-green-500' 
                            : (position.marginHealth || 0) > 25 
                            ? 'bg-amber-500' 
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${position.marginHealth || 0}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Warning */}
                  {(position.marginHealth || 0) < 30 && (
                    <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400 animate-pulse">
                      <AlertCircle className="w-4 h-4 animate-ping" />
                      <span>Low margin - risk of liquidation</span>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <Button variant="secondary" size="sm" className="flex-1">
                      Add Margin
                    </Button>
                    <Button variant="danger" size="sm" className="flex-1">
                      Close Position
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-heading text-slate-300 mb-2">No Open Positions</h3>
              <p className="text-slate-400">
                Start trading to see your positions here
              </p>
            </div>
          )}
        </Card>
      </div>
      
      {/* Orderbook Placeholder */}
      <Card variant="cyber">
        <div className="mb-4">
          <h3 className="text-lg font-heading text-slate-200">Order Book</h3>
          <p className="text-sm text-slate-400">Market depth visualization</p>
        </div>
        <div className="relative bg-slate-800/30 rounded-lg p-8 min-h-[300px] flex items-center justify-center border-2 border-dashed border-slate-700 overflow-hidden">
          {/* Animated bars background */}
          <div className="absolute inset-0 flex items-end justify-around opacity-20 px-8">
            {Array.from({ length: 20 }).map((_, i) => (
              <div 
                key={i}
                className={`w-2 rounded-t ${i < 10 ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}
                style={{ 
                  height: `${Math.random() * 80 + 20}%`,
                  animationDelay: `${i * 100}ms`
                }}
              />
            ))}
          </div>
          <div className="text-center relative z-10">
            <div className="relative inline-block mb-3">
              <BarChart3 className="w-12 h-12 text-purple-400 animate-float" />
              <div className="absolute inset-0 w-12 h-12 bg-purple-500/30 rounded-full blur-xl animate-glow-pulse" />
            </div>
            <p className="text-slate-300 font-medium mb-2">Order book visualization coming soon</p>
            <p className="text-sm text-slate-500">
              Real-time market depth and liquidity analysis
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}