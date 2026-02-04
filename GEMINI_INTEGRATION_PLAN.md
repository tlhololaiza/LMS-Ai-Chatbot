# 🎓 Google Gemini Integration Plan - LMS AI Chatbot
## Academic Project - Streamlined Implementation

## 📊 Executive Summary

**Project Status:** 85% Complete (7 of 10 phases done)

**Missing Components:**
- ❌ Real AI Backend Integration (Google Gemini)
- ❌ Basic API Endpoints
- ❌ Essential Testing
- ❌ Simple Deployment

**Integration Goal:** Connect existing LMS chatbot UI with Google Gemini API to provide intelligent, context-aware responses.

**Timeline:** 5-6 days with 5-person team (academic-level implementation)

**Cost:** FREE (Gemini API free tier: 60 requests/minute, plenty for school demo)

---

## 👥 5-Person Team Breakdown (Simplified)

### 👤 **Team Member 1: AI Integration Developer**
**Branch:** `feature/gemini-integration`
**Focus:** Google Gemini SDK setup and basic service
**Total Time:** 5 hours

#### **Task 1.1: Setup Gemini SDK** (1.5 hours)
**Commit Message:** `feat(gemini): setup Google Gemini SDK - Task 1.1`

**Implementation:**

```bash
# 1. Install dependencies
cd server
npm install @google/generative-ai dotenv
```

**2. Create `server/.env` file:**
```env
# Get your free API key: https://makersuite.google.com/app/apikey
GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
PORT=4000
NODE_ENV=development
```

**3. Update `server/.gitignore`:**
```gitignore
node_modules
.env
dist
```

**Validation:**
```bash
# Test API key is loaded
node -e "require('dotenv').config(); console.log('✅ API Key:', process.env.GOOGLE_GEMINI_API_KEY ? 'Loaded' : 'Missing')"
```

---

#### **Task 1.2: Create Simple Gemini Service** (2 hours)
**Commit Message:** `feat(gemini): create basic GeminiService for chat - Task 1.2`

**Create `server/src/services/geminiService.ts`:**

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

class GeminiService {
  /**
   * Generate AI response with conversation history
   */
  async generateResponse(
    userMessage: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    try {
      // Build prompt with context
      let prompt = 'You are a helpful LMS learning assistant.\n\n';
      
      // Add recent conversation (last 3 messages for context)
      if (conversationHistory.length > 0) {
        prompt += 'Recent conversation:\n';
        conversationHistory.slice(-3).forEach(msg => {
          prompt += `${msg.role}: ${msg.content}\n`;
        });
        prompt += '\n';
      }
      
      prompt += `Student question: ${userMessage}\n\n`;
      prompt += 'Provide a clear, educational response.';

      // Call Gemini API
      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      return response;
    } catch (error: any) {
      console.error('Gemini Error:', error);
      
      // Simple error handling
      if (error.status === 429) {
        return 'Too many requests. Please wait a moment and try again.';
      }
      return 'Sorry, I encountered an error. Please try again.';
    }
  }

  /**
   * Stream response (optional - for real-time typing effect)
   */
  async *streamResponse(
    userMessage: string,
    conversationHistory: ChatMessage[] = []
  ): AsyncGenerator<string> {
    try {
      let prompt = 'You are a helpful LMS learning assistant.\n\n';
      prompt += `Student question: ${userMessage}`;

      const result = await model.generateContentStream(prompt);
      
      for await (const chunk of result.stream) {
        yield chunk.text();
      }
    } catch (error) {
      yield 'Error generating response.';
    }
  }
}

export default new GeminiService();
```

**Validation:**
```typescript
// Create server/test-gemini.ts for quick test
import geminiService from './src/services/geminiService';

geminiService.generateResponse('What is React?', [])
  .then(res => console.log('✅ Response:', res))
  .catch(err => console.error('❌ Error:', err));
```

---

#### **Task 1.3: Add Knowledge Base Support** (1.5 hours)
**Commit Message:** `feat(gemini): integrate knowledge base with AI responses - Task 1.3`

**Update `server/src/services/geminiService.ts`:**

Add RAG integration to enhance responses with knowledge base:

```typescript
// At the top, import knowledge base
import { knowledgeBase } from '../../../src/data/mockData';

