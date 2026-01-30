/**
 * RAG (Retrieval Augmented Generation) Service
 * Retrieves relevant content from knowledge base and injects it into AI prompts
 */

import {
  searchKnowledgeBase,
  getLearningPath,
  getContextualSuggestions,
  getConceptByTerm,
  getFAQsByCategory,
  terminology,
} from '@/data/knowledgeBase';
import { ChatMessageMetadata } from '@/types/lms';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface RetrievedSource {
  type: 'concept' | 'faq' | 'lesson' | 'definition';
  id: string;
  title: string;
  content: string;
  relevance: number;
  category?: string;
}

export interface RAGContext {
  sources: RetrievedSource[];
  combinedContent: string;
  citations: SourceCitation[];
  relevanceScore: number;
}

export interface SourceCitation {
  sourceId: string;
  sourceTitle: string;
  sourceType: 'concept' | 'faq' | 'lesson' | 'definition';
  url?: string;
}

export interface EnhancedPrompt {
  systemPrompt: string;
  userPrompt: string;
  context: RAGContext;
  citations: SourceCitation[];
}

// ============================================
// RETRIEVAL FUNCTIONS
// ============================================

/**
 * Retrieve relevant content based on user query and metadata context
 * Ranks results by relevance and combines multiple sources
 */
export function retrieveRelevantContent(
  query: string,
  metadata?: Partial<ChatMessageMetadata>,
  maxSources: number = 5,
): RAGContext {
  // Search knowledge base
  const searchResults = searchKnowledgeBase(query);

  // Filter by difficulty if user progress is known
  let filtered = searchResults;
  if (metadata?.userProgress !== undefined) {
    // Suggest content slightly above current level for growth
    const currentLevel = getUserLevelFromProgress(metadata.userProgress);
    filtered = searchResults.filter((result) => {
      const difficulty = getDifficultyFromResult(result);
      return isSuitableDifficulty(difficulty, currentLevel);
    });
  }

  // Get contextual suggestions if lesson/module is known
  if (metadata?.lessonId) {
    const suggestions = getContextualSuggestions(metadata.lessonId);
    const suggestionSources: RetrievedSource[] = [
      ...suggestions.relatedConcepts.map((concept) => ({
        type: 'concept' as const,
        id: concept.id,
        title: concept.term,
        content: concept.explanation,
        relevance: 0.7,
      })),
      ...suggestions.helpfulFAQs.map((faq) => ({
        type: 'faq' as const,
        id: faq.id,
        title: faq.question,
        content: faq.answer,
        relevance: 0.65,
      })),
    ];
    filtered = [...filtered, ...suggestionSources];
  }

  // Remove duplicates and limit results
  const sources = deduplicateSources(filtered).slice(0, maxSources);

  // Generate combined content for prompt injection
  const combinedContent = combineSources(sources);

  // Create citations
  const citations = sources.map((source) => ({
    sourceId: source.id,
    sourceTitle: source.title,
    sourceType: source.type,
  }));

  // Calculate overall relevance score
  const relevanceScore =
    sources.length > 0
      ? sources.reduce((sum, s) => sum + s.relevance, 0) / sources.length
      : 0;

  return {
    sources,
    combinedContent,
    citations,
    relevanceScore,
  };
}

/**
 * Retrieve content based on course/module context
 */
export function retrieveContextualContent(
  courseId?: string,
  moduleId?: string,
  lessonId?: string,
): RAGContext {
  const sources: RetrievedSource[] = [];

  // If lesson is specified, get learning path
  if (lessonId) {
    // Extract concept from lesson ID for learning path
    const conceptName = extractConceptFromLessonId(lessonId);
    const learningPath = getLearningPath(conceptName);

    // Add prerequisites
    learningPath.prerequisites.forEach((concept) => {
      sources.push({
        type: 'concept',
        id: concept.id,
        title: `${concept.term} (Prerequisite)`,
        content: concept.explanation,
        relevance: 0.85,
        category: concept.category,
      });
    });

    // Add related FAQs
    learningPath.relatedFAQs.forEach((faq) => {
      sources.push({
        type: 'faq',
        id: faq.id,
        title: faq.question,
        content: faq.answer,
        relevance: 0.75,
      });
    });
  }

  const combinedContent = combineSources(sources);
  const citations = sources.map((source) => ({
    sourceId: source.id,
    sourceTitle: source.title,
    sourceType: source.type,
  }));

  const relevanceScore =
    sources.length > 0
      ? sources.reduce((sum, s) => sum + s.relevance, 0) / sources.length
      : 0;

  return {
    sources,
    combinedContent,
    citations,
    relevanceScore,
  };
}

/**
 * Retrieve FAQs related to a specific category
 */
