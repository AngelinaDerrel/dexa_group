import { useEffect, useState } from 'react'
export default function PhotoUploader({ onChange }) {
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')
  useEffect(() => () => preview && URL.revokeObjectURL(preview), [preview])
  function handleChange(event) {
    const file = event.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png'].includes(file.type)) return setError('Gunakan foto JPG atau PNG.')
    if (file.size > 5 * 1024 * 1024) return setError('Ukuran foto maksimal 5 MB.')
    setError(''); setPreview(URL.createObjectURL(file)); onChange(file)
  }
  return <div><div className="photo-uploader">{preview ? <><img className="photo-preview" src={preview} alt="Pratinjau foto presensi" /><button className="remove-photo" type="button" onClick={() => { setPreview(''); onChange(null) }}>Hapus</button></> : <label htmlFor="photo">📷<br />Unggah foto diri<span>JPG/PNG, maksimal 5 MB</span></label>}<input id="photo" type="file" accept="image/jpeg,image/png" onChange={handleChange} /></div>{error && <span className="field-error">{error}</span>}</div>
}
