export const mockUser = {
  id: 1, name: 'Rania Dwi Lestari', nik: 'DXG-2024-0187',
  email: 'rania.lestari@dexagroup.com', position: 'Product Development Specialist',
  department: 'Research & Development', phone: '+62 812 3456 7890',
}
export const mockAttendance = {
  id: 1, date: new Date().toISOString().slice(0, 10), time: '08:02',
  status: 'Hadir', notes: 'Bekerja dari rumah', photoUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
}
export const mockHistory = [
  mockAttendance,
  { id: 2, date: '2024-06-13', time: '08:11', status: 'Hadir', notes: 'Fokus pada laporan mingguan', photoUrl: mockAttendance.photoUrl },
  { id: 3, date: '2024-06-12', time: '07:55', status: 'Hadir', notes: 'Bekerja dari rumah', photoUrl: mockAttendance.photoUrl },
  { id: 4, date: '2024-06-11', time: '08:20', status: 'Terlambat', notes: '-', photoUrl: mockAttendance.photoUrl },
]
export const mockDelay = (data) => new Promise((resolve) => setTimeout(() => resolve(data), 450))