export function retrieveFAQContent(category: string): RAGContext {
  const faqs = getFAQsByCategory(category);
  const sources = faqs.map((faq) => ({
    type: 'faq' as const,
    id: faq.id,
    title: faq.question,
    content: faq.answer,
    relevance: faq.helpful / Math.max(1, faq.views),
  }));

  const combinedContent = combineSources(sources);
  const citations = sources.map((source) => ({
    sourceId: source.id,
    sourceTitle: source.title,
    sourceType: source.type,
  }));

  const relevanceScore =
    sources.length > 0
      ? sources.reduce((sum, s) => sum + s.relevance, 0) / sources.length
      : 0;

  return {
    sources,
    combinedContent,
    citations,
    relevanceScore,
  };
}

/**
 * Get explanation for a specific term with sources
 */
export function retrieveTermExplanation(term: string): RAGContext {
  const concept = getConceptByTerm(term);
  const sources: RetrievedSource[] = [];

  if (concept) {
    sources.push({
      type: 'definition',
      id: concept.id,
      title: concept.term,
      content: concept.explanation,
      relevance: 1.0,
      category: concept.category,
    });

    // Add example if available
    if (concept.example) {
      sources.push({
        type: 'concept',
        id: `${concept.id}-example`,
        title: `${concept.term} - Example`,
        content: concept.example,
        relevance: 0.9,
      });
    }

    // Add related concepts
    concept.relatedConcepts.forEach((relatedId) => {
      const relatedConcept = terminology.find((c) => c.id === relatedId);
      if (relatedConcept) {
        sources.push({
          type: 'concept',
          id: relatedConcept.id,
          title: `Related: ${relatedConcept.term}`,
          content: relatedConcept.explanation,
          relevance: 0.75,
        });
      }
    });
  }

  const combinedContent = combineSources(sources);
  const citations = sources.map((source) => ({
    sourceId: source.id,
    sourceTitle: source.title,
    sourceType: source.type,
  }));

  const relevanceScore =
    sources.length > 0
      ? sources.reduce((sum, s) => sum + s.relevance, 0) / sources.length
      : 0;

  return {
    sources,
    combinedContent,
    citations,
    relevanceScore,
  };
}

// ============================================
// SOURCE RANKING & COMBINATION
// ============================================

/**
 * Deduplicate sources while keeping highest relevance score
 */
function deduplicateSources(sources: RetrievedSource[]): RetrievedSource[] {
  const seen = new Map<string, RetrievedSource>();

  sources.forEach((source) => {
    const key = `${source.type}:${source.id}`;
    const existing = seen.get(key);

    if (!existing || source.relevance > existing.relevance) {
      seen.set(key, source);
    }
  });

  return Array.from(seen.values()).sort((a, b) => b.relevance - a.relevance);
}

/**
 * Combine multiple sources into formatted context
 * Orders by relevance and type
 */
function combineSources(sources: RetrievedSource[]): string {
  if (sources.length === 0) return '';

  // Group by type for better organization
  const byType = {
    definition: sources.filter((s) => s.type === 'definition'),
    concept: sources.filter((s) => s.type === 'concept'),
    faq: sources.filter((s) => s.type === 'faq'),
    lesson: sources.filter((s) => s.type === 'lesson'),
  };

  let combined = '';

  // Start with definitions (highest priority)
  if (byType.definition.length > 0) {
    combined += '## Key Definitions\n\n';
    byType.definition.forEach((source) => {
      combined += `**${source.title}**: ${source.content}\n\n`;
    });
  }

  // Add concepts
  if (byType.concept.length > 0) {
    combined += '## Related Concepts\n\n';
    byType.concept.forEach((source) => {
      combined += `- **${source.title}**: ${source.content.substring(0, 150)}...\n`;
    });
    combined += '\n';
  }

  // Add FAQs
  if (byType.faq.length > 0) {
    combined += '## Frequently Asked Questions\n\n';
    byType.faq.forEach((source) => {
      combined += `**Q: ${source.title}**\nA: ${source.content.substring(0, 200)}...\n\n`;
    });
  }

  // Add lesson content
  if (byType.lesson.length > 0) {
    combined += '## Lesson Materials\n\n';
    byType.lesson.forEach((source) => {
      combined += `**${source.title}**: ${source.content}\n\n`;
    });
  }

  return combined;
}

// ============================================
// PROMPT ENHANCEMENT
// ============================================

/**
 * Create an enhanced prompt with RAG context injected
 */
export function createEnhancedPrompt(
  userQuery: string,
  metadata?: Partial<ChatMessageMetadata>,
  includeContext: boolean = true,
): EnhancedPrompt {
  // Retrieve relevant content
  const ragContext = includeContext
    ? retrieveRelevantContent(userQuery, metadata, 5)
    : {
        sources: [],
        combinedContent: '',
        citations: [],
        relevanceScore: 0,
      };

  // Create system prompt with role and context injection
  const systemPrompt = buildSystemPrompt(ragContext, metadata);

  // Create user prompt with query and source attribution setup
  const userPrompt = buildUserPrompt(userQuery, ragContext);

  return {
    systemPrompt,
    userPrompt,
    context: ragContext,
    citations: ragContext.citations,
  };
}

/**
 * Build system prompt with RAG context
 */
