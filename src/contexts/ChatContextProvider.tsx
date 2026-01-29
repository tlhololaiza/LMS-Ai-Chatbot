import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  ChatMessage,
  ChatContext,
  ChatContextType,
  ChatMessageMetadata,
} from '@/types/lms';

interface ChatContextProviderProps {
  children: ReactNode;
  userId?: string;
}

interface ChatContextValue {
  /** Current chat context state */
  context: ChatContext;
  /** Add a new message to the conversation */
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => ChatMessage;
  /** Update the active context type */
  setActiveContextType: (contextType: ChatContextType) => void;
  /** Set current course context */
  setCurrentCourse: (course: { id: string; title: string; progress: number }) => void;
  /** Set current module context */
  setCurrentModule: (module: { id: string; title: string; order: number }) => void;
  /** Set current lesson context */
  setCurrentLesson: (lesson: { id: string; title: string; type: 'video' | 'reading' | 'quiz' | 'task' }) => void;
  /** Store highlighted text with context */
  addHighlight: (text: string, context: string, source: 'lesson' | 'module' | 'task' | 'announcement') => void;
  /** Clear all highlights */
  clearHighlights: () => void;
  /** Add a discussed concept */
  addDiscussedConcept: (concept: string) => void;
  /** Clear conversation history */
  clearConversation: () => void;
  /** Get conversation history */
  getConversationHistory: () => ChatMessage[];
  /** Get messages by context type */
  getMessagesByContextType: (contextType: ChatContextType) => ChatMessage[];
  /** Update user learning profile */
  updateUserProfile: (profile: Partial<ChatContext['userProfile']>) => void;
  /** Get the last N messages */
  getRecentMessages: (count: number) => ChatMessage[];
  /** Check if a concept has been discussed */
  hasDiscussedConcept: (concept: string) => boolean;
}

const ChatContextContext = createContext<ChatContextValue | undefined>(undefined);

const CONVERSATION_STORAGE_KEY = 'lms_chat_conversation';
const MAX_HIGHLIGHTS = 10; // Keep only recent highlights
const MAX_MESSAGES = 100; // Limit conversation history

/**
 * Chat Context Provider
 * Manages conversation state, history, and context for AI interactions
 */
