import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticateToken, AuthRequest } from '../middleware/auth'

const router = Router()

// Get all sites for company
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const sites = await prisma.site.findMany({
      where: { companyId: req.companyId },
      include: {
        rigs: true,
        energyContracts: true
      }
    })
    
    res.json(sites)
  } catch (error) {
    console.error('Get sites error:', error)
    res.status(500).json({ error: 'Failed to get sites' })
  }
})

// Get single site
router.get('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const site = await prisma.site.findFirst({
      where: {
        id: req.params.id,
        companyId: req.companyId
      },
      include: {
        rigs: true,
        energyContracts: true
      }
    })
    
    if (!site) {
      return res.status(404).json({ error: 'Site not found' })
    }
    
    res.json(site)
  } catch (error) {
    console.error('Get site error:', error)
    res.status(500).json({ error: 'Failed to get site' })
  }
})

// Create new site
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, region, gridTier, coolingType } = req.body
    
    if (!name || !region) {
      return res.status(400).json({ error: 'Name and region required' })
    }
    
    // Check if company has enough funds
    const company = await prisma.company.findUnique({
      where: { id: req.companyId }
    })
    
    const siteCost = 10000 // Base cost for new site
    
    if (!company || company.usdBalance < siteCost) {
      return res.status(400).json({ error: 'Insufficient funds' })
    }
    
    // Create site and deduct cost
    const site = await prisma.site.create({
      data: {
        companyId: req.companyId!,
        name,
        region,
        gridTier: gridTier || 1,
        coolingType: coolingType || 'AIR'
      }
    })
    
    await prisma.company.update({
      where: { id: req.companyId },
      data: { usdBalance: company.usdBalance - siteCost }
    })
    
    res.json(site)
  } catch (error) {
    console.error('Create site error:', error)
    res.status(500).json({ error: 'Failed to create site' })
  }
})

// Add rig to site
router.post('/:id/rigs', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { type, gridX, gridY } = req.body
    
    if (!type || gridX === undefined || gridY === undefined) {
      return res.status(400).json({ error: 'Type and grid position required' })
    }
    
    // Verify site ownership
    const site = await prisma.site.findFirst({
      where: {
        id: req.params.id,
        companyId: req.companyId
      }
    })
    
    if (!site) {
      return res.status(404).json({ error: 'Site not found' })
    }
    
    // Check if position is occupied
    const existingRig = await prisma.rig.findUnique({
      where: {
        siteId_gridX_gridY: {
          siteId: site.id,
          gridX,
          gridY
        }
      }
    })
    
    if (existingRig) {
      return res.status(400).json({ error: 'Position already occupied' })
    }
    
    // Rig specifications
    const rigSpecs: Record<string, { hashrate: number, efficiency: number, price: number }> = {
      'ANTMINER_S19': { hashrate: 110, efficiency: 29.5, price: 5000 },
      'ANTMINER_S19_PRO': { hashrate: 110, efficiency: 29.5, price: 6000 },
      'WHATSMINER_M30S': { hashrate: 86, efficiency: 38, price: 4000 },
      'WHATSMINER_M50': { hashrate: 114, efficiency: 26, price: 7000 }
    }
    
    const specs = rigSpecs[type]
    if (!specs) {
      return res.status(400).json({ error: 'Invalid rig type' })
    }
    
    // Check if company has enough funds
    const company = await prisma.company.findUnique({
      where: { id: req.companyId }
    })
    
    if (!company || company.usdBalance < specs.price) {
      return res.status(400).json({ error: 'Insufficient funds' })
    }
    
    // Create rig and deduct cost
    const rig = await prisma.rig.create({
      data: {
        siteId: site.id,
        type,
        gridX,
        gridY,
        hashrate: specs.hashrate,
        efficiency: specs.efficiency,
        purchasePrice: specs.price
      }
    })
    
    await prisma.company.update({
      where: { id: req.companyId },
      data: { usdBalance: company.usdBalance - specs.price }
    })
    
    res.json(rig)
  } catch (error) {
    console.error('Add rig error:', error)
    res.status(500).json({ error: 'Failed to add rig' })
  }
})

// Remove rig from site
router.delete('/:siteId/rigs/:rigId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    // Verify ownership
    const rig = await prisma.rig.findFirst({
      where: {
        id: req.params.rigId,
        site: {
          id: req.params.siteId,
          companyId: req.companyId
        }
      }
    })
    
    if (!rig) {
      return res.status(404).json({ error: 'Rig not found' })
    }
    
    // Delete rig (no refund for now)
    await prisma.rig.delete({
      where: { id: rig.id }
    })
    
    res.json({ message: 'Rig removed successfully' })
  } catch (error) {
    console.error('Remove rig error:', error)
    res.status(500).json({ error: 'Failed to remove rig' })
  }
})

// Add energy contract
router.post('/:id/energy', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { provider, pricePerKWh, capacity, durationDays } = req.body
    
    if (!provider || !pricePerKWh || !capacity || !durationDays) {
      return res.status(400).json({ error: 'All fields required' })
    }
    
    // Verify site ownership
    const site = await prisma.site.findFirst({
      where: {
        id: req.params.id,
        companyId: req.companyId
      }
    })
    
    if (!site) {
      return res.status(404).json({ error: 'Site not found' })
    }
    
    const contract = await prisma.energyContract.create({
      data: {
        siteId: site.id,
        provider,
        pricePerKWh,
        capacity,
        startDate: new Date(),
        endDate: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000)
      }
    })
    
    res.json(contract)
  } catch (error) {
    console.error('Add energy contract error:', error)
    res.status(500).json({ error: 'Failed to add energy contract' })
  }
})

export { router as siteRoutes }