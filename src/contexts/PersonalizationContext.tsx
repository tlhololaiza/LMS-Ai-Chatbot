import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import {
  UserLearningProfile,
  ConceptRecord,
  LearningPreferences,
  LearningPattern,
  LearningRecommendation,
  ConceptGapAnalysis,
  InteractionEvent,
  PracticeExercise,
} from '@/types/personalization';

interface PersonalizationContextType {
  // Profile Management
  profile: UserLearningProfile | null;
  loadProfile: (userId: string) => void;
  updatePreferences: (preferences: Partial<LearningPreferences>) => void;
  saveProfile: () => void;

  // Concept Tracking
  trackConceptInteraction: (concept: string, context?: string) => void;
  recordConceptDifficulty: (concept: string, difficulty: number) => void;
  recordConfusion: (concept1: string, concept2: string) => void;
  markConceptUnderstood: (concept: string) => void;
  getConceptRecord: (concept: string) => ConceptRecord | undefined;

  // Learning Analytics
  recordInteractionEvent: (event: InteractionEvent) => void;
  updateLearningPattern: () => void;
  getTopicDistribution: () => Record<string, number>;

  // Recommendations
  getRecommendations: () => LearningRecommendation[];
  getGapAnalysis: () => ConceptGapAnalysis;
  getPracticeExercises: (topic: string) => PracticeExercise[];

  // Adaptive Response Helpers
  getAdaptationParams: () => {
    complexity: 'simple' | 'intermediate' | 'technical';
    length: 'brief' | 'moderate' | 'detailed';
    includeExamples: boolean;
    tone: 'friendly' | 'professional' | 'encouraging';
  };
  shouldRepeatConcept: (concept: string) => boolean;
  getRelatedTopics: (concept: string) => string[];
}

const PersonalizationContext = createContext<PersonalizationContextType | undefined>(undefined);

const createDefaultProfile = (userId: string): UserLearningProfile => ({
  userId,
  preferences: {
    explanationComplexity: 'intermediate',
    learningPace: 'medium',
    prefersCodeExamples: true,
    prefersVisualExplanations: false,
    prefersStepByStep: true,
    preferredTone: 'friendly',
    strengths: [],
    areasForImprovement: [],
  },
  concepts: [],
  learningPattern: {
    totalQuestionsAsked: 0,
    averageResponseTime: 0,
    topicDistribution: {},
    mostActiveTime: 'afternoon',
    averageSessionDuration: 0,
    improvedTopics: [],
    strugglingConcepts: [],
    questionPreferences: ['explanation', 'example'],
  },
  explainedConcepts: {},
  domainMastery: {},
  recommendedPath: {
    nextTopicToLearn: '',
    prerequisitesNeeded: [],
    estimatedDifficulty: 'beginner',
    suggestedResources: [],
  },
  lastUpdated: new Date().toISOString(),
  createdAt: new Date().toISOString(),
});

