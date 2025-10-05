import { useEffect, useState } from 'react'
import { useGameStore } from '../store/useGameStore'
import { Card } from '../components/UI/Card'
import { StatCard } from '../components/UI/StatCard'
import { ProgressBar } from '../components/UI/ProgressBar'
import { Button } from '../components/UI/Button'
import { Badge } from '../components/UI/Badge'
import { Loading } from '../components/UI/Loading'
import { ScrollText, Target, Award, CheckCircle, Sparkles } from 'lucide-react'
import { questApi } from '../services/api'

interface QuestData {
  id: string
  title: string
  description: string
  type: string
  category: string
  requirements: any
  rewardUsd: number
  rewardBtc: number
  rewardResearchPoints: number
  rewardReputationCypherpunk?: number
  rewardReputationCorporate?: number
  rewardReputationAcademic?: number
  rewardReputationRegulatory?: number
  companyQuest?: {
    status: string
    progress: number
    startedAt: string
    completedAt?: string
  }
}

const categories = [
  { id: 'all', name: 'All Quests', color: 'blue' },
  { id: 'MAIN', name: 'Main', color: 'green' },
  { id: 'DAILY', name: 'Daily', color: 'blue' },
  { id: 'WEEKLY', name: 'Weekly', color: 'purple' },
  { id: 'MINING', name: 'Mining', color: 'amber' },
  { id: 'TRADING', name: 'Trading', color: 'purple' },
  { id: 'RESEARCH', name: 'Research', color: 'amber' },
  { id: 'GOVERNANCE', name: 'Governance', color: 'red' }
]

