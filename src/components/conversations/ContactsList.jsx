import { Copy, Check, Mail, MessageCircle } from "lucide-react"
import Badge from "../ui/Badge"

const VALIDATION_COLORS = {
  VERIFIED: { color: "text-emerald-400", bg: "bg-emerald-500/10", ring: "ring-emerald-500/20" },
  PENDING: { color: "text-yellow-400", bg: "bg-yellow-500/10", ring: "ring-yellow-500/20" },
}

export default function ContactsList({ contacts, copied, onCopy }) {
  if (!contacts || contacts.length === 0) {
    return null
  }

  const primaryContact = contacts.find(c => c.is_primary) || contacts[0]

  return (
    <div className="space-y-3">
      {contacts.map((contact) => {
        const validationState = VALIDATION_COLORS[contact.validation_status] || VALIDATION_COLORS.PENDING
        const isPrimary = contact.is_primary

        return (
          <div key={contact.id} className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white truncate">{contact.name}</span>
                  {isPrimary && (
                    <Badge color="text-white" bg="bg-gb-500/20" ring="ring-gb-500/30">
                      PRIMARY
                    </Badge>
                  )}
                </div>
                <Badge color={validationState.color} bg={validationState.bg} ring={validationState.ring}>
                  {contact.validation_status}
                </Badge>
              </div>
            </div>

            <div className="space-y-1.5">
              {contact.email && (
                <div className="flex items-center justify-between gap-3 px-2 py-1.5 rounded-lg bg-white/[0.02]">
                  <a
                    href={`mailto:${contact.email}`}
                    className="flex items-center gap-2 text-xs text-white/60 hover:text-gb-400 transition-colors truncate"
                  >
                    <Mail size={12} className="shrink-0" />
                    <span className="font-mono truncate">{contact.email}</span>
                  </a>
                  <button
                    onClick={() => onCopy(contact.email, `email-${contact.id}`)}
                    className="p-1 text-white/40 hover:text-white/80 transition-colors shrink-0"
                  >
                    {copied === `email-${contact.id}` ? (
                      <Check size={12} className="text-emerald-400" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
              )}

              {contact.phone && (
                <div className="flex items-center justify-between gap-3 px-2 py-1.5 rounded-lg bg-white/[0.02]">
                  <a
                    href={`https://wa.me/${contact.phone.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-white/60 hover:text-emerald-400 transition-colors truncate"
                  >
                    <MessageCircle size={12} className="shrink-0" />
                    <span className="font-mono truncate">{contact.phone}</span>
                  </a>
                  <button
                    onClick={() => onCopy(contact.phone, `phone-${contact.id}`)}
                    className="p-1 text-white/40 hover:text-white/80 transition-colors shrink-0"
                  >
                    {copied === `phone-${contact.id}` ? (
                      <Check size={12} className="text-emerald-400" />
                    ) : (
                      <Copy size={12} />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
