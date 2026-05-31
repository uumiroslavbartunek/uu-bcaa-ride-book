import type { Trip } from '@/types'

export function sortTripsByDateDesc(trips: Trip[]): Trip[] {
  return [...trips].sort(
    (a, b) =>
      new Date(b.departureTimestamp).getTime() - new Date(a.departureTimestamp).getTime(),
  )
}

export interface VehicleStats {
  totalKm: number
  litres: number
}

export function computeVehicleStats(trips: Trip[], avgConsumption: number): VehicleStats {
  const totalKm = trips.reduce((sum, trip) => sum + trip.distance, 0)
  const litres = (totalKm * avgConsumption) / 100
  return { totalKm, litres }
}

export function estimateFuelCost(litres: number, pricePerLitre: number): number {
  return litres * pricePerLitre
}
