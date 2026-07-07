import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import MessageBubble from "./MessageBubble"
import ContactModal from "./ContactModal"
import ContactsList from "./ContactsList"
import Card from "../ui/Card"
import Button from "../ui/Button"
import Badge from "../ui/Badge"
import Spinner from "../ui/Spinner"
import EmptyState from "../ui/EmptyState"
import Toast from "../ui/Toast"
import { MessagesSquare, ChevronLeft, ExternalLink, Trash2 } from "lucide-react"
import { ESTADOS } from "../../utils/constants"
import { formatDateTime } from "../../utils/formatters"
import { conversationsService } from "../../services/conversations.service"
import { useAuth } from "../../context/AuthContext"

export default function ConversationDetail({ conversationId, onStatusChanged, onBack }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [conversation, setConversation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [attempts, setAttempts] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(null)
  const [convertLoading, setConvertLoading] = useState(false)
  const [convertToast, setConvertToast] = useState(null)

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

  const handleStatusUpdate = async (nuevoEstado) => {
    setSaving(true)
    try {
      await conversationsService.updateEstado(conversationId, nuevoEstado)
      await load()
      onStatusChanged?.()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este chat? Esta acción no se puede deshacer.")) {
      setSaving(true)
      try {
        await conversationsService.delete(conversationId)
        onStatusChanged?.()
        onBack()
      } catch (error) {
        console.error("Error al eliminar", error)
        setSaving(false)
      }
    }
  }

  const handleConvertToClient = async () => {
    setConvertLoading(true)
    try {
      const client = await conversationsService.convertFromConversation(conversationId)
      setConvertToast({
        type: "success",
        message: "Cliente creado correctamente",
        actionLabel: "Ver cliente",
        onAction: () => {
          navigate(`/clientes?tab=activo&clientId=${client.id}`)
        },
      })
      await load()
    } catch (error) {
      console.error("Error converting to client:", error)
      if (error.status === 400 && error.detail?.includes("contact")) {
        setConvertToast({
          type: "error",
          message: "Falta información de contacto para convertir este cliente. Verificá que la conversación tenga nombre, teléfono o email registrado.",
        })
      } else if (error.status >= 500 || error.isNetworkError) {
        setConvertToast({
          type: "error",
          message: error.detail || "Error del servidor, intentá de nuevo.",
        })
      } else {
        setConvertToast({
          type: "error",
          message: error.detail || error.message || "Error desconocido",
        })
      }
    } finally {
      setConvertLoading(false)
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

  const estadoDefault = { label: "...", color: "text-white", bg: "bg-white/10", ring: "" };
  const estado = ESTADOS[conversation.estado] || ESTADOS.ABIERTA || estadoDefault;
  const primaryContact = conversation.contacts?.find(c => c.is_primary) || conversation.contacts?.[0]
  
  const displayName = primaryContact?.name || "Sin nombre"
  
  const hasPhone = !!primaryContact?.phone
  const hasEmail = !!primaryContact?.email
  const actionLink = hasPhone 
    ? `https://wa.me/${primaryContact.phone.replace(/\D/g, "")}` 
    : (hasEmail ? `mailto:${primaryContact.email}` : null)
  const actionText = hasPhone ? "Abrir en WhatsApp" : (hasEmail ? "Abrir en Gmail" : "Sin contacto")

  return (
    <motion.div
      key={conversationId}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full flex flex-col"
    >
      <div className="flex items-center justify-between px-4 md:px-8 py-4 md:py-6 border-b border-white/[0.06] bg-charcoal-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="md:hidden p-2 -ml-2 text-white/50 hover:text-white bg-white/5 rounded-lg"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-base md:text-lg font-bold text-white truncate max-w-[150px] md:max-w-xs">
                {displayName}
              </h2>
              <Badge color={estado.color} bg={estado.bg} ring={estado.ring}>{estado.label}</Badge>
            </div>
            <p className="text-[10px] md:text-xs text-white/35">
              {conversation.channel === "whatsapp" ? "WhatsApp" : "Sitio Web"} · {formatDateTime(conversation.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {actionLink && (
            <a 
              href={actionLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gb-500/20 text-gb-300 hover:bg-gb-500/30 transition-colors text-xs font-medium border border-gb-500/20"
            >
              {actionText} <ExternalLink size={14} />
            </a>
          )}
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleStatusUpdate("FINALIZADA")}
            disabled={saving || conversation.estado === "FINALIZADA"}
          >
            {saving ? "Guardando..." : "Marcar finalizada"}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleConvertToClient}
            loading={convertLoading}
            className="text-xs"
          >
            Convertir en cliente
          </Button>

          <button
            onClick={handleDelete}
            disabled={saving}
            className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-1"
            title="Eliminar conversación"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-8 scrollbar-none">
        {/* Mensajes */}
        <div>
          <p className="text-xs font-semibold text-white/40 uppercase tracking-wide mb-3">Conversación</p>
          <div className="space-y-5">
            {conversation.messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </div>
        </div>
      </div>

      {/* Convert-to-Client Toast */}
      {convertToast && (
        <Toast
          type={convertToast.type}
          message={convertToast.message}
          actionLabel={convertToast.actionLabel}
          onAction={convertToast.onAction}
          isOpen={true}
          onClose={() => setConvertToast(null)}
        />
      )}
    </motion.div>
  )
}