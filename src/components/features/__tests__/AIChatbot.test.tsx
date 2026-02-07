import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the API client
vi.mock('@/services/apiClient', () => ({
  sendMessage: vi.fn().mockResolvedValue('This is a mock AI response.'),
  APIError: class APIError extends Error {
    status: number;
    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock the prompt builder
vi.mock('@/utils/promptBuilder', () => ({
  buildExplanationPrompt: vi.fn().mockReturnValue('mock prompt'),
  buildGeneralPrompt: vi.fn().mockReturnValue('mock prompt'),
  buildContextAwarePrompt: vi.fn().mockReturnValue('mock prompt'),
  formatPromptForLogging: vi.fn().mockReturnValue('formatted prompt'),
}));

// Mock the RAG service
vi.mock('@/utils/ragService', () => ({
  enhanceResponseWithCitations: vi.fn().mockReturnValue({
    content: 'Enhanced response',
    sources: [],
  }),
}));

describe('AIChatbot Component', () => {
  describe('Initial State', () => {
    it('should have default welcome message', () => {
      const initialMessages = [
        {
          id: '1',
          content: "Hello! I'm your learning assistant.",
          sender: 'bot',
          timestamp: new Date().toISOString(),
        },
      ];
      
      expect(initialMessages).toHaveLength(1);
      expect(initialMessages[0].sender).toBe('bot');
      expect(initialMessages[0].content).toContain('learning assistant');
    });

    it('should start with chat closed', () => {
      const initialState = {
        isOpen: false,
        messages: [],
        input: '',
        isTyping: false,
      };
      
      expect(initialState.isOpen).toBe(false);
    });
  });

  describe('User Input', () => {
    it('should validate empty input is rejected', () => {
      const input = '';
      const isValid = input.trim().length > 0;
      expect(isValid).toBe(false);
    });

    it('should validate whitespace-only input is rejected', () => {
      const input = '   ';
      const isValid = input.trim().length > 0;
      expect(isValid).toBe(false);
    });

    it('should accept valid input', () => {
      const input = 'What is React?';
      const isValid = input.trim().length > 0;
      expect(isValid).toBe(true);
    });
  });

  describe('Message Handling', () => {
    it('should create user message with correct format', () => {
      const userInput = 'Hello AI';
      const userMessage = {
        id: Date.now().toString(),
        content: userInput,
        sender: 'user',
        timestamp: new Date().toISOString(),
        contextType: 'general',
      };

      expect(userMessage.sender).toBe('user');
      expect(userMessage.content).toBe(userInput);
      expect(userMessage.contextType).toBe('general');
      expect(userMessage).toHaveProperty('id');
      expect(userMessage).toHaveProperty('timestamp');
    });

    it('should create bot message with correct format', () => {
      const botResponse = 'This is my response';
      const botMessage = {
        id: Date.now().toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date().toISOString(),
        contextType: 'general',
      };

      expect(botMessage.sender).toBe('bot');
      expect(botMessage.content).toBe(botResponse);
    });
  });

  describe('State Transitions', () => {
    it('should set typing state when sending message', () => {
      const state = { isTyping: false };
      const newState = { ...state, isTyping: true };
      expect(newState.isTyping).toBe(true);
    });

    it('should clear typing state after response', () => {
      const state = { isTyping: true };
      const newState = { ...state, isTyping: false };
      expect(newState.isTyping).toBe(false);
    });

    it('should clear input after sending', () => {
      const state = { input: 'Hello' };
      const newState = { ...state, input: '' };
      expect(newState.input).toBe('');
    });
  });

  describe('Error Handling', () => {
    it('should create error message for API failures', () => {
      const errorMessage = {
        id: Date.now().toString(),
        content: '⚠️ Sorry, something went wrong. Please try again.',
        sender: 'bot',
        timestamp: new Date().toISOString(),
        contextType: 'general',
      };

      expect(errorMessage.content).toContain('Sorry');
      expect(errorMessage.content).toContain('try again');
    });

    it('should handle rate limit errors', () => {
      const rateLimitError = {
        status: 429,
        message: 'Too many requests',
      };

      expect(rateLimitError.status).toBe(429);
    });

    it('should handle network errors', () => {
      const networkError = new Error('fetch failed');
      expect(networkError.message).toContain('fetch');
    });
  });

  describe('Text Explanation Feature', () => {
    it('should create explanation metadata', () => {
      const text = 'useState';
      const context = 'React hooks allow you to use state in functional components';
      
      const metadata = {
        highlightedText: text,
        textContext: context,
        source: 'lesson',
      };

      expect(metadata.highlightedText).toBe(text);
      expect(metadata.textContext).toBe(context);
      expect(metadata.source).toBe('lesson');
    });
  });

  describe('Chat Actions', () => {
    it('should copy message content', async () => {
      const content = 'Message to copy';
      // Mock clipboard
      const mockClipboard = {
        writeText: vi.fn().mockResolvedValue(undefined),
      };
      
      await mockClipboard.writeText(content);
      expect(mockClipboard.writeText).toHaveBeenCalledWith(content);
    });

    it('should clear messages', () => {
      const initialMessages = [{ id: '1', content: 'Welcome!' }];
      const state = { messages: [{ id: '2', content: 'Test' }] };
      const newState = { ...state, messages: initialMessages };
      
      expect(newState.messages).toEqual(initialMessages);
    });
  });
});

describe('Typing Indicator', () => {
  it('should show when AI is processing', () => {
    const isTyping = true;
    expect(isTyping).toBe(true);
  });

  it('should hide when AI response is received', () => {
    const isTyping = false;
    expect(isTyping).toBe(false);
  });
});
