import { Router } from 'express'
import { prisma } from '../lib/prisma'
import { authenticateToken, AuthRequest } from '../middleware/auth'
import { tickEngine } from '../services/tickEngine'

const router = Router()

// Get current market data
router.get('/data', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const currentTick = tickEngine.getCurrentTick()
    
    res.json({
      btcPrice: currentTick.btcPrice,
      difficulty: currentTick.difficulty,
      networkHashrate: currentTick.networkHashrate,
      timestamp: currentTick.timestamp
    })
  } catch (error) {
    console.error('Get market data error:', error)
    res.status(500).json({ error: 'Failed to get market data' })
  }
})

// Get all positions for company
router.get('/positions', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const positions = await prisma.position.findMany({
      where: { companyId: req.companyId },
      orderBy: { openedAt: 'desc' }
    })
    
    res.json(positions)
  } catch (error) {
    console.error('Get positions error:', error)
    res.status(500).json({ error: 'Failed to get positions' })
  }
})

// Open new position
router.post('/positions', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { instrument, side, quantity, leverage } = req.body
    
    if (!instrument || !side || !quantity) {
      return res.status(400).json({ error: 'Instrument, side, and quantity required' })
    }
    
    const company = await prisma.company.findUnique({
      where: { id: req.companyId }
    })
    
    if (!company) {
      return res.status(404).json({ error: 'Company not found' })
    }
    
    const currentTick = tickEngine.getCurrentTick()
    const entryPrice = currentTick.btcPrice
    const useLeverage = leverage || 1
    
    // Calculate required margin
    const positionValue = quantity * entryPrice
    const requiredMargin = positionValue / useLeverage
    
    // For spot, need full amount. For leveraged, need margin
    const requiredFunds = useLeverage === 1 ? positionValue : requiredMargin
    
    if (instrument === 'BTC_SPOT' && side === 'LONG') {
      // Buying BTC spot
      if (company.usdBalance < positionValue) {
        return res.status(400).json({ error: 'Insufficient USD balance' })
      }
      
      // Update balances
      await prisma.company.update({
        where: { id: req.companyId },
        data: {
          usdBalance: company.usdBalance - positionValue,
          btcBalance: company.btcBalance + quantity
        }
      })
      
      // Create position record
      const position = await prisma.position.create({
        data: {
          companyId: req.companyId!,
          instrument,
          side,
          quantity,
          entryPrice,
          leverage: 1,
          status: 'CLOSED' // Spot is immediately settled
        }
      })
      
      res.json(position)
      
    } else if (instrument === 'BTC_SPOT' && side === 'SHORT') {
      // Selling BTC spot
      if (company.btcBalance < quantity) {
        return res.status(400).json({ error: 'Insufficient BTC balance' })
      }
      
      // Update balances
      await prisma.company.update({
        where: { id: req.companyId },
        data: {
          usdBalance: company.usdBalance + positionValue,
          btcBalance: company.btcBalance - quantity
        }
      })
      
      // Create position record
      const position = await prisma.position.create({
        data: {
          companyId: req.companyId!,
          instrument,
          side,
          quantity,
          entryPrice,
          leverage: 1,
          status: 'CLOSED'
        }
      })
      
      res.json(position)
      
    } else {
      // Leveraged position (perps, options)
      if (company.usdBalance < requiredMargin) {
        return res.status(400).json({ error: 'Insufficient margin' })
      }
      
      // Calculate liquidation price
      let liquidationPrice
      if (side === 'LONG') {
        liquidationPrice = entryPrice * (1 - 0.8 / useLeverage) // 80% loss triggers liquidation
      } else {
        liquidationPrice = entryPrice * (1 + 0.8 / useLeverage)
      }
      
      // Deduct margin
      await prisma.company.update({
        where: { id: req.companyId },
        data: {
          usdBalance: company.usdBalance - requiredMargin
        }
      })
      
      // Create position
      const position = await prisma.position.create({
        data: {
          companyId: req.companyId!,
          instrument,
          side,
          quantity,
          entryPrice,
          leverage: useLeverage,
          margin: requiredMargin,
          liquidationPrice,
          status: 'OPEN'
        }
      })
      
      res.json(position)
    }
    
  } catch (error) {
    console.error('Open position error:', error)
    res.status(500).json({ error: 'Failed to open position' })
  }
})

// Close position
router.post('/positions/:id/close', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const position = await prisma.position.findFirst({
      where: {
        id: req.params.id,
        companyId: req.companyId,
        status: 'OPEN'
      }
    })
    
    if (!position) {
      return res.status(404).json({ error: 'Position not found or already closed' })
    }
    
    const currentTick = tickEngine.getCurrentTick()
    const exitPrice = currentTick.btcPrice
    
    // Calculate final P&L
    let pnl = 0
    if (position.side === 'LONG') {
      pnl = (exitPrice - position.entryPrice) * position.quantity
    } else {
      pnl = (position.entryPrice - exitPrice) * position.quantity
    }
    pnl *= position.leverage
    
    // Update position
    await prisma.position.update({
      where: { id: position.id },
      data: {
        status: 'CLOSED',
        pnl,
        closedAt: new Date()
      }
    })
    
    // Return margin + P&L to company
    const company = await prisma.company.findUnique({
      where: { id: req.companyId }
    })
    
    if (company) {
      const returnAmount = (position.margin || 0) + pnl
      await prisma.company.update({
        where: { id: req.companyId },
        data: {
          usdBalance: company.usdBalance + returnAmount
        }
      })
    }
    
    res.json({ message: 'Position closed', pnl, returnAmount: (position.margin || 0) + pnl })
    
  } catch (error) {
    console.error('Close position error:', error)
    res.status(500).json({ error: 'Failed to close position' })
  }
})

export { router as marketRoutes }