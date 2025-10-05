import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = Router()

// Research node definitions
const RESEARCH_NODES: Record<string, {
  category: string
  cost: number
  duration: number
  prerequisites: string[]
  benefits: string
}> = {
  'MINING_EFFICIENCY_1': {
    category: 'MINING',
    cost: 5000,
    duration: 120, // seconds
    prerequisites: [],
    benefits: '+5% mining efficiency'
  },
  'MINING_EFFICIENCY_2': {
    category: 'MINING',
    cost: 15000,
    duration: 300,
    prerequisites: ['MINING_EFFICIENCY_1'],
    benefits: '+10% mining efficiency'
  },
  'COOLING_OPTIMIZATION_1': {
    category: 'MINING',
    cost: 8000,
    duration: 180,
    prerequisites: [],
    benefits: '-10% cooling costs'
  },
  'FIRMWARE_TUNING_1': {
    category: 'MINING',
    cost: 10000,
    duration: 240,
    prerequisites: [],
    benefits: '+3% hashrate, +2% wear rate'
  },
  'TRADING_ALGORITHMS_1': {
    category: 'TRADING',
    cost: 12000,
    duration: 200,
    prerequisites: [],
    benefits: '-5% trading fees'
  },
  'RISK_MANAGEMENT_1': {
    category: 'TRADING',
    cost: 15000,
    duration: 250,
    prerequisites: [],
    benefits: '+10% margin efficiency'
  },
  'AUTOMATION_BASIC': {
    category: 'AUTOMATION',
    cost: 20000,
    duration: 300,
    prerequisites: [],
    benefits: 'Unlock basic automation scripts'
  },
  'COMPLIANCE_TOOLS_1': {
    category: 'COMPLIANCE',
    cost: 10000,
    duration: 150,
    prerequisites: [],
    benefits: '+5 reputation with regulators'
  }
}

// Get all research for company
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const research = await prisma.research.findMany({
      where: { companyId: req.companyId }
    })
    
    // Include node definitions
    const researchWithDetails = research.map(r => ({
      ...r,
      details: RESEARCH_NODES[r.nodeId]
    }))
    
    res.json(researchWithDetails)
  } catch (error) {
    console.error('Get research error:', error)
    res.status(500).json({ error: 'Failed to get research' })
  }
})

// Get available research nodes
router.get('/available', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const completedResearch = await prisma.research.findMany({
      where: {
        companyId: req.companyId,
        status: 'COMPLETED'
      },
      select: { nodeId: true }
    })
    
    const completedNodeIds = completedResearch.map(r => r.nodeId)
    
    // Filter available nodes based on prerequisites
    const availableNodes = Object.entries(RESEARCH_NODES)
      .filter(([nodeId, node]) => {
        // Not already completed
        if (completedNodeIds.includes(nodeId)) return false
        
        // Prerequisites met
        return node.prerequisites.every(prereq => completedNodeIds.includes(prereq))
      })
      .map(([nodeId, node]) => ({
        nodeId,
        ...node
      }))
    
    res.json(availableNodes)
  } catch (error) {
    console.error('Get available research error:', error)
    res.status(500).json({ error: 'Failed to get available research' })
  }
})

// Start research
router.post('/start', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { nodeId } = req.body
    
    if (!nodeId) {
      return res.status(400).json({ error: 'Node ID required' })
    }
    
    const node = RESEARCH_NODES[nodeId]
    if (!node) {
      return res.status(400).json({ error: 'Invalid research node' })
    }
    
    // Check if already researching or completed
    const existing = await prisma.research.findUnique({
      where: {
        companyId_nodeId: {
          companyId: req.companyId!,
          nodeId
        }
      }
    })
    
    if (existing) {
      return res.status(400).json({ error: 'Research already started or completed' })
    }
    
    // Check prerequisites
    const completedResearch = await prisma.research.findMany({
      where: {
        companyId: req.companyId,
        status: 'COMPLETED'
      },
      select: { nodeId: true }
    })
    
    const completedNodeIds = completedResearch.map(r => r.nodeId)
    const prerequisitesMet = node.prerequisites.every(prereq => completedNodeIds.includes(prereq))
    
    if (!prerequisitesMet) {
      return res.status(400).json({ error: 'Prerequisites not met' })
    }
    
    // Check if company has enough funds
    const company = await prisma.company.findUnique({
      where: { id: req.companyId }
    })
    
    if (!company || company.usdBalance < node.cost) {
      return res.status(400).json({ error: 'Insufficient funds' })
    }
    
    // Deduct cost and start research
    await prisma.company.update({
      where: { id: req.companyId },
      data: { usdBalance: company.usdBalance - node.cost }
    })
    
    const research = await prisma.research.create({
      data: {
        companyId: req.companyId!,
        nodeId,
        category: node.category,
        status: 'IN_PROGRESS',
        progress: 0,
        startedAt: new Date()
      }
    })
    
    res.json(research)
    
  } catch (error) {
    console.error('Start research error:', error)
    res.status(500).json({ error: 'Failed to start research' })
  }
})

export { router as researchRoutes }