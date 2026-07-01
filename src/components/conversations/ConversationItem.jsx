import { motion } from "framer-motion"
import { Globe, MessageCircle } from "lucide-react"
import Badge from "../ui/Badge"
import { ESTADOS } from "../../utils/constants"
import { formatDate } from "../../utils/formatters"
 
const VALIDATION_COLORS = {
  VERIFIED: { color: "text-emerald-400", label: "Verificado" },
  PENDING: { color: "text-yellow-400", label: "Pendiente" },
}

export default function ConversationItem({ conversation, active, onClick }) {
  const estado = ESTADOS[conversation.estado] || ESTADOS.abierta
  const ChannelIcon = conversation.channel === "whatsapp" ? MessageCircle : Globe

  const primaryContact = conversation.contacts?.find(c => c.is_primary) || conversation.contacts?.[0]
  const validationState = primaryContact ? VALIDATION_COLORS[primaryContact.validation_status] : null
  const contactDisplay = primaryContact?.email || primaryContact?.phone || null

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`w-full text-left p-4 rounded-xl border transition-colors duration-200 ${
        active
          ? "bg-gb-500/10 border-gb-500/30"
          : "bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04] hover:border-white/10"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <ChannelIcon size={14} className="text-white/35 shrink-0" />
          <span className="text-sm font-semibold text-white/90 truncate">
            {conversation.contact_name || "Sin nombre"}
          </span>
        </div>
        <Badge color={estado.color} bg={estado.bg} ring={estado.ring}>
          {estado.label}
        </Badge>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-white/35">
          <span>{conversation.message_count} mensajes</span>
          <span>{formatDate(conversation.created_at)}</span>
        </div>
        {contactDisplay && (
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-white/50 font-mono truncate">{contactDisplay}</span>
            {validationState && (
              <span className={`text-xs font-semibold ${validationState.color}`}>
                {validationState.label}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.button>
  )
}