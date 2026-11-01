import { NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import logo from '../assets/dexa.png'

function Logo() { return <div className="logo"><div className="logo"><img src={logo} alt="Dexa Group" className="logo-img" /></div></div> }
export function Sidebar() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const links = [['/profile', '⌂', 'Profil'], ['/attendance', '◷', 'Presensi'], ['/history', '▤', 'Riwayat Presensi']]
  if (user?.role === 'HRD') links.push(['/employees', '♙', 'Data Karyawan'], ['/attendance-monitoring', '◉', 'Monitoring Absensi'])
  return <aside className="sidebar"><Logo /><div className="nav-label">Menu utama</div><nav className="nav-list">{links.map(([to, icon, label]) => <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><span className="nav-icon">{icon}</span>{label}</NavLink>)}</nav><div className="sidebar-bottom"><button className="nav-item logout" onClick={() => { logout(); navigate('/') }}><span className="nav-icon">↪</span>Keluar</button></div></aside>
}

export function Layout() {
  const location = useLocation()
  const pageName = location.pathname === '/profile' ? 'Profil' : location.pathname === '/attendance' ? 'Presensi' : location.pathname === '/employees' ? 'Data Karyawan' : location.pathname === '/attendance-monitoring' ? 'Monitoring Absensi' : 'Riwayat'
  return <div className="app-shell"><Sidebar /><div className="mobile-topbar"><Logo /><span style={{ color: 'var(--muted)', fontSize: 12 }}>{pageName}</span></div><main className="main-content"><Outlet /></main></div>
}
export function ProtectedRoute() {
  const { user } = useAuth()
  const mockMode = import.meta.env.VITE_USE_MOCK !== 'false'
  return user || mockMode ? <Outlet /> : <Navigate to="/" replace />
}
export function HrdRoute() {
  const { user } = useAuth()
  return user?.role === 'HRD' ? <Outlet /> : <Navigate to="/profile" replace />
}
