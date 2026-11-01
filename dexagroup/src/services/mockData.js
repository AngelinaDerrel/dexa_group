export const mockUser = {
  id: 1, name: 'Rania Dwi Lestari', nik: 'DXG-2024-0187',
  email: 'rania.lestari@dexagroup.com', position: 'Product Development Specialist',
  department: 'Research & Development', phone: '+62 812 3456 7890',
  role: 'HRD', isActive: true,
}
export const mockEmployees = [
  mockUser,
  { id: 2, name: 'Bagus Pratama', nik: 'DXG-2024-0112', email: 'bagus.pratama@dexagroup.com', position: 'Software Engineer', department: 'Technology', phone: '+62 813 4567 8901', role: 'EMPLOYEE', isActive: true },
  { id: 3, name: 'Siti Amalia', nik: 'DXG-2023-0098', email: 'siti.amalia@dexagroup.com', position: 'Finance Analyst', department: 'Finance', phone: '+62 811 2345 6789', role: 'EMPLOYEE', isActive: false },
]
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
export const mockAttendanceRecords = [
  { id: 1, employeeId: 1, employeeName: mockUser.name, attendanceDate: new Date().toISOString().slice(0, 10), checkIn: `${new Date().toISOString().slice(0, 10)}T01:02:00.000Z`, photo: mockAttendance.photoUrl, notes: mockAttendance.notes },
  { id: 2, employeeId: 2, employeeName: 'Bagus Pratama', attendanceDate: '2024-06-13', checkIn: '2024-06-13T01:11:00.000Z', photo: mockAttendance.photoUrl, notes: 'Bekerja dari rumah' },
  { id: 3, employeeId: 3, employeeName: 'Siti Amalia', attendanceDate: '2024-06-12', checkIn: '2024-06-12T00:55:00.000Z', photo: mockAttendance.photoUrl, notes: 'Kegiatan operasional' },
]
export const mockDelay = (data) => new Promise((resolve) => setTimeout(() => resolve(data), 450))
