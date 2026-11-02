import { useEffect, useState } from 'react'
import { Button, Card, InputField, LoadingSpinner, Modal } from '../components/UI'
import { getErrorMessage } from '../lib/api'
import { employeeApi } from '../services/employeeApi'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [error, setError] = useState('')
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', passwordConfirmation: '' })
  const [passwordError, setPasswordError] = useState('')
  const [passwordNotice, setPasswordNotice] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  function updatePasswordField(event) {
    setPasswordForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  async function changePassword(event) {
    event.preventDefault()
    setPasswordError('')
    setPasswordNotice('')
    if (passwordForm.newPassword !== passwordForm.passwordConfirmation) {
      setPasswordError('Konfirmasi password gagal.')
      return
    }
    setSavingPassword(true)
    try {
      await employeeApi.changePassword(passwordForm)
      setPasswordForm({ currentPassword: '', newPassword: '', passwordConfirmation: '' })
      setPasswordNotice('Password berhasil diubah.')
      setShowPasswordModal(false)
    } catch (requestError) {
      setPasswordError(getErrorMessage(requestError, 'Password tidak dapat diubah.'))
    } finally {
      setSavingPassword(false)
    }
  }

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
        ['Kode karyawan', profile.employeeCode],
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
            {passwordNotice && <div className="alert success-alert">{passwordNotice}</div>}
            <div className="details-grid">
              {details.map(([label, value]) => (
                <div className="detail-item" key={label} >
                  <small>{label}</small>
                  <span>{value}</span>
                </div>
              ))}
              <div className="detail-item">
                <small>Password</small>
                <div className="password-detail">
                  <span>***********</span>
                  <button type="button" className="edit-button" onClick={() => { setPasswordError(''); setPasswordNotice(''); setShowPasswordModal(true) }} aria-label="Ubah password">✎</button>
                </div>
              </div>
            </div>
          </Card>
          {showPasswordModal && <Modal title="Ubah password" onClose={() => setShowPasswordModal(false)}>
            {passwordError && <div className="alert">{passwordError}</div>}
            <form onSubmit={changePassword}>
              <InputField id="current-password" name="currentPassword" type="password" label="Password saat ini" value={passwordForm.currentPassword} onChange={updatePasswordField} required />
              <InputField id="new-password" name="newPassword" type="password" label="Password baru (minimal 8 karakter)" value={passwordForm.newPassword} onChange={updatePasswordField} minLength={8} required />
              <InputField id="password-confirmation" name="passwordConfirmation" type="password" label="Konfirmasi password baru" value={passwordForm.passwordConfirmation} onChange={updatePasswordField} minLength={8} required />
              <div className="form-actions">
                <Button type="button" variant="outline" onClick={() => setShowPasswordModal(false)}>Batal</Button>
                <Button type="submit" loading={savingPassword}>Simpan password</Button>
              </div>
            </form>
          </Modal>}
        </div>
      )}
    </>
  )
}
