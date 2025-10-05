import { prisma } from '../lib/prisma'
import { EventEmitter } from 'events'
import { questService } from './questService'

/**
 * Tick Engine - Core simulation system
 * Runs every 5 seconds to update mining, markets, events
 */

export interface TickData {
  tickNumber: number
  btcPrice: number
  difficulty: number
  networkHashrate: number
  regionalData: Record<string, RegionalData>
  timestamp: Date
}

export interface RegionalData {
  energyPrice: number
  temperature: number
  reliability: number
}

class TickEngine extends EventEmitter {
  private tickNumber: number = 0
  private isRunning: boolean = false
  private intervalId?: NodeJS.Timeout
  
  // Simulation state
  private btcPrice: number = 43250
  private difficulty: number = 62.5e12 // 62.5 trillion
  private networkHashrate: number = 450e6 // 450 EH/s in TH/s
  
  // Regional data
  private regions = ['US_WEST', 'US_EAST', 'EUROPE', 'ASIA', 'SOUTH_AMERICA']
  
  constructor() {
    super()
  }
  
  /**
   * Start the tick engine
   */
  async start() {
    if (this.isRunning) {
      console.log('⚠️  Tick engine already running')
      return
    }
    
    console.log('🎮 Starting tick engine...')
    
    // Load last tick number from database
    const lastSnapshot = await prisma.tickSnapshot.findFirst({
      orderBy: { tickNumber: 'desc' }
    })
    
    if (lastSnapshot) {
      this.tickNumber = lastSnapshot.tickNumber
      this.btcPrice = lastSnapshot.btcPrice
      this.difficulty = lastSnapshot.difficulty
      this.networkHashrate = lastSnapshot.networkHashrate
      console.log(`📊 Resuming from tick ${this.tickNumber}`)
    }
    
    this.isRunning = true
    
    // Run tick every 5 seconds
    this.intervalId = setInterval(() => {
      this.executeTick().catch(err => {
        console.error('❌ Tick execution error:', err)
      })
    }, 5000)
    
    console.log('✅ Tick engine started (5s interval)')
  }
  
  /**
   * Stop the tick engine
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = undefined
    }
    this.isRunning = false
    console.log('🛑 Tick engine stopped')
  }
  
  /**
   * Execute a single tick
   */
  private async executeTick() {
    const startTime = Date.now()
    this.tickNumber++
    
    try {
      // 1. Update market simulation
      this.updateMarkets()
      
      // 2. Update regional data
      const regionalData = this.updateRegionalData()
      
      // 3. Process mining for all companies
      await this.processMining(regionalData)
      
      // 4. Update trading positions
      await this.updatePositions()
      
      // 5. Process research progress
      await this.processResearch()
      
      // 6. Check quest progress (every 10 ticks = 50 seconds)
      if (this.tickNumber % 10 === 0) {
        await this.checkQuestProgress()
      }
      
      // 7. Check for events
      await this.checkEvents(regionalData)
      
      // 7. Save tick snapshot
      const tickData: TickData = {
        tickNumber: this.tickNumber,
        btcPrice: this.btcPrice,
        difficulty: this.difficulty,
        networkHashrate: this.networkHashrate,
        regionalData,
        timestamp: new Date()
      }
      
      await prisma.tickSnapshot.create({
        data: {
          tickNumber: this.tickNumber,
          btcPrice: this.btcPrice,
          difficulty: this.difficulty,
          networkHashrate: this.networkHashrate,
          regionalData: regionalData as any,
          timestamp: new Date()
        }
      })
      
      // 8. Emit tick update event
      this.emit('tick', tickData)
      
      const duration = Date.now() - startTime
      if (duration > 1000) {
        console.warn(`⚠️  Tick ${this.tickNumber} took ${duration}ms`)
      }
      
    } catch (error) {
      console.error(`❌ Error in tick ${this.tickNumber}:`, error)
    }
  }
  
