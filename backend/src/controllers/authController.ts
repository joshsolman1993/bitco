import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { prisma } from '../lib/prisma'
import { questService } from '../services/questService'

const router = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, companyName, region } = req.body
    
    if (!email || !password || !companyName) {
      return res.status(400).json({ error: 'Email, company name, and password required' })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    // Create user and company
    const user = await prisma.user.create({
      data: {
        email,
        username: email.split('@')[0], // Use email prefix as username
        password: hashedPassword,
        company: {
          create: {
            name: companyName,
            region: region || 'US_WEST',
            usdBalance: 50000,
            btcBalance: 0
          }
        }
      },
      include: {
        company: true
      }
    })
    
    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, companyId: user.company?.id },
      JWT_SECRET,
      { expiresIn: '1h' }
    )
    
    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // Save refresh token
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })
    
    // Create starter quests for new company
    if (user.company?.id) {
      questService.createStarterQuests(user.company.id).catch(err => {
        console.error('Failed to create starter quests:', err)
      })
    }
    
    res.json({ 
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email
      },
      company: {
        id: user.company!.id,
        name: user.company!.name,
        region: user.company!.region,
        balance: user.company!.usdBalance,
        btcBalance: user.company!.btcBalance,
        reputation: {
          miners: user.company!.repMiners,
          traders: user.company!.repTraders,
          regulators: user.company!.repRegulators,
          anarchists: user.company!.repAnarchists
        }
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Registration failed' })
  }
})

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true }
    })
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    
    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })
    
    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user.id, companyId: user.company?.id },
      JWT_SECRET,
      { expiresIn: '1h' }
    )
    
    const refreshToken = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    // Save refresh token
    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    })
    
    res.json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email
      },
      company: {
        id: user.company!.id,
        name: user.company!.name,
        region: user.company!.region,
        balance: user.company!.usdBalance,
        btcBalance: user.company!.btcBalance,
        reputation: {
          miners: user.company!.repMiners,
          traders: user.company!.repTraders,
          regulators: user.company!.repRegulators,
          anarchists: user.company!.repAnarchists
        }
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Login failed' })
  }
})

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body
    
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token required' })
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, JWT_SECRET) as any
    
    // Check if session exists
    const session = await prisma.session.findUnique({
      where: { refreshToken },
      include: { user: { include: { company: true } } }
    })
    
    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' })
    }
    
    // Generate new access token
    const accessToken = jwt.sign(
      { userId: session.user.id, companyId: session.user.company?.id },
      JWT_SECRET,
      { expiresIn: '1h' }
    )
    
    res.json({ accessToken })
  } catch (error) {
    res.status(401).json({ error: 'Invalid refresh token' })
  }
})

// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body
    
    if (refreshToken) {
      await prisma.session.deleteMany({
        where: { refreshToken }
      })
    }
    
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Logout failed' })
  }
})

export { router as authRoutes }