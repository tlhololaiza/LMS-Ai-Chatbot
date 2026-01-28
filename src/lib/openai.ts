import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: For production, use a backend proxy
});

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Send a message to OpenAI and get a response
 * @param messages - Array of chat messages
 * @param model - OpenAI model to use (default: gpt-3.5-turbo)
 * @returns The AI's response
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  model: string = 'gpt-3.5-turbo'
): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('OpenAI API key is not configured. Please add your API key to the .env.local file.');
      }
      throw new Error(`Failed to get AI response: ${error.message}`);
    }
    
    throw new Error('An unexpected error occurred while communicating with OpenAI.');
  }
}

/**
 * Create a system prompt for the LMS chatbot
 */
export const systemPrompt: ChatMessage = {
  role: 'system',
  content: `You are a helpful learning assistant for CodeTribe Academy's Learning Management System. 
Your role is to:
- Help students understand programming concepts (React, TypeScript, JavaScript, etc.)
- Guide them through the platform features
- Answer questions about courses, tasks, and deadlines
- Provide coding tips and best practices
- Be encouraging and supportive

Keep your responses concise, clear, and educational. When explaining code concepts, use simple examples.
If students ask about specific deadlines or tasks, remind them to check the Tasks and Progress sections for up-to-date information.`,
};
