import express from 'express';
import cors from 'cors';
import { logQuery } from './logger.js';
import { GeminiService } from './src/services/geminiService.js';

const app = express();
const PORT = process.env.PORT || 4000;
const geminiService = new GeminiService();

app.use(cors());
app.use(express.json());

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

    res.status(200).json({
      response,
      timestamp: new Date().toISOString(),
      conversationId: `conv-${Date.now()}`,
    });
  } catch (error) {
    console.error('Chat API error:', error);
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
    res.status(500).json({
      error: 'Failed to generate response',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.post('/api/log-query', (req: express.Request, res: express.Response) => {
  const { query, category } = req.body;
  if (typeof query !== 'string' || typeof category !== 'string') {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  logQuery(query, category);
  res.status(200).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Chat API: http://localhost:${PORT}/api/chat`);
  console.log(`Stream API: http://localhost:${PORT}/api/chat/stream`);
});
