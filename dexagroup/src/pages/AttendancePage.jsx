import { useEffect, useState } from 'react'
import { Button, Card, LoadingSpinner } from '../components/UI'
import LiveClock from '../components/LiveClock'
import PhotoUploader from '../components/PhotoUploader'
import { attendanceApi } from '../services/attendanceApi'

export default function AttendancePage() {
  const [today, setToday] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    attendanceApi
      .today()
      .then(setToday)
      .catch(() => setError('Status presensi tidak dapat dimuat.'))
      .finally(() => setLoading(false))
  }, [])

  async function submit(event) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      const result = await attendanceApi.submit({ photo, notes })
      setToday(result)
      setSuccess('Presensi berhasil dicatat. Terima kasih!')
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          'Presensi gagal dikirim.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Presensi WFH</h1>
          <p>Catat kehadiran Anda hari ini.</p>
        </div>

        {today && (
          <span className="status-badge status-success">
            Sudah absen hari ini
          </span>
        )}
      </header>

      {loading ? (
        <div className="loading-box">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          {error && <div className="alert">{error}</div>}
          {success && <div className="alert success-alert">{success}</div>}

          {today ? (
            <Card className="attendance-card">
              <div className="empty-state">
                <div style={{ fontSize: 36, color: '#16704a' }}>✓</div>
                <strong>Presensi hari ini sudah tercatat</strong>
                <span>
                  Anda melakukan presensi pada pukul {today.time}.
                </span>
              </div>
            </Card>
          ) : (
            <form
              onSubmit={submit}
              className="attendance-grid"
            >
              <Card className="attendance-card">
                <LiveClock />

                <label
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    display: 'block',
                    marginBottom: 8,
                  }}
                >
                  Foto presensi
                </label>

                <PhotoUploader onChange={setPhoto} />
              </Card>

              <Card className="attendance-card">
                <div className="field">
                  <label htmlFor="notes">Catatan (opsional)</label>
                  <textarea
                    id="notes"
                    placeholder="Tambahkan catatan aktivitas hari ini..."
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                  />
                </div>

                <div
                  className="alert"
                  style={{ background: '#f5f8fa', color: '#667085' }}
                >
                  Pastikan foto menunjukkan wajah Anda dengan jelas untuk
                  validasi presensi.
                </div>

                <div className="form-actions">
                  <Button
                    type="submit"
                    loading={submitting}
                    disabled={!photo}
                  >
                    Absen Sekarang
                  </Button>
                </div>
              </Card>
            </form>
          )}
        </>
      )}
    </>
  )
}
