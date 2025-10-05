import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Controllers
import { authRoutes } from './controllers/authController'
import { playerRoutes } from './controllers/playerController'
import { siteRoutes } from './controllers/siteController'
import { marketRoutes } from './controllers/marketController'
import { researchRoutes } from './controllers/researchController'
import { governanceRoutes } from './controllers/governanceController'
import { questRoutes } from './controllers/questController'

// Services
import { tickEngine } from './services/tickEngine'
import { initializeWebSocketServer } from './services/websocketServer'
import { questService } from './services/questService'

const app = express()
const PORT = process.env.PORT || 3000

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 999999999, // Limit auth attempts to 5 per 15 minutes
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
})

// Apply rate limiting
app.use('/api/', limiter)
app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

// Body parser
app.use(express.json())

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${req.method} ${req.path}`)
  next()
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/player', playerRoutes)
app.use('/api/site', siteRoutes)
app.use('/api/market', marketRoutes)
app.use('/api/research', researchRoutes)
app.use('/api/governance', governanceRoutes)
app.use('/api/quest', questRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Bitcoin Tycoon Backend is running!',
    tickEngine: tickEngine.getCurrentTick()
  })
})

// Create HTTP server
const server = createServer(app)

// Initialize WebSocket server
initializeWebSocketServer(server)

// Seed quests on startup
questService.seedQuests().then(() => {
  console.log('✅ Quest system initialized')
})

// Start tick engine
tickEngine.start()

// Start server
server.listen(PORT, () => {
  console.log('🎮 ========================================')
  console.log('🎮 Bitcoin Tycoon Backend')
  console.log('🎮 ========================================')
  console.log(`🚀 HTTP Server: http://localhost:${PORT}`)
  console.log(`🔌 WebSocket: ws://localhost:${PORT}/ws`)
  console.log(`📊 Health: http://localhost:${PORT}/api/health`)
  console.log('🎮 ========================================')
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...')
  tickEngine.stop()
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...')
  tickEngine.stop()
  server.close(() => {
    console.log('✅ Server closed')
    process.exit(0)
  })
})