export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ children, userId }) => {
  const [context, setContext] = useState<ChatContext>(() => {
    // Try to restore conversation from localStorage
    const stored = localStorage.getItem(CONVERSATION_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse stored conversation:', error);
      }
    }

    // Initialize with default context
    return {
      conversationId: generateConversationId(),
      messages: [],
      activeContextType: 'general',
      discussedConcepts: [],
      recentHighlights: [],
    };
  });

  /**
   * Persist conversation to localStorage
   */
  useEffect(() => {
    try {
      localStorage.setItem(CONVERSATION_STORAGE_KEY, JSON.stringify(context));
    } catch (error) {
      console.error('Failed to persist conversation:', error);
    }
  }, [context]);

  /**
   * Generate a unique conversation ID
   */
  const generateConversationId = useCallback(() => {
    return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }, []);

  /**
   * Generate a unique message ID
   */
  const generateMessageId = useCallback(() => {
    return `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }, []);

  /**
   * Add a new message to the conversation
   */
  const addMessage = useCallback((message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateMessageId(),
      timestamp: new Date().toISOString(),
      contextType: message.contextType || context.activeContextType,
    };

    setContext((prev) => {
      const updatedMessages = [...prev.messages, newMessage];
      
      // Limit message history
      if (updatedMessages.length > MAX_MESSAGES) {
        updatedMessages.splice(0, updatedMessages.length - MAX_MESSAGES);
      }

      return {
        ...prev,
        messages: updatedMessages,
      };
    });

    return newMessage;
  }, [context.activeContextType, generateMessageId]);

  /**
   * Update the active context type
   */
  const setActiveContextType = useCallback((contextType: ChatContextType) => {
    setContext((prev) => ({
      ...prev,
      activeContextType: contextType,
    }));
  }, []);

  /**
   * Set current course context
   */
  const setCurrentCourse = useCallback((course: { id: string; title: string; progress: number }) => {
    setContext((prev) => ({
      ...prev,
      currentCourse: course,
    }));
  }, []);

  /**
   * Set current module context
   */
  const setCurrentModule = useCallback((module: { id: string; title: string; order: number }) => {
    setContext((prev) => ({
      ...prev,
      currentModule: module,
    }));
  }, []);

  /**
   * Set current lesson context
   */
  const setCurrentLesson = useCallback((lesson: { id: string; title: string; type: 'video' | 'reading' | 'quiz' | 'task' }) => {
    setContext((prev) => ({
      ...prev,
      currentLesson: lesson,
      activeContextType: 'lesson', // Auto-switch to lesson context
    }));
  }, []);

  /**
   * Store highlighted text with context
   */
  const addHighlight = useCallback((text: string, textContext: string, source: 'lesson' | 'module' | 'task' | 'announcement') => {
    setContext((prev) => {
      const newHighlight = {
        text,
        context: textContext,
        timestamp: new Date().toISOString(),
        source,
      };

      const updatedHighlights = [newHighlight, ...(prev.recentHighlights || [])];

      // Keep only recent highlights
      if (updatedHighlights.length > MAX_HIGHLIGHTS) {
        updatedHighlights.splice(MAX_HIGHLIGHTS);
      }

      return {
        ...prev,
        recentHighlights: updatedHighlights,
        activeContextType: 'explanation', // Auto-switch to explanation context
      };
    });
  }, []);

  /**
   * Clear all highlights
   */
  const clearHighlights = useCallback(() => {
    setContext((prev) => ({
      ...prev,
      recentHighlights: [],
    }));
  }, []);

  /**
   * Add a discussed concept
   */
  const addDiscussedConcept = useCallback((concept: string) => {
    setContext((prev) => {
      const lowerConcept = concept.toLowerCase().trim();
      if (prev.discussedConcepts.includes(lowerConcept)) {
        return prev; // Already discussed
      }

      return {
        ...prev,
        discussedConcepts: [...prev.discussedConcepts, lowerConcept],
      };
    });
  }, []);

  /**
   * Clear conversation history
   */
  const clearConversation = useCallback(() => {
    setContext({
      conversationId: generateConversationId(),
      messages: [],
      activeContextType: 'general',
      discussedConcepts: [],
      recentHighlights: [],
      currentCourse: context.currentCourse, // Preserve course context
      currentModule: context.currentModule, // Preserve module context
      currentLesson: context.currentLesson, // Preserve lesson context
      userProfile: context.userProfile, // Preserve user profile
    });

    localStorage.removeItem(CONVERSATION_STORAGE_KEY);
  }, [context.currentCourse, context.currentModule, context.currentLesson, context.userProfile, generateConversationId]);

  /**
   * Get conversation history
   */
  const getConversationHistory = useCallback((): ChatMessage[] => {
    return context.messages;
  }, [context.messages]);

  /**
   * Get messages by context type
   */
  const getMessagesByContextType = useCallback((contextType: ChatContextType): ChatMessage[] => {
    return context.messages.filter((msg) => msg.contextType === contextType);
  }, [context.messages]);

  /**
   * Update user learning profile
   */
  const updateUserProfile = useCallback((profile: Partial<ChatContext['userProfile']>) => {
    setContext((prev) => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        ...profile,
      } as ChatContext['userProfile'],
    }));
  }, []);

  /**
   * Get the last N messages
   */
  const getRecentMessages = useCallback((count: number): ChatMessage[] => {
    return context.messages.slice(-count);
  }, [context.messages]);

  /**
   * Check if a concept has been discussed
   */
  const hasDiscussedConcept = useCallback((concept: string): boolean => {
    return context.discussedConcepts.includes(concept.toLowerCase().trim());
  }, [context.discussedConcepts]);

  const value: ChatContextValue = {
    context,
    addMessage,
    setActiveContextType,
    setCurrentCourse,
    setCurrentModule,
    setCurrentLesson,
    addHighlight,
    clearHighlights,
    addDiscussedConcept,
    clearConversation,
    getConversationHistory,
    getMessagesByContextType,
    updateUserProfile,
    getRecentMessages,
    hasDiscussedConcept,
  };

  return <ChatContextContext.Provider value={value}>{children}</ChatContextContext.Provider>;
};

/**
 * Hook to use chat context
 * Must be used within ChatContextProvider
 */
export const useChatContext = (): ChatContextValue => {
  const context = useContext(ChatContextContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatContextProvider');
  }
  return context;
};

export default ChatContextProvider;
