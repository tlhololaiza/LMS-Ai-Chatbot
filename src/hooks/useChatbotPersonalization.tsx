/**
 * Personalization Integration Hook
 * Integrates the AIChatbot with personalization features
 */

import { usePersonalization } from '@/contexts/PersonalizationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { extractConceptsFromText, recommendLearningPace } from '@/utils/learningPathRecommender';
import { adaptResponse } from '@/utils/adaptiveResponseService';
import { ChatMessage } from '@/types/lms';

export const useChatbotPersonalization = () => {
  const { user } = useAuth();
  const personalization = usePersonalization();

  // Initialize user profile
  useEffect(() => {
    if (user?.id && !personalization.profile) {
      personalization.loadProfile(user.id);
    }
  }, [user?.id, personalization.profile]);

  /**
   * Track user question and extract concepts
   */
  const trackUserQuestion = (question: string) => {
    const concepts = extractConceptsFromText(question);
    concepts.forEach((concept) => {
      personalization.trackConceptInteraction(concept, question);
    });
  };

  /**
   * Generate adaptive response based on user profile
   */
  const generateAdaptiveResponse = (
    baseResponse: string,
    question: string,
    previousMessages: ChatMessage[]
  ): string => {
    if (!personalization.profile) return baseResponse;

    const concepts = extractConceptsFromText(question);
    const primaryConcept = concepts[0] || 'general';

    // Create concept relations map
    const conceptRelations: Record<string, string[]> = {};

    return adaptResponse(baseResponse, personalization.profile, primaryConcept, previousMessages, conceptRelations);
  };

  /**
   * Record when user marks understanding
   */
  const markConceptUnderstood = (concept: string) => {
    personalization.markConceptUnderstood(concept);
  };

  /**
   * Get adaptive response parameters
   */
  const getAdaptiveParams = () => {
    return personalization.getAdaptationParams();
  };

  /**
   * Update learning pace based on interaction patterns
   */
  const updateLearningPace = () => {
    if (!personalization.profile) return;
    const recommendedPace = recommendLearningPace(personalization.profile);
    if (recommendedPace !== personalization.profile.preferences.learningPace) {
      personalization.updatePreferences({ learningPace: recommendedPace });
    }
  };

  return {
    trackUserQuestion,
    generateAdaptiveResponse,
    markConceptUnderstood,
    getAdaptiveParams,
    updateLearningPace,
    profile: personalization.profile,
    saveProfile: personalization.saveProfile,
  };
};

export default useChatbotPersonalization;
