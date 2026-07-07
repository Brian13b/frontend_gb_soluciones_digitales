import { useState, useEffect, useCallback } from "react"
import { clientsService } from "../services/clients.service"

export function useClients() {
  const [tab, setTab] = useState("lead")
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(false)

  const statusFilter = tab === "lead" ? "lead" : "activo"

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      const data = await clientsService.list({ status: statusFilter, limit: 500 })
      setClients(data)
    } catch (err) {
      console.error(err)
      setClients([])
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { clients, loading, refetch, tab, setTab }
}
