import { api } from "./api"

export const clientsService = {
  list(filters = {}) {
    return api.get("/api/clients", { limit: 500, ...filters })
  },

  getById(id) {
    return api.get(`/api/clients/${id}`)
  },

  create(payload) {
    return api.post("/api/clients", payload)
  },

  update(id, payload) {
    return api.patch(`/api/clients/${id}`, payload)
  },

  delete(id) {
    return api.delete(`/api/clients/${id}`)
  }
}
