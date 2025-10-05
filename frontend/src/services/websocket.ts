import { useGameStore } from '../store/useGameStore'

// WebSocket Configuration
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/ws'
const RECONNECT_INTERVAL = 3000
const HEARTBEAT_INTERVAL = 30000

// WebSocket Message Types
export interface WSMessage {
  type: string
  payload?: any
}

export interface TickUpdatePayload {
  tickNumber: number
  timestamp: string
  btcPrice: number
  difficulty: number
  networkHashrate: number
  regionalPrices: Record<string, number>
}

export interface PlayerUpdatePayload {
  balance: number
  btcBalance: number
  reputation: {
    miners: number
    traders: number
    regulators: number
    anarchists: number
  }
  sites?: any[]
  positions?: any[]
}

export interface AlertPayload {
  id: string
  type: 'info' | 'warning' | 'critical'
  message: string
  timestamp: string
}

class WebSocketClient {
  private ws: WebSocket | null = null
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private isIntentionallyClosed = false
  private accessToken: string | null = null

  constructor() {
    this.connect = this.connect.bind(this)
    this.disconnect = this.disconnect.bind(this)
    this.send = this.send.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleError = this.handleError.bind(this)
    this.startHeartbeat = this.startHeartbeat.bind(this)
    this.stopHeartbeat = this.stopHeartbeat.bind(this)
  }

  /**
   * Connect to WebSocket server
   */
  connect(token: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[WS] Already connected')
      return
    }

    this.accessToken = token
    this.isIntentionallyClosed = false

    try {
      console.log('[WS] Connecting to', WS_URL)
      this.ws = new WebSocket(WS_URL)

      this.ws.onopen = this.handleOpen
      this.ws.onmessage = this.handleMessage
      this.ws.onclose = this.handleClose
      this.ws.onerror = this.handleError
    } catch (error) {
      console.error('[WS] Connection error:', error)
      this.scheduleReconnect()
    }
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    console.log('[WS] Disconnecting...')
    this.isIntentionallyClosed = true
    this.stopHeartbeat()

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    useGameStore.getState().setWsConnected(false)
  }

  /**
   * Send message to server
   */
  send(type: string, payload?: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      // Backend expects 'data' field, not 'payload'
      const message = { type, data: payload }
      this.ws.send(JSON.stringify(message))
    } else {
      console.warn('[WS] Cannot send message, not connected')
    }
  }

  /**
   * Handle WebSocket open event
   */
  private handleOpen() {
    console.log('[WS] Connected')
    useGameStore.getState().setWsConnected(true)

    // Authenticate
    if (this.accessToken) {
      this.send('auth', { token: this.accessToken })
    }

    // Start heartbeat
    this.startHeartbeat()
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(event: MessageEvent) {
    try {
      const message: any = JSON.parse(event.data)
      
      // Backend uses 'data' field, normalize to 'payload'
      const payload = message.payload || message.data
      
      // Handle pong response
      if (message.type === 'pong') {
        return
      }

      console.log('[WS] Message received:', message.type)

      switch (message.type) {
        case 'connected':
          console.log('[WS] Connection acknowledged by server')
          break

        case 'auth_success':
          console.log('[WS] Authentication successful')
          break

        case 'auth_error':
          console.error('[WS] Authentication failed:', message.message)
          useGameStore.getState().addAlert({
            type: 'critical',
            message: message.message || 'WebSocket authentication failed',
            timestamp: new Date(),
          })
          break

        case 'tick:update':
          this.handleTickUpdate(payload as TickUpdatePayload)
          break

        case 'player:update':
          this.handlePlayerUpdate(payload as PlayerUpdatePayload)
          break

        case 'alert':
          this.handleAlert(payload as AlertPayload)
          break

        case 'error':
          console.error('[WS] Server error:', payload)
          useGameStore.getState().addAlert({
            type: 'critical',
            message: payload?.message || message.message || 'WebSocket error',
            timestamp: new Date(),
          })
          break

        default:
          console.log('[WS] Unknown message type:', message.type)
      }
    } catch (error) {
      console.error('[WS] Failed to parse message:', error)
    }
  }

  /**
   * Handle tick update
   */
  private handleTickUpdate(payload: TickUpdatePayload) {
    const store = useGameStore.getState()
    
    store.updateTickData({
      btcPrice: payload.btcPrice,
      difficulty: payload.difficulty,
      networkHashrate: payload.networkHashrate,
      timestamp: new Date(payload.timestamp),
    })
  }

  /**
   * Handle player update
   */
  private handlePlayerUpdate(payload: PlayerUpdatePayload) {
    const store = useGameStore.getState()
    const currentCompany = store.company

    if (currentCompany) {
      store.setCompany({
        ...currentCompany,
        balance: payload.balance,
        btcBalance: payload.btcBalance,
        reputation: payload.reputation,
      })
    }

    if (payload.sites) {
      store.setSites(payload.sites)
    }

    if (payload.positions) {
      store.setPositions(payload.positions)
    }
  }

  /**
   * Handle alert
   */
  private handleAlert(payload: AlertPayload) {
    const store = useGameStore.getState()
    
    store.addAlert({
      type: payload.type,
      message: payload.message,
      timestamp: new Date(payload.timestamp),
    })
  }

  /**
   * Handle WebSocket close event
   */
  private handleClose(event: CloseEvent) {
    console.log('[WS] Disconnected:', event.code, event.reason)
    useGameStore.getState().setWsConnected(false)
    this.stopHeartbeat()

    // Attempt to reconnect if not intentionally closed
    if (!this.isIntentionallyClosed) {
      this.scheduleReconnect()
    }
  }

  /**
   * Handle WebSocket error event
   */
  private handleError(event: Event) {
    console.error('[WS] Error:', event)
  }

  /**
   * Schedule reconnection attempt
   */
  private scheduleReconnect() {
    if (this.reconnectTimer) {
      return
    }

    console.log(`[WS] Reconnecting in ${RECONNECT_INTERVAL}ms...`)
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null
      if (this.accessToken && !this.isIntentionallyClosed) {
        this.connect(this.accessToken)
      }
    }, RECONNECT_INTERVAL)
  }

  /**
   * Start heartbeat ping/pong
   */
  private startHeartbeat() {
    this.stopHeartbeat()
    
    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send('ping')
      }
    }, HEARTBEAT_INTERVAL)
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }
}

// Export singleton instance
export const wsClient = new WebSocketClient()

// Export convenience functions
export const connectWebSocket = (token: string) => wsClient.connect(token)
export const disconnectWebSocket = () => wsClient.disconnect()
export const sendWebSocketMessage = (type: string, payload?: any) =>
  wsClient.send(type, payload)
export const isWebSocketConnected = () => wsClient.isConnected()