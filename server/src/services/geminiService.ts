import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { AI_CONTEXT, MLAB_TEAM } from '../data/aiContext.js';

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
   * Returns the system instruction that tells the model HOW to behave.
   * This is passed via Gemini's systemInstruction parameter so the model
   * treats it as authoritative ground truth, not ignorable user text.
   * The knowledge data (AI_CONTEXT) is included here so the model cannot
   * override it with its own training data.
   */
  private getSystemInstruction(): string {
    return `You are the CodeTribe LMS AI Assistant — a friendly, helpful learning companion for students at mLab CodeTribe Academy.

══════════════════════════════════════════════════════════════════
CRITICAL GROUNDING RULES — YOU MUST FOLLOW THESE EXACTLY:
══════════════════════════════════════════════════════════════════
1. ONLY use the KNOWLEDGE BASE below to answer questions about mLab, CodeTribe, team members, courses, tasks, and the LMS platform.
2. NEVER use your pre-training knowledge about mLab or any similarly named organisation. Your training data is OUTDATED and WRONG for this context.
3. If someone asks about an mLab team member, role, or fact — look it up ONLY in the KNOWLEDGE BASE below. If it's not there, say "I don't have that information in my knowledge base" and direct them to mlab.co.za.
4. NEVER fabricate names, roles, or facts. If the answer is not in the knowledge base, SAY SO.
5. "mLab" means ONLY mLab Southern Africa (mlab.co.za). It is NOT MongoDB's mLab.
6. For greetings ("Hi", "How are you?"), respond warmly without dumping data.
7. For off-topic questions (weather, sports, etc.), politely redirect to CodeTribe/mLab topics.
8. Keep responses concise. Format lists clearly.
9. When asked "who should I consult", use the WHO TO CONSULT section.

EXAMPLES OF CORRECT BEHAVIOR:
- Q: "Who is the COO of mLab?" → A: "The COO of mLab is Tendai Mazhude." (from SECTION 2 below)
- Q: "Who is the CEO?" → A: "The CEO of mLab is Nicki Koorbanally." (from SECTION 2 below)
- Q: "Who is John Smith at mLab?" → A: "I don't have information about John Smith in my knowledge base. The full team is listed on mlab.co.za/who-we-are."
══════════════════════════════════════════════════════════════════

${AI_CONTEXT}`;
  }

  // runSearchKB and KB_FUNCTION_DECLARATION removed — the unified AI_CONTEXT is always injected in full.

  /**
   * Check if the query contains a known team member name.
   */
  private hasNameMatch(query: string, text: string): boolean {
    const qLower = query.toLowerCase();
    for (const member of MLAB_TEAM) {
      const nameLower = member.name.toLowerCase();
      const nameParts = nameLower.split(' ');
      // If the query contains any part of a team member's name (surname or first)
      // AND that name also appears in the text, it's a match
      const queryHasName = nameParts.some(part => part.length > 3 && qLower.includes(part));
      const textHasName = nameParts.some(part => part.length > 3 && text.includes(part));
      if (queryHasName && textHasName) return true;
    }
    return false;
  }

  /**
   * Detect if a query is related to mLab, CodeTribe, the LMS platform,
   * team members, or any topic the mLab website data covers.
   */
  private isMlabRelated(query: string): boolean {
    const q = query.toLowerCase();

    // Direct keyword hits
    const mlabKeywords = [
      'mlab', 'codetribe', 'code tribe', 'code-tribe',
      'facilitator', 'instructor', 'coordinator',
      'pillar', 'tech skills', 'tech ecosystem', 'tech solution', 'tech start',
      'boostup', 'launch league', 'iitpsa',
      'lms', 'task', 'course', 'module', 'lesson', 'assignment', 'due date',
      'progress', 'enroll', 'enrolled',
      'consult', 'who should i', 'who can i', 'who do i',
      'selection criteria', 'apply', 'application',
      'npc', 'not-for-profit', 'b-bbee',
      'innovation hub', 'dsi', 'csir',
      'soweto', 'tembisa', 'tshwane', 'polokwane', 'galeshewe',
      'giz', 'farmru', 'mafats', 'zirra', 'mpowa', 'arc hub',
    ];
    if (mlabKeywords.some(kw => q.includes(kw))) return true;

    // Check if the query mentions any team member by name
    for (const member of MLAB_TEAM) {
      const nameParts = member.name.toLowerCase().split(' ');
      if (nameParts.some(part => part.length > 3 && q.includes(part))) return true;
    }

    return false;
  }

  /**
   * Public method: check if the knowledge base has relevant content for a query.
   * Used by the server to decide whether to skip escalation.
   */
  hasKBRelevance(query: string): boolean {
    // If it's mLab-related, we always have relevant data
    if (this.isMlabRelated(query)) return true;

    // Check if the query mentions any programming concept covered by the KB
    const q = query.toLowerCase();
    const programmingKeywords = [
      'react', 'typescript', 'node', 'express', 'mongodb', 'mongoose',
      'component', 'jsx', 'props', 'state', 'hook', 'usestate', 'useeffect',
      'usereducer', 'virtual dom', 'api', 'rest', 'async', 'await',
      'closure', 'interface', 'generic', 'react native',
    ];
    return programmingKeywords.some(kw => q.includes(kw));
  }

  // Knowledge context is now embedded directly in getSystemInstruction()
  // so it's sent via Gemini's systemInstruction parameter (ground truth).

  /**
   * Generate AI response with conversation history and knowledge base
   */
  async generateResponse(
    userMessage: string,
    conversationHistory: ChatMessage[] = []
  ): Promise<string> {
    try {
      const systemInstruction = this.getSystemInstruction();

      // Build user prompt with history + question only (KB is in systemInstruction)
      const historyText = conversationHistory
        .slice(-3)
        .map((m) => `${m.role}: ${m.content}`)
        .join('\n');

      let userPrompt = '';
      if (historyText) {
        userPrompt += `Recent conversation:\n${historyText}\n\n`;
      }
      userPrompt += `Student question: ${userMessage}`;

      // Use systemInstruction so Gemini treats our KB as ground truth
      const result = await this.ai.models.generateContent({
        model: this.modelName,
        config: { systemInstruction },
        contents: userPrompt,
      });
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
      const historyText = conversationHistory
        .slice(-3)
        .map((m) => `${m.role}: ${m.content}`)
        .join('\n');

      const systemInstruction = this.getSystemInstruction();
      const userPrompt = `${historyText ? `Recent conversation:\n${historyText}\n\n` : ''}Question: ${userMessage}`;

      const result = await this.ai.models.generateContent({
        model: this.modelName,
        config: { systemInstruction },
        contents: userPrompt,
      });
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
      const historyText = conversationHistory
        .slice(-3)
        .map((m) => `${m.role}: ${m.content}`)
        .join('\n');
      const systemInstruction = this.getSystemInstruction();
      const userPrompt = `${historyText ? `Recent conversation:\n${historyText}\n\n` : ''}Question: ${userMessage}`;

      const result = await this.ai.models.generateContent({
        model: this.modelName,
        config: { systemInstruction },
        contents: userPrompt,
      });
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
        .join('\n');
      const systemInstruction = this.getSystemInstruction();
      const userPrompt = `${historyText ? `Recent conversation:\n${historyText}\n\n` : ''}Question: ${userMessage}`;

      const result = await this.ai.models.generateContent({
        model: this.modelName,
        config: { systemInstruction },
        contents: userPrompt,
      });
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