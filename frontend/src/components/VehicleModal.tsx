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
import { createVehicle, updateVehicle } from '@/api/vehicles'
import { engineTypes, type EngineType, type Vehicle } from '@/types'

interface VehicleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vehicle?: Vehicle | null
  onSaved: () => void
}

interface FormState {
  registrationPlate: string
  name: string
  colour: string
  engineType: EngineType
  avgConsumption: string
}

const emptyForm: FormState = {
  registrationPlate: '',
  name: '',
  colour: '',
  engineType: 'petrol',
  avgConsumption: '',
}

export function VehicleModal({ open, onOpenChange, vehicle, onSaved }: VehicleModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    function reset() {
      setError(null)
      setForm(
        vehicle
          ? {
              registrationPlate: vehicle.registrationPlate,
              name: vehicle.name,
              colour: vehicle.colour,
              engineType: vehicle.engineType,
              avgConsumption: String(vehicle.avgConsumption),
            }
          : emptyForm,
      )
    }

    reset()
  }, [open, vehicle])

  function update(patch: Partial<FormState>) {
    setForm((prev) => ({ ...prev, ...patch }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const payload = {
        registrationPlate: form.registrationPlate.trim(),
        name: form.name.trim(),
        colour: form.colour.trim(),
        engineType: form.engineType,
        avgConsumption: Number(form.avgConsumption),
      }

      if (vehicle) {
        await updateVehicle(vehicle.id, payload)
      } else {
        await createVehicle(payload)
      }
      onSaved()
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save vehicle')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !submitting && onOpenChange(next)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{vehicle ? 'Edit vehicle' : 'Add vehicle'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="registrationPlate">Registration plate</Label>
            <Input
              id="registrationPlate"
              value={form.registrationPlate}
              onChange={(e) => update({ registrationPlate: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => update({ name: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="colour">Colour</Label>
            <Input
              id="colour"
              value={form.colour}
              onChange={(e) => update({ colour: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="engineType">Engine type</Label>
            <Select
              value={form.engineType}
              onValueChange={(value) => update({ engineType: value as EngineType })}
            >
              <SelectTrigger id="engineType" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {engineTypes.map((type) => (
                  <SelectItem key={type} value={type} className="capitalize">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="avgConsumption">Avg consumption (L/100km)</Label>
            <Input
              id="avgConsumption"
              type="number"
              step="0.01"
              min="0"
              value={form.avgConsumption}
              onChange={(e) => update({ avgConsumption: e.target.value })}
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
