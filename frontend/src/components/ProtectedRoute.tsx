import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useGameStore } from '../store/useGameStore'
import { playerApi } from '../services/api'
import { connectWebSocket } from '../services/websocket'

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, setUser, setCompany, setToken } = useGameStore()
  const [loading, setLoading] = useState(true)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const validateAuth = async () => {
      const token = localStorage.getItem('accessToken')

      if (!token) {
        setLoading(false)
        setIsValid(false)
        return
      }

      try {
        // Verify token by fetching user profile
        const profile = await playerApi.getProfile()
        const company = await playerApi.getCompany()

        // Update store
        setUser(profile.user)
        setCompany(company)
        setToken(token)

        // Connect WebSocket if not already connected
        if (!useGameStore.getState().wsConnected) {
          connectWebSocket(token)
        }

        setIsValid(true)
      } catch (error) {
        console.error('Auth validation failed:', error)
        // Clear invalid tokens
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        setIsValid(false)
      } finally {
        setLoading(false)
      }
    }

    validateAuth()
  }, [setUser, setCompany, setToken])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-400 text-lg">Loading your empire...</p>
        </div>
      </div>
    )
  }

  if (!isValid && !isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}