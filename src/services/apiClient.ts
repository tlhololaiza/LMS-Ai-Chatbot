/**
 * API Client for LMS Chatbot
 * Handles communication with the backend API for chat functionality
 */

import { ChatMessage } from '@/types/lms';

// Get API URL from environment variable with fallback
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * Request payload for chat messages
 */
export interface ChatRequest {
  message: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  metadata?: {
    courseId?: string;
    moduleId?: string;
    lessonId?: string;
    highlightedText?: string;
    textContext?: string;
    source?: string;
  };
}

/**
 * Response from the chat API
 */
export interface ChatResponse {
  response: string;
  timestamp: string;
  conversationId?: string;
  escalated?: boolean;
  draft?: any;
}

/**
 * API Error class for better error handling
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public statusText?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Validates HTTP response and throws appropriate errors
 */
async function validateResponse(response: Response): Promise<void> {
  if (!response.ok) {
    let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = `API request failed: ${response.status} ${response.statusText}`;
    }
    
    throw new APIError(errorMessage, response.status, response.statusText);
  }
}

/**
 * Converts ChatMessage array to conversation history format
 */
function formatConversationHistory(messages: ChatMessage[]) {
  return messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
    content: msg.content,
  }));
}

/**
 * Send a message to the chat API and get a complete response
 * 
 * @param request - Chat request payload
 * @returns Promise with chat response
 * @throws APIError on request failure
 */
export async function sendMessage(request: ChatRequest): Promise<ChatResponse> {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    await validateResponse(response);

    const data = await response.json();
    
    return {
      response: data.response || data.message || '',
      timestamp: data.timestamp || new Date().toISOString(),
      conversationId: data.conversationId,
      escalated: data.escalated,
      draft: data.draft,
    };
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    // Network or parsing errors
    throw new APIError(
      error instanceof Error ? error.message : 'Failed to send message',
      undefined,
      'Network Error'
    );
  }
}

export async function sendEscalationEmail(payload: { escalationId: string; subject: string; body: string; recipients: string[]; from?: string; }) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const res = await fetch(`${API_URL}/api/escalation/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to send escalation email');
  }
  return res.json();
}

/**
 * Stream a message response from the chat API
 * Yields chunks of the response as they arrive
 * 
 * @param request - Chat request payload
 * @yields Response chunks as they arrive
 * @throws APIError on request failure
 */
export async function* streamMessage(request: ChatRequest): AsyncGenerator<string, void, unknown> {
  try {
    const response = await fetch(`${API_URL}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    await validateResponse(response);

    if (!response.body) {
      throw new APIError('No response body received', response.status);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();
            
            // Skip empty data or [DONE] signal
            if (!data || data === '[DONE]') {
              continue;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.chunk) {
                yield parsed.chunk;
              } else if (parsed.response) {
                yield parsed.response;
              }
            } catch {
              // If not JSON, treat as plain text chunk
              yield data;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    
    throw new APIError(
      error instanceof Error ? error.message : 'Failed to stream message',
      undefined,
      'Network Error'
    );
  }
}

/**
 * Helper function to send message with conversation history from ChatMessage array
 */
export async function sendMessageWithHistory(
  message: string,
  conversationHistory: ChatMessage[],
  metadata?: ChatRequest['metadata']
): Promise<ChatResponse> {
  return sendMessage({
    message,
    conversationHistory: formatConversationHistory(conversationHistory),
    metadata,
  });
}

/**
 * Helper function to stream message with conversation history
 */
export async function* streamMessageWithHistory(
  message: string,
  conversationHistory: ChatMessage[],
  metadata?: ChatRequest['metadata']
): AsyncGenerator<string, void, unknown> {
  yield* streamMessage({
    message,
    conversationHistory: formatConversationHistory(conversationHistory),
    metadata,
  });
}

/**
 * Test API connection
 * 
 * @returns True if API is reachable, false otherwise
 */
export async function testConnection(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/health`, {
      method: 'GET',
    });
    
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get API configuration
 */
export function getAPIConfig() {
  return {
    apiUrl: API_URL,
    chatEndpoint: `${API_URL}/api/chat`,
    streamEndpoint: `${API_URL}/api/chat/stream`,
    healthEndpoint: `${API_URL}/api/health`,
  };
}
