import { motion } from "framer-motion"
import { Globe, MessageCircle, ExternalLink, CheckCircle2 } from "lucide-react"
import Badge from "../ui/Badge"
import { ESTADOS } from "../../utils/constants"
import { formatDate } from "../../utils/formatters"

const VALIDATION_COLORS = {
  VERIFIED: { color: "text-emerald-400", label: "Verificado" },
  PENDING: { color: "text-yellow-400", label: "Pendiente" },
}

export default function ConversationItem({ conversation, active, onClick, onStatusChange }) {
  const estado = ESTADOS[conversation.estado] || ESTADOS.abierta
  const ChannelIcon = conversation.channel === "whatsapp" ? MessageCircle : Globe

  const primaryContact = conversation.contacts?.find(c => c.is_primary) || conversation.contacts?.[0]
  const validationState = primaryContact ? VALIDATION_COLORS[primaryContact.validation_status] : null
  
  const hasPhone = !!primaryContact?.phone
  const hasEmail = !!primaryContact?.email
  
  const actionLink = hasPhone 
    ? `https://wa.me/${primaryContact.phone.replace(/\D/g, "")}` 
    : (hasEmail ? `mailto:${primaryContact.email}` : null)
    
  const actionText = hasPhone ? "Abrir en WhatsApp" : (hasEmail ? "Abrir en Gmail" : "Sin contacto")

  const handleActionClick = (e) => {
    e.stopPropagation()
    if (actionLink) {
      window.open(actionLink, "_blank", "noopener,noreferrer")
    }
  }

  const handleResolveClick = (e) => {
    e.stopPropagation()
    onStatusChange?.(conversation.id, "CERRADA") 
  }

  return (
    <motion.div
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      role="button"
      className={`w-full text-left p-4 rounded-xl border flex flex-col gap-3 transition-colors duration-200 ${
        active
          ? "bg-gb-500/10 border-gb-500/30"
          : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10"
      }`}
    >
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`p-1.5 rounded-md ${conversation.channel === 'whatsapp' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
            <ChannelIcon size={14} className="shrink-0" />
          </div>
          <span className="text-sm font-semibold text-white/90 truncate">
            {conversation.contact_name || "Sin nombre"}
          </span>
        </div>
        <Badge color={estado.color} bg={estado.bg} ring={estado.ring}>
          {estado.label}
        </Badge>
      </div>

      {/* Meta info */}
      <div className="flex items-center justify-between text-xs text-white/35 px-1">
        <span>{conversation.message_count} mensajes</span>
        <span>{formatDate(conversation.created_at)}</span>
      </div>

      {/* Botones de Acción */}
      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={handleActionClick}
          disabled={!actionLink}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
            actionLink 
              ? "bg-white/[0.03] border-white/10 text-white/80 hover:bg-white/10 hover:text-white" 
              : "bg-transparent border-white/[0.02] text-white/20 cursor-not-allowed"
          }`}
        >
          {actionText}
          {actionLink && <ExternalLink size={12} />}
        </button>
        
        <button
          onClick={handleResolveClick}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium bg-charcoal-800 border border-white/5 text-white/60 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-colors"
        >
          <CheckCircle2 size={12} />
          {actionLink ? "Marcar resuelto" : "Finalizar"}
        </button>
      </div>
    </motion.div>
  )
}