function buildSystemPrompt(
  ragContext: RAGContext,
  metadata?: Partial<ChatMessageMetadata>,
): string {
  let prompt = `You are an intelligent learning assistant for an LMS platform. Your role is to:
1. Provide clear, concise explanations of concepts
2. Guide learners through their coursework
3. Answer questions about platform features and deadlines
4. Cite sources when providing information

Key behaviors:
- Keep responses focused and practical
- Use examples from course materials when relevant
- Encourage deeper learning through related concepts
- Be encouraging and supportive
`;

  // Add context-specific guidance
  if (metadata?.lessonId) {
    prompt += `\nThe user is currently studying a specific lesson. Consider their current learning context when answering.`;
  }

  if (metadata?.userProgress !== undefined && metadata.userProgress > 0) {
    prompt += `\nThe user has ${metadata.userProgress}% progress in their course. Tailor difficulty accordingly.`;
  }

  // Add RAG context to system prompt
  if (ragContext.sources.length > 0) {
    prompt += `\n\n## Retrieved Learning Materials\n`;
    prompt += `Found ${ragContext.sources.length} relevant source(s) to help answer this question.\n`;
    prompt += ragContext.combinedContent;
  }

  prompt += `\n\n## Citation Guidelines
When using information from the retrieved sources:
- Reference the source title in your explanation
- Use [Source: title] format for inline citations
- Group related information from multiple sources
- Always be accurate to the source material`;

  return prompt;
}

/**
 * Build user prompt that leverages RAG context
 */
function buildUserPrompt(userQuery: string, ragContext: RAGContext): string {
  let prompt = userQuery;

  if (ragContext.sources.length > 0) {
    prompt += `\n\n[Context provided from ${ragContext.sources.length} source(s) with avg relevance ${(ragContext.relevanceScore * 100).toFixed(0)}%]`;
  }

  return prompt;
}

// ============================================
// RESPONSE ENHANCEMENT
// ============================================

/**
 * Enhance a generated response with source citations
 */
export function enhanceResponseWithCitations(
  response: string,
  citations: SourceCitation[],
): string {
  let enhanced = response;

  // Add sources section at the end if there are citations
  if (citations.length > 0) {
    enhanced += '\n\n---\n';
    enhanced += '### 📚 Sources\n';
    citations.forEach((citation, index) => {
      const icon = getCitationIcon(citation.sourceType);
      enhanced += `${icon} [${index + 1}] ${citation.sourceTitle}`;
      if (citation.sourceType !== 'definition') {
        enhanced += ` (${citation.sourceType})`;
      }
      enhanced += '\n';
    });
  }

  return enhanced;
}

/**
 * Get icon emoji for citation type
 */
function getCitationIcon(type: string): string {
  const icons: Record<string, string> = {
    definition: '📖',
    concept: '💡',
    faq: '❓',
    lesson: '📚',
  };
  return icons[type] || '📝';
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Determine user's learning level from progress percentage
 */
function getUserLevelFromProgress(progress: number): 'beginner' | 'intermediate' | 'advanced' {
  if (progress < 30) return 'beginner';
  if (progress < 70) return 'intermediate';
  return 'advanced';
}

/**
 * Extract difficulty level from search result
 */
function getDifficultyFromResult(
  result: RetrievedSource | { difficulty?: string },
): 'beginner' | 'intermediate' | 'advanced' | 'unknown' {
  if ('difficulty' in result && result.difficulty) return result.difficulty as 'beginner' | 'intermediate' | 'advanced';
  return 'unknown';
}

/**
 * Check if difficulty is suitable for user's level
 * (Include some stretch content for growth)
 */
function isSuitableDifficulty(
  difficulty: string,
  userLevel: 'beginner' | 'intermediate' | 'advanced',
): boolean {
  if (difficulty === 'unknown') return true;

  const levels = ['beginner', 'intermediate', 'advanced'];
  const userIndex = levels.indexOf(userLevel);
  const diffIndex = levels.indexOf(difficulty);

  // Show content at current level and one level above
  return diffIndex <= userIndex + 1;
}

/**
 * Extract concept name from lesson ID
 */
function extractConceptFromLessonId(lessonId: string): string {
  // Convert lesson-l1 to "Your First Component" or similar
  // This is a simple mapping - in production, this would query the lesson data
  const conceptMap: Record<string, string> = {
    'react-l1': 'React Components',
    'react-l2': 'Import Export',
    'react-l3': 'JSX Markup',
    'react-l5': 'Props',
    'react-l6': 'Conditional Rendering',
    'react-l7': 'List Rendering',
  };
  return conceptMap[lessonId] || 'React';
}

/**
 * Calculate relevance score for mixed source types
 */
export function calculateCombinedRelevance(sources: RetrievedSource[]): number {
  if (sources.length === 0) return 0;

  // Weight different source types differently
  const weights = {
    definition: 1.0,
    concept: 0.9,
    faq: 0.8,
    lesson: 0.85,
  };

  const totalWeightedRelevance = sources.reduce((sum, source) => {
    const weight = weights[source.type as keyof typeof weights] || 0.5;
    return sum + source.relevance * weight;
  }, 0);

  return totalWeightedRelevance / sources.length;
}
