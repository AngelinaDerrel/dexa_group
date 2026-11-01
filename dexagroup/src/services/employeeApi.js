import api from './api'
import { mockDelay, mockUser } from './mockData'
const useMock = import.meta.env.VITE_USE_MOCK !== 'false'
export const employeeApi = {
  async getProfile() {
    if (useMock) return mockDelay(mockUser)
    // Panggilan API profil melalui service, bukan langsung dari halaman.
    const response = await api.get('/auth/me')
    return response.data
  },
}
