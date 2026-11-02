import { useEffect, useMemo, useState } from 'react'
import { Button, Card, DataTable, EmptyState, InputField, LoadingSpinner, Modal, StatusBadge } from '../components/UI'
import { getErrorMessage } from '../lib/api'
import { employeeApi } from '../services/employeeApi'

const emptyForm = { name: '', nik: '', email: '', password: '', position: '', department: '', phone: '', role: 'EMPLOYEE', isActive: true }

function EmployeeForm({ employee, onClose, onSaved }) {
  const [form, setForm] = useState(employee ? { ...emptyForm, ...employee, password: '' } : emptyForm)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const isEditing = Boolean(employee)

  function updateField(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      const payload = { ...form }
      if (isEditing && !payload.password) delete payload.password
      if (isEditing) delete payload.id
      if (!isEditing) delete payload.isActive
      const saved = isEditing ? await employeeApi.update(employee.id, payload) : await employeeApi.create(payload)
      onSaved(saved)
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Data karyawan tidak dapat disimpan.'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert">{error}</div>}
      <div className="form-grid">
        <InputField id="employee-name" name="name" label="Nama lengkap" value={form.name} onChange={updateField} required />
        <InputField id="employee-nik" name="nik" label="NIK" value={form.nik} onChange={updateField} required />
        <InputField id="employee-email" name="email" type="email" label="Email" value={form.email} onChange={updateField} required />
        <InputField id="employee-phone" name="phone" label="No. HP" value={form.phone || ''} onChange={updateField} />
        <InputField id="employee-position" name="position" label="Jabatan" value={form.position} onChange={updateField} required />
        <InputField id="employee-department" name="department" label="Departemen" value={form.department} onChange={updateField} required />
        <InputField id="employee-password" name="password" type="password" label={isEditing ? 'Password baru (opsional)' : 'Password (minimal 8 karakter)'} value={form.password} onChange={updateField} required={!isEditing} minLength={8} />
        <div className="field">
          <label htmlFor="employee-role">Role</label>
          <select id="employee-role" name="role" value={form.role} onChange={updateField}>
            <option value="EMPLOYEE">Karyawan</option>
            <option value="HRD">HRD</option>
          </select>
        </div>
      </div>
      {isEditing && <label className="checkbox-field"><input type="checkbox" name="isActive" checked={form.isActive} onChange={updateField} /> Karyawan aktif</label>}
      <div className="form-actions">
        <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
        <Button type="submit" loading={saving}>{isEditing ? 'Simpan perubahan' : 'Tambah karyawan'}</Button>
      </div>
    </form>
  )
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('')
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)

  function loadEmployees() {
    setLoading(true)
    setError('')
    employeeApi.list()
      .then(setEmployees)
      .catch((requestError) => setError(getErrorMessage(requestError, 'Data karyawan tidak dapat dimuat.')))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let active = true
    employeeApi.list()
      .then((data) => { if (active) setEmployees(data) })
      .catch((requestError) => { if (active) setError(getErrorMessage(requestError, 'Data karyawan tidak dapat dimuat.')) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const departments = useMemo(() => [...new Set(employees.map((employee) => employee.department).filter(Boolean))].sort(), [employees])
  const filteredEmployees = useMemo(() => employees.filter((employee) => {
    const search = query.toLowerCase()
    return (!search || [employee.name, employee.nik, employee.email].some((value) => value?.toLowerCase().includes(search)))
      && (!department || employee.department === department)
  }), [employees, query, department])

  async function toggleActive(employee) {
    setError('')
    try {
      await employeeApi.update(employee.id, { isActive: !employee.isActive })
      setEmployees((current) => current.map((item) => item.id === employee.id ? { ...item, isActive: !item.isActive } : item))
      setNotice(`Status ${employee.name} berhasil diubah.`)
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Status karyawan tidak dapat diubah.'))
    }
  }

  function handleSaved() {
    setShowForm(false)
    setSelected(null)
    setNotice('Data karyawan berhasil disimpan.')
    loadEmployees()
  }

  const columns = [
    { key: 'name', label: 'Nama', render: (row) => <div><strong>{row.name}</strong><small className="table-subtext">{row.nik}</small></div> },
    { key: 'email', label: 'Email' },
    { key: 'position', label: 'Jabatan' },
    { key: 'department', label: 'Departemen' },
    { key: 'phone', label: 'Telepon', render: (row) => row.phone || '-' },
    { key: 'role', label: 'Role' },
    { key: 'isActive', label: 'Status', render: (row) => <StatusBadge status={row.isActive ? 'success' : 'warning'}>{row.isActive ? 'Aktif' : 'Nonaktif'}</StatusBadge> },
    { key: 'action', label: 'Aksi', render: (row) => <div className="table-actions"><button className="link-button" onClick={() => { setSelected(row); setShowForm(true) }}>Edit</button><button className="link-button" onClick={() => toggleActive(row)}>{row.isActive ? 'Nonaktifkan' : 'Aktifkan'}</button></div> },
  ]

  return (
    <>
      <header className="page-header">
        <div><h1>Data Karyawan</h1><p>Kelola data master karyawan dan status akses akun.</p></div>
        <Button onClick={() => { setSelected(null); setShowForm(true) }}>+ Tambah Karyawan</Button>
      </header>
      {error && <div className="alert"><div>{error}</div><button className="link-button" onClick={loadEmployees}>Coba lagi</button></div>}
      {notice && <div className="alert success-alert">{notice}</div>}
      <Card className="filter-card">
        <div className="filter-grid employee-filters">
          <InputField id="employee-search" label="Cari nama, NIK, atau email" value={query} onChange={(event) => setQuery(event.target.value)} />
          <div className="field">
            <label htmlFor="department-filter">Departemen</label>
            <select id="department-filter" value={department} onChange={(event) => setDepartment(event.target.value)}>
              <option value="">Semua departemen</option>
              {departments.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </div>
        </div>
      </Card>
      <Card className="table-card">
        {loading ? <div className="loading-box"><LoadingSpinner /></div> : filteredEmployees.length ? <DataTable columns={columns} rows={filteredEmployees} /> : <EmptyState title="Belum ada data">Tidak ada karyawan yang sesuai filter.</EmptyState>}
      </Card>
      {showForm && <Modal title={selected ? 'Edit data karyawan' : 'Tambah Karyawan'} onClose={() => setShowForm(false)}><EmployeeForm employee={selected} onClose={() => setShowForm(false)} onSaved={handleSaved} /></Modal>}
    </>
  )
}
