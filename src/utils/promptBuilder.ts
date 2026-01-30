/**
 * Prompt Builder Utility
 * Constructs context-aware prompts for the AI chatbot
 */

import { ChatMessageMetadata } from '@/types/lms';
import {
  createEnhancedPrompt,
  EnhancedPrompt,
  retrieveRelevantContent,
  retrieveContextualContent,
  retrieveFAQContent,
  retrieveTermExplanation,
  RAGContext,
} from './ragService';

// ============================================
// PROMPT TEMPLATES
// ============================================

const SYSTEM_PROMPTS = {
  learning: `You are an expert learning assistant for an LMS platform. Your expertise includes:
- Teaching programming concepts clearly with practical examples
- Answering questions about course materials and assignments
- Guiding learners through difficult concepts
- Providing encouragement and study tips

Guidelines:
- Be clear and concise in your explanations
- Use examples and code snippets when relevant
- Relate answers to the learner's current progress
- Suggest next steps or related topics
- Always cite sources when using provided materials
- Format code examples with proper syntax highlighting`,

  explanation: `You are an expert at explaining concepts. When explaining:
- Start with a simple overview
- Build up complexity gradually
- Use analogies and real-world examples
- Provide code examples when relevant
- Highlight common mistakes
- Suggest related concepts to explore
- Use [Source: source_name] format when referencing materials`,

  technical: `You are a technical expert assistant. When answering technical questions:
- Provide accurate, detailed explanations
- Include code examples and best practices
- Explain the "why" behind recommendations
- Mention edge cases and gotchas
- Reference official documentation when available
- Suggest testing approaches
- Use [Source: source_name] format for citations`,

  help: `You are a helpful support assistant for the learning platform. You can help with:
- How to use platform features
- Submitting assignments
- Understanding deadlines
- Finding course materials
- Resolving common issues
- Answering procedural questions`,
};

// ============================================
// PUBLIC FUNCTIONS
// ============================================

/**
 * Build a context-aware system prompt based on chat context
 */
export function buildSystemPrompt(metadata?: Partial<ChatMessageMetadata>): string {
  let prompt = SYSTEM_PROMPTS.learning;

  // Customize based on metadata
  if (metadata?.source === 'lesson') {
    prompt = SYSTEM_PROMPTS.explanation;
  } else if (metadata?.source === 'task') {
    prompt = SYSTEM_PROMPTS.technical;
  }

  // Add user progress context
  if (metadata?.userProgress !== undefined) {
    const level =
      metadata.userProgress < 30
        ? 'beginner'
        : metadata.userProgress < 70
          ? 'intermediate'
          : 'advanced';

    prompt += `\n\nThe user is at a ${level} level with ${metadata.userProgress}% progress in their current course.
Tailor your explanation and difficulty level accordingly.`;
  }

  // Add course context
  if (metadata?.courseId) {
    prompt += `\n\nThe user is studying a specific course. Use course-relevant examples when possible.`;
  }

  return prompt;
}

/**
 * Build user prompt with optional RAG augmentation
 */
export function buildUserPrompt(
  userMessage: string,
  metadata?: Partial<ChatMessageMetadata>,
  useRAG: boolean = true,
): EnhancedPrompt {
  if (!useRAG) {
    // Return non-augmented prompt
    return {
      systemPrompt: buildSystemPrompt(metadata),
      userPrompt: userMessage,
      context: {
        sources: [],
        combinedContent: '',
        citations: [],
        relevanceScore: 0,
      },
      citations: [],
    };
  }

  // Use RAG for context augmentation
  return createEnhancedPrompt(userMessage, metadata, true);
}

/**
 * Build prompt for explaining highlighted text
 */
export function buildExplanationPrompt(
  highlightedText: string,
  context?: string,
  metadata?: Partial<ChatMessageMetadata>,
): EnhancedPrompt {
  // Try to get term explanation first
  let ragContext = retrieveTermExplanation(highlightedText);

  // If no direct match, search broadly
  if (ragContext.sources.length === 0) {
    ragContext = retrieveRelevantContent(highlightedText, metadata, 5);
  }

  const systemPrompt = `${SYSTEM_PROMPTS.explanation}

The user has highlighted text and wants an explanation. Focus your answer on the highlighted content.
${context ? `Context from lesson: "${context.substring(0, 200)}"` : ''}`;

  const userPrompt = `Can you explain: "${highlightedText}"?
${context ? `\nContext: ${context}` : ''}`;

  return {
    systemPrompt,
    userPrompt,
    context: ragContext,
    citations: ragContext.citations,
  };
}

/**
 * Build prompt for lesson-specific questions
 */
export function buildLessonPrompt(
  lessonId: string,
  courseId: string,
  userQuery: string,
  moduleId?: string,
): EnhancedPrompt {
  const metadata: Partial<ChatMessageMetadata> = {
    lessonId,
    courseId,
    moduleId,
    source: 'lesson',
  };

  // Get contextual content for the lesson
  const ragContext = retrieveContextualContent(courseId, moduleId, lessonId);

  const systemPrompt = `${SYSTEM_PROMPTS.learning}

The user is studying a specific lesson: ${lessonId}
Use the provided course materials to inform your answer.`;

  return {
    systemPrompt,
    userPrompt: userQuery,
    context: ragContext,
    citations: ragContext.citations,
  };
}

