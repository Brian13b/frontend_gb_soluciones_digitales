import { useState, useEffect, useCallback } from "react"
import { conversationsService } from "../services/conversations.service"
 
export function useConversations(filters) {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
 
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true)
      const data = await conversationsService.list(filters)
      setConversations(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)])
 
  useEffect(() => {
    fetchConversations()

    let interval = null
    let isVisible = true

    const handleVisibilityChange = () => {
      isVisible = !document.hidden
      if (isVisible && !window.__gb_modal_open) {
        fetchConversations()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)

    if (isVisible && !window.__gb_modal_open) {
      interval = setInterval(() => {
        if (!document.hidden && !window.__gb_modal_open) {
          fetchConversations()
        }
      }, 30000)
    }

    return () => {
      clearInterval(interval)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [fetchConversations])
 
  return { conversations, loading, error, refetch: fetchConversations }
}