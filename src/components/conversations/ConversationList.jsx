import { MessagesSquare } from "lucide-react"
import ConversationItem from "./ConversationItem"
import EmptyState from "../ui/EmptyState"
import Spinner from "../ui/Spinner"
 
export default function ConversationList({ conversations, loading, selectedId, onSelect }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    )
  }
 
  if (conversations.length === 0) {
    return (
      <EmptyState
        icon={MessagesSquare}
        title="No hay conversaciones"
        description="Cuando alguien escriba desde el sitio o WhatsApp, aparecerá acá."
      />
    )
  }
 
  return (
    <div className="space-y-2">
      {conversations.map((conv) => (
        <ConversationItem
          key={conv.id}
          conversation={conv}
          active={selectedId === conv.id}
          onClick={() => onSelect(conv.id)}
        />
      ))}
    </div>
  )
}