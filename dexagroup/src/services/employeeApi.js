import { apiRequest } from '../lib/api'

export const employeeApi = {
  getProfile() { return apiRequest('/auth/me') },
  changePassword(payload) { return apiRequest('/auth/password', { method: 'PATCH', body: payload }) },
  list() { return apiRequest('/employees') },
  create(payload) { return apiRequest('/employees', { method: 'POST', body: payload }) },
  update(id, payload) { return apiRequest(`/employees/${id}`, { method: 'PATCH', body: payload }) },
  remove(id) { return apiRequest(`/employees/${id}`, { method: 'DELETE' }) },
}
