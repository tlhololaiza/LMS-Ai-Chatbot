import {
  ChatContextType,
  AIPromptTemplate,
  PromptBuildContext,
  ChatContext,
  ChatMessage,
} from '@/types/lms';

// ============================================
// PROMPT TEMPLATES
// ============================================

/**
 * Predefined prompt templates for different conversation contexts
 */
export const PROMPT_TEMPLATES: Record<ChatContextType, AIPromptTemplate> = {
  general: {
    id: 'general_conversation',
    name: 'General Conversation',
    contextType: 'general',
    systemMessage: `You are a friendly and knowledgeable learning assistant for CodeTribe Academy, a coding bootcamp.
Your role is to help students with their learning journey by:
- Answering questions about courses, platform navigation, and deadlines
- Providing encouragement and motivation
- Guiding students to relevant resources
- Maintaining a supportive and educational tone

Keep responses concise, clear, and actionable. Use emojis sparingly for friendliness.`,
    userMessageTemplate: `Student question: {{userInput}}

Current context:
- Student is enrolled in: {{courseTitle}}
- Current progress: {{courseProgress}}%
- Active module: {{moduleTitle}}

Please provide a helpful response.`,
    variables: ['userInput', 'courseTitle', 'courseProgress', 'moduleTitle'],
  },

  explanation: {
    id: 'text_explanation',
    name: 'Text Explanation',
    contextType: 'explanation',
    systemMessage: `You are an expert programming educator at CodeTribe Academy.
Your role is to explain technical concepts clearly and effectively by:
- Providing a quick, simple overview first
- Following with detailed explanation
- Including practical, relevant code examples
- Suggesting related concepts to explore
- Adapting complexity to student's level

Structure your explanations with clear sections using emojis:
🎯 Quick Overview
📖 Detailed Explanation
💡 Practical Example
🔗 Related Topics

Always end with a follow-up question to check understanding.`,
    userMessageTemplate: `The student has highlighted this text: "{{highlightedText}}"

Context where it appears:
{{textContext}}

Course information:
- Course: {{courseTitle}}
- Module: {{moduleTitle}}
- Lesson: {{lessonTitle}}
- Lesson type: {{lessonType}}

Student's learning profile:
- Preferred style: {{explanationStyle}}
- Learning pace: {{learningPace}}
- Previously discussed: {{discussedConcepts}}

Please explain this concept in a way that helps the student understand it better.`,
    variables: [
      'highlightedText',
      'textContext',
      'courseTitle',
      'moduleTitle',
      'lessonTitle',
      'lessonType',
      'explanationStyle',
      'learningPace',
      'discussedConcepts',
    ],
    example: 'Explaining "JSX" from a React lesson',
  },

  lesson: {
    id: 'lesson_assistance',
    name: 'Lesson Assistance',
    contextType: 'lesson',
    systemMessage: `You are a dedicated tutor helping a student through their current lesson at CodeTribe Academy.
Your role is to:
- Answer questions specific to the lesson content
- Clarify confusing concepts from the lesson
- Provide additional examples related to the lesson
- Guide students through exercises
- Check understanding before moving on

Reference the specific lesson content when possible.
Use a patient, step-by-step teaching approach.`,
    userMessageTemplate: `Student question about current lesson: {{userInput}}

Lesson details:
- Title: {{lessonTitle}}
- Type: {{lessonType}}
- Duration: {{lessonDuration}}
- Topics covered: {{lessonTopics}}

Relevant lesson content:
{{lessonContent}}

Student progress:
- Lesson completion: {{lessonProgress}}%
- Previously asked: {{previousQuestions}}

Please help the student with their question about this lesson.`,
    variables: [
      'userInput',
      'lessonTitle',
      'lessonType',
      'lessonDuration',
      'lessonTopics',
      'lessonContent',
      'lessonProgress',
      'previousQuestions',
    ],
  },

  task: {
    id: 'task_help',
    name: 'Task & Assignment Help',
    contextType: 'task',
    systemMessage: `You are a helpful mentor assisting a student with their coding assignment at CodeTribe Academy.
Your role is to:
- Guide students through task requirements
- Help break down tasks into manageable steps
- Suggest approaches without giving complete solutions
- Debug and troubleshoot issues
- Provide best practices and code quality tips
- Encourage independent problem-solving

Important: Provide guidance, hints, and explanations rather than complete code solutions.
Help students learn by doing.`,
    userMessageTemplate: `Student needs help with task: {{taskTitle}}

Task details:
- Description: {{taskDescription}}
- Due date: {{taskDueDate}}
- Status: {{taskStatus}}
- Module: {{moduleTitle}}

Student's question/issue:
{{userInput}}

Related concepts:
{{relatedConcepts}}

Previous submissions/attempts:
{{previousAttempts}}

Please guide the student through this task challenge.`,
    variables: [
      'taskTitle',
      'taskDescription',
      'taskDueDate',
      'taskStatus',
      'moduleTitle',
      'userInput',
      'relatedConcepts',
      'previousAttempts',
    ],
  },
};

