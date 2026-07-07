import { useState, useEffect, useCallback } from "react"
import { projectsService } from "../services/projects.service"

export function useProjects(filters = {}) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(false)

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      const data = await projectsService.list({ limit: 500, ...filters })
      setProjects(data)
    } catch (err) {
      console.error(err)
      setProjects([])
    } finally {
      setLoading(false)
    }
  }, [JSON.stringify(filters)])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { projects, loading, refetch }
}
