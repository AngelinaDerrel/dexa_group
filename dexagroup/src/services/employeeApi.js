import api from './api'
import { mockDelay, mockEmployees, mockUser } from './mockData'
const useMock = import.meta.env.VITE_USE_MOCK !== 'false'
const mockStorageKey = 'dexagroup_employees'

function getMockEmployees() {
  try {
    const stored = JSON.parse(localStorage.getItem(mockStorageKey) || 'null')
    return Array.isArray(stored) ? stored : mockEmployees
  } catch {
    return mockEmployees
  }
}

function saveMockEmployees(employees) {
  localStorage.setItem(mockStorageKey, JSON.stringify(employees))
  return employees
}

export const employeeApi = {
  async getProfile() {
    if (useMock) return mockDelay(mockUser)
    // Panggilan API profil melalui service, bukan langsung dari halaman.
    const response = await api.get('/auth/me')
    return response.data
  },
  async list() {
    if (useMock) return mockDelay(getMockEmployees())
    const response = await api.get('/employees')
    return response.data
  },
  async create(payload) {
    if (useMock) {
      const employee = { ...payload, id: Date.now(), isActive: true }
      return mockDelay(saveMockEmployees([employee, ...getMockEmployees()]).find((item) => item.id === employee.id))
    }
    const response = await api.post('/employees', payload)
    return response.data
  },
  async update(id, payload) {
    if (useMock) {
      const employees = getMockEmployees().map((employee) => employee.id === id ? { ...employee, ...payload } : employee)
      return mockDelay(saveMockEmployees(employees).find((employee) => employee.id === id))
    }
    const response = await api.patch(`/employees/${id}`, payload)
    return response.data
  },
  async remove(id) {
    if (useMock) {
      saveMockEmployees(getMockEmployees().filter((employee) => employee.id !== id))
      return mockDelay({ message: 'Karyawan berhasil dihapus.' })
    }
    const response = await api.delete(`/employees/${id}`)
    return response.data
  },
}
