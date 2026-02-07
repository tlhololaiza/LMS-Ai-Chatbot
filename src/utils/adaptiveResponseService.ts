/**
 * Adaptive Response Service
 * Generates personalized responses based on user learning profile
 */

import { UserLearningProfile, AdaptiveResponseParams } from '@/types/personalization';
import { ChatMessage } from '@/types/lms';

/**
 * Adjusts response complexity based on user profile
 */
export const adjustComplexity = (
  response: string,
  profile: UserLearningProfile,
  shouldAdjust: boolean
): string => {
  if (!shouldAdjust) return response;

  const complexity = profile.preferences.explanationComplexity;

  if (complexity === 'simple') {
    // Simplify: remove technical jargon, use analogies
    return simplifyResponse(response);
  } else if (complexity === 'technical') {
    // Enhance: add technical details, patterns, edge cases
    return enhanceWithTechnicalDetails(response);
  }

  return response;
};

/**
 * Adjusts response length based on learning pace
 */
export const adjustResponseLength = (
  response: string,
  profile: UserLearningProfile,
  shouldAdjust: boolean
): string => {
  if (!shouldAdjust) return response;

  const pace = profile.preferences.learningPace;
  const sentences = response.split(/(?<=[.!?])\s+/);

  if (pace === 'slow') {
    // Keep detailed responses, add more examples
    return response;
  } else if (pace === 'fast') {
    // Condense: take first 50-60% of content, keep key points
    const targetSentenceCount = Math.ceil(sentences.length * 0.5);
    return sentences.slice(0, targetSentenceCount).join(' ').trim();
  }

  return response;
};

/**
 * Personalizes examples based on user's experience
 */
export const personalizeExamples = (
  response: string,
  profile: UserLearningProfile,
  shouldPersonalize: boolean
): string => {
  if (!shouldPersonalize) return response;

  // Replace generic examples with user-context examples if available
  let personalized = response;

  // If user has strong understanding of specific topics, reference those
  const strengths = profile.preferences.strengths;
  if (strengths.length > 0) {
    const strength = strengths[0];
    personalized = personalized.replace(/\b(for example|e\.g\.)/gi, `(similar to how ${strength} works, for example`);
  }

  return personalized;
};

/**
 * Prevents repeating already explained concepts
 */
export const avoidRepetition = (
  response: string,
  profile: UserLearningProfile,
  previousMessages: ChatMessage[]
): string => {
  const explainedConcepts = Object.keys(profile.explainedConcepts);

  // Check if this response repeats explanations
  for (const concept of explainedConcepts) {
    const previousExplanation = profile.explainedConcepts[concept];
    if (response.includes(previousExplanation)) {
      // Instead of repeating, reference the previous explanation
      return response.replace(previousExplanation, `(As I mentioned before with ${concept})`);
    }
  }

  return response;
};

/**
 * Implements progressive disclosure - reveal information gradually
 */
export const progressivelyDisclose = (
  response: string,
  profile: UserLearningProfile,
  shouldDisclose: boolean
): string => {
  if (!shouldDisclose) return response;

  // If user is a beginner, prioritize core concepts
  const masteryLevel = Math.max(...Object.values(profile.domainMastery), 0.5);

  if (masteryLevel < 0.5) {
    // Extract and prioritize main concepts, hide advanced details
    const mainSections = response.split(/(?:Advanced|Note:|Edge case|Performance|Implementation detail)/i);
    return mainSections[0].trim() + '\n\n*Want to learn more advanced concepts? Ask me anytime!*';
  }

  return response;
};

/**
 * Connects to previous explanations for continuity
 */
export const connectToPreviousExplanations = (
  response: string,
  profile: UserLearningProfile,
  currentConcept: string
): string => {
  const explainedConcepts = Object.entries(profile.explainedConcepts);

  // Find related previously explained concepts
  const relatedExplanations = explainedConcepts.filter(([concept]) => {
    // Simple heuristic: check if concepts share keywords
    const currentWords = currentConcept.toLowerCase().split(/\W+/);
    const conceptWords = concept.toLowerCase().split(/\W+/);
    return currentWords.some((word) => conceptWords.includes(word));
  });

  if (relatedExplanations.length > 0) {
    const [previousConcept] = relatedExplanations[0];
    const prefix = `Building on our earlier discussion about "${previousConcept}", here's how this connects:\n\n`;
    return prefix + response;
  }

  return response;
};

