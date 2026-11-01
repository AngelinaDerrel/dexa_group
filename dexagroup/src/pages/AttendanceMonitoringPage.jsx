import { useEffect, useState } from 'react'
import { attendanceApi } from '../services/attendanceApi'
import { employeeApi } from '../services/employeeApi'
import { Button, Card, DataTable, EmptyState, InputField, LoadingSpinner, Modal } from '../components/UI'

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatTime(value) {
  return value ? new Date(value).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-'
}

export default function AttendanceMonitoringPage() {
  const [records, setRecords] = useState([])
  const [employees, setEmployees] = useState([])
  const [filters, setFilters] = useState({ employeeId: '', from: '', to: '' })
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    employeeApi.list().then(setEmployees).catch(() => setError('Daftar karyawan tidak dapat dimuat.'))
  }, [])

  useEffect(() => {
    let active = true
    attendanceApi.all(filters)
      .then((result) => { if (active) setRecords(result.data) })
      .catch(() => { if (active) setError('Data absensi tidak dapat dimuat.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [filters])

  function updateFilter(event) {
    const { name, value } = event.target
    setLoading(true)
    setFilters((current) => ({ ...current, [name]: value }))
  }

  const columns = [
    { key: 'employeeName', label: 'Karyawan' },
    { key: 'attendanceDate', label: 'Tanggal', render: (row) => formatDate(row.attendanceDate) },
    { key: 'checkIn', label: 'Jam submit', render: (row) => formatTime(row.checkIn) },
    { key: 'notes', label: 'Catatan', render: (row) => row.notes || '-' },
    { key: 'photo', label: 'Bukti', render: (row) => <button className="link-button" onClick={() => setSelected(row)}>Lihat detail</button> },
  ]

  return (
    <>
      <header className="page-header">
        <div><h1>Monitoring Absensi</h1><p>Lihat absensi yang telah disubmit karyawan. Data ini bersifat view-only.</p></div>
        <Button variant="outline" onClick={() => { setLoading(true); setFilters({ employeeId: '', from: '', to: '' }) }}>Reset filter</Button>
      </header>
      {error && <div className="alert">{error}</div>}
      <Card className="filter-card">
        <div className="filter-grid">
          <div className="field">
            <label htmlFor="attendance-employee">Karyawan</label>
            <select id="attendance-employee" name="employeeId" value={filters.employeeId} onChange={updateFilter}>
              <option value="">Semua karyawan</option>
              {employees.map((employee) => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
            </select>
          </div>
          <InputField id="attendance-from" name="from" type="date" label="Dari tanggal" value={filters.from} onChange={updateFilter} />
          <InputField id="attendance-to" name="to" type="date" label="Sampai tanggal" value={filters.to} onChange={updateFilter} />
        </div>
      </Card>
      <Card className="table-card">
        {loading ? <div className="loading-box"><LoadingSpinner /></div> : records.length ? <DataTable columns={columns} rows={records} /> : <EmptyState title="Belum ada absensi">Tidak ada data sesuai filter.</EmptyState>}
      </Card>
      {selected && <Modal title={`Detail absensi · ${selected.employeeName}`} onClose={() => setSelected(null)}>
        <div className="attendance-detail">
          <div className="details-grid">
            <div className="detail-item"><small>Tanggal</small><span>{formatDate(selected.attendanceDate)}</span></div>
            <div className="detail-item"><small>Jam submit</small><span>{formatTime(selected.checkIn)}</span></div>
            <div className="detail-item"><small>Catatan</small><span>{selected.notes || '-'}</span></div>
          </div>
          {selected.photo && <img src={selected.photo} alt={`Bukti absensi ${selected.employeeName}`} />}
        </div>
      </Modal>}
    </>
  )
}