  /**
   * Update BTC price and difficulty using stochastic model
   */
  private updateMarkets() {
    // Simple random walk for BTC price
    const priceChange = (Math.random() - 0.5) * 200 // +/- $100
    this.btcPrice = Math.max(10000, this.btcPrice + priceChange)
    
    // Difficulty adjusts slowly
    if (Math.random() < 0.01) { // 1% chance per tick
      const difficultyChange = (Math.random() - 0.48) * 0.05 // Slight upward bias
      this.difficulty *= (1 + difficultyChange)
    }
    
    // Network hashrate follows difficulty
    this.networkHashrate = this.difficulty * 7.2e6 / 600 // Approximate conversion
  }
  
  /**
   * Update regional energy prices and conditions
   */
  private updateRegionalData(): Record<string, RegionalData> {
    const data: Record<string, RegionalData> = {}
    
    for (const region of this.regions) {
      // Base energy prices by region
      const basePrices: Record<string, number> = {
        'US_WEST': 0.08,
        'US_EAST': 0.10,
        'EUROPE': 0.15,
        'ASIA': 0.06,
        'SOUTH_AMERICA': 0.05
      }
      
      const basePrice = basePrices[region] || 0.08
      const priceVariation = (Math.random() - 0.5) * 0.02
      
      data[region] = {
        energyPrice: Math.max(0.03, basePrice + priceVariation),
        temperature: 20 + Math.random() * 15, // 20-35°C
        reliability: 0.95 + Math.random() * 0.05 // 95-100%
      }
    }
    
    return data
  }
  
  /**
   * Process mining yields for all active sites
   */
  private async processMining(regionalData: Record<string, RegionalData>) {
    const companies = await prisma.company.findMany({
      include: {
        sites: {
          include: {
            rigs: true,
            energyContracts: true
          }
        }
      }
    })
    
    for (const company of companies) {
      let totalBtcMined = 0
      let totalEnergyCost = 0
      
      for (const site of company.sites) {
        const regional = regionalData[site.region] || regionalData['US_WEST']
        
        // Calculate site hashrate
        let siteHashrate = 0
        let sitePower = 0
        
        for (const rig of site.rigs) {
          if (rig.status === 'ACTIVE') {
            // Apply wear factor
            const wearFactor = 1 - (rig.wear / 200) // Max 50% reduction at 100 wear
            const effectiveHashrate = rig.hashrate * wearFactor
            siteHashrate += effectiveHashrate
            
            // Power consumption (efficiency is J/TH, convert to kW)
            const rigPower = (rig.efficiency * rig.hashrate) / 1000 // kW
            sitePower += rigPower
            
            // Increase wear slightly each tick
            await prisma.rig.update({
              where: { id: rig.id },
              data: { wear: Math.min(100, rig.wear + 0.001) }
            })
          }
        }
        
        // Apply uptime factor
        const effectiveHashrate = siteHashrate * (site.uptime / 100)
        
        // Calculate BTC mined this tick (5 seconds)
        // Formula: (hashrate / network_hashrate) * block_reward * (tick_duration / block_time)
        const blockReward = 6.25 // Current BTC block reward
        const blockTime = 600 // 10 minutes in seconds
        const tickDuration = 5 // seconds
        
        const btcMined = (effectiveHashrate / this.networkHashrate) * blockReward * (tickDuration / blockTime)
        totalBtcMined += btcMined
        
        // Calculate energy cost
        const energyPrice = site.energyContracts[0]?.pricePerKWh || regional.energyPrice
        const energyCost = sitePower * energyPrice * (tickDuration / 3600) // Convert to hours
        totalEnergyCost += energyCost
        
        // Update site stats
        await prisma.site.update({
          where: { id: site.id },
          data: {
            totalHashrate: siteHashrate,
            powerUsage: sitePower,
            uptime: Math.max(90, Math.min(100, site.uptime + (Math.random() - 0.5) * 0.5))
          }
        })
      }
      
      // Update company balances
      await prisma.company.update({
        where: { id: company.id },
        data: {
          btcBalance: company.btcBalance + totalBtcMined,
          usdBalance: company.usdBalance - totalEnergyCost
        }
      })
      
      // Create alert if balance is low
      if (company.usdBalance < 1000) {
        await prisma.alert.create({
          data: {
            companyId: company.id,
            type: 'WARNING',
            category: 'SYSTEM',
            message: 'Low USD balance! Consider selling BTC or reducing operations.',
            data: { balance: company.usdBalance }
          }
        })
      }
    }
  }
  
