import { useEffect, useState } from 'react'
import { getTrips, getTripsByVehicle } from '@/api/trips'
import { sortTripsByDateDesc } from '@/lib/stats'
import type { Trip } from '@/types'

export function useTrips(vehicleId?: string) {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadTrips() {
    setLoading(true)
    setError(null)
    try {
      const data = await (vehicleId ? getTripsByVehicle(vehicleId) : getTrips())
      setTrips(sortTripsByDateDesc(data))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTrips()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleId])

  return { trips, loading, error, refetch: loadTrips }
}
