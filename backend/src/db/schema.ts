import { pgTable, pgEnum, uuid, text, numeric, timestamp } from 'drizzle-orm/pg-core';
import { engineTypeEnumValues } from './constants';

export const engineTypeEnum = pgEnum('engine_type', engineTypeEnumValues);

export const vehicles = pgTable('vehicles', {
  id: uuid('id').primaryKey().defaultRandom(),
  registrationPlate: text('registration_plate').notNull(),
  name: text('name').notNull(),
  colour: text('colour').notNull(),
  engineType: engineTypeEnum('engine_type').notNull(),
  avgConsumption: numeric('avg_consumption', {
    precision: 6,
    scale: 2,
    mode: 'number',
  }).notNull(),
});

export const trips = pgTable('trips', {
  id: uuid('id').primaryKey().defaultRandom(),
  vehicleId: uuid('vehicle_id')
    .notNull()
    .references(() => vehicles.id, { onDelete: 'cascade' }),
  departure: text('departure').notNull(),
  destination: text('destination').notNull(),
  departureTimestamp: timestamp('departure_timestamp', { mode: 'date' }).notNull(),
  distance: numeric('distance', {
    precision: 10,
    scale: 2,
    mode: 'number',
  }).notNull(),
});