/**
 * Suggests related topics user hasn't explored
 */
export const suggestRelatedTopics = (
  response: string,
  profile: UserLearningProfile,
  conceptRelations: Record<string, string[]>
): string => {
  const understoodConcepts = new Set(
    profile.concepts.filter((c) => c.isUnderstood).map((c) => c.id)
  );

  // Find related concepts not yet explored
  let suggestions: string[] = [];
  understoodConcepts.forEach((concept) => {
    const related = conceptRelations[concept] || [];
    related.forEach((r) => {
      if (!understoodConcepts.has(r) && !suggestions.includes(r)) {
        suggestions.push(r);
      }
    });
  });

  if (suggestions.length > 0) {
    const suggestionText = suggestions.slice(0, 3).join(', ');
    return (
      response +
      `\n\n📚 **Want to explore more?** Try asking about: ${suggestionText}`
    );
  }

  return response;
};

/**
 * Generates adaptive response parameters
 */
export const getAdaptiveParams = (profile: UserLearningProfile): AdaptiveResponseParams => {
  return {
    adjustComplexity: true,
    adjustLength: profile.preferences.learningPace !== 'medium',
    personalizeExamples: true,
    avoidRepetition: true,
    progressiveDisclosure: Math.max(...Object.values(profile.domainMastery), 0) < 0.5,
    connectToPreviousExplanations: Object.keys(profile.explainedConcepts).length > 2,
    suggestRelatedTopics: profile.concepts.length > 5,
  };
};

/**
 * Applies all adaptive transformations to response
 */
export const adaptResponse = (
  baseResponse: string,
  profile: UserLearningProfile,
  currentConcept: string,
  previousMessages: ChatMessage[],
  conceptRelations?: Record<string, string[]>
): string => {
  let response = baseResponse;
  const params = getAdaptiveParams(profile);

  // Apply transformations in order
  if (params.adjustComplexity) {
    response = adjustComplexity(response, profile, true);
  }

  if (params.adjustLength) {
    response = adjustResponseLength(response, profile, true);
  }

  if (params.personalizeExamples) {
    response = personalizeExamples(response, profile, true);
  }

  // Avoid repetition only if we've explained this before
  const explained = profile.explainedConcepts[currentConcept];
  if (!explained) {
    response = avoidRepetition(response, profile, previousMessages);
  }

  if (params.progressiveDisclosure) {
    response = progressivelyDisclose(response, profile, true);
  }

  if (params.connectToPreviousExplanations) {
    response = connectToPreviousExplanations(response, profile, currentConcept);
  }

  if (params.suggestRelatedTopics && conceptRelations) {
    response = suggestRelatedTopics(response, profile, conceptRelations);
  }

  return response;
};

// ============================================
// Helper Functions
// ============================================

function simplifyResponse(response: string): string {
  return response
    .replace(/\b(closure|hoisting|prototype|lexical scope|binding|context)\b/gi, (match) => {
      const explanations: Record<string, string> = {
        closure: 'a function that remembers variables from where it was created',
        hoisting: 'JavaScript moving declarations to the top',
        prototype: 'how JavaScript objects share methods',
        'lexical scope': 'where a variable is available based on where it was written',
        binding: 'connecting a function to an object',
        context: 'what `this` refers to',
      };
      return `${match} (${explanations[match.toLowerCase()] || match})`;
    })
    .split('. ')
    .slice(0, Math.ceil(response.split('. ').length * 0.7))
    .join('. ');
}

function enhanceWithTechnicalDetails(response: string): string {
  const technicalAdditions: Record<string, string> = {
    'function': '\n**Technical details:** Functions in JavaScript are first-class objects, enabling higher-order functions and functional programming patterns.',
    'async': '\n**Implementation note:** Async functions return a Promise and utilize the microtask queue for execution ordering.',
    'closure':
      '\n**Deep dive:** Closures create a persistent scope chain; each closure maintains a reference to its outer function\'s variables through the [[Scope]] internal property.',
  };

  let enhanced = response;
  for (const [keyword, addition] of Object.entries(technicalAdditions)) {
    if (response.toLowerCase().includes(keyword.toLowerCase())) {
      enhanced += addition;
      break;
    }
  }

  return enhanced;
}
