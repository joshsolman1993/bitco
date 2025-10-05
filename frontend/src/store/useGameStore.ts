import { create } from 'zustand'

// Types
export interface User {
  id: string
  email: string
  name?: string
}

export interface Company {
  id: string
  name: string
  region: string
  balance: number
  btcBalance: number
  reputation: {
    miners: number
    traders: number
    regulators: number
    anarchists: number
  }
}

export interface Site {
  id: string
  name: string
  region: string
  gridTier: string
  coolingType: string
  uptime: number
  rigs: Array<{
    id: string
    type: string
    hashrate: number
    efficiency: number
    wear: number
    status: string
    purchasePrice: number
  }>
  energyContracts: Array<{
    id: string
    pricePerKWh: number
    capacity: number
    startDate: string
    endDate: string
  }>
}

export interface Position {
  id: string
  instrument: string
  side: 'long' | 'short'
  quantity: number
  entryPrice: number
  currentPrice?: number
  pnl?: number
  marginHealth?: number
}

export interface Research {
  id: string
  nodeId: string
  level: number
  progress: number
  status: string
  startedAt?: string
}

export interface Quest {
  id: number
  title: string
  description: string
  progress: number
  reward: string
  deadline?: Date
}

export interface Alert {
  id: number
  type: 'info' | 'warning' | 'critical'
  message: string
  timestamp: Date
}

export interface TickData {
  btcPrice: number
  difficulty: number
  networkHashrate: number
  timestamp: Date
}

// Store interface
interface GameStore {
  // Auth
  user: User | null
  isAuthenticated: boolean
  token: string | null
  
  // Game state
  company: Company | null
  sites: Site[]
  positions: Position[]
  research: Research[]
  quests: Quest[]
  alerts: Alert[]
  tickData: TickData | null
  
  // WebSocket
  wsConnected: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  setCompany: (company: Company | null) => void
  setSites: (sites: Site[]) => void
  setPositions: (positions: Position[]) => void
  setResearch: (research: Research[]) => void
  setQuests: (quests: Quest[]) => void
  addAlert: (alert: Omit<Alert, 'id'>) => void
  clearAlert: (id: number) => void
  updateTickData: (data: TickData) => void
  setWsConnected: (connected: boolean) => void
  logout: () => void
}

// Create store
export const useGameStore = create<GameStore>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  token: null,
  company: null,
  sites: [],
  positions: [],
  research: [],
  quests: [],
  alerts: [],
  tickData: null,
  wsConnected: false,
  
  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  setCompany: (company) => set({ company }),
  setSites: (sites) => set({ sites }),
  setPositions: (positions) => set({ positions }),
  setResearch: (research) => set({ research }),
  setQuests: (quests) => set({ quests }),
  
  addAlert: (alert) => set((state) => ({
    alerts: [{ ...alert, id: Date.now() }, ...state.alerts].slice(0, 10)
  })),
  
  clearAlert: (id) => set((state) => ({
    alerts: state.alerts.filter(a => a.id !== id)
  })),
  
  updateTickData: (data) => set({ tickData: data }),
  setWsConnected: (connected) => set({ wsConnected: connected }),
  
  logout: () => set({
    user: null,
    isAuthenticated: false,
    token: null,
    company: null,
    sites: [],
    positions: [],
    research: [],
    quests: [],
    alerts: [],
    tickData: null,
    wsConnected: false
  })
}))