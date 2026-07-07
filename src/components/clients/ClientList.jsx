import { Users } from "lucide-react"
import ClientItem from "./ClientItem"
import EmptyState from "../ui/EmptyState"
import Spinner from "../ui/Spinner"

export default function ClientList({ clients, loading, selectedId, onSelect, onDelete }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner />
      </div>
    )
  }

  if (clients.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No hay clientes"
        description="Cargá el primer cliente manualmente o convierte una conversación."
      />
    )
  }

  return (
    <div className="space-y-2">
      {clients.map((client) => (
        <ClientItem
          key={client.id}
          client={client}
          active={selectedId === client.id}
          onClick={() => onSelect(client.id)}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
