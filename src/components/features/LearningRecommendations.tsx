import React, { useEffect, useState } from 'react';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Target,
  TrendingUp,
  Zap,
  AlertCircle,
  ChevronRight,
  Clock,
  Lightbulb,
} from 'lucide-react';
import { LearningRecommendation, ConceptGapAnalysis, PracticeExercise } from '@/types/personalization';

interface LearningRecommendationsProps {
  topic?: string;
  onSelectRecommendation?: (recommendation: LearningRecommendation) => void;
}

export const LearningRecommendations: React.FC<LearningRecommendationsProps> = ({
  topic,
  onSelectRecommendation,
}) => {
  const { getRecommendations, getGapAnalysis, getPracticeExercises } = usePersonalization();
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([]);
  const [gaps, setGaps] = useState<ConceptGapAnalysis | null>(null);
  const [exercises, setExercises] = useState<PracticeExercise[]>([]);

  useEffect(() => {
    setRecommendations(getRecommendations());
    setGaps(getGapAnalysis());
    if (topic) {
      setExercises(getPracticeExercises(topic));
    }
  }, [topic, getRecommendations, getGapAnalysis, getPracticeExercises]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return <BookOpen className="w-4 h-4" />;
      case 'exercise':
        return <Zap className="w-4 h-4" />;
      case 'prerequisite':
        return <AlertCircle className="w-4 h-4" />;
      case 'challenge':
        return <Target className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'bg-green-100 text-green-800';
    if (difficulty <= 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (recommendations.length === 0 && (!gaps || gaps.missingConcepts.length === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Keep exploring topics and asking questions to get personalized recommendations!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Gap Analysis */}
      {gaps && gaps.missingConcepts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              Identified Knowledge Gaps
            </CardTitle>
            <CardDescription>
              {gaps.estimatedTimeToClose} hours to master these concepts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gaps.masteryGaps.slice(0, 3).map((gap) => (
                <div key={gap.concept} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">{gap.concept}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all"
                        style={{ width: `${gap.currentMastery * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {Math.round(gap.currentMastery * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              Personalized Recommendations
            </CardTitle>
            <CardDescription>Next steps tailored to your learning progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.recommendedItemId}
                className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onSelectRecommendation?.(rec)}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-start gap-2 flex-1">
                    <div className="mt-1 text-muted-foreground">{getTypeIcon(rec.type)}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{rec.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getDifficultyColor(rec.difficulty)} variant="secondary">
                    Difficulty: {rec.difficulty}/5
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {rec.estimatedTime} min
                  </Badge>
                  <Badge variant="outline">
                    Confidence: {Math.round(rec.confidence * 100)}%
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Practice Exercises */}
      {exercises.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="w-4 h-4 text-orange-500" />
              Practice Exercises
            </CardTitle>
            <CardDescription>Reinforce your learning with hands-on practice</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="font-medium text-sm">{exercise.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{exercise.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">{exercise.type}</Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {exercise.estimatedTime} min
                  </Badge>
                  <Button size="sm" variant="ghost" className="ml-auto h-7">
                    Start
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LearningRecommendations;
