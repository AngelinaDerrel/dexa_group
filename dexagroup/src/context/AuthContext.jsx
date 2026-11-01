import { useMemo, useState } from 'react'
import { authApi } from '../services/authApi'
import { AuthContext } from './contextValue'

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('dexagroup_user') || 'null')
  } catch {
    localStorage.removeItem('dexagroup_user')
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [loading, setLoading] = useState(false)
  async function login(credentials) {
    setLoading(true)
    try {
      const result = await authApi.login(credentials)
      setUser(result.user)
      localStorage.setItem('dexagroup_user', JSON.stringify(result.user))
      localStorage.setItem('dexagroup_token', result.token)
      return result
    } finally { setLoading(false) }
  }
  function logout() {
    setUser(null); localStorage.removeItem('dexagroup_user'); localStorage.removeItem('dexagroup_token')
  }
  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
