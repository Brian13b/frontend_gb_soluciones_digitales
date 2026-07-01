import { useState, useEffect, useCallback } from "react"
import { conversationsService } from "../services/conversations.service"
 
export function useStats() {
  const [stats, setStats] = useState({ open: 0, contacted: 0, closed: 0, total_conversations: 0 })
  const [loading, setLoading] = useState(true)
 
  const fetchStats = useCallback(async () => {
    try {
      const data = await conversationsService.getStats()
      setStats(data)
    } catch {
      // silencioso: no bloquea el resto del panel
    } finally {
      setLoading(false)
    }
  }, [])
 
  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [fetchStats])
 
  return { stats, loading, refetch: fetchStats }
}