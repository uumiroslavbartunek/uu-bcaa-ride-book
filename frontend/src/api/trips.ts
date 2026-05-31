import type { Trip, TripPayload } from '@/types'
import { apiFetch } from './client'

export function getTrips() {
  return apiFetch<Trip[]>('/trips')
}

export function getTripsByVehicle(vehicleId: string) {
  return apiFetch<Trip[]>(`/trips?vehicleId=${vehicleId}`)
}

export function createTrip(data: TripPayload) {
  return apiFetch<Trip>('/trips', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateTrip(id: string, data: TripPayload) {
  return apiFetch<Trip>(`/trips/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteTrip(id: string) {
  return apiFetch<{ id: string }>(`/trips/${id}`, { method: 'DELETE' })
}
