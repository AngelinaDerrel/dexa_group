import { apiRequest } from '../lib/api'
export const attendanceApi = {
  today() { return apiRequest('/attendances/me/today') },
  async submit(payload) {
    const formData = new FormData()
    formData.append('photo', payload.photo)
    formData.append('notes', payload.notes || '')
    return apiRequest('/attendances/check-in', { method: 'POST', body: formData })
  },
  myHistory() { return apiRequest('/attendances/me') },
  all({ employeeId, search, from, to, page = 1, limit = 20 } = {}) {
    const params = { employeeId, search, page, limit }
    if (from && to) Object.assign(params, { from, to })
    return apiRequest('/attendances', { params })
  },
}
