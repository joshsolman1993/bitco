import { prisma } from '../lib/prisma'

/**
 * Quest Service
 * Handles quest progress tracking and auto-completion
 */

export interface QuestRequirement {
  type: string
  target: number
  current?: number
}

export interface QuestProgress {
  [key: string]: number
}

class QuestService {
  /**
   * Check and update quest progress for a company
   */
  async checkQuestProgress(companyId: string): Promise<void> {
    try {
      // Get all active quests for company
      const activeQuests = await prisma.companyQuest.findMany({
        where: {
          companyId,
          status: 'ACTIVE'
        },
        include: {
          quest: true,
          company: {
            include: {
              sites: {
                include: {
                  rigs: true
                }
              },
              positions: true,
              research: true
            }
          }
        }
      })

      for (const companyQuest of activeQuests) {
        const requirements = companyQuest.quest.requirements as any
        const progress: QuestProgress = {}
        let isCompleted = true

        // Check each requirement
        for (const [key, value] of Object.entries(requirements)) {
          const target = value as number
          let current = 0

          switch (key) {
            case 'total_hashrate':
              // Calculate total hashrate across all sites
              current = companyQuest.company.sites.reduce((sum, site) => {
                const siteHashrate = site.rigs.reduce((rigSum, rig) => rigSum + rig.hashrate, 0)
                return sum + siteHashrate
              }, 0)
              break

            case 'site_count':
              current = companyQuest.company.sites.length
              break

            case 'rig_count':
              current = companyQuest.company.sites.reduce((sum, site) => sum + site.rigs.length, 0)
              break

            case 'usd_balance':
              current = companyQuest.company.usdBalance
              break

            case 'btc_balance':
              current = companyQuest.company.btcBalance
              break

            case 'btc_mined':
              // This would need to be tracked separately in a mining stats table
              // For now, use BTC balance as proxy
              current = companyQuest.company.btcBalance
              break

            case 'trades_completed':
              // Count closed positions
              current = companyQuest.company.positions.filter(p => p.status === 'CLOSED').length
              break

            case 'profitable_trades':
              // Count profitable closed positions
              current = companyQuest.company.positions.filter(p => p.status === 'CLOSED' && p.pnl > 0).length
              break

            case 'research_completed':
              current = companyQuest.company.research.filter(r => r.status === 'COMPLETED').length
              break

            case 'reputation_miners':
              current = companyQuest.company.repMiners
              break

            case 'reputation_traders':
              current = companyQuest.company.repTraders
              break

            case 'reputation_regulators':
              current = companyQuest.company.repRegulators
              break

            case 'reputation_anarchists':
              current = companyQuest.company.repAnarchists
              break

            case 'any_reputation':
              // Check if any faction reputation meets target
              current = Math.max(
                companyQuest.company.repMiners,
                companyQuest.company.repTraders,
                companyQuest.company.repRegulators,
                companyQuest.company.repAnarchists
              )
              break

            default:
              console.warn(`Unknown quest requirement type: ${key}`)
          }

          progress[key] = current

          // Check if this requirement is met
          if (current < target) {
            isCompleted = false
          }
        }

        // Update progress
        await prisma.companyQuest.update({
          where: { id: companyQuest.id },
          data: {
            progress: progress as any,
            status: isCompleted ? 'COMPLETED' : 'ACTIVE'
          }
        })

        // If completed, create alert
        if (isCompleted && companyQuest.status !== 'COMPLETED') {
          await prisma.alert.create({
            data: {
              companyId,
              type: 'INFO',
              category: 'SYSTEM',
              message: `Quest completed: ${companyQuest.quest.title}! Claim your reward.`
            }
          })
        }
      }
    } catch (error) {
      console.error('Check quest progress error:', error)
    }
  }