// ============================================
// PROMPT BUILDER FUNCTIONS
// ============================================

/**
 * Replace template variables with actual values
 */
function replaceTemplateVariables(template: string, variables: Record<string, string>): string {
  let result = template;

  Object.entries(variables).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, 'g'), value || 'N/A');
  });

  return result;
}

/**
 * Build a context-rich prompt for explanation requests
 */
export function buildExplanationPrompt(context: PromptBuildContext): { systemMessage: string; userMessage: string } {
  const template = PROMPT_TEMPLATES.explanation;

  const variables: Record<string, string> = {
    highlightedText: context.userInput,
    textContext: context.chatContext.recentHighlights?.[0]?.context || '',
    courseTitle: context.courseInfo?.title || context.chatContext.currentCourse?.title || 'Unknown Course',
    moduleTitle: context.courseInfo?.currentModule || context.chatContext.currentModule?.title || 'Unknown Module',
    lessonTitle: context.courseInfo?.currentLesson || context.chatContext.currentLesson?.title || 'Unknown Lesson',
    lessonType: context.chatContext.currentLesson?.type || 'reading',
    explanationStyle: context.chatContext.userProfile?.preferredExplanationStyle || 'detailed',
    learningPace: context.chatContext.userProfile?.learningPace || 'medium',
    discussedConcepts: context.chatContext.discussedConcepts.slice(0, 5).join(', ') || 'None yet',
  };

  return {
    systemMessage: template.systemMessage,
    userMessage: replaceTemplateVariables(template.userMessageTemplate, variables),
  };
}

/**
 * Build a context-rich prompt for general conversation
 */
export function buildGeneralPrompt(context: PromptBuildContext): { systemMessage: string; userMessage: string } {
  const template = PROMPT_TEMPLATES.general;

  const variables: Record<string, string> = {
    userInput: context.userInput,
    courseTitle: context.chatContext.currentCourse?.title || 'Multiple courses',
    courseProgress: context.chatContext.currentCourse?.progress.toString() || '0',
    moduleTitle: context.chatContext.currentModule?.title || 'None active',
  };

  return {
    systemMessage: template.systemMessage,
    userMessage: replaceTemplateVariables(template.userMessageTemplate, variables),
  };
}

/**
 * Build a context-rich prompt for lesson assistance
 */
export function buildLessonPrompt(context: PromptBuildContext): { systemMessage: string; userMessage: string } {
  const template = PROMPT_TEMPLATES.lesson;

  // Extract recent lesson-related questions
  const previousQuestions = context.chatContext.messages
    .filter((msg) => msg.sender === 'user' && msg.contextType === 'lesson')
    .slice(-3)
    .map((msg) => msg.content)
    .join('; ');

  const variables: Record<string, string> = {
    userInput: context.userInput,
    lessonTitle: context.chatContext.currentLesson?.title || 'Current Lesson',
    lessonType: context.chatContext.currentLesson?.type || 'reading',
    lessonDuration: '30 minutes', // Could be dynamic
    lessonTopics: context.courseInfo?.topics?.join(', ') || 'Various topics',
    lessonContent: context.lessonContent?.substring(0, 500) || 'Lesson content not available',
    lessonProgress: '50', // Could be dynamic
    previousQuestions: previousQuestions || 'No previous questions',
  };

  return {
    systemMessage: template.systemMessage,
    userMessage: replaceTemplateVariables(template.userMessageTemplate, variables),
  };
}

/**
 * Build a context-rich prompt for task help
 */
export function buildTaskPrompt(context: PromptBuildContext): { systemMessage: string; userMessage: string } {
  const template = PROMPT_TEMPLATES.task;

  const metadata = context.metadata || {};
  const variables: Record<string, string> = {
    taskTitle: (metadata.taskTitle as string) || 'Assignment',
    taskDescription: (metadata.taskDescription as string) || 'Task details not available',
    taskDueDate: (metadata.taskDueDate as string) || 'Not specified',
    taskStatus: (metadata.taskStatus as string) || 'pending',
    moduleTitle: context.chatContext.currentModule?.title || 'Module',
    userInput: context.userInput,
    relatedConcepts: context.courseInfo?.topics?.slice(0, 3).join(', ') || 'None specified',
    previousAttempts: 'First attempt', // Could be dynamic
  };

  return {
    systemMessage: template.systemMessage,
    userMessage: replaceTemplateVariables(template.userMessageTemplate, variables),
  };
}

