import { useEffect, useState } from 'react'
import { Card, LoadingSpinner } from '../components/UI'
import { employeeApi } from '../services/employeeApi'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    employeeApi
      .getProfile()
      .then(setProfile)
      .catch(() => setError('Profil tidak dapat dimuat.'))
  }, [])

  const initials = profile?.name
    ? profile.name
        .split(' ')
        .map((word) => word[0])
        .slice(0, 2)
        .join('')
    : ''

  const details = profile
    ? [
        ['Nama lengkap', profile.name],
        ['NIK', profile.nik],
        ['Email', profile.email],
        ['Jabatan', profile.position],
        ['Departemen', profile.department],
        ['No. HP', profile.phone],
      ]
    : []

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Profil Karyawan</h1>
          <p>Informasi akun dan data kepegawaian Anda.</p>
        </div>
      </header>

      {error && <div className="alert">{error}</div>}

      {!profile && !error && (
        <div className="loading-box">
          <LoadingSpinner />
        </div>
      )}

      {profile && (
        <div className="profile-grid">
          <Card className="profile-summary">
            <div className="avatar">{initials}</div>
            <h2>{profile.name}</h2>
            <p>{profile.position}</p>
            <div style={{ marginTop: 16 }}>
              <span className="status-badge status-success">
                Karyawan aktif
              </span>
            </div>
          </Card>

          <Card className="profile-details">
            <h2 className="section-title">Detail informasi</h2>
            <div className="details-grid">
              {details.map(([label, value]) => (
                <div
                  className="detail-item"
                  key={label}
                >
                  <small>{label}</small>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </>
  )
}
