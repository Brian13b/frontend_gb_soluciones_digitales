import { createContext, useContext, useState, useCallback } from "react"
import { authService } from "../services/auth.service"
 
const AuthContext = createContext(null)
 
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
 
  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authService.login(email, password)
      setUser({ id: data.user_id, email: data.email })
      return true
    } catch (err) {
      setError(err.message || "Credenciales inválidas")
      return false
    } finally {
      setLoading(false)
    }
  }, [])
 
  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
  }, [])
 
  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}
 
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
  return ctx
}