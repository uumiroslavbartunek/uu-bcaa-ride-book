import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ColourSwatch } from '@/components/ColourSwatch'
import { TripRow } from '@/components/TripRow'
import { VehicleModal } from '@/components/VehicleModal'
import { TripModal } from '@/components/TripModal'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { Loading, ErrorState, EmptyState } from '@/components/StateViews'
import { useVehicle } from '@/hooks/useVehicle'
import { useVehicles } from '@/hooks/useVehicles'
import { useTrips } from '@/hooks/useTrips'
import { deleteTrip } from '@/api/trips'
import { deleteVehicle } from '@/api/vehicles'
import { computeVehicleStats, estimateFuelCost } from '@/lib/stats'
import { formatNumber } from '@/lib/format'
import type { Trip } from '@/types'

export function VehicleDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()

  const { vehicle, loading, error, refetch } = useVehicle(id)
  const tripsState = useTrips(id)
  const vehiclesState = useVehicles()

  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [tripModalOpen, setTripModalOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null)
  const [deletingTrip, setDeletingTrip] = useState<Trip | null>(null)
  const [fuelPrice, setFuelPrice] = useState('')

  const stats = useMemo(
    () => computeVehicleStats(tripsState.trips, vehicle?.avgConsumption ?? 0),
    [tripsState.trips, vehicle?.avgConsumption],
  )

  const price = Number(fuelPrice)
  const showCost = fuelPrice !== '' && !Number.isNaN(price)
  const estimatedCost = estimateFuelCost(stats.litres, price)

  if (loading) return <Loading label="Loading vehicle…" />
  if (error) return <ErrorState message={error} onRetry={refetch} />
  if (!vehicle) return <ErrorState message="Vehicle not found." />

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <ArrowLeft />
            Back
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-mono text-sm font-medium tracking-wide text-muted-foreground">
                {vehicle.registrationPlate}
              </p>
              <CardTitle className="text-2xl">{vehicle.name}</CardTitle>
            </div>
            <Badge variant="outline" className="capitalize">
              {vehicle.engineType}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Colour</span>
            <ColourSwatch colour={vehicle.colour} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-muted-foreground">Avg consumption</span>
            <span>{formatNumber(vehicle.avgConsumption, 2)} L/100km</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-3">
          <Stat label="Total distance" value={`${formatNumber(stats.totalKm, 1)} km`} />
          <Stat label="Litres consumed" value={`${formatNumber(stats.litres, 1)} L`} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="fuelPrice">Fuel price (per L)</Label>
            <Input
              id="fuelPrice"
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g. 1.65"
              value={fuelPrice}
              onChange={(e) => setFuelPrice(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Estimated cost:{' '}
              <span className="font-medium text-foreground">
                {showCost ? formatNumber(estimatedCost, 2) : '—'}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Trips</h2>
          <Button
            size="sm"
            onClick={() => {
              setEditingTrip(null)
              setTripModalOpen(true)
            }}
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
          <EmptyState>No trips for this vehicle yet.</EmptyState>
        ) : (
          <div className="flex flex-col gap-3">
            {tripsState.trips.map((trip) => (
              <TripRow
                key={trip.id}
                trip={trip}
                onEdit={() => {
                  setEditingTrip(trip)
                  setTripModalOpen(true)
                }}
                onDelete={() => setDeletingTrip(trip)}
              />
            ))}
          </div>
        )}
      </section>

      <VehicleModal
        open={editOpen}
        onOpenChange={setEditOpen}
        vehicle={vehicle}
        onSaved={refetch}
      />

      <TripModal
        open={tripModalOpen}
        onOpenChange={setTripModalOpen}
        trip={editingTrip}
        vehicles={vehiclesState.vehicles}
        defaultVehicleId={vehicle.id}
        onSaved={tripsState.refetch}
      />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete vehicle"
        description={`Delete ${vehicle.name} (${vehicle.registrationPlate})? All of its trips will be removed too. This cannot be undone.`}
        onConfirm={async () => {
          await deleteVehicle(vehicle.id)
          navigate('/')
        }}
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

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-xl font-semibold tabular-nums">{value}</span>
    </div>
  )
}