class GeminiService {
  /**
   * Find relevant knowledge from knowledge base
   */
  private findRelevantKnowledge(query: string): string {
    const queryLower = query.toLowerCase();
    let context = '';

    // Search concepts
    const relevantConcepts = knowledgeBase.concepts.filter(concept =>
      queryLower.includes(concept.title.toLowerCase()) ||
      concept.explanation.toLowerCase().includes(queryLower)
    );

    if (relevantConcepts.length > 0) {
      context += '\nKnowledge Base:\n';
      relevantConcepts.slice(0, 2).forEach(concept => {
        context += `- ${concept.title}: ${concept.explanation}\n`;
      });
    }

    return context;
  }

  /**
   * Generate response WITH knowledge base
   */
  async generateResponse(
    userMessage: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    try {
      // Find relevant knowledge
      const knowledgeContext = this.findRelevantKnowledge(userMessage);
      
      let prompt = 'You are a helpful LMS learning assistant.\n\n';
      
      // Add knowledge base
      if (knowledgeContext) {
        prompt += knowledgeContext + '\n';
      }
      
      // Add conversation
      if (conversationHistory.length > 0) {
        prompt += 'Recent conversation:\n';
        conversationHistory.slice(-3).forEach(msg => {
          prompt += `${msg.role}: ${msg.content}\n`;
        });
        prompt += '\n';
      }
      
      prompt += `Student question: ${userMessage}\n\n`;
      prompt += 'Use the knowledge base to provide accurate responses.';

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      console.error('Gemini Error:', error);
      return error.status === 429 
        ? 'Too many requests. Please wait.' 
        : 'Sorry, error occurred. Please try again.';
    }
  }
}

export default new GeminiService();
```

**Test:**
```bash
# Test with knowledge base query
node test-gemini.ts
```

---

### 👤 **Team Member 2: Backend Developer**
**Branch:** `feature/api-endpoints`
**Focus:** Simple REST API for chat
**Total Time:** 5 hours

#### **Task 2.1: Create Chat API Endpoint** (2.5 hours)
**Commit Message:** `feat(api): create /api/chat endpoint - Task 2.1`

**Update `server/index.ts`:**

```typescript
import express, { Request, Response } from 'express';
import cors from 'cors';
import geminiService from './src/services/geminiService';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Types
interface ChatRequest {
  message: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

// Chat endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [] }: ChatRequest = req.body;

    // Validation
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Generate response
    const response = await geminiService.generateResponse(
      message,
      conversationHistory
    );

    res.json({ 
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// Logging endpoint (existing)
app.post('/api/log-query', (req: Request, res: Response) => {
  console.log('Query logged:', req.body);
  res.json({ success: true });
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
```

**Test:**
```bash
# Start server
npm run dev

# Test endpoint
curl -X POST http://localhost:4000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What is React?"}'
```

---

#### **Task 2.2: Add Streaming Endpoint (Optional)** (1.5 hours)
**Commit Message:** `feat(api): add /api/chat/stream endpoint - Task 2.2`

**Add to `server/index.ts`:**

```typescript
// Streaming endpoint
app.post('/api/chat/stream', async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [] }: ChatRequest = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Stream response
    for await (const chunk of geminiService.streamResponse(message, conversationHistory)) {
      res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('Stream Error:', error);
    res.status(500).json({ error: 'Stream failed' });
  }
});
```

---

#### **Task 2.3: Basic Rate Limiting** (1 hour)
**Commit Message:** `feat(api): add simple rate limiting - Task 2.3`

```bash
# Install rate limiting
npm install express-rate-limit
```

**Update `server/index.ts`:**

```typescript
import rateLimit from 'express-rate-limit';

// Rate limiter (simple)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many requests, please try again later.' }
});

// Apply to chat endpoints
app.use('/api/chat', limiter);
```

---

### 👤 **Team Member 3: Frontend Developer**
**Branch:** `feature/frontend-integration`
**Focus:** Connect UI to real AI backend
**Total Time:** 5 hours

#### **Task 3.1: Create API Client Service** (2 hours)
**Commit Message:** `feat(frontend): create API client for Gemini backend - Task 3.1`

**Create `src/services/apiClient.ts`:**

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

class ApiClient {
  /**
   * Send chat message to AI backend
   */
  async sendMessage(
    message: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('API Error:', error);
      throw new Error('Failed to get AI response');
    }
  }

  /**
   * Stream chat message (optional)
   */
  async *streamMessage(
    message: string,
    conversationHistory: ChatMessage[] = []
  ): AsyncGenerator<string> {
    try {
      const response = await fetch(`${API_URL}/api/chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            
            try {
              const parsed = JSON.parse(data);
              yield parsed.chunk;
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream Error:', error);
      yield 'Error streaming response';
    }
  }
}

