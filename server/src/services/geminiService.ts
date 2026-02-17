import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { knowledgeBase } from '../data/knowledgeBase.js';

dotenv.config();

// Model name is configurable via environment; default to Gemini 2.0 Flash-Lite as requested
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

class GeminiService {
  private ai: GoogleGenAI;
  public modelName: string;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing GEMINI_API_KEY (or GOOGLE_GEMINI_API_KEY) in server environment');
    }
    // The client can read GEMINI_API_KEY automatically, but we pass explicitly for clarity
    this.ai = new GoogleGenAI({ apiKey });
    this.modelName = DEFAULT_MODEL;
  }
  /**
   * Tool schema: function declaration that the model can call.
   */
  private KB_FUNCTION_DECLARATION = {
    functionDeclarations: [
      {
        name: 'searchKB',
        description: 'Search LMS knowledge base for relevant concepts and FAQs',
        parameters: {
          type: 'OBJECT',
          properties: {
            query: { type: 'STRING', description: 'Search query string' },
            limit: { type: 'INTEGER', description: 'Max results', minimum: 1, maximum: 10 },
          },
          required: ['query'],
        },
      },
    ],
  };

  /**
   * Implements the searchKB tool: returns structured results from the KB.
   */
  private runSearchKB(query: string, limit = 3): { results: Array<{ type: 'concept' | 'faq'; title: string; detail: string }> } {
    const q = (query || '').toLowerCase();
    const results: Array<{ type: 'concept' | 'faq'; title: string; detail: string }> = [];

    // Concepts
    for (const c of knowledgeBase.concepts) {
      const hit = c.title.toLowerCase().includes(q) || c.explanation.toLowerCase().includes(q);
      if (hit) {
        results.push({ type: 'concept', title: c.title, detail: c.explanation });
      }
      if (results.length >= limit) break;
    }

    // FAQs (fill remaining slots)
    if (results.length < limit) {
      for (const f of knowledgeBase.faqs) {
        const hit = f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
        if (hit) {
          results.push({ type: 'faq', title: f.question, detail: f.answer });
        }
        if (results.length >= limit) break;
      }
    }

    // If no direct hits, provide top concepts as fallback context
    if (results.length === 0) {
      for (const c of knowledgeBase.concepts.slice(0, limit)) {
        results.push({ type: 'concept', title: c.title, detail: c.explanation });
      }
    }
    return { results };
  }
  /**
   * Find relevant knowledge from knowledge base
   */
  private findRelevantKnowledge(query: string): string {
    const queryLower = query.toLowerCase();
    let context = '';

    // Search concepts
    const relevantConcepts = knowledgeBase.concepts.filter(concept =>
      queryLower.includes(concept.title.toLowerCase()) ||
      concept.explanation.toLowerCase().includes(queryLower) ||
      queryLower.split(' ').some(word => 
        word.length > 3 && concept.title.toLowerCase().includes(word)
      )
    );

    // Search FAQs
    const relevantFAQs = knowledgeBase.faqs.filter(faq =>
      queryLower.includes(faq.question.toLowerCase()) ||
      faq.question.toLowerCase().includes(queryLower)
    );

    // Add concepts to context
    if (relevantConcepts.length > 0) {
      context += '\n📚 Knowledge Base - Concepts:\n';
      relevantConcepts.slice(0, 2).forEach(concept => {
        context += `• ${concept.title}: ${concept.explanation}\n`;
      });
    }

    // Add FAQs to context
    if (relevantFAQs.length > 0) {
      context += '\n❓ Knowledge Base - FAQs:\n';
      relevantFAQs.slice(0, 2).forEach(faq => {
        context += `Q: ${faq.question}\nA: ${faq.answer}\n`;
      });
    }

    return context;
  }

  /**
   * Generate AI response with conversation history and knowledge base
   */
  async generateResponse(
    userMessage: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    try {
      // Find relevant knowledge from knowledge base
      const knowledgeContext = this.findRelevantKnowledge(userMessage);
      
      // Build prompt with context
      let prompt = 'You are a helpful LMS learning assistant.\n\n';
      
      // Add knowledge base context if found
      if (knowledgeContext) {
        prompt += knowledgeContext + '\n';
        prompt += 'Use the above knowledge base information to provide accurate, detailed responses.\n\n';
      }
      
      // Add recent conversation (last 3 messages for context)
      if (conversationHistory.length > 0) {
        prompt += 'Recent conversation:\n';
        conversationHistory.slice(-3).forEach(msg => {
          prompt += `${msg.role}: ${msg.content}\n`;
        });
        prompt += '\n';
      }
      
      prompt += `Student question: ${userMessage}\n\n`;
      prompt += 'Provide a clear, educational response. If you used the knowledge base, mention relevant concepts naturally in your explanation.';

  // Call Gemini API (new genai client)
  const result = await this.ai.models.generateContent({ model: this.modelName, contents: prompt });
  const response = (result as any).text ?? '';
      
      return response;
    } catch (error: unknown) {
      console.error('Gemini Error:', error);
      
      // Simple error handling
      const err = error as { status?: number };
      if (err.status === 429) {
        return 'Too many requests. Please wait a moment and try again.';
      }
      return 'Sorry, I encountered an error. Please try again.';
    }
  }

  /**
   * Health check to validate API connectivity and key validity
   */
  async healthCheck(): Promise<{ ok: boolean; message?: string; error?: string; model: string; attempts?: Array<{ model: string; error: string }> }> {
    try {
      // Minimal prompt to reduce cost and latency
      const prompt = "Reply with 'ok'.";
      const candidates = Array.from(
        new Set([
          this.modelName,
          // Gemini 2.0 models
          'gemini-2.0-flash-lite',
          'gemini-2.0-flash',
          'gemini-2.0-flash-exp',
          'gemini-2.0-pro-exp',
          // Gemini 3.x previews
          'gemini-3-flash-preview',
          'gemini-3.0-flash',
          'gemini-3.0-pro',
          // Gemini 1.x fallbacks
          'gemini-1.5-flash',
          'gemini-1.5-flash-latest',
          'gemini-1.5-pro',
          'gemini-1.5-pro-latest',
          'gemini-1.0-pro',
        ])
      );
      const attempts: Array<{ model: string; error: string }> = [];

      for (const name of candidates) {
        try {
          const result = await this.ai.models.generateContent({ model: name, contents: prompt });
          const text = ((result as any).text ?? '').trim();
          if (text) {
            if (name !== this.modelName) {
              this.modelName = name;
            }
            return { ok: true, message: text, model: name };
          }
        } catch (innerErr) {
          // Try next candidate on error (e.g., 404 model not found, 429 quota)
          let errMsg = innerErr instanceof Error ? innerErr.message : String(innerErr);
          // If the error is a JSON string, expose concise details
          try {
            const parsed = JSON.parse(errMsg);
            const code = parsed?.error?.code;
            const status = parsed?.error?.status;
            const retryInfo = parsed?.error?.details?.find((d: any) => d['@type']?.includes('RetryInfo'));
            const retryDelay = retryInfo?.retryDelay;
            errMsg = `code=${code} status=${status}${retryDelay ? ` retryDelay=${retryDelay}` : ''}`;
          } catch {}
          attempts.push({ model: name, error: errMsg });
          continue;
        }
      }
      // If none work, return last configured model with error
      return { ok: false, error: 'No supported Gemini model responded successfully', model: this.modelName, attempts };
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      return { ok: false, error: msg, model: this.modelName };
    }
  }

  /**
   * Agent-based chat using the SDK's startChat, preserving structured history.
   * Maps our ChatMessage roles to SDK roles ('user' | 'model').
   */
  async agentResponse(
    userMessage: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    try {
      // Build a single prompt with history + KB context (new client minimal approach)
      const historyText = conversationHistory
        .slice(-3)
        .map((m) => `${m.role}: ${m.content}`)
        .join('\n');

      const knowledgeContext = this.findRelevantKnowledge(userMessage);
      const prompt = `${historyText ? `Recent conversation:\n${historyText}\n\n` : ''}${knowledgeContext ? `Context:\n${knowledgeContext}\n\n` : ''}Question: ${userMessage}`;

  const result = await this.ai.models.generateContent({ model: this.modelName, contents: prompt });
  const text = (result as any).text ?? '';
      return text || '';
    } catch (error: unknown) {
      console.error('Gemini Agent Error:', error);
      const err = error as { status?: number };
      if (err.status === 429) {
        return 'Too many requests. Please wait a moment and try again.';
      }
      return 'Sorry, I encountered an error. Please try again.';
    }
  }

  /**
   * Agent response with function-calling tools enabled (searchKB).
   * Handles one round of function call + tool output submission.
   */
  async agentResponseWithTools(
    userMessage: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    try {
      // New client does not expose function-calling in the same shape.
      // Emulate tool-calling by proactively running searchKB and injecting results.
      const toolOutput = this.runSearchKB(userMessage, 3);
      const historyText = conversationHistory
        .slice(-3)
        .map((m) => `${m.role}: ${m.content}`)
        .join('\n');
      const prompt = `${historyText ? `Recent conversation:\n${historyText}\n\n` : ''}Tool: searchKB results:\n${JSON.stringify(toolOutput.results, null, 2)}\n\nQuestion: ${userMessage}`;
  const result = await this.ai.models.generateContent({ model: this.modelName, contents: prompt });
  const text = (result as any).text ?? '';
      return text || '';
    } catch (error: unknown) {
      console.error('Gemini Agent Tools Error:', error);
      const err = error as { status?: number };
      if (err.status === 429) {
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
      // Generate once then yield chunks to simulate streaming
      const historyText = conversationHistory
        .slice(-3)
        .map((m) => `${m.role}: ${m.content}`)
        .join(' ');
      const prompt = `${historyText ? `${historyText} ` : ''}${userMessage}`;
  const result = await this.ai.models.generateContent({ model: this.modelName, contents: prompt });
  const full = (result as any).text ?? '';
      const words = full.split(/\s+/);
      const chunkSize = 8;
      for (let i = 0; i < words.length; i += chunkSize) {
        yield words.slice(i, i + chunkSize).join(' ') + ' ';
      }
    } catch (error) {
      yield 'Error generating response.';
    }
  }
}

// Export both the class and a default instance
export { GeminiService };
export default new GeminiService();