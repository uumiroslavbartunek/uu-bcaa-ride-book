import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ColourSwatch } from './ColourSwatch'
import type { Vehicle } from '@/types'

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link to={`/vehicles/${vehicle.id}`} className="block">
      <Card className="gap-2 p-4 transition-colors hover:bg-accent">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-sm font-medium tracking-wide">
              {vehicle.registrationPlate}
            </p>
            <p className="truncate text-base font-semibold">{vehicle.name}</p>
          </div>
          <Badge variant="outline" className="capitalize">
            {vehicle.engineType}
          </Badge>
        </div>
        <ColourSwatch colour={vehicle.colour} />
      </Card>
    </Link>
  )
}
