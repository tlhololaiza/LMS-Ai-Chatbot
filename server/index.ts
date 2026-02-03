import express from 'express';
import cors from 'cors';
import { logQuery } from './logger';
import geminiService from './src/services/geminiService.js';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ---------------------------------------------
// Rate Limiter (Task 2.3)
// 15-minute window, max 100 requests per IP
// ---------------------------------------------
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: 'Too many requests, please try again later.', code: 'RATE_LIMITED' },
});

// ---------------------------------------------
// Health Check Endpoint
// ---------------------------------------------
type HealthResponse = {
  ok: boolean;
  service: 'chat-api';
  status: 'healthy' | 'degraded';
  model?: string;
};

app.get('/api/health', (_req, res: express.Response<HealthResponse>) => {
  const hasKey = !!process.env.GOOGLE_GEMINI_API_KEY;
  res.status(200).json({
    ok: true,
    service: 'chat-api',
    status: hasKey ? 'healthy' : 'degraded',
    model: 'gemini-pro',
  });
});

// ---------------------------------------------
// Chat Endpoint (non-streaming)
// ---------------------------------------------
type ChatRole = 'user' | 'assistant';
interface ChatHistoryMessage {
  role: ChatRole;
  content: string;
}
interface ChatRequest {
  message: string;
  history?: ChatHistoryMessage[];
}
interface ChatSuccessResponse {
  ok: true;
  data: { reply: string };
}
interface ErrorResponse {
  ok: false;
  error: string;
  code?: string;
}

function isValidHistory(history: unknown): history is ChatHistoryMessage[] {
  if (!Array.isArray(history)) return false;
  return history.every(
    (m) =>
      m &&
      typeof m === 'object' &&
      (m as ChatHistoryMessage).role &&
      (m as ChatHistoryMessage).content &&
      typeof (m as ChatHistoryMessage).content === 'string' &&
      ((m as ChatHistoryMessage).role === 'user' || (m as ChatHistoryMessage).role === 'assistant')
  );
}

app.post(
  '/api/chat',
  chatLimiter,
  async (
    req: express.Request<unknown, unknown, ChatRequest>,
    res: express.Response<ChatSuccessResponse | ErrorResponse>
  ) => {
    try {
      const { message, history } = req.body || ({} as ChatRequest);

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res
          .status(400)
          .json({ ok: false, error: 'Invalid "message" in request body', code: 'BAD_REQUEST' });
      }
      if (history && !isValidHistory(history)) {
        return res.status(400).json({ ok: false, error: 'Invalid "history" format', code: 'BAD_REQUEST' });
      }

      const reply = await geminiService.generateResponse(message, history || []);

      return res.status(200).json({ ok: true, data: { reply } });
    } catch (err) {
      console.error('POST /api/chat error:', err);
      return res.status(500).json({ ok: false, error: 'Internal server error', code: 'INTERNAL_ERROR' });
    }
  }
);

app.post('/api/log-query', (req: express.Request, res: express.Response) => {
  const { query, category } = req.body;
  if (typeof query !== 'string' || typeof category !== 'string') {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  logQuery(query, category);
  res.status(200).json({ success: true });
});

// ---------------------------------------------
// Streaming Chat Endpoint (SSE over POST)
// ---------------------------------------------
interface ChatStreamRequest {
  message: string;
  history?: ChatHistoryMessage[];
}

app.post(
  '/api/chat/stream',
  chatLimiter,
  async (req: express.Request<unknown, unknown, ChatStreamRequest>, res: express.Response) => {
    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    // Some proxies buffer unless disabled
    res.setHeader('X-Accel-Buffering', 'no');

    try {
      const { message, history } = req.body || ({} as ChatStreamRequest);

      // Basic validation
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        res.write(`event: error\n`);
        res.write(`data: ${JSON.stringify({ error: 'Invalid "message" in request body' })}\n\n`);
        return res.end();
      }
      if (history && !isValidHistory(history)) {
        res.write(`event: error\n`);
        res.write(`data: ${JSON.stringify({ error: 'Invalid "history" format' })}\n\n`);
        return res.end();
      }

      // Initial open event
      res.write(`event: open\n`);
      res.write(`data: ${JSON.stringify({ ok: true })}\n\n`);

      // Stream chunks from Gemini service
      for await (const chunk of geminiService.streamResponse(message, history || [])) {
        const payload = { delta: chunk };
        res.write(`data: ${JSON.stringify(payload)}\n\n`);
      }

      // End event
      res.write('event: end\n');
      res.write('data: {}\n\n');
      res.end();
    } catch (err) {
      console.error('POST /api/chat/stream error:', err);
      res.write(`event: error\n`);
      res.write(
        `data: ${JSON.stringify({ error: 'Internal server error', code: 'INTERNAL_ERROR' })}\n\n`
      );
      res.end();
    }
  }
);

app.listen(PORT, () => {
  console.log(`Chat API server running on port ${PORT}`);
});
