import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import { z } from 'zod';
import vehiclesRouter from './routes/vehicles';
import tripsRouter from './routes/trips';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/vehicles', vehiclesRouter);
app.use('/api/trips', tripsRouter);

// Unknown route -> 404.
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler. Express 5 forwards rejected async handlers here.
app.use(
  (err: Error & { type?: string }, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: z.prettifyError(err) });
      return;
    }
    if (err.type === 'entity.parse.failed') {
      res.status(400).json({ error: 'Invalid JSON in request body' });
      return;
    }
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  },
);

app.listen(3000, () => {
  console.log(`RideBook backend listening on http://localhost:${3000}`);
});
