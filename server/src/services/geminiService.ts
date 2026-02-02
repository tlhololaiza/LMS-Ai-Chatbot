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
