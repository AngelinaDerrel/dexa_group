import { apiRequest } from '../lib/api'
export const authApi = {
  login(credentials) { return apiRequest('/auth/login', { method: 'POST', body: credentials }) },
}
