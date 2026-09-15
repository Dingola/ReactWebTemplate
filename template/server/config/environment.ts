import { z } from 'zod';

const serverEnvironmentSchema = z.object({
  HOST: z.string().default('127.0.0.1'),
  PORT: z.coerce.number().int().positive().default(3000),
});

/** Validated configuration required to start the HTTP server. */
export type ServerEnvironment = z.infer<typeof serverEnvironmentSchema>;

/**
 * Loads optional local values and validates the server environment.
 *
 * Missing `.env.local` files are ignored because every included variable has a safe
 * development default. Other file-system and validation errors remain fatal.
 */
export function loadServerEnvironment(): ServerEnvironment {
  try {
    process.loadEnvFile('.env.local');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }

  return serverEnvironmentSchema.parse(process.env);
}
