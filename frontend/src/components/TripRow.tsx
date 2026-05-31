import { ArrowRight, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatDate, formatDistance } from '@/lib/format'
import type { Trip } from '@/types'

interface TripRowProps {
  trip: Trip
  subtitle?: string
  onEdit: () => void
  onDelete: () => void
}

export function TripRow({ trip, subtitle, onEdit, onDelete }: TripRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border p-3">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 font-medium">
          <span className="truncate">{trip.departure}</span>
          <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
          <span className="truncate">{trip.destination}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDate(trip.departureTimestamp)}
          {subtitle && <span className="ml-2">· {subtitle}</span>}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <span className="text-sm tabular-nums text-muted-foreground">
          {formatDistance(trip.distance)}
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={onEdit} aria-label="Edit trip">
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onDelete}
            aria-label="Delete trip"
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  )
}
