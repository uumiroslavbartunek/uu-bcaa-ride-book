import { describe, expect, it } from 'vitest'
import { computeVehicleStats, estimateFuelCost, sortTripsByDateDesc } from './stats'
import type { Trip } from '@/types'

function trip(id: string, departureTimestamp: string, distance: number): Trip {
  return {
    id,
    vehicleId: 'v1',
    departure: 'A',
    destination: 'B',
    departureTimestamp,
    distance,
  }
}

describe('sortTripsByDateDesc', () => {
  it('orders trips newest first', () => {
    const trips = [
      trip('a', '2024-01-01T08:00:00.000Z', 10),
      trip('b', '2024-03-01T08:00:00.000Z', 10),
      trip('c', '2024-02-01T08:00:00.000Z', 10),
    ]
    expect(sortTripsByDateDesc(trips).map((t) => t.id)).toEqual(['b', 'c', 'a'])
  })

  it('does not mutate the input array', () => {
    const trips = [
      trip('a', '2024-01-01T08:00:00.000Z', 10),
      trip('b', '2024-03-01T08:00:00.000Z', 10),
    ]
    sortTripsByDateDesc(trips)
    expect(trips.map((t) => t.id)).toEqual(['a', 'b'])
  })
})

describe('computeVehicleStats', () => {
  it('sums distance and derives litres from consumption', () => {
    const trips = [trip('a', '2024-01-01T08:00:00.000Z', 100), trip('b', '2024-01-02T08:00:00.000Z', 150)]
    expect(computeVehicleStats(trips, 6)).toEqual({ totalKm: 250, litres: 15 })
  })

  it('returns zeros for no trips', () => {
    expect(computeVehicleStats([], 6)).toEqual({ totalKm: 0, litres: 0 })
  })
})

describe('estimateFuelCost', () => {
  it('multiplies litres by price', () => {
    expect(estimateFuelCost(15, 1.6)).toBeCloseTo(24)
  })
})
