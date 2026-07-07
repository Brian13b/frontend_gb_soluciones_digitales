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

    let interval = null
    let isVisible = true

    const handleVisibilityChange = () => {
      isVisible = !document.hidden
      if (isVisible && !window.__gb_modal_open) {
        fetchStats()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    if (isVisible && !window.__gb_modal_open) {
      interval = setInterval(() => {
        if (!document.hidden && !window.__gb_modal_open) {
          fetchStats()
        }
      }, 30000)
    }

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [fetchStats])
 
  return { stats, loading, refetch: fetchStats }
}