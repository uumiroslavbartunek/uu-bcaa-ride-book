import type { Vehicle, VehiclePayload } from '@/types'
import { apiFetch } from './client'

export function getVehicles() {
  return apiFetch<Vehicle[]>('/vehicles')
}

export function getVehicle(id: string) {
  return apiFetch<Vehicle>(`/vehicles/${id}`)
}

export function createVehicle(data: VehiclePayload) {
  return apiFetch<Vehicle>('/vehicles', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function updateVehicle(id: string, data: VehiclePayload) {
  return apiFetch<Vehicle>(`/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteVehicle(id: string) {
  return apiFetch<{ id: string }>(`/vehicles/${id}`, { method: 'DELETE' })
}
