import { api } from "./api"

export const conversationsService = {
  list(filters = {}) {
    return api.get("/api/conversations", { limit: 500, ...filters }) 
  },

  getById(id) {
    return api.get(`/api/conversations/${id}`)
  },
 
  updateEstado(id, estado) {
    return api.patch(`/api/conversations/${id}/estado?estado=${estado}`)
  },

  delete(id) {
    return api.delete(`/api/conversations/${id}`)
  },
 
  createContactAttempt(conversationId, developerId, payload) {
    return api.post(
      `/api/conversations/${conversationId}/contact-attempt?developer_id=${developerId}`,
      payload
    )
  },
 
  getContactAttempts(conversationId) {
    return api.get(`/api/conversations/${conversationId}/contact-attempts`)
  },
 
  getStats() {
    return api.get("/api/stats")
  },

  convertFromConversation(conversationId) {
    return api.post(`/api/conversations/${conversationId}/convert-to-client`)
  }
}