export default new ApiClient();
```

**Create `.env` file:**
```env
VITE_API_URL=http://localhost:4000
```

---

#### **Task 3.2: Update AIChatbot Component** (2 hours)
**Commit Message:** `feat(frontend): connect AIChatbot to real AI backend - Task 3.2`

**Update `src/components/features/AIChatbot.tsx`:**

Replace the `getBotResponse` function:

```typescript
import apiClient from '@/services/apiClient';

// Remove old mock getBotResponse function
// Add this instead:

const getBotResponse = async (message: string, history: Message[]): Promise<string> => {
  try {
    // Convert to API format
    const conversationHistory = history.map(msg => ({
      role: msg.sender as 'user' | 'assistant',
      content: msg.text,
    }));

    // Call real AI backend
    const response = await apiClient.sendMessage(message, conversationHistory);
    return response;

  } catch (error) {
    console.error('Chat error:', error);
    return 'Sorry, I encountered an error. Please try again.';
  }
};
```

---

#### **Task 3.3: Add Loading States** (1 hour)
**Commit Message:** `feat(frontend): improve UX with loading states - Task 3.3`

**Update `AIChatbot.tsx` send function:**

```typescript
const handleSend = async () => {
  if (!input.trim() || isLoading) return;

  const userMessage: Message = {
    id: Date.now().toString(),
    text: input,
    sender: 'user',
    timestamp: new Date(),
  };

  setMessages(prev => [...prev, userMessage]);
  setInput('');
  setIsLoading(true);

  try {
    // Get AI response
    const botReply = await getBotResponse(input, messages);
    
    const botMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: botReply,
      sender: 'assistant',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);
  } catch (error) {
    // Error handling
    const errorMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: 'Sorry, something went wrong. Please try again.',
      sender: 'assistant',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, errorMessage]);
  } finally {
    setIsLoading(false);
  }
};
```

---

### 👤 **Team Member 4: Testing**
**Branch:** `feature/testing`
**Focus:** Basic tests for demo
**Total Time:** 4 hours

#### **Task 4.1: Backend API Tests** (2 hours)
**Commit Message:** `test(api): add basic endpoint tests - Task 4.1`

```bash
# Install testing tools
cd server
npm install --save-dev jest ts-jest @types/jest supertest @types/supertest
```

**Create `server/jest.config.js`:**
```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
};
```

**Create `server/src/__tests__/api.test.ts`:**
```typescript
import request from 'supertest';
import express from 'express';

