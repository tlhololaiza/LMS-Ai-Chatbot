import express from 'express';
import cors from 'cors';
import { logQuery, logResponseOutcome, logEscalationEvent, verifyLogChain } from './logger.js';
import { GeminiService } from './src/services/geminiService.js';

const app = express();
const PORT = process.env.PORT || 4000;
const geminiService = new GeminiService();

app.use(cors());
app.use(express.json());

// Helper to classify AI error-like responses
function isAiErrorResponse(text: string): boolean {
  const t = (text || '').toLowerCase();
  return (
    t.includes('sorry, i encountered an error') ||
    t.includes('too many requests') ||
    t.includes('failed to generate') ||
    t.includes('error generating response')
  );
}

// Health check endpoint
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Chat endpoint (non-streaming)
app.post('/api/chat', async (req: express.Request, res: express.Response) => {
  try {
    const { message, conversationHistory, metadata } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    // Log the query
    logQuery(message, metadata?.source || 'general');

    // Generate response
    const response = await geminiService.generateResponse(message, conversationHistory || []);

    // Classify and log outcome
    const aiError = isAiErrorResponse(response);
    logResponseOutcome({
      query: message,
      category: metadata?.source || 'general',
      outcome: aiError ? 'error' : 'success',
      response: aiError ? undefined : response,
      errorMessage: aiError ? response : undefined,
      model: 'gemini-pro',
      aiError,
    });

    res.status(200).json({
      response,
      timestamp: new Date().toISOString(),
      conversationId: `conv-${Date.now()}`,
    });
  } catch (error) {
    console.error('Chat API error:', error);
    // Log response outcome (error)
    logResponseOutcome({
      query: req.body?.message || '',
      category: req.body?.metadata?.source || 'general',
      outcome: 'error',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      model: 'gemini-pro',
    });
    res.status(500).json({
      error: 'Failed to generate response',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Streaming chat endpoint
app.post('/api/chat/stream', async (req: express.Request, res: express.Response) => {
  try {
    const { message, conversationHistory, metadata } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    // Log the query
    logQuery(message, metadata?.source || 'general');

    // Set headers for SSE (Server-Sent Events)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Generate response (for now, we'll send it in chunks)
    // In a real implementation, you'd use Gemini's streaming API
    const response = await geminiService.generateResponse(message, conversationHistory || []);

    // Classify and log outcome for streaming
    const aiError = isAiErrorResponse(response);
    logResponseOutcome({
      query: message,
      category: metadata?.source || 'general',
      outcome: aiError ? 'error' : 'success',
      response: aiError ? undefined : response,
      errorMessage: aiError ? response : undefined,
      model: 'gemini-pro',
      aiError,
    });

    // Simulate streaming by sending response in chunks
    const words = response.split(' ');
    const chunkSize = 5;

    for (let i = 0; i < words.length; i += chunkSize) {
      const chunk = words.slice(i, i + chunkSize).join(' ') + ' ';
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      // Small delay to simulate streaming
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Streaming chat API error:', error);
    // Log response outcome (error for streaming)
    logResponseOutcome({
      query: req.body?.message || '',
      category: req.body?.metadata?.source || 'general',
      outcome: 'error',
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      model: 'gemini-pro',
    });
    res.status(500).json({
      error: 'Failed to generate response',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
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

      // Classify and log outcome for typed endpoint
      const aiError = isAiErrorResponse(reply);
      logResponseOutcome({
        query: message,
        category: 'general',
        outcome: aiError ? 'error' : 'success',
        response: aiError ? undefined : reply,
        errorMessage: aiError ? reply : undefined,
        model: 'gemini-pro',
        aiError,
      });

      return res.status(200).json({ ok: true, data: { reply } });
    } catch (err) {
      console.error('POST /api/chat error:', err);
      logResponseOutcome({
        query: req.body?.message || '',
        category: 'general',
        outcome: 'error',
        errorMessage: err instanceof Error ? err.message : 'Internal server error',
        model: 'gemini-pro',
        aiError: true,
      });
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
// Escalation Logging Endpoint
// ---------------------------------------------
app.post('/api/log-escalation', (req: express.Request, res: express.Response) => {
  const { query, category, reason, escalationType, target, severity, correlationId } = req.body || {};

  if (typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing "query"' });
  }
  if (typeof category !== 'string' || category.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing "category"' });
  }
  if (typeof reason !== 'string' || reason.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing "reason"' });
  }
  const allowedTypes = ['human_review', 'support', 'moderation', 'other'];
  if (!allowedTypes.includes(escalationType)) {
    return res.status(400).json({ error: 'Invalid "escalationType"' });
  }

  logEscalationEvent({ query, category, reason, escalationType, target, severity, correlationId });
  return res.status(200).json({ ok: true });
});

// ---------------------------------------------
// Verify Log Chain Endpoint
// ---------------------------------------------
app.get('/api/logs/verify', (_req: express.Request, res: express.Response) => {
  const result = verifyLogChain();
  res.status(200).json(result);
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
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Chat API: http://localhost:${PORT}/api/chat`);
  console.log(`Stream API: http://localhost:${PORT}/api/chat/stream`);
  console.log(`Chat API server running on port ${PORT}`);
});
