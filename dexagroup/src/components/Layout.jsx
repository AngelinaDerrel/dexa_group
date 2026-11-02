import { NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import logo from '../assets/dexa.png'

function Logo() { return <div className="logo"><div className="logo"><img src={logo} alt="Dexa Group" className="logo-img" /></div></div> }
export function Sidebar() {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const personalLinks = [
    ['/profile', '⌂', 'Profil'],
    ['/attendance', '◷', 'Presensi'],
    ['/history', '▤', 'Riwayat Presensi'],
  ]
  const hrdLinks = [
    ['/employees', '♙', 'Data Karyawan'],
    ['/attendance-monitoring', '◉', 'Monitoring Presensi'],
  ]
  const links = user?.role === 'HRD' ? [...personalLinks, ...hrdLinks] : personalLinks
  return <aside className="sidebar"><Logo /><div className="nav-label">Menu utama</div><nav className="nav-list">{links.map(([to, icon, label]) => <NavLink key={to} to={to} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}><span className="nav-icon">{icon}</span>{label}</NavLink>)}</nav><div className="sidebar-bottom"><div className="sidebar-user">{user?.name}</div><button className="nav-item logout" onClick={() => { logout(); navigate('/') }}><span className="nav-icon">↪</span>Keluar</button></div></aside>
}

export function Layout() {
  const { logout, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const pageNames = {
    '/profile': 'Profil',
    '/attendance': 'Presensi',
    '/history': 'Riwayat Presensi',
    '/employees': 'Data Karyawan',
    '/attendance-monitoring': 'Monitoring Presensi',
  }
  const pageName = pageNames[location.pathname] || 'Profil'
  return <div className="app-shell"><Sidebar /><div className="mobile-topbar"><Logo /><span style={{ color: 'var(--muted)', fontSize: 12 }}>{user?.name} · {pageName}</span><button className="mobile-logout" onClick={() => { logout(); navigate('/') }}>Keluar</button></div><main className="main-content"><Outlet /></main></div>
}
export function ProtectedRoute() {
  const { user } = useAuth()
  return user ? <Outlet /> : <Navigate to="/" replace />
}
export function HrdRoute() {
  const { user } = useAuth()
  return user?.role === 'HRD' ? <Outlet /> : <Navigate to="/profile" replace />
}
export function LegacyRoute() {
  return <Navigate to="/profile" replace />
}
