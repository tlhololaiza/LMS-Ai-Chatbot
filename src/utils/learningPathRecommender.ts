/**
 * Learning Path Recommender
 * Analyzes user questions, identifies gaps, and recommends learning paths
 */

import { UserLearningProfile, ConceptGapAnalysis, LearningRecommendation } from '@/types/personalization';
import { ConceptRecord } from '@/types/personalization';

/**
 * Concept prerequisite graph
 */
const CONCEPT_GRAPH: Record<string, {
  prerequisites: string[];
  related: string[];
  difficulty: number;
  category: string;
}> = {
  // JavaScript Fundamentals
  'variables': {
    prerequisites: [],
    related: ['data-types', 'scope', 'hoisting'],
    difficulty: 1,
    category: 'fundamentals',
  },
  'data-types': {
    prerequisites: ['variables'],
    related: ['operators', 'type-coercion', 'objects'],
    difficulty: 1,
    category: 'fundamentals',
  },
  'functions': {
    prerequisites: ['variables', 'data-types'],
    related: ['scope', 'closure', 'arrow-functions', 'callbacks'],
    difficulty: 2,
    category: 'fundamentals',
  },
  'scope': {
    prerequisites: ['variables', 'functions'],
    related: ['closure', 'hoisting', 'this'],
    difficulty: 2,
    category: 'fundamentals',
  },
  'closure': {
    prerequisites: ['scope', 'functions'],
    related: ['functional-programming', 'callbacks', 'higher-order-functions'],
    difficulty: 3,
    category: 'advanced',
  },
  'this': {
    prerequisites: ['functions', 'objects'],
    related: ['binding', 'arrow-functions', 'closures'],
    difficulty: 3,
    category: 'advanced',
  },
  'objects': {
    prerequisites: ['data-types', 'variables'],
    related: ['prototypes', 'classes', 'this', 'destructuring'],
    difficulty: 2,
    category: 'fundamentals',
  },
  'prototypes': {
    prerequisites: ['objects', 'functions'],
    related: ['classes', 'inheritance', 'prototype-chain'],
    difficulty: 3,
    category: 'advanced',
  },
  'async-programming': {
    prerequisites: ['functions', 'callbacks'],
    related: ['promises', 'async-await', 'event-loop'],
    difficulty: 3,
    category: 'advanced',
  },
  'promises': {
    prerequisites: ['async-programming', 'functions'],
    related: ['async-await', 'error-handling', 'promise-chaining'],
    difficulty: 3,
    category: 'advanced',
  },
  'async-await': {
    prerequisites: ['promises', 'async-programming'],
    related: ['error-handling', 'try-catch', 'promises'],
    difficulty: 3,
    category: 'advanced',
  },

  // React
  'react-basics': {
    prerequisites: ['functions', 'objects', 'jsx'],
    related: ['components', 'state', 'props', 'hooks'],
    difficulty: 2,
    category: 'react',
  },
  'jsx': {
    prerequisites: ['functions', 'objects'],
    related: ['react-basics', 'components', 'rendering'],
    difficulty: 2,
    category: 'react',
  },
  'components': {
    prerequisites: ['react-basics', 'functions'],
    related: ['props', 'state', 'lifecycle', 'hooks'],
    difficulty: 2,
    category: 'react',
  },
  'props': {
    prerequisites: ['components', 'objects'],
    related: ['state', 'component-communication', 'destructuring'],
    difficulty: 2,
    category: 'react',
  },
  'state': {
    prerequisites: ['components', 'hooks'],
    related: ['useState', 'state-management', 'props'],
    difficulty: 2,
    category: 'react',
  },
  'hooks': {
    prerequisites: ['components', 'functions', 'state'],
    related: ['useState', 'useEffect', 'custom-hooks', 'rules-of-hooks'],
    difficulty: 2,
    category: 'react',
  },
  'useState': {
    prerequisites: ['hooks', 'state'],
    related: ['state-management', 'useReducer', 'hooks'],
    difficulty: 2,
    category: 'react',
  },
  'useEffect': {
    prerequisites: ['hooks', 'side-effects'],
    related: ['lifecycle', 'cleanup', 'dependencies'],
    difficulty: 2,
    category: 'react',
  },
  'custom-hooks': {
    prerequisites: ['hooks', 'functions', 'useEffect', 'useState'],
    related: ['reusable-logic', 'component-logic', 'hooks'],
    difficulty: 3,
    category: 'react',
  },
};

