import Select from "../ui/Select"
import Button from "../ui/Button"

export default function FiltersBar({ estado, canal, onEstadoChange, onCanalChange, onClear }) {
  return (
    <div className="flex flex-col gap-3 mb-5">
      <div className="flex gap-3">
        <div className="flex-1 min-w-0">
          <Select value={estado || ""} onChange={(e) => onEstadoChange(e.target.value || null)}>
            <option value="">Todos los estados</option>
            <option value="ABIERTA">Pendientes</option>
            <option value="CONTACTADA">Contactadas</option>
            <option value="FINALIZADA">Finalizadas</option>
          </Select>
        </div>
        <div className="flex-1 min-w-0">
          <Select value={canal || ""} onChange={(e) => onCanalChange(e.target.value || null)}>
            <option value="">Todos los canales</option>
            <option value="web">Sitio Web</option>
            <option value="whatsapp">WhatsApp</option>
          </Select>
        </div>
      </div>
      {(estado || canal) && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}