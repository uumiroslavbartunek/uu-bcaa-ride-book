export type EngineType = 'petrol' | 'diesel' | 'electric' | 'hybrid'

export const engineTypes: EngineType[] = ['petrol', 'diesel', 'electric', 'hybrid']

export interface Vehicle {
  id: string
  registrationPlate: string
  name: string
  colour: string
  engineType: EngineType
  avgConsumption: number
}

export interface Trip {
  id: string
  vehicleId: string
  departure: string
  destination: string
  departureTimestamp: string
  distance: number
}

export type VehiclePayload = Omit<Vehicle, 'id'>
export type TripPayload = Omit<Trip, 'id'>
