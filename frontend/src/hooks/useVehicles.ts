import { useEffect, useState } from 'react'
import { getVehicles } from '@/api/vehicles'
import type { Vehicle } from '@/types'

export function useVehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getVehicles()
        if (active) setVehicles(data)
      } catch (err) {
        if (active) setError((err as Error).message)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [tick])

  return {
    vehicles,
    loading,
    error,
    refetch: () => setTick((t) => t + 1),
  }
}
