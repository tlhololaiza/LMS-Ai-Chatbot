import express from 'express';
import cors from 'cors';
import { logQuery, logResponseOutcome } from './logger.js';

export const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/log-query', (req: express.Request, res: express.Response) => {
  const { query, category } = req.body ?? {};
  if (typeof query !== 'string' || typeof category !== 'string') {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  logQuery(query, category);
  return res.status(200).json({ success: true });
});

// Log chatbot response outcome (success/failure) with optional metadata
app.post('/api/log-response', (req: express.Request, res: express.Response) => {
  const { queryId, category, outcome, responseTimeMs, model, error } = req.body ?? {};

  // Basic validation
  if (typeof category !== 'string' || !category.trim()) {
    return res.status(400).json({ error: 'Invalid "category"' });
  }
  if (typeof outcome !== 'string' || !['success', 'failure'].includes(outcome)) {
    return res.status(400).json({ error: 'Invalid "outcome" (use "success" or "failure")' });
  }
  if (queryId !== undefined && typeof queryId !== 'string') {
    return res.status(400).json({ error: 'Invalid "queryId"' });
  }
  if (responseTimeMs !== undefined && typeof responseTimeMs !== 'number') {
    return res.status(400).json({ error: 'Invalid "responseTimeMs"' });
  }
  if (model !== undefined && typeof model !== 'string') {
    return res.status(400).json({ error: 'Invalid "model"' });
  }
  if (error !== undefined && typeof error !== 'string') {
    return res.status(400).json({ error: 'Invalid "error"' });
  }

  const normalizedOutcome = outcome as 'success' | 'failure';
  logResponseOutcome({
    queryId,
    category,
    outcome: normalizedOutcome,
    responseTimeMs,
    model,
    error,
  });

  return res.status(200).json({ success: true });
});
