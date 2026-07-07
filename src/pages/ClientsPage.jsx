import { useState } from "react"
import AppShell from "../components/layout/AppShell"
import ClientList from "../components/clients/ClientList"
import ClientDetail from "../components/clients/ClientDetail"
import ClientModal from "../components/clients/ClientModal"
import { useClients } from "../hooks/useClients"
import Button from "../components/ui/Button"
import { Plus } from "lucide-react"

export default function ClientsPage() {
  const [selectedId, setSelectedId] = useState(null)
  const [clientModalOpen, setClientModalOpen] = useState(false)

  const { clients, loading, refetch, tab, setTab } = useClients()

  const handleClientCreated = () => {
    refetch()
  }

  const handleClientDeleted = () => {
    setSelectedId(null)
    refetch()
  }

  return (
    <AppShell>
      <div className="flex h-full min-h-0 relative overflow-hidden">
        <div
          className={`
            w-full md:w-[380px] shrink-0 border-r border-white/[0.06] flex-col h-full bg-charcoal-950 md:bg-transparent
            ${selectedId ? "hidden md:flex" : "flex"}
          `}
        >
          <div className="px-6 pt-8 pb-4">
            <h1 className="text-lg font-bold text-white mb-1">Clientes</h1>
            <p className="text-xs text-white/35 mb-5">{clients.length} en total</p>
            <Button
              size="sm"
              onClick={() => setClientModalOpen(true)}
              className="w-full mb-5"
            >
              <Plus size={16} />
              Nuevo
            </Button>
            <div className="flex gap-2">
              <button
                onClick={() => setTab("lead")}
                className={`
                  flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
                  ${tab === "lead"
                    ? "bg-gb-500/20 border border-gb-500/30 text-white"
                    : "bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white/80"
                  }
                `}
              >
                En conversación
              </button>
              <button
                onClick={() => setTab("activo")}
                className={`
                  flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200
                  ${tab === "activo"
                    ? "bg-gb-500/20 border border-gb-500/30 text-white"
                    : "bg-white/[0.05] border border-white/[0.08] text-white/60 hover:text-white/80"
                  }
                `}
              >
                Con proyecto
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-6 scrollbar-none">
            <ClientList
              clients={clients}
              loading={loading}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onDelete={handleClientDeleted}
            />
          </div>
        </div>

        <div
          className={`
            flex-1 min-w-0 flex-col h-full bg-charcoal-950 md:bg-transparent
            ${!selectedId ? "hidden md:flex" : "flex"}
          `}
        >
          <ClientDetail
            clientId={selectedId}
            onStatusChanged={refetch}
            onBack={() => setSelectedId(null)}
          />
        </div>

      </div>

      <ClientModal
        isOpen={clientModalOpen}
        onClose={() => setClientModalOpen(false)}
        onSuccess={handleClientCreated}
      />
    </AppShell>
  )
}
