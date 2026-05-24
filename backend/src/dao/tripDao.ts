import { desc, eq } from 'drizzle-orm';
import { db } from '../db';
import { trips } from '../db/schema';

export type Trip = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;

export const tripDao = {
  async getAll(): Promise<Trip[]> {
    return db.select().from(trips);
  },

  async getAllByVehicleId(vehicleId: string): Promise<Trip[]> {
    return db
      .select()
      .from(trips)
      .where(eq(trips.vehicleId, vehicleId))
      .orderBy(desc(trips.departureTimestamp));
  },

  async getById(id: string): Promise<Trip | null> {
    const rows = await db.select().from(trips).where(eq(trips.id, id));
    return rows[0] ?? null;
  },

  async create(data: NewTrip): Promise<Trip> {
    const rows = await db.insert(trips).values(data).returning();
    return rows[0];
  },

  async update(id: string, data: Partial<NewTrip>): Promise<Trip | null> {
    const rows = await db
      .update(trips)
      .set(data)
      .where(eq(trips.id, id))
      .returning();
    return rows[0] ?? null;
  },

  async delete(id: string): Promise<string | null> {
    const rows = await db
      .delete(trips)
      .where(eq(trips.id, id))
      .returning({ id: trips.id });
    return rows[0]?.id ?? null;
  },
};
