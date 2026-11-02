import { useEffect, useState } from 'react'
import { Button, Card, DataTable, EmptyState, InputField, LoadingSpinner, Modal } from '../components/UI'
import { getErrorMessage, getPhotoUrl } from '../lib/api'
import { attendanceApi } from '../services/attendanceApi'

const emptyFilters = { search: '', from: '', to: '' }

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function formatTime(value) {
  return value ? `${new Date(value).toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta', hour: '2-digit', minute: '2-digit' })} WIB` : '-'
}

function AttendancePhoto({ photo, large = false, employeeName }) {
  const [failed, setFailed] = useState(false)
  if (!photo || failed) return <div className={large ? 'photo-placeholder photo-placeholder-large' : 'photo-placeholder'}>Foto tidak tersedia</div>
  return <img className={large ? 'attendance-photo-large' : 'attendance-thumbnail'} src={getPhotoUrl(photo)} alt={`Bukti absensi ${employeeName}`} onError={() => setFailed(true)} />
}

export default function AttendanceMonitoringPage() {
  const [records, setRecords] = useState([])
  const [searchInput, setSearchInput] = useState('')
  const [filters, setFilters] = useState(emptyFilters)
  const [selected, setSelected] = useState(null)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const limit = 20

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = searchInput.trim()
      if (value === filters.search) return
      setLoading(true)
      setPage(1)
      setError('')
      setFilters((current) => ({ ...current, search: value }))
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput, filters.search])

  useEffect(() => {
    let active = true
    attendanceApi.all({ ...filters, page, limit })
      .then((result) => {
        if (!active) return
        setRecords(result.data)
        setTotal(result.total)
      })
      .catch((requestError) => {
        if (!active) return
        setRecords([])
        setTotal(0)
        setError(getErrorMessage(requestError, 'Data absensi tidak dapat dimuat.'))
      })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [filters, page, reloadKey])

  function updateFilter(event) {
    const { name, value } = event.target
    setLoading(true)
    setPage(1)
    setError('')
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function resetFilters() {
    setLoading(true)
    setPage(1)
    setError('')
    setSearchInput('')
    setFilters(emptyFilters)
  }

  function retry() {
    setLoading(true)
    setError('')
    setReloadKey((current) => current + 1)
  }

  const columns = [
    { key: 'attendanceDate', label: 'Tanggal', render: (row) => formatDate(row.attendanceDate) },
    { key: 'checkIn', label: 'Jam check-in', render: (row) => formatTime(row.checkIn) },
    { key: 'employeeName', label: 'Nama karyawan' },
    { key: 'notes', label: 'Catatan', render: (row) => row.notes || '-' },
    { key: 'photo', label: 'Foto bukti', render: (row) => <button className="photo-button" onClick={() => setSelected(row)} aria-label={`Lihat foto ${row.employeeName}`}><AttendancePhoto photo={row.photo} employeeName={row.employeeName} /></button> },
  ]
  const pageCount = Math.ceil(total / limit)

  return (
    <>
      <header className="page-header">
        <div><h1>Monitoring Presensi</h1><p>Lihat absensi yang telah disubmit karyawan. Data ini bersifat view-only.</p></div>
        <Button variant="outline" onClick={resetFilters}>Reset filter</Button>
      </header>
      {error && <div className="alert"><div>{error}</div><button className="link-button" onClick={retry}>Coba lagi</button></div>}
      <Card className="filter-card">
        <div className="filter-grid">
          <InputField id="attendance-search" name="search" type="text" label="Cari nama karyawan" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
          <InputField id="attendance-from" name="from" type="date" label="Dari tanggal" value={filters.from} onChange={updateFilter} />
          <InputField id="attendance-to" name="to" type="date" label="Sampai tanggal" value={filters.to} onChange={updateFilter} />
        </div>
      </Card>
      <Card className="table-card">
        {loading ? <div className="loading-box"><LoadingSpinner /></div> : records.length ? <DataTable columns={columns} rows={records} /> : <EmptyState title="Belum ada data">Tidak ada absensi sesuai filter.</EmptyState>}
      </Card>
      {!loading && pageCount > 1 && <div className="pagination"><Button variant="outline" disabled={page === 1} onClick={() => { setLoading(true); setPage((current) => current - 1) }}>Sebelumnya</Button><span>Halaman {page} dari {pageCount}</span><Button variant="outline" disabled={page === pageCount} onClick={() => { setLoading(true); setPage((current) => current + 1) }}>Berikutnya</Button></div>}
      {selected && <Modal title={`Detail absensi · ${selected.employeeName}`} onClose={() => setSelected(null)}><div className="attendance-detail"><div className="details-grid"><div className="detail-item"><small>Tanggal</small><span>{formatDate(selected.attendanceDate)}</span></div><div className="detail-item"><small>Jam check-in</small><span>{formatTime(selected.checkIn)}</span></div><div className="detail-item"><small>Catatan</small><span>{selected.notes || '-'}</span></div></div><AttendancePhoto photo={selected.photo} large employeeName={selected.employeeName} /></div></Modal>}
    </>
  )
}
