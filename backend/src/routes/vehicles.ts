import { Router } from 'express';
import { z } from 'zod';
import { vehicleDao } from '../dao/vehicleDao';
import { vehicleSchema } from '../validation';

const router = Router();

// GET /api/vehicles
router.get('/', async (_req, res) => {
  const all = await vehicleDao.getAll();
  res.json(all);
});

// GET /api/vehicles/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!z.uuid().safeParse(id).success) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }
  const vehicle = await vehicleDao.getById(id);
  if (!vehicle) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }
  res.json(vehicle);
});

// POST /api/vehicles
router.post('/', async (req, res) => {
  const data = vehicleSchema.parse(req.body);
  const created = await vehicleDao.create(data);
  res.status(201).json(created);
});

// PUT /api/vehicles/:id
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  if (!z.uuid().safeParse(id).success) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }
  const data = vehicleSchema.parse(req.body);
  const updated = await vehicleDao.update(id, data);
  if (!updated) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }
  res.json(updated);
});

// DELETE /api/vehicles/:id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!z.uuid().safeParse(id).success) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }
  const deletedId = await vehicleDao.delete(id);
  if (!deletedId) {
    res.status(404).json({ error: 'Vehicle not found' });
    return;
  }
  res.json({ id: deletedId });
});

export default router;
