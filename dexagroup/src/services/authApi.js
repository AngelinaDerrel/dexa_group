import api from './api'
import { mockDelay, mockUser } from './mockData'

// Mock aktif secara default agar aplikasi tetap bisa dipakai tanpa backend.
const useMock = import.meta.env.VITE_USE_MOCK !== 'false'
export const authApi = {
  async login(credentials) {
    if (useMock) {
      if (!credentials.email || credentials.password.length < 4) throw new Error('Email atau password tidak valid.')
      return mockDelay({ user: mockUser, token: 'mock-jwt-token' })
    }
    // Panggilan API autentikasi terpusat di service.
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
}
