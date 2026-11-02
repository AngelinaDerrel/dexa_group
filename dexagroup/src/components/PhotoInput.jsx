import { useEffect, useRef, useState } from 'react'
import { Button } from './UI'

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png']

function cameraErrorMessage(error) {
  switch (error?.name) {
    case 'NotAllowedError':
      return 'Akses kamera ditolak. Izinkan kamera di browser (ikon gembok di address bar), atau upload foto dari file.'
    case 'NotFoundError':
      return 'Kamera tidak ditemukan di perangkat ini. Silakan upload foto dari file.'
    case 'NotReadableError':
      return 'Kamera sedang dipakai aplikasi lain. Tutup aplikasi tersebut, atau upload foto dari file.'
    default:
      return 'Kamera tidak dapat dibuka. Silakan coba lagi atau upload foto dari file.'
  }
}

export default function PhotoInput({ onChange }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const fileRef = useRef(null)
  const previewRef = useRef('')
  const [mode, setMode] = useState('camera')
  const [cameraOn, setCameraOn] = useState(false)
  const [preview, setPreview] = useState('')
  const [error, setError] = useState('')

  function showPreview(blob) {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
    previewRef.current = blob ? URL.createObjectURL(blob) : ''
    setPreview(previewRef.current)
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setCameraOn(false)
  }

  useEffect(() => {
    if (cameraOn && videoRef.current) videoRef.current.srcObject = streamRef.current
  }, [cameraOn])

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    if (previewRef.current) URL.revokeObjectURL(previewRef.current)
  }, [])

  function switchMode(next) {
    if (next === mode) return
    stopCamera()
    showPreview(null)
    setError('')
    onChange(null)
    setMode(next)
  }

  async function startCamera() {
    setError('')
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Browser ini tidak mendukung kamera (butuh HTTPS atau localhost). Silakan upload foto dari file.')
      return
    }
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 } },
        audio: false,
      })
      showPreview(null)
      onChange(null)
      setCameraOn(true)
    } catch (requestError) {
      setError(cameraErrorMessage(requestError))
    }
  }

  function capture() {
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    canvas.toBlob((blob) => {
      if (!blob) return
      showPreview(blob)
      onChange(new File([blob], `absen-${Date.now()}.jpg`, { type: 'image/jpeg' }))
      stopCamera()
    }, 'image/jpeg', 0.85)
  }

  function handleFile(event) {
    const file = event.target.files?.[0]
    if (!file) return
    let message = ''
    if (!ALLOWED.includes(file.type)) message = 'Gunakan foto JPG atau PNG.'
    else if (file.size > MAX_SIZE) message = 'Ukuran foto maksimal 5 MB.'

    if (message) {
      event.target.value = ''
      showPreview(null)
      onChange(null)
      setError(message)
      return
    }
    setError('')
    showPreview(file)
    onChange(file)
  }

  function removeFile() {
    if (fileRef.current) fileRef.current.value = ''
    showPreview(null)
    onChange(null)
  }

  let box
  if (mode === 'camera') {
    if (cameraOn) box = <video ref={videoRef} className="photo-preview" autoPlay playsInline muted />
    else if (preview) box = <img className="photo-preview" src={preview} alt="Pratinjau foto presensi" />
    else box = (
      <div className="camera-placeholder">
        <label>📷<br />Kamera belum dibuka<span>Ambil foto langsung dari kamera Anda</span></label>
        <Button type="button" onClick={startCamera}>Buka kamera</Button>
      </div>
    )
  } else {
    box = (
      <>
        {preview ? (
          <>
            <img className="photo-preview" src={preview} alt="Pratinjau foto presensi" />
            <button className="remove-photo" type="button" onClick={removeFile}>Hapus</button>
          </>
        ) : (
          <label htmlFor="photo">📷<br />Unggah foto diri<span>JPG/PNG, maksimal 5 MB</span></label>
        )}
        <input ref={fileRef} id="photo" type="file" accept="image/jpeg,image/png" onChange={handleFile} />
      </>
    )
    
  }
  

  return (
    <div>
      <div className="photo-mode-actions">
        <Button type="button" variant={mode === 'camera' ? undefined : 'outline'} onClick={() => switchMode('camera')}>Kamera (disarankan)</Button>
        <Button type="button" variant={mode === 'file' ? undefined : 'outline'} onClick={() => switchMode('file')}>Upload foto</Button>
      </div>

      <div className="photo-uploader">{box}</div>

      {mode === 'camera' && (cameraOn
        ? <div className="photo-capture-actions"><Button type="button" onClick={capture}>Ambil foto</Button></div>
        : preview && <div className="photo-capture-actions"><Button type="button" onClick={startCamera}>Foto ulang</Button></div>)}

      {error && <span className="field-error">{error}</span>}
      {error && mode === 'camera' && <button type="button" className="link-button" onClick={() => switchMode('file')}>Upload foto dari file</button>}
    </div>
  )
}