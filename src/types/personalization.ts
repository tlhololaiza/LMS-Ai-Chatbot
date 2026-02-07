/**
 * PERSONALIZATION AND ADAPTIVE LEARNING TYPES
 * Manages user learning profiles, preferences, and recommendations
 */

/**
 * Tracks a concept the user has encountered
 */
export interface ConceptRecord {
  /** Unique identifier for the concept */
  id: string;
  /** Name of the concept */
  name: string;
  /** Number of times user asked about this concept */
  timesAskedAbout: number;
  /** Difficulty level as perceived by user (1-5, where 5 is hardest) */
  userPerceivedDifficulty: number;
  /** Whether user marked this as understood */
  isUnderstood: boolean;
  /** Topics commonly confused with this one */
  frequentlyConfusedWith: string[];
  /** Timestamps of interactions */
  interactionTimestamps: string[];
  /** Last time user asked about this */
  lastAskedAt: string;
  /** Category/domain this concept belongs to */
  category: string;
  /** Prerequisites that should be mastered first */
  prerequisites: string[];
  /** Related concepts that complement this one */
  relatedConcepts: string[];
  /** Mastery level (0-1) estimated by system */
  masteryScore: number;
}

/**
 * Represents user's learning preferences and style
 */
export interface LearningPreferences {
  /** Preferred explanation complexity: simple, intermediate, or technical */
  explanationComplexity: 'simple' | 'intermediate' | 'technical';
  /** Preferred learning pace: slow (more examples), medium, fast (concise) */
  learningPace: 'slow' | 'medium' | 'fast';
  /** Whether user prefers code examples */
  prefersCodeExamples: boolean;
  /** Whether user prefers visual explanations */
  prefersVisualExplanations: boolean;
  /** Whether user prefers step-by-step guidance */
  prefersStepByStep: boolean;
  /** Preferred response tone */
  preferredTone: 'friendly' | 'professional' | 'encouraging';
  /** Topics/areas of strength */
  strengths: string[];
  /** Topics/areas needing improvement */
  areasForImprovement: string[];
}

/**
 * Tracks user's learning progress and patterns
 */
export interface LearningPattern {
  /** Total questions asked */
  totalQuestionsAsked: number;
  /** Average response time user takes (in seconds) */
  averageResponseTime: number;
  /** Most commonly asked topics */
  topicDistribution: Record<string, number>;
  /** Time of day user is most active */
  mostActiveTime: 'morning' | 'afternoon' | 'evening' | 'night';
  /** Average time between interactions */
  averageSessionDuration: number;
  /** Topics showing improvement */
  improvedTopics: string[];
  /** Concepts still struggling with */
  strugglingConcepts: string[];
  /** Preferred question types */
  questionPreferences: Array<'explanation' | 'example' | 'practice' | 'comparison'>;
}

/**
 * Comprehensive user learning profile
 * Stores all personalization data for adaptive learning
 */
export interface UserLearningProfile {
  /** User ID this profile belongs to */
  userId: string;
  /** Learning preferences */
  preferences: LearningPreferences;
  /** All concepts user has encountered */
  concepts: ConceptRecord[];
  /** Learning patterns and analytics */
  learningPattern: LearningPattern;
  /** Topics previously explained (to avoid repetition) */
  explainedConcepts: Record<string, string>; // concept -> explanation
  /** Current knowledge level per domain (0-1) */
  domainMastery: Record<string, number>;
  /** Recommended learning path */
  recommendedPath: {
    nextTopicToLearn: string;
    prerequisitesNeeded: string[];
    estimatedDifficulty: 'beginner' | 'intermediate' | 'advanced';
    suggestedResources: string[];
  };
  /** Last updated timestamp */
  lastUpdated: string;
  /** Profile creation timestamp */
  createdAt: string;
}

/**
 * Recommendation for user's learning
 */
export interface LearningRecommendation {
  /** Type of recommendation */
  type: 'concept' | 'lesson' | 'exercise' | 'prerequisite' | 'challenge';
  /** ID of recommended item */
  recommendedItemId: string;
  /** Title of recommendation */
  title: string;
  /** Reason why this is recommended */
  reason: string;
  /** Estimated difficulty (1-5) */
  difficulty: number;
  /** Estimated time to complete (in minutes) */
  estimatedTime: number;
  /** Confidence score that user will find this helpful (0-1) */
  confidence: number;
  /** Prerequisites that must be satisfied first */
  prerequisites: string[];
  /** Related recommendations */
  relatedRecommendations: string[];
}

/**
 * Response adjustment parameters for adaptive responses
 */
export interface AdaptiveResponseParams {
  /** Adjust response complexity based on user level */
  adjustComplexity: boolean;
  /** Adjust response length based on learning pace */
  adjustLength: boolean;
  /** Include examples relevant to user's experience */
  personalizeExamples: boolean;
  /** Avoid repeating concepts user already knows */
  avoidRepetition: boolean;
  /** Progressively disclose information */
  progressiveDisclosure: boolean;
  /** Connect to user's previous explanations */
  connectToPreviousExplanations: boolean;
  /** Suggest related topics user hasn't explored */
  suggestRelatedTopics: boolean;
}

/**
 * Concept gap analysis result
 */
export interface ConceptGapAnalysis {
  /** Concepts user is missing */
  missingConcepts: string[];
  /** Prerequisite chain needed */
  prerequisiteChain: string[];
  /** Current mastery gaps */
  masteryGaps: Array<{
    concept: string;
    currentMastery: number;
    targetMastery: number;
    gapSize: number;
  }>;
  /** Suggested learning path to close gaps */
  suggestedPath: string[];
  /** Estimated time to close gaps (in hours) */
  estimatedTimeToClose: number;
}

/**
 * Practice exercise recommendation
 */
export interface PracticeExercise {
  /** Exercise ID */
  id: string;
  /** Exercise title */
  title: string;
  /** Concepts this exercise covers */
  concepts: string[];
  /** Difficulty level */
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  /** Type of exercise */
  type: 'coding' | 'quiz' | 'problem-solving' | 'discussion';
  /** Estimated time to complete */
  estimatedTime: number;
  /** Instructions or description */
  description: string;
  /** Starting template or example */
  template?: string;
  /** Solution reference */
  solutionId?: string;
}

/**
 * User interaction event for tracking
 */
export interface InteractionEvent {
  /** Event ID */
  id: string;
  /** User ID */
  userId: string;
  /** Type of interaction */
  type:
    | 'question_asked'
    | 'concept_explained'
    | 'lesson_completed'
    | 'exercise_completed'
    | 'topic_marked_difficult'
    | 'related_concepts_viewed'
    | 'explanation_understood';
  /** Concept involved in this interaction */
  concept?: string;
  /** Additional metadata */
  metadata?: Record<string, unknown>;
  /** Timestamp of interaction */
  timestamp: string;
}
