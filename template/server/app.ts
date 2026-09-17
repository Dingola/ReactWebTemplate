import compression from 'compression';
import express, { type Express } from 'express';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { healthRouter } from './routes/health.js';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultClientDirectory = path.resolve(currentDirectory, '../dist');

/** Options used to construct the Express application. */
export type CreateAppOptions = {
  /** Directory containing the built client application. */
  clientDirectory?: string;
};

/**
 * Creates the configured Express application without opening a network port.
 *
 * Keeping construction separate from the server bootstrap allows tests and other
 * runtimes to instantiate the application without triggering `listen`.
 */
export function createApp({
  clientDirectory = defaultClientDirectory,
}: CreateAppOptions = {}): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: '100kb' }));

  app.use('/api', healthRouter);
  app.use('/api', (_request, response) => {
    response.status(404).json({ error: 'Not found' });
  });

  app.use(express.static(clientDirectory, { index: false, maxAge: '1h' }));
  app.get('/{*path}', (_request, response) => {
    response.sendFile(path.join(clientDirectory, 'index.html'));
  });

  return app;
}
