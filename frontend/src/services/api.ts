import axios, { AxiosInstance, AxiosError } from 'axios'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any

    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        })

        const { accessToken } = response.data
        localStorage.setItem('accessToken', accessToken)

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface LoginResponse {
  user: {
    id: string
    email: string
  }
  company: {
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
  accessToken: string
  refreshToken: string
}

export interface RegisterRequest {
  email: string
  password: string
  companyName: string
  region: string
}

export interface TickSnapshot {
  id: string
  tickNumber: number
  timestamp: string
  btcPrice: number
  difficulty: number
  networkHashrate: number
  regionalPrices: Record<string, number>
}

export interface Site {
  id: string
  name: string
  region: string
  gridTier: string
  coolingType: string
  uptime: number
  rigs: Rig[]
  energyContracts: EnergyContract[]
}

export interface Rig {
  id: string
  type: string
  hashrate: number
  efficiency: number
  wear: number
  status: string
  purchasePrice: number
}

export interface EnergyContract {
  id: string
  pricePerKWh: number
  capacity: number
  startDate: string
  endDate: string
}

export interface Position {
  id: string
  instrument: string
  side: 'long' | 'short'
  quantity: number
  entryPrice: number
  currentPrice?: number
  leverage: number
  margin: number
  status: string
  pnl?: number
  marginHealth?: number
}

export interface ResearchNode {
  id: string
  name: string
  category: string
  level: number
  maxLevel: number
  cost: number
  duration: number
  description: string
  prerequisites: string[]
}

export interface CompanyResearch {
  id: string
  nodeId: string
  level: number
  progress: number
  status: string
  startedAt?: string
}

export interface Proposal {
  id: string
  type: string
  title: string
  description: string
  proposerId: string
  createdAt: string
  deadline: string
  votesFor: number
  votesAgainst: number
  status: string
  outcome?: string
}

export interface Alert {
  id: string
  type: 'info' | 'warning' | 'critical'
  message: string
  createdAt: string
  read: boolean
}

// Auth API
export const authApi = {
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/register', data)
    return response.data
  },

  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      password,
    })
    return response.data
  },

  logout: async (): Promise<void> => {
    const refreshToken = localStorage.getItem('refreshToken')
    await apiClient.post('/auth/logout', { refreshToken })
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },

  refresh: async (refreshToken: string): Promise<{ accessToken: string }> => {
    const response = await apiClient.post('/auth/refresh', { refreshToken })
    return response.data
  },
}

// Player API
export const playerApi = {
  getProfile: async () => {
    const response = await apiClient.get('/player/profile')
    return response.data
  },

  getCompany: async () => {
    const response = await apiClient.get('/player/company')
    return response.data
  },

  getAlerts: async () => {
    const response = await apiClient.get<Alert[]>('/player/alerts')
    return response.data
  },

  markAlertRead: async (alertId: string) => {
    const response = await apiClient.patch(`/player/alerts/${alertId}/read`)
    return response.data
  },
}

// Site API
export const siteApi = {
  getSites: async () => {
    const response = await apiClient.get<Site[]>('/site')
    return response.data
  },

  createSite: async (data: {
    name: string
    region: string
    gridTier: string
    coolingType: string
  }) => {
    const response = await apiClient.post<Site>('/site', data)
    return response.data
  },

  addRig: async (siteId: string, data: { type: string, gridX: number, gridY: number }) => {
    const response = await apiClient.post<Rig>(`/site/${siteId}/rigs`, data)
    return response.data
  },

  removeRig: async (siteId: string, rigId: string) => {
    const response = await apiClient.delete(`/site/${siteId}/rigs/${rigId}`)
    return response.data
  },

  addEnergyContract: async (
    siteId: string,
    data: {
      provider: string
      pricePerKWh: number
      capacity: number
      durationDays: number
    }
  ) => {
    const response = await apiClient.post<EnergyContract>(
      `/site/${siteId}/energy`,
      data
    )
    return response.data
  },
}

// Market API
export const marketApi = {
  getMarketData: async () => {
    const response = await apiClient.get<TickSnapshot>('/market/data')
    return response.data
  },

  getPositions: async () => {
    const response = await apiClient.get<Position[]>('/market/positions')
    return response.data
  },

  openPosition: async (data: {
    instrument: string
    side: 'long' | 'short'
    quantity: number
    leverage?: number
  }) => {
    const response = await apiClient.post<Position>('/market/open', data)
    return response.data
  },

  closePosition: async (positionId: string) => {
    const response = await apiClient.post(`/market/close/${positionId}`)
    return response.data
  },
}

// Research API
export const researchApi = {
  getAvailable: async () => {
    const response = await apiClient.get<ResearchNode[]>('/research/available')
    return response.data
  },

  getProgress: async () => {
    const response = await apiClient.get<CompanyResearch[]>('/research')
    return response.data
  },

  startResearch: async (nodeId: string) => {
    const response = await apiClient.post<CompanyResearch>('/research/start', {
      nodeId,
    })
    return response.data
  },
}

// Governance API
export const governanceApi = {
  getProposals: async () => {
    const response = await apiClient.get<Proposal[]>('/governance/proposals')
    return response.data
  },

  createProposal: async (data: {
    type: string
    title: string
    description: string
    durationDays: number
  }) => {
    const response = await apiClient.post<Proposal>('/governance/propose', data)
    return response.data
  },

  vote: async (proposalId: string, support: boolean) => {
    const response = await apiClient.post('/governance/vote', {
      proposalId,
      support,
    })
    return response.data
  },
}

// Quest API
export const questApi = {
  getQuests: async () => {
    const response = await apiClient.get('/quest')
    return response.data
  },

  startQuest: async (questId: string) => {
    const response = await apiClient.post(`/quest/${questId}/start`)
    return response.data
  },

  claimReward: async (questId: string) => {
    const response = await apiClient.post(`/quest/${questId}/claim`)
    return response.data
  },

  getQuestProgress: async (questId: string) => {
    const response = await apiClient.get(`/quest/${questId}/progress`)
    return response.data
  },
}

// Health check
export const healthCheck = async () => {
  const response = await apiClient.get('/health')
  return response.data
}

export default apiClient