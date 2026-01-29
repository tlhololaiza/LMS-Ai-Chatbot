export interface User {
  id: string;
  name: string;
  email: string;
  role: 'learner' | 'facilitator' | 'admin';
  avatar?: string;
  enrolledCourses?: string[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  progress: number;
  instructor: string;
  duration: string;
  enrolledCount: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  isCompleted: boolean;
  isLocked: boolean;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz' | 'task';
  duration: string;
  isCompleted: boolean;
  content?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded' | 'late';
  submissionUrl?: string;
  grade?: number;
  feedback?: string;
  moduleId: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  priority: 'normal' | 'important' | 'urgent';
  isRead: boolean;
}

// ============================================
// AI CHATBOT TYPES
// ============================================

/**
 * Type of context for a chat message
 * - general: Regular conversation
 * - explanation: Explaining highlighted text
 * - lesson: Lesson-specific question
 * - task: Task/assignment help
 */
export type ChatContextType = 'general' | 'explanation' | 'lesson' | 'task';

/**
 * Metadata associated with a chat message
 * Provides context for AI to generate better responses
 */
export interface ChatMessageMetadata {
  /** ID of the current course (if applicable) */
  courseId?: string;
  /** ID of the current module (if applicable) */
  moduleId?: string;
  /** ID of the current lesson (if applicable) */
  lessonId?: string;
  /** ID of the current task (if applicable) */
  taskId?: string;
  /** Text that was highlighted by the user */
  highlightedText?: string;
  /** Surrounding context of the highlighted text */
  textContext?: string;
  /** Source location of the highlighted text */
  source?: 'lesson' | 'module' | 'task' | 'announcement';
  /** User's current progress in the course (0-100) */
  userProgress?: number;
  /** Concepts the user has previously asked about */
  relatedConcepts?: string[];
}

/**
 * Enhanced chat message with context and metadata
 */
export interface ChatMessage {
  /** Unique identifier for the message */
  id: string;
  /** Message content */
  content: string;
  /** Sender of the message */
  sender: 'user' | 'bot';
  /** ISO timestamp of when message was sent */
  timestamp: string;
  /** Type of context for this message */
  contextType?: ChatContextType;
  /** Additional metadata for context-aware responses */
  metadata?: ChatMessageMetadata;
  /** Whether this message is part of a multi-turn conversation */
  isFollowUp?: boolean;
  /** ID of the parent message if this is a follow-up */
  parentMessageId?: string;
}

/**
 * Chat conversation context
 * Maintains state for intelligent conversation management
 */
export interface ChatContext {
  /** Current conversation ID */
  conversationId: string;
  /** All messages in the current conversation */
  messages: ChatMessage[];
  /** Current active context type */
  activeContextType: ChatContextType;
  /** Current course context */
  currentCourse?: {
    id: string;
    title: string;
    progress: number;
  };
  /** Current module context */
  currentModule?: {
    id: string;
    title: string;
    order: number;
  };
  /** Current lesson context */
  currentLesson?: {
    id: string;
    title: string;
    type: 'video' | 'reading' | 'quiz' | 'task';
  };
  /** Recently highlighted text with context */
  recentHighlights?: Array<{
    text: string;
    context: string;
    timestamp: string;
    source: 'lesson' | 'module' | 'task' | 'announcement';
  }>;
  /** Concepts discussed in this conversation */
  discussedConcepts: string[];
  /** User's learning profile for personalization */
  userProfile?: {
    preferredExplanationStyle: 'simple' | 'detailed' | 'technical';
    learningPace: 'slow' | 'medium' | 'fast';
    knownConcepts: string[];
  };
}

/**
 * Template for AI prompt construction
 */
export interface AIPromptTemplate {
  /** Template identifier */
  id: string;
  /** Template name */
  name: string;
  /** Type of context this template is for */
  contextType: ChatContextType;
  /** System message template */
  systemMessage: string;
  /** User message template with placeholders */
  userMessageTemplate: string;
  /** Variables that can be injected into the template */
  variables: string[];
  /** Example usage of the template */
  example?: string;
}

/**
 * Prompt building context
 * Used to construct context-rich prompts for AI
 */
export interface PromptBuildContext {
  /** User's query or highlighted text */
  userInput: string;
  /** Type of prompt to build */
  contextType: ChatContextType;
  /** Current chat context */
  chatContext: ChatContext;
  /** Current course information */
  courseInfo?: {
    title: string;
    currentModule: string;
    currentLesson: string;
    topics: string[];
  };
  /** User's recent activity */
  recentActivity?: {
    lastViewedLessons: string[];
    pendingTasks: string[];
    recentlyAskedQuestions: string[];
  };
  /** Relevant lesson content for context */
  lessonContent?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
}

/**
 * AI response configuration
 */
export interface AIResponseConfig {
  /** Maximum length of response in tokens */
  maxTokens?: number;
  /** Temperature for response generation (0-1) */
  temperature?: number;
  /** Whether to include code examples */
  includeCodeExamples?: boolean;
  /** Whether to include related concepts */
  includeRelatedConcepts?: boolean;
  /** Response format preference */
  format?: 'structured' | 'conversational' | 'tutorial';
  /** Tone of the response */
  tone?: 'friendly' | 'professional' | 'encouraging';
}