/**
 * Analyzes user's question for concepts and finds gaps
 */
export const analyzeQuestionForGaps = (
  question: string,
  profile: UserLearningProfile
): ConceptGapAnalysis => {
  // Extract potential concepts from question
  const extractedConcepts = extractConceptsFromText(question);
  const understoodConcepts = new Set(profile.concepts.filter((c) => c.isUnderstood).map((c) => c.id));

  const missingConcepts: string[] = [];
  const prerequisiteChain: string[] = [];

  // Check each concept's prerequisites
  extractedConcepts.forEach((concept) => {
    if (!understoodConcepts.has(concept)) {
      missingConcepts.push(concept);

      // Get prerequisites
      const conceptInfo = CONCEPT_GRAPH[concept];
      if (conceptInfo) {
        conceptInfo.prerequisites.forEach((prereq) => {
          if (!understoodConcepts.has(prereq) && !prerequisiteChain.includes(prereq)) {
            prerequisiteChain.push(prereq);
          }
        });
      }
    }
  });

  // Calculate mastery gaps
  const masteryGaps = profile.concepts
    .filter((c) => c.masteryScore < 0.8)
    .slice(0, 5)
    .map((c) => ({
      concept: c.name,
      currentMastery: c.masteryScore,
      targetMastery: 0.9,
      gapSize: 0.9 - c.masteryScore,
    }));

  // Build suggested learning path
  const suggestedPath = buildLearningPath(missingConcepts, prerequisiteChain, profile);

  const estimatedTimeToClose = Math.ceil(
    (missingConcepts.length * 20 + masteryGaps.length * 15) / 60
  );

  return {
    missingConcepts,
    prerequisiteChain,
    masteryGaps,
    suggestedPath,
    estimatedTimeToClose,
  };
};

/**
 * Extracts concepts from free-form text
 */
export const extractConceptsFromText = (text: string): string[] => {
  const lowerText = text.toLowerCase();
  const concepts: string[] = [];

  // Check for concept keywords
  Object.keys(CONCEPT_GRAPH).forEach((concept) => {
    // Also check for common aliases
    const aliases = getConceptAliases(concept);
    if (aliases.some((alias) => lowerText.includes(alias))) {
      concepts.push(concept);
    }
  });

  return [...new Set(concepts)]; // Remove duplicates
};

/**
 * Gets alternative names for a concept
 */
const getConceptAliases = (concept: string): string[] => {
  const aliases: Record<string, string[]> = {
    'functions': ['function', 'method', 'callback'],
    'async-programming': ['async', 'asynchronous', 'promise'],
    'promises': ['promise', 'then', 'catch', 'finally'],
    'async-await': ['await', 'async function'],
    'react-basics': ['react', 'component', 'reactjs'],
    'jsx': ['jsx', 'element', 'render'],
    'components': ['component', 'react component'],
    'state': ['state', 'useState', 'stateful'],
    'props': ['prop', 'property', 'parameter'],
    'hooks': ['hook', 'usestate', 'useeffect'],
    'useState': ['usestate', 'state hook'],
    'useEffect': ['useeffect', 'effect hook', 'side effect'],
    'closure': ['closure', 'lexical scope'],
    'scope': ['scope', 'global', 'local', 'block scope'],
    'this': ['this', 'context'],
    'prototypes': ['prototype', 'inheritance', 'prototype chain'],
  };

  return aliases[concept] || [concept];
};

/**
 * Builds optimal learning path to fill gaps
 */
export const buildLearningPath = (
  missingConcepts: string[],
  prerequisites: string[],
  profile: UserLearningProfile
): string[] => {
  const path: string[] = [];
  const added = new Set<string>();

  // First, add prerequisites in order
  prerequisites.forEach((prereq) => {
    if (!added.has(prereq)) {
      path.push(prereq);
      added.add(prereq);
    }
  });

  // Then, add missing concepts sorted by difficulty
  const sorted = missingConcepts.sort((a, b) => {
    const diffA = CONCEPT_GRAPH[a]?.difficulty || 2;
    const diffB = CONCEPT_GRAPH[b]?.difficulty || 2;
    return diffA - diffB;
  });

  sorted.forEach((concept) => {
    if (!added.has(concept)) {
      path.push(concept);
      added.add(concept);
    }
  });

  return path;
};

