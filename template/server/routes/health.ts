import { Router } from 'express';

/** Infrastructure routes used by deployment health checks. */
export const healthRouter = Router();

healthRouter.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});
