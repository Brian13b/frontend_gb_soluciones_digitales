import { api } from "./api"
 
export const authService = {
  async login(email, password) {
    const data = await api.post("/api/auth/login", { email, password }, { auth: false })
    localStorage.setItem("gb_token", data.access_token)
    localStorage.setItem("gb_user", JSON.stringify({ id: data.user_id, email: data.email }))
    return data
  },
 
  logout() {
    localStorage.removeItem("gb_token")
    localStorage.removeItem("gb_user")
  },
 
  getCurrentUser() {
    const raw = localStorage.getItem("gb_user")
    return raw ? JSON.parse(raw) : null
  },
 
  isAuthenticated() {
    return !!localStorage.getItem("gb_token")
  },
}