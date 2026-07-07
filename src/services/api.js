const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001"
 
class ApiError extends Error {
  constructor(message, status, headers = {}) {
    super(message)
    this.status = status
    this.headers = headers
  }
}
 
async function request(path, { method = "GET", body, params, auth = true } = {}) {
  const token = localStorage.getItem("gb_token")
 
  let url = `${API_URL}${path}`
  if (params) {
    const qs = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
    ).toString()
    if (qs) url += `?${qs}`
  }
 
  const headers = { "Content-Type": "application/json" }
  if (auth && token) headers["Authorization"] = `Bearer ${token}`
 
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })
 
  if (res.status === 401) {
    localStorage.removeItem("gb_token")
    localStorage.removeItem("gb_user")
    sessionStorage.setItem("gb_session_expired", "true")
    window.location.href = "/login"
    throw new ApiError("No autorizado", 401)
  }
 
  if (!res.ok) {
    let detail = "Error en la solicitud"
    try {
      const data = await res.json()
      detail = data.detail || detail
    } catch {}

    // Extract relevant headers (X-Client-ID, etc.)
    const headers = {}
    const clientId = res.headers.get("X-Client-ID")
    if (clientId) headers["X-Client-ID"] = clientId

    throw new ApiError(detail, res.status, headers)
  }
 
  if (res.status === 204) return null
  return res.json()
}
 
export const api = {
  get: (path, params) => request(path, { method: "GET", params }),
  post: (path, body, opts = {}) => request(path, { method: "POST", body, ...opts }),
  patch: (path, body, opts = {}) => request(path, { method: "PATCH", body, ...opts }),
  del: (path) => request(path, { method: "DELETE" }),
}
 
export { ApiError }