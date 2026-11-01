import { useEffect, useState } from 'react'
import { Button, Card, DataTable, InputField, LoadingSpinner, Modal, StatusBadge } from '../components/UI'
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
      if (!isEditing && payload.password.length < 8) {
        setError('Password minimal 8 karakter.')
        return
      }
      const saved = isEditing ? await employeeApi.update(employee.id, payload) : await employeeApi.create(payload)
      onSaved(saved)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Data karyawan tidak dapat disimpan.')
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
        <InputField id="employee-phone" name="phone" label="No. HP" value={form.phone} onChange={updateField} />
        <InputField id="employee-position" name="position" label="Jabatan" value={form.position} onChange={updateField} required />
        <InputField id="employee-department" name="department" label="Departemen" value={form.department} onChange={updateField} required />
        <InputField id="employee-password" name="password" type="password" label={isEditing ? 'Password baru (opsional)' : 'Password'} value={form.password} onChange={updateField} required={!isEditing} minLength={8} />
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
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    let active = true
    employeeApi.list()
      .then((data) => { if (active) setEmployees(data) })
      .catch(() => { if (active) setError('Data karyawan tidak dapat dimuat.') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  async function removeEmployee(employee) {
    if (!window.confirm(`Hapus data ${employee.name}?`)) return
    try {
      await employeeApi.remove(employee.id)
      setEmployees((current) => current.filter((item) => item.id !== employee.id))
    } catch {
      setError('Data karyawan tidak dapat dihapus.')
    }
  }

  const columns = [
    { key: 'name', label: 'Karyawan', render: (row) => <div><strong>{row.name}</strong><small className="table-subtext">{row.nik}</small></div> },
    { key: 'email', label: 'Kontak', render: (row) => <div><span>{row.email}</span><small className="table-subtext">{row.phone || '-'}</small></div> },
    { key: 'position', label: 'Jabatan' },
    { key: 'department', label: 'Departemen' },
    { key: 'role', label: 'Role', render: (row) => <StatusBadge>{row.role === 'HRD' ? 'HRD' : 'Karyawan'}</StatusBadge> },
    { key: 'isActive', label: 'Status', render: (row) => <StatusBadge status={row.isActive ? 'success' : 'warning'}>{row.isActive ? 'Aktif' : 'Nonaktif'}</StatusBadge> },
    { key: 'action', label: 'Aksi', render: (row) => <div className="table-actions"><button className="link-button" onClick={() => { setSelected(row); setShowForm(true) }}>Edit</button><button className="link-button danger-link" onClick={() => removeEmployee(row)}>Hapus</button></div> },
  ]

  return (
    <>
      <header className="page-header">
        <div><h1>Data Karyawan</h1><p>Kelola seluruh informasi karyawan dan akses akun.</p></div>
        <Button onClick={() => { setSelected(null); setShowForm(true) }}>+ Tambah karyawan</Button>
      </header>
      {error && <div className="alert">{error}</div>}
      <Card className="table-card">
        {loading ? <div className="loading-box"><LoadingSpinner /></div> : <DataTable columns={columns} rows={employees} emptyTitle="Belum ada data karyawan" />}
      </Card>
      {showForm && <Modal title={selected ? 'Edit data karyawan' : 'Tambah karyawan'} onClose={() => setShowForm(false)}><EmployeeForm employee={selected} onClose={() => setShowForm(false)} onSaved={(saved) => { setEmployees((current) => selected ? current.map((item) => item.id === saved.id ? saved : item) : [saved, ...current]); setShowForm(false) }} /></Modal>}
    </>
  )
}
