// @vitest-environment node

import { once } from 'node:events';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { createApp } from './app.js';

describe('Express application', () => {
  let baseUrl = '';
  let clientDirectory = '';
  let server: Server | undefined;

  beforeAll(async () => {
    clientDirectory = await mkdtemp(path.join(tmpdir(), 'react-web-template-'));
    await writeFile(
      path.join(clientDirectory, 'index.html'),
      '<!doctype html><html><body>Client application</body></html>',
      'utf8',
    );

    server = createApp({ clientDirectory }).listen(0, '127.0.0.1');
    await once(server, 'listening');

    const address = server.address() as AddressInfo;
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    if (server) {
      const activeServer = server;
      await new Promise<void>((resolve, reject) => {
        activeServer.close((error) => (error ? reject(error) : resolve()));
      });
    }

    if (clientDirectory) {
      await rm(clientDirectory, { recursive: true, force: true });
    }
  });

  it('reports service health with security headers', async () => {
    const response = await fetch(`${baseUrl}/api/health`);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: 'ok' });
    expect(response.headers.get('content-security-policy')).toBeTruthy();
    expect(response.headers.get('x-powered-by')).toBeNull();
  });

  it('returns JSON for unknown API routes', async () => {
    const response = await fetch(`${baseUrl}/api/missing`);

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({ error: 'Not found' });
  });

  it('serves the client application for browser routes', async () => {
    const response = await fetch(`${baseUrl}/settings/profile`);

    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toContain('Client application');
  });
});
