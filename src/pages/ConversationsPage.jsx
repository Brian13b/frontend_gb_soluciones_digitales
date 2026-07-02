import { useState } from "react"
import AppShell from "../components/layout/AppShell"
import ConversationList from "../components/conversations/ConversationList"
import ConversationDetail from "../components/conversations/ConversationDetail"
import FiltersBar from "../components/conversations/FiltersBar"
import { useConversations } from "../hooks/useConversations"
import { conversationsService } from "../services/conversations.service"

export default function ConversationsPage() {
  const [estado, setEstado] = useState(null)
  const [canal, setCanal] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  const { conversations, loading, refetch } = useConversations({ estado, channel: canal })

  return (
    <AppShell>
      <div className="flex h-full min-h-0 relative overflow-hidden">
        <div className="w-[380px] shrink-0 border-r border-white/[0.06] flex flex-col h-screen overflow-hidden">
          <div className="shrink-0 px-6 pt-8 pb-2">
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
          <div className="flex-1 min-h-0 overflow-y-auto px-4 pb-6">
            <ConversationList
              conversations={conversations}
              loading={loading}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onStatusChange={async (id, nuevoEstado) => {
                await conversationsService.updateEstado(id, nuevoEstado)
                refetch()
              }}
            />
          </div>
        </div>

        <div 
          className={`
            flex-1 min-w-0 flex-col h-full bg-charcoal-950 md:bg-transparent
            ${!selectedId ? "hidden md:flex" : "flex"}
          `}
        >
          <ConversationDetail 
            conversationId={selectedId} 
            onStatusChanged={refetch}
            onBack={() => setSelectedId(null)} 
          />
        </div>
        
      </div>
    </AppShell>
  )
}