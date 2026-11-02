import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, InputField } from '../components/UI'
import { getErrorMessage } from '../lib/api'
import { useAuth } from '../context/useAuth'
import logo from '../assets/dexa.png'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  async function submit(event) {
    event.preventDefault(); setError('')
    try { await login(form); navigate('/profile') } catch (requestError) { setError(getErrorMessage(requestError, 'Login gagal. Silakan coba lagi.')) }
  }
  return <main className="login-page">
          <section className="card login-card">
            <div className="logo">
              <img src={logo} alt="Dexa Group" className="logo-img" />
            </div>
            <h1>Halo, Selamat Datang Kembali!</h1>
            <p className="intro">Login untuk mengakses presensi WFH Anda.</p>{error && <div className="alert">{error}</div>}
              <form onSubmit={submit}>
                <InputField id="email" label="Email perusahaan" type="email" placeholder="email@dexagroup.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                <div className="password-field">
                  <InputField id="password" label="Kata sandi" type={showPassword ? 'text' : 'password'} placeholder="Masukkan kata sandi" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                  <button type="button" className="password-toggle" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}>
                    {showPassword ? '◉' : '◌'}
                  </button>
                </div>
                <Button type="submit" loading={loading}>Masuk</Button>
              </form>
            <p className="login-foot">Sistem Absensi WFH · Dexa Group</p>
          </section>
        </main>
}
