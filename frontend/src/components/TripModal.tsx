import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createTrip, updateTrip } from '@/api/trips'
import { toDatetimeLocal } from '@/lib/format'
import type { Trip, Vehicle } from '@/types'

interface TripModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trip?: Trip | null
  vehicles: Vehicle[]
  defaultVehicleId?: string
  onSaved: () => void
}

interface FormState {
  vehicleId: string
  departure: string
  destination: string
  departureTimestamp: string
  distance: string
}

export function TripModal({
  open,
  onOpenChange,
  trip,
  vehicles,
  defaultVehicleId,
  onSaved,
}: TripModalProps) {
  const [form, setForm] = useState<FormState>({
    vehicleId: '',
    departure: '',
    destination: '',
    departureTimestamp: '',
    distance: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    function reset() {
      setError(null)
      setForm({
        vehicleId: trip?.vehicleId ?? defaultVehicleId ?? '',
        departure: trip?.departure ?? '',
        destination: trip?.destination ?? '',
        departureTimestamp: trip ? toDatetimeLocal(trip.departureTimestamp) : '',
        distance: trip ? String(trip.distance) : '',
      })
    }

    reset()
  }, [open, trip, defaultVehicleId])

  function update(patch: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...patch }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!form.vehicleId) {
      setError('Please select a vehicle')
      return
    }
    setSubmitting(true)
    setError(null)

    try {
      const payload = {
        vehicleId: form.vehicleId,
        departure: form.departure.trim(),
        destination: form.destination.trim(),
        departureTimestamp: new Date(form.departureTimestamp).toISOString(),
        distance: Number(form.distance),
      }

      if (trip) {
        await updateTrip(trip.id, payload)
      } else {
        await createTrip(payload)
      }
      onSaved()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save trip')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !submitting && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{trip ? 'Edit trip' : 'Add trip'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="vehicle">Vehicle</Label>
            <Select value={form.vehicleId} onValueChange={(value) => update({ vehicleId: value })}>
              <SelectTrigger id="vehicle" className="w-full">
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {vehicle.registrationPlate} — {vehicle.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="departure">Departure</Label>
            <Input
              id="departure"
              value={form.departure}
              onChange={(e) => update({ departure: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              value={form.destination}
              onChange={(e) => update({ destination: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="departureTimestamp">Departure time</Label>
            <Input
              id="departureTimestamp"
              type="datetime-local"
              value={form.departureTimestamp}
              onChange={(e) => update({ departureTimestamp: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="distance">Distance (km)</Label>
            <Input
              id="distance"
              type="number"
              step="0.01"
              min="0"
              value={form.distance}
              onChange={(e) => update({ distance: e.target.value })}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
