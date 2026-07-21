import { createContext, useContext, useState, useCallback } from 'react'
import { setAuthCredentials, clearAuthCredentials } from '../services/api'

const AuthContext = createContext(null)

const STORAGE_KEY = 'spazaconnect_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  })

  const login = useCallback((userData, rawPassword) => {
    // The backend's User entity has no @JsonIgnore on `password`, so every
    // /auth/login and /auth/register response includes the BCrypt hash.
    // Never let that reach localStorage or component state — strip it here,
    // in the one place all session data flows through.
    // eslint-disable-next-line no-unused-vars
    const { password, ...safeUser } = userData
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeUser))
    setUser(safeUser)

    // See services/api.js — temporary Basic Auth stopgap, in memory only.
    if (rawPassword) setAuthCredentials(safeUser.username, rawPassword)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
    clearAuthCredentials()
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside an AuthProvider')
  return ctx
}
