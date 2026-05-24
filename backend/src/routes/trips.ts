import { Router } from 'express';
import { z } from 'zod';
import { tripDao } from '../dao/tripDao';
import { vehicleDao } from '../dao/vehicleDao';
import { tripSchema } from '../validation';

const router = Router();

// GET /api/trips  and  GET /api/trips?vehicleId=:vehicleId
router.get('/', async (req, res) => {
  const { vehicleId } = req.query;
  const parsed = z.uuid().safeParse(vehicleId);
  if (parsed.success) {
    const filtered = await tripDao.getAllByVehicleId(parsed.data);
    res.json(filtered);
    return;
  }
  // Unknown / malformed vehicleId yields an empty result, not an error.
  if (vehicleId !== undefined) {
    res.json([]);
    return;
  }
  const all = await tripDao.getAll();
  res.json(all);
});

// GET /api/trips/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!z.uuid().safeParse(id).success) {
    res.status(404).json({ error: 'Trip not found' });
    return;
  }
  const trip = await tripDao.getById(id);
  if (!trip) {
    res.status(404).json({ error: 'Trip not found' });
    return;
  }
  res.json(trip);
});

// POST /api/trips
router.post('/', async (req, res) => {
  const data = tripSchema.parse(req.body);
  const vehicle = await vehicleDao.getById(data.vehicleId);
  if (!vehicle) {
    res.status(400).json({ error: 'vehicleId does not reference an existing vehicle' });
    return;
  }
  const created = await tripDao.create(data);
  res.status(201).json(created);
});

// PUT /api/trips/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (!z.uuid().safeParse(id).success) {
    res.status(404).json({ error: 'Trip not found' });
    return;
  }
  const data = tripSchema.parse(req.body);
  const vehicle = await vehicleDao.getById(data.vehicleId);
  if (!vehicle) {
    res.status(400).json({ error: 'vehicleId does not reference an existing vehicle' });
    return;
  }
  const updated = await tripDao.update(id, data);
  if (!updated) {
    res.status(404).json({ error: 'Trip not found' });
    return;
  }
  res.json(updated);
});

// DELETE /api/trips/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!z.uuid().safeParse(id).success) {
    res.status(404).json({ error: 'Trip not found' });
    return;
  }
  const deletedId = await tripDao.delete(id);
  if (!deletedId) {
    res.status(404).json({ error: 'Trip not found' });
    return;
  }
  res.json({ id: deletedId });
});

export default router;
