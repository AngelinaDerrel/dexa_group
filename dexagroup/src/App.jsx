import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { HrdRoute, Layout, ProtectedRoute } from './components/Layout'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import AttendancePage from './pages/AttendancePage'
import HistoryPage from './pages/HistoryPage'
import EmployeesPage from './pages/EmployeesPage'
import AttendanceMonitoringPage from './pages/AttendanceMonitoringPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route element={<HrdRoute />}>
                <Route path="/employees" element={<EmployeesPage />} />
                <Route path="/attendance-monitoring" element={<AttendanceMonitoringPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/profile" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
