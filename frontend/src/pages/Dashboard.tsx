import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VehicleCard } from '@/components/VehicleCard'
import { TripRow } from '@/components/TripRow'
import { VehicleModal } from '@/components/VehicleModal'
import { TripModal } from '@/components/TripModal'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Loading, ErrorState, EmptyState } from '@/components/StateViews'
import { useVehicles } from '@/hooks/useVehicles'
import { useTrips } from '@/hooks/useTrips'
import { deleteTrip } from '@/api/trips'
import type { Trip } from '@/types'

export function Dashboard() {
  const vehiclesState = useVehicles()
  const tripsState = useTrips()

  const [vehicleModalOpen, setVehicleModalOpen] = useState(false)
  const [tripModalOpen, setTripModalOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [deletingTrip, setDeletingTrip] = useState<Trip | null>(null)

  const vehicleLabels = useMemo(() => {
    const map = new Map<string, string>()
    for (const v of vehiclesState.vehicles) {
      map.set(v.id, `${v.registrationPlate} · ${v.name}`)
    }
    return map
  }, [vehiclesState.vehicles])

  function openAddTrip() {
    setEditingTrip(null)
    setTripModalOpen(true)
  }

  function openEditTrip(trip: Trip) {
    setEditingTrip(trip)
    setTripModalOpen(true)
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Vehicles</h2>
          <Button size="sm" onClick={() => setVehicleModalOpen(true)}>
            <Plus />
            Add vehicle
          </Button>
        </div>
        {vehiclesState.loading ? (
          <Loading label="Loading vehicles…" />
        ) : vehiclesState.error ? (
          <ErrorState message={vehiclesState.error} onRetry={vehiclesState.refetch} />
        ) : vehiclesState.vehicles.length === 0 ? (
          <EmptyState>No vehicles yet. Add your first one.</EmptyState>
        ) : (
          <div className="flex flex-col gap-3">
            {vehiclesState.vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Trips</h2>
          <Button
            size="sm"
            onClick={openAddTrip}
            disabled={vehiclesState.vehicles.length === 0}
          >
            <Plus />
            Add trip
          </Button>
        </div>
        {tripsState.loading ? (
          <Loading label="Loading trips…" />
        ) : tripsState.error ? (
          <ErrorState message={tripsState.error} onRetry={tripsState.refetch} />
        ) : tripsState.trips.length === 0 ? (
          <EmptyState>No trips yet.</EmptyState>
        ) : (
          <div className="flex flex-col gap-3">
            {tripsState.trips.map((trip) => (
              <TripRow
                key={trip.id}
                trip={trip}
                subtitle={vehicleLabels.get(trip.vehicleId)}
                onEdit={() => openEditTrip(trip)}
                onDelete={() => setDeletingTrip(trip)}
              />
            ))}
          </div>
        )}
      </section>

      <VehicleModal
        open={vehicleModalOpen}
        onOpenChange={setVehicleModalOpen}
        onSaved={vehiclesState.refetch}
      />

      <TripModal
        open={tripModalOpen}
        onOpenChange={setTripModalOpen}
        trip={editingTrip}
        vehicles={vehiclesState.vehicles}
        onSaved={tripsState.refetch}
      />

      <ConfirmDialog
        open={deletingTrip !== null}
        onOpenChange={(open) => !open && setDeletingTrip(null)}
        title="Delete trip"
        description={
          deletingTrip
            ? `Delete the trip from ${deletingTrip.departure} to ${deletingTrip.destination}? This cannot be undone.`
            : ''
        }
        onConfirm={async () => {
          if (!deletingTrip) return
          await deleteTrip(deletingTrip.id)
          setDeletingTrip(null)
          tripsState.refetch()
        }}
      />
    </div>
  )
}