  /**
   * Create starter quests for new company
   */
  async createStarterQuests(companyId: string): Promise<void> {
    try {
      // Check if starter quests already exist
      const existingQuests = await prisma.companyQuest.findMany({
        where: { companyId }
      })

      if (existingQuests.length > 0) {
        return // Already has quests
      }

      // Get tutorial quests
      const tutorialQuests = await prisma.quest.findMany({
        where: { type: 'MAIN' }
      })

      // Auto-start tutorial quests
      for (const quest of tutorialQuests) {
        await prisma.companyQuest.create({
          data: {
            companyId,
            questId: quest.id,
            status: 'ACTIVE',
            progress: {}
          }
        })
      }
    } catch (error) {
      console.error('Create starter quests error:', error)
    }
  }

  /**
   * Seed initial quests into database
   */
  async seedQuests(): Promise<void> {
    try {
      const existingQuests = await prisma.quest.count()
      if (existingQuests > 0) {
        console.log('Quests already seeded')
        return
      }

      const quests = [
        // Tutorial/Main Quests
        {
          type: 'MAIN',
          category: 'MINING',
          title: 'First Mining Site',
          description: 'Establish your first mining operation by creating a site',
          requirements: { site_count: 1 },
          rewardUsd: 5000,
          rewardBtc: 0,
          rewardRep: { miners: 10 },
          rewardResearch: 0
        },
        {
          type: 'MAIN',
          category: 'MINING',
          title: 'First Mining Rig',
          description: 'Purchase and install your first mining rig',
          requirements: { rig_count: 1 },
          rewardUsd: 2500,
          rewardBtc: 0,
          rewardRep: { miners: 5 },
          rewardResearch: 0
        },
        {
          type: 'MAIN',
          category: 'MINING',
          title: 'Reach 100 TH/s',
          description: 'Scale your mining operations to 100 TH/s total hashrate',
          requirements: { total_hashrate: 100 },
          rewardUsd: 10000,
          rewardBtc: 0.001,
          rewardRep: { miners: 15 },
          rewardResearch: 100
        },
        {
          type: 'MAIN',
          category: 'TRADING',
          title: 'First Trade',
          description: 'Execute your first trade on the market',
          requirements: { trades_completed: 1 },
          rewardUsd: 2500,
          rewardBtc: 0,
          rewardRep: { traders: 10 },
          rewardResearch: 0
        },
        {
          type: 'MAIN',
          category: 'TRADING',
          title: 'Profitable Trader',
          description: 'Complete a trade that results in profit',
          requirements: { profitable_trades: 1 },
          rewardUsd: 5000,
          rewardBtc: 0,
          rewardRep: { traders: 15 },
          rewardResearch: 50
        },
        {
          type: 'MAIN',
          category: 'RESEARCH',
          title: 'Research Milestone',
          description: 'Complete your first research project',
          requirements: { research_completed: 1 },
          rewardUsd: 7500,
          rewardBtc: 0,
          rewardRep: null,
          rewardResearch: 200
        },
        {
          type: 'MAIN',
          category: 'GOVERNANCE',
          title: 'Community Builder',
          description: 'Reach 75 reputation with any faction',
          requirements: { any_reputation: 75 },
          rewardUsd: 10000,
          rewardBtc: 0.002,
          rewardRep: null,
          rewardResearch: 150
        },

        // Daily Quests
        {
          type: 'DAILY',
          category: 'MINING',
          title: 'Daily Mining Goal',
          description: 'Mine 0.01 BTC today',
          requirements: { btc_mined: 0.01 },
          rewardUsd: 1000,
          rewardBtc: 0,
          rewardRep: { miners: 5 },
          rewardResearch: 25,
          startDate: new Date(),
          endDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },

        // Weekly Quests
        {
          type: 'WEEKLY',
          category: 'TRADING',
          title: 'Weekly Trading Challenge',
          description: 'Complete 10 trades this week',
          requirements: { trades_completed: 10 },
          rewardUsd: 5000,
          rewardBtc: 0.001,
          rewardRep: { traders: 10 },
          rewardResearch: 100,
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      ]

      for (const quest of quests) {
        await prisma.quest.create({
          data: quest as any
        })
      }

      console.log(`✅ Seeded ${quests.length} quests`)
    } catch (error) {
      console.error('Seed quests error:', error)
    }
  }
}

export const questService = new QuestService()