/**
 * Main prompt builder - routes to appropriate builder based on context type
 */
export function buildPrompt(context: PromptBuildContext): { systemMessage: string; userMessage: string } {
  switch (context.contextType) {
    case 'explanation':
      return buildExplanationPrompt(context);
    case 'lesson':
      return buildLessonPrompt(context);
    case 'task':
      return buildTaskPrompt(context);
    case 'general':
    default:
      return buildGeneralPrompt(context);
  }
}

// ============================================
// CONVERSATION HISTORY FORMATTING
// ============================================

/**
 * Format conversation history for AI context
 * Includes only relevant recent messages to avoid token limits
 */
export function formatConversationHistory(
  messages: ChatMessage[],
  maxMessages: number = 5
): Array<{ role: 'user' | 'assistant'; content: string }> {
  return messages.slice(-maxMessages).map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.content,
  }));
}

/**
 * Create a summary of discussed concepts for context
 */
export function createConceptSummary(chatContext: ChatContext): string {
  if (chatContext.discussedConcepts.length === 0) {
    return 'This is the start of the conversation.';
  }

  const concepts = chatContext.discussedConcepts.slice(-10).join(', ');
  return `Previously discussed concepts: ${concepts}`;
}

/**
 * Extract key information from lesson content for context
 */
export function extractLessonKeyPoints(lessonContent: string, maxLength: number = 300): string {
  if (!lessonContent) return '';

  // Simple extraction: get first few paragraphs or code blocks
  const cleaned = lessonContent
    .replace(/```[\s\S]*?```/g, '[CODE EXAMPLE]') // Replace code blocks
    .replace(/#{1,6}\s/g, '') // Remove markdown headers
    .trim();

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  return cleaned.substring(0, maxLength) + '...';
}

/**
 * Build metadata object for message
 */
export function buildMessageMetadata(
  chatContext: ChatContext,
  additionalMetadata?: Record<string, unknown>
): ChatMessage['metadata'] {
  return {
    courseId: chatContext.currentCourse?.id,
    moduleId: chatContext.currentModule?.id,
    lessonId: chatContext.currentLesson?.id,
    highlightedText: chatContext.recentHighlights?.[0]?.text,
    textContext: chatContext.recentHighlights?.[0]?.context,
    source: chatContext.recentHighlights?.[0]?.source,
    userProgress: chatContext.currentCourse?.progress,
    relatedConcepts: chatContext.discussedConcepts.slice(-5),
    ...additionalMetadata,
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Detect if user input is asking for explanation
 */
export function detectExplanationRequest(userInput: string): boolean {
  const explanationKeywords = [
    'what is',
    'what does',
    'explain',
    'clarify',
    'what do you mean',
    'i don\'t understand',
    'help me understand',
    'can you explain',
    'tell me about',
  ];

  const lowerInput = userInput.toLowerCase();
  return explanationKeywords.some((keyword) => lowerInput.includes(keyword));
}

/**
 * Detect if user input is asking for task help
 */
export function detectTaskRequest(userInput: string): boolean {
  const taskKeywords = [
    'assignment',
    'task',
    'project',
    'homework',
    'how do i',
    'how to',
    'help with',
    'stuck on',
    'can\'t figure out',
    'not working',
    'error',
    'bug',
  ];

  const lowerInput = userInput.toLowerCase();
  return taskKeywords.some((keyword) => lowerInput.includes(keyword));
}

/**
 * Auto-detect appropriate context type from user input
 */
export function detectContextType(userInput: string, currentContext: ChatContextType): ChatContextType {
  if (detectExplanationRequest(userInput)) {
    return 'explanation';
  }

  if (detectTaskRequest(userInput)) {
    return 'task';
  }

  // If in lesson and asking question, keep lesson context
  if (currentContext === 'lesson') {
    return 'lesson';
  }

  return 'general';
}

export default {
  buildPrompt,
  formatConversationHistory,
  createConceptSummary,
  extractLessonKeyPoints,
  buildMessageMetadata,
  detectContextType,
  PROMPT_TEMPLATES,
};
