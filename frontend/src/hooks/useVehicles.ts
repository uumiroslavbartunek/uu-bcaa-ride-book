import { useEffect, useState } from 'react'
import { getVehicles } from '@/api/vehicles'
import type { Vehicle } from '@/types'

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadVehicles() {
    setLoading(true)
    setError(null)
    try {
      const data = await getVehicles()
      setVehicles(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVehicles()
  }, [])

  return { vehicles, loading, error, refetch: loadVehicles }
}
