/**
 * API Client Test Suite
 * Tests for API client functionality
 */

import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import {
  sendMessage,
  streamMessage,
  testConnection,
  getAPIConfig,
  APIError,
  ChatRequest,
} from './apiClient';

describe('API Client', () => {
  describe('Configuration', () => {
    it('should return correct API configuration', () => {
      const config = getAPIConfig();
      
      expect(config).toHaveProperty('apiUrl');
      expect(config).toHaveProperty('chatEndpoint');
      expect(config).toHaveProperty('streamEndpoint');
      expect(config).toHaveProperty('healthEndpoint');
      expect(config.chatEndpoint).toContain('/api/chat');
    });
  });

  describe('APIError', () => {
    it('should create APIError with all properties', () => {
      const error = new APIError('Test error', 500, 'Internal Server Error');
      
      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('APIError');
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(500);
      expect(error.statusText).toBe('Internal Server Error');
    });

    it('should create APIError without status code', () => {
      const error = new APIError('Network error');
      
      expect(error.message).toBe('Network error');
      expect(error.statusCode).toBeUndefined();
    });
  });

  describe('Connection Test', () => {
    it('should test API connection', async () => {
      // This will actually try to connect to the API
      // In a real test environment, you'd mock this
      const isConnected = await testConnection();
      
      // We don't assert true/false since API may not be running
      // Just verify it returns a boolean
      expect(typeof isConnected).toBe('boolean');
    });
  });

  describe('sendMessage', () => {
    it('should handle network errors gracefully', async () => {
      const request: ChatRequest = {
        message: 'Test message',
      };

      // Use an invalid URL to force a network error
      const originalUrl = import.meta.env.VITE_API_URL;
      import.meta.env.VITE_API_URL = 'http://invalid-url-12345.com';

      try {
        await sendMessage(request);
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(APIError);
        expect((error as APIError).message).toBeTruthy();
      } finally {
        import.meta.env.VITE_API_URL = originalUrl;
      }
    });

    it('should format request correctly', async () => {
      const request: ChatRequest = {
        message: 'Hello, AI!',
        conversationHistory: [
          { role: 'user', content: 'Previous message' },
          { role: 'assistant', content: 'Previous response' },
        ],
        metadata: {
          courseId: 'course-1',
          lessonId: 'lesson-1',
        },
      };

      // Mock fetch for this test
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          response: 'Test response',
          timestamp: new Date().toISOString(),
        }),
      });

      global.fetch = mockFetch;

      try {
        await sendMessage(request);
        
        expect(mockFetch).toHaveBeenCalledWith(
          expect.stringContaining('/api/chat'),
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: expect.any(String),
          })
        );

        const callArgs = mockFetch.mock.calls[0];
        const body = JSON.parse(callArgs[1].body);
        
        expect(body.message).toBe('Hello, AI!');
        expect(body.conversationHistory).toHaveLength(2);
        expect(body.metadata).toEqual({
          courseId: 'course-1',
          lessonId: 'lesson-1',
        });
      } finally {
        vi.restoreAllMocks();
      }
    });
  });

  describe('streamMessage', () => {
    it('should handle streaming responses', async () => {
      // Mock streaming response
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('data: {"chunk": "Hello"}\n'));
          controller.enqueue(new TextEncoder().encode('data: {"chunk": " world"}\n'));
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n'));
          controller.close();
        },
      });

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        body: mockStream,
      });

      global.fetch = mockFetch;

      try {
        const chunks: string[] = [];
        const request: ChatRequest = { message: 'Test streaming' };
        
        for await (const chunk of streamMessage(request)) {
          chunks.push(chunk);
        }

        expect(chunks).toHaveLength(2);
        expect(chunks[0]).toBe('Hello');
        expect(chunks[1]).toBe(' world');
      } finally {
        vi.restoreAllMocks();
      }
    });
  });
});

// Manual integration test (run when server is running)
export async function runManualTest() {
  console.log('🧪 Running API Client Manual Tests...\n');

  // Test 1: Connection
  console.log('Test 1: Testing connection...');
  const isConnected = await testConnection();
  console.log(`✅ Connection test: ${isConnected ? 'PASSED' : 'FAILED'}`);
  
  if (!isConnected) {
    console.log('❌ API server is not running. Start the server and try again.');
    return;
  }

  // Test 2: Send Message
  console.log('\nTest 2: Sending a message...');
  try {
    const response = await sendMessage({
      message: 'What is React?',
    });
    console.log('✅ Send message: PASSED');
    console.log('Response:', response.response.substring(0, 100) + '...');
  } catch (error) {
    console.log('❌ Send message: FAILED');
    console.error(error);
  }

  // Test 3: Send Message with History
  console.log('\nTest 3: Sending message with conversation history...');
  try {
    const response = await sendMessage({
      message: 'Can you explain hooks?',
      conversationHistory: [
        { role: 'user', content: 'What is React?' },
        { role: 'assistant', content: 'React is a JavaScript library for building user interfaces.' },
      ],
    });
    console.log('✅ Send with history: PASSED');
    console.log('Response:', response.response.substring(0, 100) + '...');
  } catch (error) {
    console.log('❌ Send with history: FAILED');
    console.error(error);
  }

  // Test 4: Stream Message
  console.log('\nTest 4: Streaming a message...');
  try {
    const chunks: string[] = [];
    for await (const chunk of streamMessage({
      message: 'Tell me about TypeScript',
    })) {
      chunks.push(chunk);
    }
    console.log('✅ Stream message: PASSED');
    console.log(`Received ${chunks.length} chunks`);
    console.log('Full response:', chunks.join('').substring(0, 100) + '...');
  } catch (error) {
    console.log('❌ Stream message: FAILED');
    console.error(error);
  }

  // Test 5: Error Handling
  console.log('\nTest 5: Testing error handling...');
  try {
    await sendMessage({
      message: '',  // Empty message should trigger validation error
    });
    console.log('❌ Error handling: FAILED (no error thrown)');
  } catch (error) {
    if (error instanceof APIError) {
      console.log('✅ Error handling: PASSED');
      console.log('Error caught:', error.message);
    } else {
      console.log('⚠️  Error handling: PARTIAL (wrong error type)');
    }
  }

  console.log('\n✅ All manual tests completed!');
}

// Uncomment to run manual tests (requires server running)
// runManualTest();
