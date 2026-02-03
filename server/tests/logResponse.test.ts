import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

describe('POST /api/log-response', () => {
  it('logs a valid success outcome', async () => {
    const res = await request(app)
      .post('/api/log-response')
      .send({ category: 'general', outcome: 'success', responseTimeMs: 123, model: 'unit-test' })
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true });
  });

  it('rejects invalid outcome', async () => {
    const res = await request(app)
      .post('/api/log-response')
      .send({ category: 'general', outcome: 'bad' })
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('rejects missing category', async () => {
    const res = await request(app)
      .post('/api/log-response')
      // @ts-expect-error: testing invalid payload
      .send({ outcome: 'success' })
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
