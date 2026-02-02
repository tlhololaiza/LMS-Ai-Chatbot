import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { knowledgeBase } from '../data/knowledgeBase.js';

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
