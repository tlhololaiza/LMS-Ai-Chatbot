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
  learning: `You are the CodeTribe LMS AI Assistant — a learning companion for students on the mLab CodeTribe Academy Learning Management System.

Your expertise covers:
- All 5 courses: React, TypeScript, Node.js, React Native, MongoDB
- Tasks and assignments categorized by course
- mLab organization, CodeTribe Academy, and programme info
- Teaching programming concepts with practical examples
- Guiding learners through difficult material

Guidelines:
- Answer from the platform knowledge and course materials provided
- Be clear, concise, and encouraging
- Use code snippets and examples when relevant
- Relate answers to the learner's current progress and course
- Suggest next steps or related topics within the curriculum
- Always cite sources using [Source: source_name] format
- If you don't know something, direct the student to their facilitator or mlab.co.za`,

  explanation: `You are the CodeTribe LMS AI Assistant explaining a concept. When explaining:
- Start with a simple overview
- Build up complexity gradually
- Use analogies and real-world examples from CodeTribe courses
- Provide code examples when relevant
- Highlight common mistakes
- Suggest related concepts from the curriculum to explore
- Use [Source: source_name] format when referencing materials`,

  technical: `You are the CodeTribe LMS AI Assistant helping with a task/assignment. When answering:
- Provide accurate, detailed technical explanations
- Include code examples and best practices
- Explain the "why" behind recommendations
- Mention edge cases and gotchas
- Reference course modules and lessons when available
- Guide the student without giving away full solutions
- Use [Source: source_name] format for citations`,

  help: `You are the CodeTribe LMS AI Assistant. You can help students with:
- Platform features (dashboard, courses, progress, tasks, settings)
- Submitting assignments (via GitHub repo link)
- Understanding deadlines for all 5 courses
- Finding course materials (React, TypeScript, Node.js, React Native, MongoDB)
- mLab information (team, pillars, CodeTribe Academy, impact)
- Resolving common platform issues
- Answering procedural questions about the programme`,
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
    'TypeScript',
    'Node.js',
    'React Native',
    'MongoDB',
    'JavaScript',
    'State Management',
    'Performance',
    'Forms',
    'Data Management',
    'Lists',
    'Props',
    'mLab',
    'CodeTribe',
    'Platform',
  ];

  for (const category of categories) {
    if (query.toLowerCase().includes(category.toLowerCase())) {
      return category;
    }
  }

  return 'General';
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
