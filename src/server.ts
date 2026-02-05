import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import config from './config/index.js';
import telegramRoutes from './routes/telegram.js';
import apiRoutes from './routes/api.js';
import { checkConnection } from './services/saleor-health.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from Vite build
app.use(express.static(join(__dirname, '../dist/public')));

// API routes
app.use('/api', apiRoutes);
app.use('/telegram', telegramRoutes);

// Health check endpoint
app.get('/api/health', async (_req: Request, res: Response) => {
  try {
    const saleorAvailable = await checkConnection();
    res.json({ saleor: saleorAvailable });
  } catch (error) {
    res.status(500).json({ saleor: false, error: 'Saleor API unavailable' });
  }
});

// Health check endpoint
app.get('/', (_req: Request, res: Response) => {
  res.send('Ready to serve...');
});

// Serve React app for all other routes
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(join(__dirname, '../dist/public/index.html'));
});

// Start server
app.listen(config.server.port, () => {
  console.log(`Server running on port ${config.server.port}`);
});

export default app;