/**
 * Build prompt for frequently asked questions
 */
export function buildFAQPrompt(
  category: string,
  userQuery: string,
): EnhancedPrompt {
  const ragContext = retrieveFAQContent(category);

  const systemPrompt = `${SYSTEM_PROMPTS.help}

Common questions in this category have been provided below.
Use them to answer accurately and comprehensively.`;

  return {
    systemPrompt,
    userPrompt: userQuery,
    context: ragContext,
    citations: ragContext.citations,
  };
}

/**
 * Build prompt for task/assignment help
 */
export function buildTaskPrompt(
  taskId: string,
  courseId: string,
  userQuery: string,
): EnhancedPrompt {
  const metadata: Partial<ChatMessageMetadata> = {
    taskId,
    courseId,
    source: 'task',
  };

  const ragContext = retrieveRelevantContent(userQuery, metadata, 5);

  const systemPrompt = `${SYSTEM_PROMPTS.technical}

The user is working on a task assignment.
Provide helpful guidance without directly giving away solutions.
Encourage understanding of underlying concepts.`;

  return {
    systemPrompt,
    userPrompt: userQuery,
    context: ragContext,
    citations: ragContext.citations,
  };
}

/**
 * Build a general query prompt with RAG
 */
export function buildGeneralPrompt(
  userQuery: string,
  metadata?: Partial<ChatMessageMetadata>,
): EnhancedPrompt {
  return createEnhancedPrompt(userQuery, metadata, true);
}

/**
 * Detect context from user query and build appropriate prompt
 */
export function buildContextAwarePrompt(
  userQuery: string,
  metadata?: Partial<ChatMessageMetadata>,
): EnhancedPrompt {
  // Detect if user is asking about specific topic
  const isExplanation = detectExplanationRequest(userQuery);
  const isFAQ = detectFAQRequest(userQuery);
  const isTask = metadata?.source === 'task';
  const isLesson = metadata?.source === 'lesson';

  if (isExplanation && metadata?.highlightedText) {
    return buildExplanationPrompt(metadata.highlightedText, undefined, metadata);
  }

  if (isFAQ) {
    const category = extractCategoryFromQuery(userQuery);
    return buildFAQPrompt(category, userQuery);
  }

  if (isLesson && metadata?.lessonId) {
    return buildLessonPrompt(
      metadata.lessonId,
      metadata.courseId || '',
      userQuery,
      metadata.moduleId,
    );
  }

  if (isTask && metadata?.taskId) {
    return buildTaskPrompt(metadata.taskId, metadata.courseId || '', userQuery);
  }

  // Default: use general prompt with RAG
  return buildGeneralPrompt(userQuery, metadata);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Detect if user is asking for an explanation
 */
function detectExplanationRequest(query: string): boolean {
  const explanationKeywords = [
    'explain',
    'what is',
    'what are',
    'how does',
    'tell me about',
    'define',
    'clarify',
    'understand',
    'confused about',
  ];

  const lowerQuery = query.toLowerCase();
  return explanationKeywords.some((keyword) => lowerQuery.includes(keyword));
}

/**
 * Detect if user is asking a frequently asked question
 */
function detectFAQRequest(query: string): boolean {
  const faqKeywords = [
    'how do i',
    'how can i',
    'how to',
    'how do you',
    'what should i',
    'when should i',
    'can i',
    'am i',
  ];

  const lowerQuery = query.toLowerCase();
  return faqKeywords.some((keyword) => lowerQuery.includes(keyword));
}

/**
 * Extract potential category from FAQ query
 */
function extractCategoryFromQuery(query: string): string {
  const categories = [
    'React',
    'JavaScript',
    'State Management',
    'Performance',
    'Forms',
    'Data Management',
    'Lists',
    'Props',
  ];

  for (const category of categories) {
    if (query.toLowerCase().includes(category.toLowerCase())) {
      return category;
    }
  }

  return 'React Concepts';
}

/**
 * Format prompt for display/logging
 */
export function formatPromptForLogging(prompt: EnhancedPrompt): string {
  let formatted = '=== ENHANCED PROMPT ===\n\n';

  formatted += '--- SYSTEM PROMPT ---\n';
  formatted += prompt.systemPrompt + '\n\n';

  formatted += '--- USER QUERY ---\n';
  formatted += prompt.userPrompt + '\n\n';

  if (prompt.context.sources.length > 0) {
    formatted += '--- RAG CONTEXT ---\n';
    formatted += `Sources: ${prompt.context.sources.length}\n`;
    formatted += `Relevance: ${(prompt.context.relevanceScore * 100).toFixed(0)}%\n\n`;

    formatted += '--- CITATIONS ---\n';
    prompt.citations.forEach((citation, idx) => {
      formatted += `[${idx + 1}] ${citation.sourceTitle} (${citation.sourceType})\n`;
    });
  }

  return formatted;
}
