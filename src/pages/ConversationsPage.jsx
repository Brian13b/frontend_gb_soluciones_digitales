import { useState } from "react"
import AppShell from "../components/layout/AppShell"
import ConversationList from "../components/conversations/ConversationList"
import ConversationDetail from "../components/conversations/ConversationDetail"
import FiltersBar from "../components/conversations/FiltersBar"
import { useConversations } from "../hooks/useConversations"
 
export default function ConversationsPage() {
  const [estado, setEstado] = useState(null)
  const [canal, setCanal] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
 
  const { conversations, loading, refetch } = useConversations({ estado, channel: canal })
 
  return (
    <AppShell>
      <div className="flex h-screen">
        <div className="w-[380px] shrink-0 border-r border-white/[0.06] flex flex-col">
          <div className="px-6 pt-8 pb-2">
            <h1 className="text-lg font-bold text-white mb-1">Conversaciones</h1>
            <p className="text-xs text-white/35 mb-5">{conversations.length} en total</p>
            <FiltersBar
              estado={estado}
              canal={canal}
              onEstadoChange={setEstado}
              onCanalChange={setCanal}
              onClear={() => {
                setEstado(null)
                setCanal(null)
              }}
            />
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-6">
            <ConversationList
              conversations={conversations}
              loading={loading}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>
        </div>
 
        <div className="flex-1 min-w-0">
          <ConversationDetail conversationId={selectedId} onStatusChanged={refetch} />
        </div>
      </div>
    </AppShell>
  )
}