import { useEffect, useState } from 'react'
import { getVehicle } from '@/api/vehicles'
import type { Vehicle } from '@/types'

export function useVehicle(id: string) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getVehicle(id)
        if (active) setVehicle(data)
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
  }, [id, tick])

  return {
    vehicle,
    loading,
    error,
    refetch: () => setTick((t) => t + 1),
  }
}
