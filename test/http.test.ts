import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createHttpApp } from '../src/transports/http.js';
import { fixtureProfile } from './fixtures/profile.fixture.js';
import { loadConfig } from '../src/config.js';

const app = createHttpApp(fixtureProfile, loadConfig({} as NodeJS.ProcessEnv));

describe('HTTP app', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('POST /mcp without a body still responds (does not crash the server)', async () => {
    const res = await request(app).post('/mcp').send({});
    expect([400, 406, 200]).toContain(res.status);
  });

  it('POST /mcp initialize returns the server info', async () => {
    const res = await request(app)
      .post('/mcp')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json, text/event-stream')
      .send({
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '2024-11-05',
          capabilities: {},
          clientInfo: { name: 'test', version: '1.0.0' },
        },
      });
    expect(res.status).toBe(200);
    expect(res.text).toContain('derekhuynen-mcp-server');
  });
});