export const PersonalizationProvider: React.FC<{ children: ReactNode; userId?: string }> = ({
  children,
  userId: initialUserId,
}) => {
  const [profile, setProfile] = useState<UserLearningProfile | null>(
    initialUserId ? createDefaultProfile(initialUserId) : null
  );
  const [interactionEvents, setInteractionEvents] = useState<InteractionEvent[]>([]);

  const loadProfile = useCallback((userId: string) => {
    // Try to load from localStorage first
    const stored = localStorage.getItem(`learningProfile_${userId}`);
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
        return;
      } catch (e) {
        console.error('Failed to load profile from storage', e);
      }
    }
    // Create new profile if not found
    setProfile(createDefaultProfile(userId));
  }, []);

  const saveProfile = useCallback(() => {
    if (profile) {
      localStorage.setItem(`learningProfile_${profile.userId}`, JSON.stringify(profile));
    }
  }, [profile]);

  const updatePreferences = useCallback((preferences: Partial<LearningPreferences>) => {
    setProfile((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        preferences: { ...prev.preferences, ...preferences },
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const trackConceptInteraction = useCallback((concept: string, context?: string) => {
    setProfile((prev) => {
      if (!prev) return null;

      let conceptRecord = prev.concepts.find((c) => c.id === concept);

      if (conceptRecord) {
        conceptRecord = {
          ...conceptRecord,
          timesAskedAbout: conceptRecord.timesAskedAbout + 1,
          interactionTimestamps: [...conceptRecord.interactionTimestamps, new Date().toISOString()],
          lastAskedAt: new Date().toISOString(),
        };
      } else {
        conceptRecord = {
          id: concept,
          name: concept,
          timesAskedAbout: 1,
          userPerceivedDifficulty: 3,
          isUnderstood: false,
          frequentlyConfusedWith: [],
          interactionTimestamps: [new Date().toISOString()],
          lastAskedAt: new Date().toISOString(),
          category: 'general',
          prerequisites: [],
          relatedConcepts: [],
          masteryScore: 0.3,
        };
      }

      // Update topic distribution
      const topicDistribution = { ...prev.learningPattern.topicDistribution };
      topicDistribution[concept] = (topicDistribution[concept] || 0) + 1;

      return {
        ...prev,
        concepts: prev.concepts.some((c) => c.id === concept)
          ? prev.concepts.map((c) => (c.id === concept ? conceptRecord : c))
          : [...prev.concepts, conceptRecord],
        learningPattern: {
          ...prev.learningPattern,
          totalQuestionsAsked: prev.learningPattern.totalQuestionsAsked + 1,
          topicDistribution,
        },
        lastUpdated: new Date().toISOString(),
      };
    });

    // Record interaction event
    recordInteractionEvent({
      id: `evt_${Date.now()}`,
      userId: profile?.userId || '',
      type: 'question_asked',
      concept,
      metadata: { context },
      timestamp: new Date().toISOString(),
    });
  }, [profile?.userId]);

  const recordConceptDifficulty = useCallback((concept: string, difficulty: number) => {
    setProfile((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        concepts: prev.concepts.map((c) =>
          c.id === concept
            ? { ...c, userPerceivedDifficulty: Math.min(5, Math.max(1, difficulty)) }
            : c
        ),
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const recordConfusion = useCallback((concept1: string, concept2: string) => {
    setProfile((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        concepts: prev.concepts.map((c) => {
          if (c.id === concept1 && !c.frequentlyConfusedWith.includes(concept2)) {
            return {
              ...c,
              frequentlyConfusedWith: [...c.frequentlyConfusedWith, concept2],
            };
          }
          return c;
        }),
        lastUpdated: new Date().toISOString(),
      };
    });
  }, []);

  const markConceptUnderstood = useCallback((concept: string) => {
    setProfile((prev) => {
      if (!prev) return null;

      return {
        ...prev,
        concepts: prev.concepts.map((c) =>
          c.id === concept
            ? {
                ...c,
                isUnderstood: true,
                masteryScore: Math.min(1, c.masteryScore + 0.2),
              }
            : c
        ),
        lastUpdated: new Date().toISOString(),
      };
    });

    recordInteractionEvent({
      id: `evt_${Date.now()}`,
      userId: profile?.userId || '',
      type: 'explanation_understood',
      concept,
      timestamp: new Date().toISOString(),
    });
  }, [profile?.userId]);

  const getConceptRecord = useCallback(
    (concept: string): ConceptRecord | undefined => {
      return profile?.concepts.find((c) => c.id === concept);
    },
    [profile]
  );

  const recordInteractionEvent = useCallback((event: InteractionEvent) => {
    setInteractionEvents((prev) => [...prev, event]);
  }, []);

  const updateLearningPattern = useCallback(() => {
    if (!profile) return;

    const avgTime =
      interactionEvents.length > 0
        ? interactionEvents.reduce((sum) => sum + 30, 0) / interactionEvents.length
        : 0;

    const strugglingConcepts = profile.concepts
      .filter((c) => c.userPerceivedDifficulty >= 4 && !c.isUnderstood)
      .map((c) => c.name);

    const improvedTopics = profile.concepts
      .filter((c) => c.masteryScore > 0.7)
      .map((c) => c.name);

    setProfile((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        learningPattern: {
          ...prev.learningPattern,
          averageResponseTime: avgTime,
          improvedTopics,
          strugglingConcepts,
        },
        lastUpdated: new Date().toISOString(),
      };
    });
  }, [profile, interactionEvents]);

  const getTopicDistribution = useCallback((): Record<string, number> => {
    return profile?.learningPattern.topicDistribution || {};
  }, [profile]);

  const getRecommendations = useCallback((): LearningRecommendation[] => {
    if (!profile) return [];

    const recommendations: LearningRecommendation[] = [];

    // Recommend practice for struggled topics
    profile.concepts
      .filter((c) => c.userPerceivedDifficulty >= 4 && c.masteryScore < 0.7)
      .forEach((concept) => {
        recommendations.push({
          type: 'exercise',
          recommendedItemId: `exercise_${concept.id}`,
          title: `Practice: ${concept.name}`,
          reason: `You found "${concept.name}" difficult. More practice will help!`,
          difficulty: concept.userPerceivedDifficulty,
          estimatedTime: 15,
          confidence: 0.8,
          prerequisites: concept.prerequisites,
          relatedRecommendations: concept.relatedConcepts,
        });
      });

    // Recommend next topics based on progression
    profile.concepts
      .filter((c) => c.isUnderstood && c.relatedConcepts.length > 0)
      .slice(0, 2)
      .forEach((concept) => {
        concept.relatedConcepts.forEach((related) => {
          if (!profile.concepts.find((c) => c.id === related)) {
            recommendations.push({
              type: 'concept',
              recommendedItemId: related,
              title: `Learn: ${related}`,
              reason: `Build on your knowledge of "${concept.name}"`,
              difficulty: 2,
              estimatedTime: 20,
              confidence: 0.7,
              prerequisites: [concept.id],
              relatedRecommendations: [concept.id],
            });
          }
        });
      });

    return recommendations.slice(0, 5);
  }, [profile]);

  const getGapAnalysis = useCallback((): ConceptGapAnalysis => {
    if (!profile) {
      return {
        missingConcepts: [],
        prerequisiteChain: [],
        masteryGaps: [],
        suggestedPath: [],
        estimatedTimeToClose: 0,
      };
    }

    const understoodConcepts = new Set(profile.concepts.filter((c) => c.isUnderstood).map((c) => c.id));
    const missingConcepts: string[] = [];
    const prerequisiteChain: string[] = [];

    // Find prerequisites not yet mastered
    profile.concepts.forEach((concept) => {
      concept.prerequisites.forEach((prereq) => {
        if (!understoodConcepts.has(prereq)) {
          if (!prerequisiteChain.includes(prereq)) {
            prerequisiteChain.push(prereq);
          }
        }
      });
    });

    const masteryGaps = profile.concepts
      .filter((c) => c.masteryScore < 0.8)
      .map((c) => ({
        concept: c.name,
        currentMastery: c.masteryScore,
        targetMastery: 0.9,
        gapSize: 0.9 - c.masteryScore,
      }));

    const estimatedTimeToClose = masteryGaps.reduce((sum, gap) => sum + gap.gapSize * 60, 0);

    return {
      missingConcepts,
      prerequisiteChain,
      masteryGaps,
      suggestedPath: prerequisiteChain,
      estimatedTimeToClose: Math.round(estimatedTimeToClose / 60), // Convert to hours
    };
  }, [profile]);

  const getPracticeExercises = useCallback((topic: string): PracticeExercise[] => {
    return [
      {
        id: `exercise_1_${topic}`,
        title: `Basic ${topic} Exercise`,
        concepts: [topic],
        difficulty: 'beginner',
        type: 'coding',
        estimatedTime: 15,
        description: `Get hands-on with ${topic}`,
        template: `// Start here\nconsole.log('Practice ${topic}');`,
      },
      {
        id: `exercise_2_${topic}`,
        title: `Intermediate ${topic} Challenge`,
        concepts: [topic],
        difficulty: 'intermediate',
        type: 'problem-solving',
        estimatedTime: 30,
        description: `Solve a real-world problem using ${topic}`,
      },
      {
        id: `exercise_3_${topic}`,
        title: `${topic} Quiz`,
        concepts: [topic],
        difficulty: 'intermediate',
        type: 'quiz',
        estimatedTime: 10,
        description: `Test your knowledge of ${topic}`,
      },
    ];
  }, []);

  const getAdaptationParams = useCallback(() => {
    if (!profile)
      return {
        complexity: 'intermediate' as const,
        length: 'moderate' as const,
        includeExamples: true,
        tone: 'friendly' as const,
      };

    return {
      complexity: profile.preferences.explanationComplexity,
      length:
        profile.preferences.learningPace === 'slow'
          ? 'detailed'
          : profile.preferences.learningPace === 'fast'
            ? 'brief'
            : 'moderate',
      includeExamples: profile.preferences.prefersCodeExamples,
      tone: profile.preferences.preferredTone,
    };
  }, [profile]);

  const shouldRepeatConcept = useCallback((concept: string): boolean => {
    const record = profile?.concepts.find((c) => c.id === concept);
    if (!record) return false;
    // Don't repeat if user recently asked (within 30 minutes) and understands it
    if (record.isUnderstood && record.masteryScore > 0.7) {
      const lastAsked = new Date(record.lastAskedAt);
      const now = new Date();
      const minutesSinceLastAsked = (now.getTime() - lastAsked.getTime()) / (1000 * 60);
      return minutesSinceLastAsked < 30;
    }
    return false;
  }, [profile]);

  const getRelatedTopics = useCallback((concept: string): string[] => {
    const record = profile?.concepts.find((c) => c.id === concept);
    return record?.relatedConcepts || [];
  }, [profile]);

  const value: PersonalizationContextType = {
    profile,
    loadProfile,
    updatePreferences,
    saveProfile,
    trackConceptInteraction,
    recordConceptDifficulty,
    recordConfusion,
    markConceptUnderstood,
    getConceptRecord,
    recordInteractionEvent,
    updateLearningPattern,
    getTopicDistribution,
    getRecommendations,
    getGapAnalysis,
    getPracticeExercises,
    getAdaptationParams,
    shouldRepeatConcept,
    getRelatedTopics,
  };

  return <PersonalizationContext.Provider value={value}>{children}</PersonalizationContext.Provider>;
};

export const usePersonalization = () => {
  const context = useContext(PersonalizationContext);
  if (context === undefined) {
    throw new Error('usePersonalization must be used within a PersonalizationProvider');
  }
  return context;
};
