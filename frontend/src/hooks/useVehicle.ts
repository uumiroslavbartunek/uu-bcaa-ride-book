import { useEffect, useState } from 'react'
import { getVehicle } from '@/api/vehicles'
import type { Vehicle } from '@/types'

export function useVehicle(id: string) {
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadVehicle() {
    setLoading(true)
    setError(null)
    try {
      const data = await getVehicle(id)
      setVehicle(data)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVehicle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return { vehicle, loading, error, refetch: loadVehicle }
}