  /**
   * Update P&L for all open trading positions
   */
  private async updatePositions() {
    const positions = await prisma.position.findMany({
      where: { status: 'OPEN' }
    })
    
    for (const position of positions) {
      let currentPrice = this.btcPrice
      
      // Calculate P&L
      let pnl = 0
      if (position.side === 'LONG') {
        pnl = (currentPrice - position.entryPrice) * position.quantity
      } else {
        pnl = (position.entryPrice - currentPrice) * position.quantity
      }
      
      // Apply leverage
      pnl *= position.leverage
      
      // Check for liquidation
      if (position.liquidationPrice) {
        const shouldLiquidate = 
          (position.side === 'LONG' && currentPrice <= position.liquidationPrice) ||
          (position.side === 'SHORT' && currentPrice >= position.liquidationPrice)
        
        if (shouldLiquidate) {
          await prisma.position.update({
            where: { id: position.id },
            data: {
              status: 'LIQUIDATED',
              pnl: -(position.margin || 0),
              closedAt: new Date()
            }
          })
          
          // Create alert
          await prisma.alert.create({
            data: {
              companyId: position.companyId,
              type: 'CRITICAL',
              category: 'TRADING',
              message: `Position liquidated: ${position.instrument}`,
              data: { positionId: position.id, loss: position.margin }
            }
          })
          
          continue
        }
      }
      
      // Update P&L
      await prisma.position.update({
        where: { id: position.id },
        data: { pnl }
      })
    }
  }
  
  /**
   * Process research progress
   */
  private async processResearch() {
    const research = await prisma.research.findMany({
      where: { status: 'IN_PROGRESS' }
    })
    
    for (const r of research) {
      // Progress 0.1% per tick (5 seconds = ~2 minutes for 100%)
      const newProgress = Math.min(100, r.progress + 0.1)
      
      if (newProgress >= 100) {
        await prisma.research.update({
          where: { id: r.id },
          data: {
            progress: 100,
            status: 'COMPLETED',
            completedAt: new Date()
          }
        })
        
        // Create alert
        await prisma.alert.create({
          data: {
            companyId: r.companyId,
            type: 'INFO',
            category: 'RESEARCH',
            message: `Research completed: ${r.nodeId}`,
            data: { researchId: r.id }
          }
        })
      } else {
        await prisma.research.update({
          where: { id: r.id },
          data: { progress: newProgress }
        })
      }
    }
  }
  
  /**
   * Check quest progress for all companies
   */
  private async checkQuestProgress() {
    try {
      const companies = await prisma.company.findMany({
        select: { id: true }
      })
      
      for (const company of companies) {
        await questService.checkQuestProgress(company.id)
      }
    } catch (error) {
      console.error('Quest progress check error:', error)
    }
  }
  
  /**
   * Check for random events
   */
  private async checkEvents(regionalData: Record<string, RegionalData>) {
    // 1% chance of event per tick
    if (Math.random() < 0.01) {
      const eventTypes = ['POWER_OUTAGE', 'MARKET_VOLATILITY', 'DIFFICULTY_SPIKE', 'HARDWARE_SHORTAGE']
      const type = eventTypes[Math.floor(Math.random() * eventTypes.length)]
      const region = this.regions[Math.floor(Math.random() * this.regions.length)]
      
      await prisma.event.create({
        data: {
          type,
          severity: 'MEDIUM',
          title: `${type.replace('_', ' ')} in ${region}`,
          description: `A ${type.toLowerCase().replace('_', ' ')} event has occurred in ${region}`,
          region,
          payload: { regionalData: regionalData[region] } as any
        }
      })
    }
  }
  
  /**
   * Get current tick data
   */
  getCurrentTick(): TickData {
    return {
      tickNumber: this.tickNumber,
      btcPrice: this.btcPrice,
      difficulty: this.difficulty,
      networkHashrate: this.networkHashrate,
      regionalData: this.updateRegionalData(),
      timestamp: new Date()
    }
  }
}

// Singleton instance
export const tickEngine = new TickEngine()