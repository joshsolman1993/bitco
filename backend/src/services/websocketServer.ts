import { WebSocketServer, WebSocket } from 'ws'
import { Server } from 'http'
import { tickEngine, TickData } from './tickEngine'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string
  companyId?: string
  isAlive?: boolean
}

export class GameWebSocketServer {
  private wss: WebSocketServer
  private clients: Map<string, AuthenticatedWebSocket> = new Map()
  
  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/ws' })
    this.setupWebSocketServer()
    this.setupTickListener()
    this.setupHeartbeat()
  }
  
  private setupWebSocketServer() {
    this.wss.on('connection', (ws: AuthenticatedWebSocket, req) => {
      console.log('🔌 New WebSocket connection')
      
      ws.isAlive = true
      
      // Handle pong responses
      ws.on('pong', () => {
        ws.isAlive = true
      })
      
      // Handle messages from client
      ws.on('message', async (data) => {
        try {
          const message = JSON.parse(data.toString())
          await this.handleMessage(ws, message)
        } catch (error) {
          console.error('❌ WebSocket message error:', error)
          ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }))
        }
      })
      
      // Handle disconnection
      ws.on('close', () => {
        if (ws.userId) {
          this.clients.delete(ws.userId)
          console.log(`🔌 Client disconnected: ${ws.userId}`)
        }
      })
      
      // Send initial connection success
      ws.send(JSON.stringify({ 
        type: 'connected', 
        message: 'WebSocket connection established' 
      }))
    })
    
    console.log('✅ WebSocket server initialized on /ws')
  }
  
  private async handleMessage(ws: AuthenticatedWebSocket, message: any) {
    const { type, data } = message
    
    switch (type) {
      case 'auth':
        await this.handleAuth(ws, data)
        break
        
      case 'subscribe':
        await this.handleSubscribe(ws, data)
        break
        
      case 'ping':
        ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }))
        break
        
      default:
        ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }))
    }
  }
  
  private async handleAuth(ws: AuthenticatedWebSocket, data: any) {
    try {
      const { token } = data
      
      if (!token) {
        ws.send(JSON.stringify({ type: 'auth_error', message: 'No token provided' }))
        return
      }
      
      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as any
      ws.userId = decoded.userId
      ws.companyId = decoded.companyId
      
      // Store authenticated client
      if (ws.userId) {
        this.clients.set(ws.userId, ws)
      }
      
      // Send auth success
      ws.send(JSON.stringify({ 
        type: 'auth_success', 
        userId: ws.userId,
        companyId: ws.companyId
      }))
      
      // Send current tick data
      const currentTick = tickEngine.getCurrentTick()
      ws.send(JSON.stringify({ 
        type: 'tick:update', 
        data: currentTick 
      }))
      
      console.log(`✅ Client authenticated: ${ws.userId}`)
      
    } catch (error) {
      ws.send(JSON.stringify({ type: 'auth_error', message: 'Invalid token' }))
    }
  }
  
  private async handleSubscribe(ws: AuthenticatedWebSocket, data: any) {
    if (!ws.userId) {
      ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }))
      return
    }
    
    const { channel } = data
    
    // For now, all authenticated clients are subscribed to all updates
    // In the future, we can implement channel-specific subscriptions
    
    ws.send(JSON.stringify({ 
      type: 'subscribed', 
      channel 
    }))
  }
  
  private setupTickListener() {
    // Listen for tick updates from the tick engine
    tickEngine.on('tick', (tickData: TickData) => {
      this.broadcastToAll({
        type: 'tick:update',
        data: tickData
      })
    })
  }
  
  private setupHeartbeat() {
    // Ping clients every 30 seconds to keep connection alive
    setInterval(() => {
      this.wss.clients.forEach((ws: AuthenticatedWebSocket) => {
        if (ws.isAlive === false) {
          return ws.terminate()
        }
        
        ws.isAlive = false
        ws.ping()
      })
    }, 30000)
  }
  
  /**
   * Broadcast message to all connected clients
   */
  private broadcastToAll(message: any) {
    const data = JSON.stringify(message)
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data)
      }
    })
  }
  
  /**
   * Send message to specific user
   */
  public sendToUser(userId: string, message: any) {
    const client = this.clients.get(userId)
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message))
    }
  }
  
  /**
   * Send message to specific company
   */
  public sendToCompany(companyId: string, message: any) {
    this.clients.forEach((client) => {
      if (client.companyId === companyId && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message))
      }
    })
  }
  
  /**
   * Broadcast alert to company
   */
  public broadcastAlert(companyId: string, alert: any) {
    this.sendToCompany(companyId, {
      type: 'alert',
      data: alert
    })
  }
  
  /**
   * Broadcast player update
   */
  public broadcastPlayerUpdate(userId: string, data: any) {
    this.sendToUser(userId, {
      type: 'player:update',
      data
    })
  }
}

let wsServer: GameWebSocketServer | null = null

export function initializeWebSocketServer(server: Server): GameWebSocketServer {
  if (!wsServer) {
    wsServer = new GameWebSocketServer(server)
  }
  return wsServer
}

export function getWebSocketServer(): GameWebSocketServer | null {
  return wsServer
}