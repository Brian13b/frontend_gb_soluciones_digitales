import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import MessageBubble from "./MessageBubble"
import ContactModal from "./ContactModal"
import ContactsList from "./ContactsList"
import Card from "../ui/Card"
import Button from "../ui/Button"
import Badge from "../ui/Badge"
import Spinner from "../ui/Spinner"
import EmptyState from "../ui/EmptyState"
import { MessagesSquare } from "lucide-react"
import { ESTADOS } from "../../utils/constants"
import { formatDateTime } from "../../utils/formatters"
import { conversationsService } from "../../services/conversations.service"
import { useAuth } from "../../context/AuthContext"
 
export default function ConversationDetail({ conversationId, onStatusChanged }) {
  const { user } = useAuth()
  const [conversation, setConversation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [attempts, setAttempts] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(null)
 
  const load = useCallback(async () => {
    if (!conversationId) return
    setLoading(true)
    try {
      const [conv, attemptsList] = await Promise.all([
        conversationsService.getById(conversationId),
        conversationsService.getContactAttempts(conversationId),
      ])
      setConversation(conv)
      setAttempts(attemptsList)
    } finally {
      setLoading(false)
    }
  }, [conversationId])
 
  useEffect(() => {
    load()
  }, [load])
 
  const handleCopy = (value, key) => {
    navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }
 
  const handleContactSubmit = async (method, notes) => {
    setSaving(true)
    try {
      await conversationsService.createContactAttempt(conversationId, user.id, { method, notes })
      await conversationsService.updateEstado(conversationId, "contactado")
      await load()
      onStatusChanged?.()
      setModalOpen(false)
    } finally {
      setSaving(false)
    }
  }
 
  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center">
        <EmptyState
          icon={MessagesSquare}
          title="Seleccioná una conversación"
          description="Elegí un chat de la lista para ver el detalle y contactar a la persona."
        />
      </div>
    )
  }
 
  if (loading || !conversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size={28} />
      </div>
    )
  }
 
  const estado = ESTADOS[conversation.estado] || ESTADOS.abierta
 
  return (
    <motion.div
      key={conversationId}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full flex flex-col"
    >
      <div className="flex items-start justify-between px-8 py-6 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <h2 className="text-lg font-bold text-white">{conversation.contact_name || "Sin nombre"}</h2>
            <Badge color={estado.color} bg={estado.bg} ring={estado.ring}>{estado.label}</Badge>
          </div>
          <p className="text-xs text-white/35">
            {conversation.channel === "whatsapp" ? "WhatsApp" : "Sitio Web"} · {formatDateTime(conversation.created_at)}
          </p>
        </div>
        <Button size="sm" onClick={() => setModalOpen(true)}>
          Registrar contacto
        </Button>
      </div>
 
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8">
        {conversation.contacts && conversation.contacts.length > 0 && (
          <Card className="p-5">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">
              Contactos Capturados ({conversation.contacts.length})
            </p>
            <ContactsList contacts={conversation.contacts} copied={copied} onCopy={handleCopy} />
          </Card>
        )}
 
        <div>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">Conversación</p>
          <div className="space-y-5">
            {conversation.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </div>
        </div>
 
        {attempts.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">Historial de contactos</p>
            <div className="space-y-2">
              {attempts.map((a) => (
                <Card key={a.id} className="p-3.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-gb-300 capitalize">{a.method}</span>
                    <span className="text-[10px] text-white/30">{formatDateTime(a.created_at)}</span>
                  </div>
                  {a.notes && <p className="text-xs text-white/50">{a.notes}</p>}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
 
      <ContactModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleContactSubmit}
        phone={conversation.contact_phone}
        email={conversation.contact_email}
        loading={saving}
      />
    </motion.div>
  )
}