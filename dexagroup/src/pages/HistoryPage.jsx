import { useEffect, useState } from 'react'
import { Card, DataTable, LoadingSpinner, Modal } from '../components/UI'
import { attendanceApi } from '../services/attendanceApi'
import { getErrorMessage, getPhotoUrl } from '../lib/api'

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatTime(value) {
  return value ? new Date(value).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' }) : '-'
}

function AttendancePhoto({ photo, date, large = false }) {
  const [failed, setFailed] = useState(false)

  if (!photo || failed) {
    return <div className={large ? 'photo-placeholder photo-placeholder-large' : 'photo-placeholder'}>Foto tidak tersedia</div>
  }

  return (
    <img
      className={large ? 'attendance-photo-large' : 'attendance-thumbnail'}
      src={getPhotoUrl(photo)}
      alt={`Foto presensi ${date}`}
      onError={() => setFailed(true)}
    />
  )
}

export default function HistoryPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    attendanceApi
      .myHistory()
      .then(setRows)
      .catch((requestError) => setError(getErrorMessage(requestError, 'Riwayat presensi tidak dapat dimuat.')))
      .finally(() => setLoading(false))
  }, [])

  const columns = [
    {
      key: 'date',
      label: 'Tanggal',
      render: (row) =>
        formatDate(row.attendanceDate),
    },
    {
      key: 'checkIn',
      label: 'Jam masuk',
      render: (row) => `${formatTime(row.checkIn)} WIB`,
    },
    {
      key: 'notes',
      label: 'Catatan',
    },
    {
      key: 'action',
      label: 'Foto',
      render: (row) => (
        <button
          className="link-button"
          onClick={() => setSelected(row)}
        >
          Lihat
        </button>
      ),
    },
  ]

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Riwayat Presensi</h1>
          <p>Rekap kehadiran WFH Anda.</p>
        </div>
      </header>
      {error && <div className="alert">{error}</div>}
      <Card className="table-card">
        {loading ? (
          <div className="loading-box">
            <LoadingSpinner />
          </div>
        ) : (
          <DataTable
            columns={columns}
            rows={rows}
            emptyTitle="Belum ada riwayat presensi"
          />
        )}
      </Card>
      {selected && (
        <Modal
          title={`Foto presensi · ${selected.attendanceDate}`}
          onClose={() => setSelected(null)}
        >
          <AttendancePhoto photo={selected.photo} date={selected.attendanceDate} large />
        </Modal>
      )}
    </>
  )
}
