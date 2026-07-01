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
    const interval = setInterval(fetchConversations, 30000)
    return () => clearInterval(interval)
  }, [fetchConversations])
 
  return { conversations, loading, error, refetch: fetchConversations }
}