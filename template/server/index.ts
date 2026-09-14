import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

try {
  process.loadEnvFile('.env.local');
} catch (error) {
  if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
    throw error;
  }
}

const serverEnvironmentSchema = z.object({
  HOST: z.string().default('127.0.0.1'),
  PORT: z.coerce.number().int().positive().default(3000),
});

const environment = serverEnvironmentSchema.parse(process.env);
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const clientDirectory = path.resolve(currentDirectory, '../dist');
const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use(express.static(clientDirectory, { index: false, maxAge: '1h' }));
app.get('/{*path}', (_request, response) => {
  response.sendFile(path.join(clientDirectory, 'index.html'));
});

app.listen(environment.PORT, environment.HOST, () => {
  console.log(`Server listening at http://${environment.HOST}:${environment.PORT}`);
});
