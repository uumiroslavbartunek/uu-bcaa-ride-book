import { eq } from 'drizzle-orm';
import { db } from '../db';
import { vehicles } from '../db/schema';

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;

export const vehicleDao = {
  async getAll(): Promise<Vehicle[]> {
    return db.select().from(vehicles);
  },

  async getById(id: string): Promise<Vehicle | null> {
    const rows = await db.select().from(vehicles).where(eq(vehicles.id, id));
    return rows[0] ?? null;
  },

  async create(data: NewVehicle): Promise<Vehicle> {
    const rows = await db.insert(vehicles).values(data).returning();
    return rows[0];
  },

  async update(id: string, data: Partial<NewVehicle>): Promise<Vehicle | null> {
    const rows = await db
      .update(vehicles)
      .set(data)
      .where(eq(vehicles.id, id))
      .returning();
    return rows[0] ?? null;
  },

  async delete(id: string): Promise<string | null> {
    const rows = await db
      .delete(vehicles)
      .where(eq(vehicles.id, id))
      .returning({ id: vehicles.id });
    return rows[0]?.id ?? null;
  },
};
