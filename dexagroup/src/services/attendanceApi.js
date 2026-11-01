import api from './api'
import { mockAttendance, mockAttendanceRecords, mockDelay, mockHistory } from './mockData'
const useMock = import.meta.env.VITE_USE_MOCK !== 'false'
export const attendanceApi = {
  async today() {
    if (useMock) return mockDelay(localStorage.getItem('dexagroup_attended') ? mockAttendance : null)
    // Service mengambil status presensi hari ini dari backend.
    const response = await api.get('/attendances/today')
    return response.data
  },
  async submit(payload) {
    if (useMock) {
      localStorage.setItem('dexagroup_attended', 'true')
      return mockDelay({ ...mockAttendance, notes: payload.notes || mockAttendance.notes })
    }
    // FormData dikirim sebagai multipart/form-data untuk foto presensi.
    const formData = new FormData()
    formData.append('photo', payload.photo)
    formData.append('notes', payload.notes || '')
    const response = await api.post('/attendances', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    return response.data
  },
  async myHistory() {
    if (useMock) return mockDelay(mockHistory)
    // Service mengambil seluruh riwayat presensi pengguna aktif.
    const response = await api.get('/attendances/me')
    return response.data
  },
  async all({ employeeId, from, to } = {}) {
    if (useMock) {
      const data = mockAttendanceRecords.filter((record) =>
        (!employeeId || String(record.employeeId) === String(employeeId))
        && (!from || record.attendanceDate >= from)
        && (!to || record.attendanceDate <= to),
      )
      return mockDelay({ data, total: data.length, page: 1, limit: 20 })
    }
    const response = await api.get('/attendances', { params: { employeeId, from, to, page: 1, limit: 100 } })
    return response.data
  },
}
