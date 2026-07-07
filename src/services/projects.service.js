import { api } from "./api"

export const projectsService = {
  list(filters = {}) {
    return api.get("/api/projects", { limit: 500, ...filters })
  },

  getById(id) {
    return api.get(`/api/projects/${id}`)
  },

  create(payload) {
    return api.post("/api/projects", payload)
  },

  update(id, payload) {
    return api.patch(`/api/projects/${id}`, payload)
  },

  delete(id) {
    return api.delete(`/api/projects/${id}`)
  }
}