export function Quests() {
  const { addAlert } = useGameStore()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [questsData, setQuestsData] = useState<QuestData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuests()
  }, [])

  const fetchQuests = async () => {
    try {
      setLoading(true)
      const data = await questApi.getQuests()
      setQuestsData(data)
    } catch (error) {
      console.error('Failed to fetch quests:', error)
      addAlert({
        type: 'critical',
        message: 'Failed to load quests',
        timestamp: new Date()
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStartQuest = async (questId: string) => {
    try {
      await questApi.startQuest(questId)
      addAlert({
        type: 'info',
        message: 'Quest started!',
        timestamp: new Date()
      })
      fetchQuests()
    } catch (error: any) {
      console.error('Failed to start quest:', error)
      addAlert({
        type: 'critical',
        message: error.response?.data?.error || 'Failed to start quest',
        timestamp: new Date()
      })
    }
  }

  const handleClaimReward = async (questId: string) => {
    try {
      const result = await questApi.claimReward(questId)
      addAlert({
        type: 'info',
        message: `Rewards claimed! +$${result.rewards.usd.toLocaleString()}`,
        timestamp: new Date()
      })
      fetchQuests()
    } catch (error: any) {
      console.error('Failed to claim reward:', error)
      addAlert({
        type: 'critical',
        message: error.response?.data?.error || 'Failed to claim reward',
        timestamp: new Date()
      })
    }
  }

  const formatReward = (quest: QuestData) => {
    const rewards = []
    if (quest.rewardUsd > 0) rewards.push(`$${quest.rewardUsd.toLocaleString()}`)
    if (quest.rewardBtc > 0) rewards.push(`${quest.rewardBtc} BTC`)
    if (quest.rewardResearchPoints > 0) rewards.push(`${quest.rewardResearchPoints} RP`)
    return rewards.join(' + ')
  }

  const getQuestProgress = (quest: QuestData) => {
    return quest.companyQuest?.progress || 0
  }

  const getQuestStatus = (quest: QuestData) => {
    if (!quest.companyQuest) return 'available'
    return quest.companyQuest.status.toLowerCase()
  }
  
  const filteredQuests = selectedCategory === 'all'
    ? questsData
    : questsData.filter(q => q.type === selectedCategory || q.category === selectedCategory)
  
  const activeQuests = filteredQuests.filter(q => getQuestStatus(q) === 'active')
  const completedQuests = filteredQuests.filter(q => getQuestStatus(q) === 'completed')
  const availableQuests = filteredQuests.filter(q => getQuestStatus(q) === 'available')
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loading size="lg" text="Loading quests..." variant="dots" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading text-neon-amber neon-text-glow-amber animate-fade-in">
          Quests & Events
        </h1>
        <p className="text-slate-400 mt-1 flex items-center gap-2">
          <ScrollText className="w-4 h-4 text-amber-400 animate-pulse" />
          Complete objectives and earn rewards
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Active Quests"
          value={activeQuests.length.toString()}
          icon={<Target className="w-6 h-6" />}
          color="cyan"
        />
        
        <StatCard
          label="Completed"
          value={completedQuests.length.toString()}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
          trend={{ value: completedQuests.length, isPositive: true }}
        />
        
        <StatCard
          label="Total XP"
          value="1,250"
          icon={<Award className="w-6 h-6" />}
          color="purple"
        />
      </div>
      
      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? `bg-${cat.color}-500/20 border border-${cat.color}-500/30 text-${cat.color}-400`
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      
      {/* Available Quests */}
      {availableQuests.length > 0 && (
        <Card variant="glow" glowColor="cyan">
          <div className="mb-4">
            <h3 className="text-lg font-heading text-slate-200">Available Quests</h3>
            <p className="text-sm text-slate-400">Start new objectives</p>
          </div>
          <div className="space-y-4">
            {availableQuests.map((quest, index) => (
              <div 
                key={quest.id}
                className="p-6 glass rounded-lg border border-cyan-500/30 hover:border-cyan-400/50 transition-all hover:neon-glow-cyan animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-heading text-slate-200">
                        {quest.title}
                      </h3>
                      <Badge variant="info" size="sm">
                        {quest.type}
                      </Badge>
                      <Badge variant="cyber" size="sm">
                        {quest.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-400">
                      {quest.description}
                    </p>
                  </div>
                </div>
                
                {/* Reward */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400 animate-pulse" />
                    <span className="text-sm text-slate-300">
                      Reward: <span className="text-amber-400 font-mono font-bold">{formatReward(quest)}</span>
                    </span>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => handleStartQuest(quest.id)}>
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    Start Quest
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Active Quests */}
      <Card variant="glow" glowColor="purple">
        <div className="mb-4">
          <h3 className="text-lg font-heading text-slate-200">Active Quests</h3>
          <p className="text-sm text-slate-400">In-progress objectives</p>
        </div>
        <div className="space-y-4">
          {activeQuests.length > 0 ? (
            activeQuests.map((quest, index) => {
              const progress = getQuestProgress(quest)
              return (
                <div 
                  key={quest.id}
                  className="p-6 glass rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all hover:neon-glow-purple animate-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-heading text-slate-200">
                          {quest.title}
                        </h3>
                        <Badge variant="info" size="sm">
                          {quest.type}
                        </Badge>
                        <Badge variant="cyber" size="sm" glow>
                          {quest.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400">
                        {quest.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Progress */}
                  <div className="mb-4">
                    <ProgressBar 
                      value={progress} 
                      label="Progress"
                      color="blue"
                    />
                  </div>
                  
                  {/* Reward */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-400 animate-pulse" />
                      <span className="text-sm text-slate-300">
                        Reward: <span className="text-amber-400 font-mono font-bold">{formatReward(quest)}</span>
                      </span>
                    </div>
                    {progress >= 100 ? (
                      <Button variant="primary" size="sm" onClick={() => handleClaimReward(quest.id)}>
                        <Award className="w-4 h-4 inline mr-2" />
                        Claim Reward
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" disabled>
                        <span className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                          In Progress
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-heading text-slate-300 mb-2">No Active Quests</h3>
              <p className="text-slate-400">
                Start a quest from the available quests above
              </p>
            </div>
          )}
        </div>
      </Card>
      
      {/* Completed Quests */}
      {completedQuests.length > 0 && (
        <Card variant="glow" glowColor="green">
          <div className="mb-4">
            <h3 className="text-lg font-heading text-slate-200">Completed Quests</h3>
            <p className="text-sm text-slate-400">Successfully finished objectives</p>
          </div>
          <div className="space-y-3">
            {completedQuests.map((quest) => (
              <div 
                key={quest.id}
                className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <div>
                    <h4 className="text-sm font-medium text-slate-200">{quest.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Reward claimed: {formatReward(quest)}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-green-400 font-medium">COMPLETED</span>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {/* Daily/Weekly Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {questsData.filter(q => q.type === 'DAILY').map((quest) => {
          const status = getQuestStatus(quest)
          const progress = getQuestProgress(quest)
          return (
            <Card key={quest.id} title="Daily Challenge" subtitle={quest.title}>
              <div className="space-y-4">
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-400 mb-2">
                    {quest.description}
                  </h4>
                  {status === 'active' && (
                    <ProgressBar value={progress} color="blue" showLabel={false} />
                  )}
                  <p className="text-xs text-slate-400 mt-2">
                    Reward: {formatReward(quest)}
                  </p>
                  {status === 'available' && (
                    <Button 
                      variant="cyber"
                      glowColor="cyan"
                      onClick={() => handleStartQuest(quest.id)}
                      className="mt-3 w-full"
                    >
                      Start Challenge
                    </Button>
                  )}
                  {status === 'completed' && (
                    <div className="mt-3 text-center text-green-400 text-sm font-medium">
                      ✓ Completed
                    </div>
                  )}
                  {status === 'active' && progress >= 100 && (
                    <Button 
                      variant="primary"
                      glowColor="green"
                      onClick={() => handleClaimReward(quest.id)}
                      className="mt-3 w-full"
                    >
                      Claim Reward
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
        
        {questsData.filter(q => q.type === 'WEEKLY').map((quest) => {
          const status = getQuestStatus(quest)
          const progress = getQuestProgress(quest)
          return (
            <Card key={quest.id} title="Weekly Challenge" subtitle={quest.title}>
              <div className="space-y-4">
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-400 mb-2">
                    {quest.description}
                  </h4>
                  {status === 'active' && (
                    <ProgressBar value={progress} color="purple" showLabel={false} />
                  )}
                  <p className="text-xs text-slate-400 mt-2">
                    Reward: {formatReward(quest)}
                  </p>
                  {status === 'available' && (
                    <Button 
                      variant="cyber"
                      glowColor="purple"
                      onClick={() => handleStartQuest(quest.id)}
                      className="mt-3 w-full"
                    >
                      Start Challenge
                    </Button>
                  )}
                  {status === 'completed' && (
                    <div className="mt-3 text-center text-green-400 text-sm font-medium">
                      ✓ Completed
                    </div>
                  )}
                  {status === 'active' && progress >= 100 && (
                    <Button 
                      variant="primary"
                      glowColor="green"
                      onClick={() => handleClaimReward(quest.id)}
                      className="mt-3 w-full"
                    >
                      Claim Reward
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}