import { useEffect, useState } from 'react'
import { useGameStore } from '../store/useGameStore'
import { Card } from '../components/UI/Card'
import { Button } from '../components/UI/Button'
import { Badge } from '../components/UI/Badge'
import { Loading } from '../components/UI/Loading'
import { Vote, Users, Award, TrendingUp, Scale } from 'lucide-react'
import { governanceApi } from '../services/api'

const factions = [
  { id: 1, name: 'Mining Pools', reputation: 75, color: 'blue' },
  { id: 2, name: 'Hardware Suppliers', reputation: 60, color: 'purple' },
  { id: 3, name: 'Regulators', reputation: 45, color: 'amber' },
  { id: 4, name: 'Community', reputation: 85, color: 'green' }
]

export function Governance() {
  const { addAlert } = useGameStore()
  const [loading, setLoading] = useState(true)
  const [proposals, setProposals] = useState<any[]>([])
  
  // Fetch proposals on mount
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        setLoading(true)
        const data = await governanceApi.getProposals()
        setProposals(data)
      } catch (error: any) {
        console.error('Failed to fetch proposals:', error)
        addAlert({
          type: 'critical',
          message: 'Failed to load governance proposals',
          timestamp: new Date()
        })
      } finally {
        setLoading(false)
      }
    }
    
    fetchProposals()
  }, [])
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loading size="lg" text="Loading proposals..." variant="dots" />
      </div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading text-neon-green neon-text-glow-green animate-fade-in">
          Governance
        </h1>
        <p className="text-slate-400 mt-1 flex items-center gap-2">
          <Scale className="w-4 h-4 text-green-400" />
          Participate in decisions and build reputation
        </p>
      </div>
      
      {/* Reputation Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {factions.map((faction, index) => (
          <Card 
            key={faction.id}
            variant="glow"
            glowColor={faction.color === 'blue' ? 'cyan' : faction.color === 'amber' ? 'pink' : faction.color as any}
            className="animate-slide-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-slate-200">{faction.name}</h3>
                <Users className={`w-5 h-5 text-${faction.color}-400 animate-pulse`} />
              </div>
              <div>
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Reputation</span>
                  <span className={`font-mono font-bold text-${faction.color}-400`}>{faction.reputation}/100</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-${faction.color}-500 transition-all animate-shimmer`}
                    style={{ width: `${faction.reputation}%` }}
                  />
                </div>
              </div>
              <Badge 
                variant={faction.reputation >= 75 ? 'success' : faction.reputation >= 50 ? 'info' : 'default'}
                size="sm"
              >
                <Award className="w-3 h-3 inline mr-1" />
                {faction.reputation >= 75 ? 'Elite' : faction.reputation >= 50 ? 'Trusted' : 'Member'}
              </Badge>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Active Proposals */}
      <Card variant="glow" glowColor="purple">
        <div className="mb-4">
          <h3 className="text-lg font-heading text-slate-200">Active Proposals</h3>
          <p className="text-sm text-slate-400">Vote on governance decisions</p>
        </div>
        <div className="space-y-4">
          {proposals.filter(p => p.status === 'ACTIVE').map((proposal) => {
            const totalVotes = proposal.votesFor + proposal.votesAgainst
            const forPercentage = (proposal.votesFor / totalVotes) * 100
            const daysLeft = Math.ceil((proposal.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
            
            return (
              <div 
                key={proposal.id}
                className="p-6 glass rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all hover:neon-glow-purple"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-heading text-slate-200 mb-2">
                      {proposal.title}
                    </h3>
                    <p className="text-sm text-slate-400">
                      {proposal.description}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <p className="text-sm text-slate-400">Ends in</p>
                    <p className="text-lg font-mono text-amber-400">{daysLeft}d</p>
                  </div>
                </div>
                
                {/* Vote Distribution */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>For: {proposal.votesFor.toLocaleString()}</span>
                    <span>Against: {proposal.votesAgainst.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-green-500"
                      style={{ width: `${forPercentage}%` }}
                    />
                    <div 
                      className="bg-red-500"
                      style={{ width: `${100 - forPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>{forPercentage.toFixed(1)}%</span>
                    <span>{(100 - forPercentage).toFixed(1)}%</span>
                  </div>
                </div>
                
                {/* Vote Buttons */}
                <div className="flex gap-3">
                  <Button variant="primary" size="sm" className="flex-1">
                    <Vote className="w-4 h-4 inline mr-2" />
                    Vote For
                  </Button>
                  <Button variant="danger" size="sm" className="flex-1">
                    Vote Against
                  </Button>
                  <Button variant="ghost" size="sm">
                    Details
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
      
      {/* Past Proposals */}
      <Card variant="cyber">
        <div className="mb-4">
          <h3 className="text-lg font-heading text-slate-200">Recent Decisions</h3>
          <p className="text-sm text-slate-400">Completed governance votes</p>
        </div>
        <div className="space-y-3">
          {proposals.filter(p => p.status === 'PASSED' || p.status === 'REJECTED').map((proposal) => {
            const passed = proposal.status === 'PASSED'
            
            return (
              <div 
                key={proposal.id}
                className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-sm font-medium text-slate-200">
                        {proposal.title}
                      </h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        passed 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {passed ? 'PASSED' : 'REJECTED'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {proposal.votesFor.toLocaleString()} for, {proposal.votesAgainst.toLocaleString()} against
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">
                      {new Date(proposal.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
      
      {/* Reputation Benefits */}
      <Card variant="glow" glowColor="green">
        <div className="mb-4">
          <h3 className="text-lg font-heading text-slate-200">Reputation Benefits</h3>
          <p className="text-sm text-slate-400">Unlocked perks and bonuses</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-green-400" />
              <h4 className="text-sm font-medium text-green-400">Community Elite</h4>
            </div>
            <p className="text-xs text-slate-400">
              • 10% discount on hardware purchases<br />
              • Priority support access<br />
              • Exclusive quest access
            </p>
          </div>
          
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h4 className="text-sm font-medium text-blue-400">Pool Trusted</h4>
            </div>
            <p className="text-xs text-slate-400">
              • Reduced pool fees (1.5% → 1.2%)<br />
              • Priority payout processing<br />
              • Advanced analytics access
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}