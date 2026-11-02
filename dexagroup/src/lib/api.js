const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

function readStorage(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function clearAuth() {
  try {
    localStorage.removeItem('dexagroup_token')
    localStorage.removeItem('dexagroup_user')
  } catch {}
  if (window.location.pathname !== '/') window.location.assign('/')
}

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.details = details
  }
}

export function getErrorMessage(error, fallback = 'Terjadi kesalahan. Silakan coba lagi.') {
  const message = error?.details?.message || error?.message
  if (Array.isArray(message)) return message.join(', ')
  return message || fallback
}

export function getPhotoUrl(photo) {
  if (!photo) return ''
  if (/^https?:\/\//i.test(String(photo))) return String(photo)
  return `${apiUrl.replace(/\/api\/?$/, '')}/${String(photo).replace(/^\/+/, '')}`
}

export async function apiRequest(path, { method = 'GET', body, params } = {}) {
  const url = new URL(`${apiUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`)
  if (params) Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') url.searchParams.set(key, value)
  })

  const headers = {}
  const token = readStorage('dexagroup_token')
  if (token) headers.Authorization = 'Bearer ' + token
  if (!(body instanceof FormData)) headers['Content-Type'] = 'application/json'

  const response = await fetch(url, {
    method,
    headers,
    body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body),
  })
  const responseText = await response.text()
  let data = null
  if (responseText) {
    try { data = JSON.parse(responseText) } catch { data = null }
  }
  if (response.status === 401) {
    clearAuth()
    throw new ApiError('Sesi login telah berakhir. Silakan masuk kembali.', 401, data)
  }
  if (!response.ok) {
    const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message
    throw new ApiError(message || 'Permintaan tidak dapat diproses.', response.status, data)
  }
  return data
}
