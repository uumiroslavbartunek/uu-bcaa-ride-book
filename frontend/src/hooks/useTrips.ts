import { useEffect, useState } from 'react'
import { getTrips, getTripsByVehicle } from '@/api/trips'
import { sortTripsByDateDesc } from '@/lib/stats'
import type { Trip } from '@/types'

export function useTrips(vehicleId?: string) {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let active = true

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await (vehicleId ? getTripsByVehicle(vehicleId) : getTrips())
        if (active) setTrips(sortTripsByDateDesc(data))
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
  }, [vehicleId, tick])

  return {
    trips,
    loading,
    error,
    refetch: () => setTick((t) => t + 1),
  }
}
