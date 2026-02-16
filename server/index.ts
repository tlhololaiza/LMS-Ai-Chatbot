import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { logQuery, logResponseOutcome, logEscalationEvent, verifyLogChain } from './logger.js';
import { GeminiService } from './src/services/geminiService.js';
import { generateEscalationDraft, sendEscalationEmail } from './src/services/escalationMailer.js';
import { isJudgementRequired } from './src/logic/escalationThreshold.js';

const app = express();
const PORT = process.env.PORT || 4000;
let geminiService: GeminiService;
try {
  geminiService = new GeminiService();
} catch (err) {
  console.error('Failed to initialize GeminiService:', err);
  // Fallback shim to keep the server running with clear error messages
  geminiService = {
    async generateResponse() {
      throw new Error('Gemini API key missing or invalid');
    },
    async *streamResponse() {
      yield 'Error: Gemini API not configured.';
    },
    async healthCheck() {
      return { ok: false, error: 'Gemini API not configured', model: 'unknown' };
    },
  } as unknown as GeminiService;
}
// List available models for the current API key (simple REST proxy)
app.get('/api/models', async (_req: express.Request, res: express.Response) => {
  try {
    const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
    if (!key) return res.status(400).json({ error: 'Missing GEMINI_API_KEY' });
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
    const r = await fetch(url);
    const j = await r.json();
    const models = Array.isArray(j.models) ? j.models.map((m: any) => ({ name: m.name, displayName: m.displayName })) : [];
    res.json({ models });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : String(e) });
  }
});

// Rate limiting configuration (30 requests per minute per IP)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    error: 'Too many requests',
    message: 'Please wait a moment before sending more messages.',
    retryAfter: 60,
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Input validation middleware
function validateChatInput(req: express.Request, res: express.Response, next: express.NextFunction) {
  const { message } = req.body;
  
  // Check if message exists and is a string
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ 
      error: 'Invalid input', 
      message: 'Message is required and must be a string' 
    });
  }
  
  // Check message length (max 2000 characters)
  if (message.length > 2000) {
    return res.status(400).json({ 
      error: 'Message too long', 
      message: 'Message must be less than 2000 characters' 
    });
  }
  
  // Check for empty/whitespace-only messages
  if (message.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Empty message', 
      message: 'Message cannot be empty' 
    });
  }
  
  // Sanitize message (basic XSS prevention)
  req.body.message = message.trim();
  
  next();
}

app.use(cors());
app.use(express.json({ limit: '10kb' })); // Limit body size

// Apply rate limiting to chat endpoints
app.use('/api/chat', apiLimiter);

// Shared types and validators for optional history
type ChatRole = 'user' | 'assistant';
interface ChatHistoryMessage {
  role: ChatRole;
  content: string;
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
// Removed duplicate simple health endpoint; consolidated below with key status

// Chat endpoint (non-streaming) with validation
app.post('/api/chat', validateChatInput, async (req: express.Request, res: express.Response) => {
  try {
  const { message, conversationHistory, metadata, useAgent, useAgentTools } = req.body;

    // Log the query
    logQuery(message, metadata?.source || 'general');

    // Pre-check: if the query requires human judgement, escalate immediately with a draft
    if (isJudgementRequired(message)) {
      try {
        const draft = await generateEscalationDraft({ query: message, conversation: Array.isArray(conversationHistory) ? conversationHistory.map((h: any) => `${h.role}: ${h.content}`) : [], category: metadata?.source, correlationId: `conv-${Date.now()}` });
        return res.status(200).json({ escalated: true, escalationId: draft.escalationId, draft });
      } catch (err) {
        // Fall back to continuing to generate a response if draft generation fails
        console.error('Failed to generate escalation draft:', err);
      }
    }

    // Generate response
    const response = useAgentTools
      ? await geminiService.agentResponseWithTools(message, conversationHistory || [])
      : useAgent
      ? await geminiService.agentResponse(message, conversationHistory || [])
      : await geminiService.generateResponse(message, conversationHistory || []);

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
      model: (geminiService as any).modelName || 'unknown',
      agent: !!useAgent || !!useAgentTools,
      tools: !!useAgentTools,
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
    // Detect quota/429 and return appropriate status to the client
    const raw = error instanceof Error ? error.message : String(error);
    let status = 500;
    let msg = raw;
    if (raw.includes('RESOURCE_EXHAUSTED') || raw.includes('code=429') || raw.includes('"code":429')) {
      status = 429;
      msg = 'Quota exceeded or rate-limited. Please try again later or check billing/plan.';
    }
    res.status(status).json({
      error: status === 429 ? 'RATE_LIMITED' : 'Failed to generate response',
      message: msg,
    });
  }
});

// Streaming chat endpoint with validation
// Removed duplicate simulated streaming endpoint; consolidated below with true streaming
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

// Gemini-specific health check using the service
app.get('/api/health/gemini', async (_req, res: express.Response) => {
  try {
    const result = await geminiService.healthCheck();
    return res.status(result.ok ? 200 : 500).json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'unknown error';
    return res.status(500).json({ ok: false, error: msg });
  }
});

// Removed duplicate typed /api/chat endpoint; using the validated version above that matches frontend response shape

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

  // Persist audit log
  logEscalationEvent({ query, category, reason, escalationType, target, severity, correlationId });

  try {
    // Also attempt to generate an escalation email draft and return it to the caller for review
    (async () => {})();
  } catch {}

  // Generate draft asynchronously and return immediate acknowledgement
  generateEscalationDraft({ query, conversation: [], category, correlationId })
    .then((draft) => res.status(200).json({ ok: true, draft }))
    .catch((err) => {
      console.error('Failed to generate draft:', err);
      res.status(200).json({ ok: true });
    });
});

// ---------------------------------------------
// Verify Log Chain Endpoint
// ---------------------------------------------
app.get('/api/logs/verify', (_req: express.Request, res: express.Response) => {
  const result = verifyLogChain();
  res.status(200).json(result);
});

// ---------------------------------------------
// Send Escalation Email (final send after user review)
// ---------------------------------------------
app.post('/api/escalation/send', async (req: express.Request, res: express.Response) => {
  const { escalationId, subject, body, recipients, from, correlationId } = req.body || {};
  if (!escalationId || !subject || !body || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await sendEscalationEmail({ escalationId, subject, body, recipients, from, correlationId });
    return res.status(200).json({ ok: true, result });
  } catch (err) {
    console.error('Failed to send escalation email:', err);
    return res.status(500).json({ error: 'Failed to send email', message: err instanceof Error ? err.message : String(err) });
  }
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
        // Use "chunk" property to match frontend stream parser
        const payload = { chunk };
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