describe('Chat API', () => {
  test('POST /api/chat returns response', async () => {
    const response = await request('http://localhost:4000')
      .post('/api/chat')
      .send({ message: 'Hello' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('response');
  });

  test('POST /api/chat validates input', async () => {
    const response = await request('http://localhost:4000')
      .post('/api/chat')
      .send({ message: '' });

    expect(response.status).toBe(400);
  });
});
```

---

#### **Task 4.2: Frontend Tests** (2 hours)
**Commit Message:** `test(frontend): add component tests - Task 4.2`

**Create `src/components/features/__tests__/AIChatbot.test.tsx`:**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AIChatbot from '../AIChatbot';

// Mock API client
vi.mock('@/services/apiClient', () => ({
  default: {
    sendMessage: vi.fn(() => Promise.resolve('Test response')),
  },
}));

describe('AIChatbot', () => {
  it('renders chat interface', () => {
    render(<AIChatbot />);
    expect(screen.getByPlaceholderText(/ask/i)).toBeInTheDocument();
  });

  it('sends message when button clicked', async () => {
    render(<AIChatbot />);
    
    const input = screen.getByPlaceholderText(/ask/i);
    const button = screen.getByRole('button', { name: /send/i });

    fireEvent.change(input, { target: { value: 'Test question' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Test question')).toBeInTheDocument();
    });
  });
});
```

**Run tests:**
```bash
npm test
```

---

### 👤 **Team Member 5: Documentation & Deployment**
**Branch:** `feature/docs-and-deploy`
**Focus:** Setup instructions and deployment
**Total Time:** 4 hours

#### **Task 5.1: Update Documentation** (2 hours)
**Commit Message:** `docs: add Gemini setup and API documentation - Task 5.1`

**Update `README.md`:**

Add AI Integration section:

```markdown
## 🤖 AI Integration

### Setup Google Gemini

1. **Get API Key:**
   - Visit: https://makersuite.google.com/app/apikey
   - Create new API key (FREE)

2. **Configure Backend:**
   ```bash
   cd server
   cp .env.example .env
   # Add your API key to .env
   ```

3. **Start Services:**
   ```bash
   # Terminal 1: Backend
   cd server
   npm install
   npm run dev

   # Terminal 2: Frontend
   npm install
   npm run dev
   ```

### API Endpoints

**POST /api/chat**
```json
{
  "message": "Your question here",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "response": "AI response here",
  "timestamp": "2026-02-02T10:00:00.000Z"
}
```
```

---

#### **Task 5.2: Update Final Documentation** (2 hours)
**Commit Message:** `docs: finalize README and deployment instructions - Task 5.2`

**Updates to README.md:**
- Add "Getting Started" section with clear setup steps
- Add "Demo Instructions" for presentation
- Update prerequisites section
- Add troubleshooting guide
- Include team credits

---

## 📋 Implementation Checklist

### Week 1: Core Development (Day 1-3)

**Day 1: Setup**
- [ ] Member 1: Task 1.1 - Gemini SDK setup
- [ ] Member 2: Task 2.1 - Chat API endpoint
- [ ] Member 3: Task 3.1 - API client service
- [ ] Member 4: Setup test environment
- [ ] Member 5: Update documentation

**Day 2: Integration**
- [ ] Member 1: Task 1.2 - Gemini service
- [ ] Member 2: Task 2.2 - Streaming endpoint
- [ ] Member 3: Task 3.2 - Update AIChatbot
- [ ] Member 4: Task 4.1 - Backend tests
- [ ] Member 5: Setup deployment

**Day 3: Enhancement**
- [ ] Member 1: Task 1.3 - RAG integration
- [ ] Member 2: Task 2.3 - Rate limiting
- [ ] Member 3: Task 3.3 - Loading states
- [ ] Member 4: Task 4.2 - Frontend tests
- [ ] Member 5: Final documentation

### Week 2: Testing & Demo (Day 4-5)

**Day 4: Testing**
- [ ] All: Integration testing
- [ ] All: Bug fixes
- [ ] All: Code review

**Day 5: Demo Prep**
- [ ] All: Documentation complete
- [ ] All: Demo scenarios prepared
- [ ] All: Final testing
- [ ] All: Presentation ready

---

## 🎯 Success Criteria

### Technical Requirements
✅ Gemini API integrated and working
✅ Chat endpoint returns AI responses
✅ Frontend connected to backend
✅ Basic error handling
✅ Simple rate limiting
✅ Tests passing

### Demo Requirements
✅ Can ask questions and get AI responses
✅ Conversation history maintained
✅ Knowledge base integrated
✅ Loading states visible
✅ Error handling works
✅ Documentation complete

---

## 🚀 Quick Start After Integration

```bash
# 1. Get Gemini API key
Visit: https://makersuite.google.com/app/apikey

# 2. Setup backend
cd server
npm install
# Add API key to .env
npm run dev

# 3. Setup frontend
cd ..
npm install
npm run dev

# 4. Test
Open: http://localhost:5173
Chat with the AI!
```

---

## 📊 Time Breakdown Summary

| Member | Tasks | Total Time |
|--------|-------|------------|
| Member 1 | AI Integration | 5 hours |
| Member 2 | Backend API | 5 hours |
| Member 3 | Frontend | 5 hours |
| Member 4 | Testing | 4 hours |
| Member 5 | Docs & Deploy | 4 hours |
| **TOTAL** | | **23 hours** |

**Team Velocity:** ~5 hours per person
**Timeline:** 5-6 days (working part-time)
**Status:** Ready for implementation 🚀

---

**Last Updated:** February 2, 2026
**Complexity Level:** Academic/School Project
**Focus:** Working demo with good practices, not production-grade
