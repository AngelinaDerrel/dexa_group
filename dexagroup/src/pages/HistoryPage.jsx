import { useEffect, useState } from 'react'
import {Card, DataTable, LoadingSpinner, Modal, StatusBadge} from '../components/UI'
import { attendanceApi } from '../services/attendanceApi'

export default function HistoryPage() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    attendanceApi
      .myHistory()
      .then(setRows)
      .catch(() => setError('Riwayat presensi tidak dapat dimuat.'))
      .finally(() => setLoading(false))
  }, [])

  const columns = [
    {
      key: 'date',
      label: 'Tanggal',
      render: (row) =>
        new Date(row.date).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
    },
    {
      key: 'time',
      label: 'Jam masuk',
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <StatusBadge status={row.status === 'Hadir' ? 'success' : 'warning'}>
          {row.status}
        </StatusBadge>
      ),
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
          title={`Foto presensi · ${selected.date}`}
          onClose={() => setSelected(null)}
        >
          <img
            src={selected.photoUrl}
            alt={`Foto presensi ${selected.date}`}
          />
        </Modal>
      )}
    </>
  )
}
