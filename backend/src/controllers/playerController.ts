import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = Router()

// Get player profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        createdAt: true,
        lastLogin: true
      }
    })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ error: 'Failed to get profile' })
  }
})

// Update player profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { username, avatar } = req.body
    
    const user = await prisma.user.update({
      where: { id: req.userId },
      data: {
        ...(username && { username }),
        ...(avatar && { avatar })
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true
      }
    })
    
    res.json(user)
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

// Get company data
router.get('/company', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.companyId },
      include: {
        sites: {
          include: {
            rigs: true,
            energyContracts: true
          }
        },
        positions: {
          where: { status: 'OPEN' }
        },
        research: true,
        quests: {
          include: {
            quest: true
          },
          where: { status: 'ACTIVE' }
        },
        alerts: {
          where: { read: false },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' })
    }
    
    res.json(company)
  } catch (error) {
    console.error('Get company error:', error)
    res.status(500).json({ error: 'Failed to get company data' })
  }
})

// Update company settings
router.put('/company', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, description } = req.body
    
    const company = await prisma.company.update({
      where: { id: req.companyId },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description })
      }
    })
    
    res.json(company)
  } catch (error) {
    console.error('Update company error:', error)
    res.status(500).json({ error: 'Failed to update company' })
  }
})

// Get alerts
router.get('/alerts', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const alerts = await prisma.alert.findMany({
      where: { companyId: req.companyId },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    
    res.json(alerts)
  } catch (error) {
    console.error('Get alerts error:', error)
    res.status(500).json({ error: 'Failed to get alerts' })
  }
})

// Mark alert as read
router.put('/alerts/:id/read', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const alert = await prisma.alert.update({
      where: { id: req.params.id },
      data: { read: true }
    })
    
    res.json(alert)
  } catch (error) {
    console.error('Mark alert read error:', error)
    res.status(500).json({ error: 'Failed to mark alert as read' })
  }
})

export { router as playerRoutes }