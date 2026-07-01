import { api } from "./api"
 
// Conversation structure:
// {
//   id, channel, created_at, estado, message_count,
//   contact_name, messages: [...],
//   contacts: [
//     { id, name, email, phone, validation_status: 'PENDING'|'VERIFIED', is_primary: boolean }
//   ]
// }

export const conversationsService = {
  list(filters = {}) {
    return api.get("/api/conversations", { limit: 50, ...filters })
  },

  getById(id) {
    return api.get(`/api/conversations/${id}`)
  },
 
  updateEstado(id, estado) {
    return api.patch(`/api/conversations/${id}/estado?estado=${estado}`)
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
}