/**
 * Generates personalized practice exercises based on gaps
 */
export const generatePracticeExercises = (profile: UserLearningProfile): string[] => {
  const strugglingConcepts = profile.concepts.filter(
    (c) => c.userPerceivedDifficulty >= 4 && !c.isUnderstood
  );

  return strugglingConcepts.slice(0, 3).map((concept) => concept.name);
};

/**
 * Recommends lessons based on user's questions and gaps
 */
export const recommendLessons = (
  question: string,
  profile: UserLearningProfile
): LearningRecommendation[] => {
  const gap = analyzeQuestionForGaps(question, profile);
  const recommendations: LearningRecommendation[] = [];

  // Recommend lesson for each missing concept
  gap.suggestedPath.forEach((concept, index) => {
    const conceptInfo = CONCEPT_GRAPH[concept];
    if (conceptInfo) {
      recommendations.push({
        type: 'lesson',
        recommendedItemId: `lesson_${concept}`,
        title: `Learn: ${formatConceptName(concept)}`,
        reason:
          index === 0
            ? 'This is a prerequisite for understanding your question'
            : `Build on ${gap.suggestedPath[index - 1]}`,
        difficulty: conceptInfo.difficulty,
        estimatedTime: 20 + conceptInfo.difficulty * 10,
        confidence: 0.85,
        prerequisites: conceptInfo.prerequisites,
        relatedRecommendations: conceptInfo.related,
      });
    }
  });

  // Add challenge exercise recommendation
  if (profile.concepts.length > 5) {
    recommendations.push({
      type: 'challenge',
      recommendedItemId: 'challenge_project',
      title: 'Mini Project Challenge',
      reason: 'Apply what you have learned',
      difficulty: 4,
      estimatedTime: 60,
      confidence: 0.7,
      prerequisites: gap.suggestedPath,
      relatedRecommendations: [],
    });
  }

  return recommendations.slice(0, 5);
};

/**
 * Tracks mastery of concepts over time
 */
export const updateConceptMastery = (
  concept: ConceptRecord,
  successRate: number
): ConceptRecord => {
  // Update mastery score based on success rate
  // Increase score on success, decrease on failure
  const previousMastery = concept.masteryScore;
  const masteryAdjustment = (successRate - 0.5) * 0.2; // Range: -0.1 to 0.1 per interaction
  const newMastery = Math.max(0, Math.min(1, previousMastery + masteryAdjustment));

  return {
    ...concept,
    masteryScore: newMastery,
    isUnderstood: newMastery >= 0.7,
  };
};

/**
 * Calculates learning speed and adjusts pace recommendations
 */
export const recommendLearningPace = (profile: UserLearningProfile): 'slow' | 'medium' | 'fast' => {
  if (profile.concepts.length === 0) return 'medium';

  // Calculate average mastery
  const avgMastery =
    profile.concepts.reduce((sum, c) => sum + c.masteryScore, 0) / profile.concepts.length;

  // Calculate difficulty perception
  const avgDifficulty =
    profile.concepts.reduce((sum, c) => sum + c.userPerceivedDifficulty, 0) /
    profile.concepts.length;

  // If user is mastering concepts quickly and doesn't find them too difficult
  if (avgMastery > 0.75 && avgDifficulty < 2.5) {
    return 'fast';
  }

  // If user is struggling
  if (avgMastery < 0.5 || avgDifficulty > 3.5) {
    return 'slow';
  }

  return 'medium';
};

/**
 * Formats concept names for display
 */
const formatConceptName = (concept: string): string => {
  return concept
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Identifies common misconceptions
 */
export const identifyMisconceptions = (profile: UserLearningProfile): string[] => {
  const misconceptions: string[] = [];

  profile.concepts.forEach((concept) => {
    // If user is confused about this concept frequently
    if (concept.frequentlyConfusedWith.length > 0 && concept.userPerceivedDifficulty >= 3) {
      misconceptions.push(
        `${concept.name} is often confused with ${concept.frequentlyConfusedWith.join(', ')}`
      );
    }
  });

  return misconceptions;
};
