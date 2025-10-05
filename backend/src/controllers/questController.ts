import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = Router()

// Get all available quests for company
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // Get company's active and completed quests
    const companyQuests = await prisma.companyQuest.findMany({
      where: { companyId: req.companyId },
      include: {
        quest: true
      }
    })

    // Get all available quests
    const allQuests = await prisma.quest.findMany({
      where: {
        OR: [
          { startDate: null }, // Always available
          {
            AND: [
              { startDate: { lte: new Date() } },
              {
                OR: [
                  { endDate: null },
                  { endDate: { gte: new Date() } }
                ]
              }
            ]
          }
        ]
      }
    })

    // Combine quest data with company progress
    const questsWithProgress = allQuests.map(quest => {
      const companyQuest = companyQuests.find(cq => cq.questId === quest.id)
      
      return {
        ...quest,
        status: companyQuest?.status || 'AVAILABLE',
        progress: companyQuest?.progress || null,
        startedAt: companyQuest?.startedAt || null,
        completedAt: companyQuest?.completedAt || null
      }
    })

    res.json(questsWithProgress)
  } catch (error) {
    console.error('Get quests error:', error)
    res.status(500).json({ error: 'Failed to get quests' })
  }
})

// Start a quest
router.post('/:questId/start', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { questId } = req.params

    // Check if quest exists and is available
    const quest = await prisma.quest.findUnique({
      where: { id: questId }
    })

    if (!quest) {
      return res.status(404).json({ error: 'Quest not found' })
    }

    // Check if quest is within date range
    const now = new Date()
    if (quest.startDate && quest.startDate > now) {
      return res.status(400).json({ error: 'Quest not yet available' })
    }
    if (quest.endDate && quest.endDate < now) {
      return res.status(400).json({ error: 'Quest has expired' })
    }

    // Check if already started
    const existing = await prisma.companyQuest.findUnique({
      where: {
        companyId_questId: {
          companyId: req.companyId!,
          questId
        }
      }
    })

    if (existing) {
      return res.status(400).json({ error: 'Quest already started' })
    }

    // Create company quest
    const companyQuest = await prisma.companyQuest.create({
      data: {
        companyId: req.companyId!,
        questId,
        status: 'ACTIVE',
        progress: {}
      },
      include: {
        quest: true
      }
    })

    res.json(companyQuest)
  } catch (error) {
    console.error('Start quest error:', error)
    res.status(500).json({ error: 'Failed to start quest' })
  }
})

// Claim quest reward
router.post('/:questId/claim', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { questId } = req.params

    // Get company quest
    const companyQuest = await prisma.companyQuest.findUnique({
      where: {
        companyId_questId: {
          companyId: req.companyId!,
          questId
        }
      },
      include: {
        quest: true
      }
    })

    if (!companyQuest) {
      return res.status(404).json({ error: 'Quest not found' })
    }

    if (companyQuest.status !== 'COMPLETED') {
      return res.status(400).json({ error: 'Quest not completed' })
    }

    if (companyQuest.completedAt) {
      return res.status(400).json({ error: 'Reward already claimed' })
    }

    // Get company
    const company = await prisma.company.findUnique({
      where: { id: req.companyId }
    })

    if (!company) {
      return res.status(404).json({ error: 'Company not found' })
    }

    // Calculate rewards
    const quest = companyQuest.quest
    const rewardRep = quest.rewardRep as any || {}

    // Update company with rewards
    await prisma.company.update({
      where: { id: req.companyId },
      data: {
        usdBalance: company.usdBalance + quest.rewardUsd,
        btcBalance: company.btcBalance + quest.rewardBtc,
        repMiners: Math.min(100, company.repMiners + (rewardRep.miners || 0)),
        repTraders: Math.min(100, company.repTraders + (rewardRep.traders || 0)),
        repRegulators: Math.min(100, company.repRegulators + (rewardRep.regulators || 0)),
        repAnarchists: Math.min(100, company.repAnarchists + (rewardRep.anarchists || 0))
      }
    })

    // Mark quest as claimed
    await prisma.companyQuest.update({
      where: {
        companyId_questId: {
          companyId: req.companyId!,
          questId
        }
      },
      data: {
        completedAt: new Date()
      }
    })

    // Create alert
    await prisma.alert.create({
      data: {
        companyId: req.companyId!,
        type: 'INFO',
        category: 'SYSTEM',
        message: `Quest completed: ${quest.title}! Rewards claimed.`
      }
    })

    res.json({
      message: 'Reward claimed successfully',
      rewards: {
        usd: quest.rewardUsd,
        btc: quest.rewardBtc,
        reputation: rewardRep,
        research: quest.rewardResearch
      }
    })
  } catch (error) {
    console.error('Claim quest error:', error)
    res.status(500).json({ error: 'Failed to claim reward' })
  }
})

// Get quest progress details
router.get('/:questId/progress', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { questId } = req.params

    const companyQuest = await prisma.companyQuest.findUnique({
      where: {
        companyId_questId: {
          companyId: req.companyId!,
          questId
        }
      },
      include: {
        quest: true
      }
    })

    if (!companyQuest) {
      return res.status(404).json({ error: 'Quest not started' })
    }

    res.json(companyQuest)
  } catch (error) {
    console.error('Get quest progress error:', error)
    res.status(500).json({ error: 'Failed to get quest progress' })
  }
})

export { router as questRoutes }