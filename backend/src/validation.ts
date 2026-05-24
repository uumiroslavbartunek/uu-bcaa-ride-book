import { z } from 'zod';
import { engineTypeEnumValues } from './db/constants';

export const vehicleSchema = z.object({
  registrationPlate: z.string(),
  name: z.string(),
  colour: z.string(),
  engineType: z.enum(engineTypeEnumValues),
  avgConsumption: z.number(),
});

export const tripSchema = z.object({
  vehicleId: z.uuid(),
  departure: z.string(),
  destination: z.string(),
  departureTimestamp: z.coerce.date(),
  distance: z.number(),
});
