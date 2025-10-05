import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = Router()

// Get all active proposals
router.get('/proposals', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const proposals = await prisma.proposal.findMany({
      where: {
        deadline: { gte: new Date() },
        outcome: null
      },
      include: {
        votes: {
          select: {
            companyId: true,
            choice: true,
            weight: true
          }
        }
      },
      orderBy: { deadline: 'asc' }
    })
    
    res.json(proposals)
  } catch (error) {
    console.error('Get proposals error:', error)
    res.status(500).json({ error: 'Failed to get proposals' })
  }
})

// Get proposal history
router.get('/proposals/history', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const proposals = await prisma.proposal.findMany({
      where: {
        outcome: { not: null }
      },
      orderBy: { resolvedAt: 'desc' },
      take: 20
    })
    
    res.json(proposals)
  } catch (error) {
    console.error('Get proposal history error:', error)
    res.status(500).json({ error: 'Failed to get proposal history' })
  }
})

// Vote on proposal
router.post('/proposals/:id/vote', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { choice } = req.body
    
    if (!choice || !['FOR', 'AGAINST', 'ABSTAIN'].includes(choice)) {
      return res.status(400).json({ error: 'Valid choice required (FOR, AGAINST, ABSTAIN)' })
    }
    
    const proposal = await prisma.proposal.findUnique({
      where: { id: req.params.id }
    })
    
    if (!proposal) {
      return res.status(404).json({ error: 'Proposal not found' })
    }
    
    if (proposal.deadline < new Date()) {
      return res.status(400).json({ error: 'Voting period has ended' })
    }
    
    if (proposal.outcome) {
      return res.status(400).json({ error: 'Proposal already resolved' })
    }
    
    // Check if already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        proposalId_companyId: {
          proposalId: proposal.id,
          companyId: req.companyId!
        }
      }
    })
    
    if (existingVote) {
      return res.status(400).json({ error: 'Already voted on this proposal' })
    }
    
    // Get company reputation to determine vote weight
    const company = await prisma.company.findUnique({
      where: { id: req.companyId }
    })
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' })
    }
    
    // Vote weight based on average reputation
    const avgReputation = (company.repMiners + company.repTraders + company.repRegulators + company.repAnarchists) / 4
    const weight = Math.floor(avgReputation / 10) + 1 // 1-11 weight
    
    // Create vote
    const vote = await prisma.vote.create({
      data: {
        proposalId: proposal.id,
        companyId: req.companyId!,
        choice,
        weight
      }
    })
    
    // Update proposal vote counts
    const updateData: any = {}
    if (choice === 'FOR') {
      updateData.votesFor = proposal.votesFor + weight
    } else if (choice === 'AGAINST') {
      updateData.votesAgainst = proposal.votesAgainst + weight
    } else {
      updateData.votesAbstain = proposal.votesAbstain + weight
    }
    
    await prisma.proposal.update({
      where: { id: proposal.id },
      data: updateData
    })
    
    // Increase governance reputation
    await prisma.company.update({
      where: { id: req.companyId },
      data: {
        repRegulators: Math.min(100, company.repRegulators + 1)
      }
    })
    
    res.json(vote)
    
  } catch (error) {
    console.error('Vote error:', error)
    res.status(500).json({ error: 'Failed to vote' })
  }
})

// Create proposal (admin only for now, could be unlocked via research)
router.post('/proposals', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { type, title, description, durationHours } = req.body
    
    if (!type || !title || !description) {
      return res.status(400).json({ error: 'Type, title, and description required' })
    }
    
    const deadline = new Date(Date.now() + (durationHours || 24) * 60 * 60 * 1000)
    
    const proposal = await prisma.proposal.create({
      data: {
        type,
        title,
        description,
        deadline
      }
    })
    
    res.json(proposal)
    
  } catch (error) {
    console.error('Create proposal error:', error)
    res.status(500).json({ error: 'Failed to create proposal' })
  }
})

export { router as governanceRoutes }