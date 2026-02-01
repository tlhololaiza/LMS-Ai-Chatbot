import React, { useState } from 'react';
import { usePersonalization } from '@/contexts/PersonalizationContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Gauge,
  TrendingUp,
  BookmarksIcon,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
} from 'lucide-react';

export const UserLearningProfile: React.FC = () => {
  const { profile, updatePreferences } = usePersonalization();
  const [showEditPreferences, setShowEditPreferences] = useState(false);

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Learning Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No profile data available</p>
        </CardContent>
      </Card>
    );
  }

  const masteryLevel = Math.max(...Object.values(profile.domainMastery), 0) * 100;
  const topConcepts = profile.concepts.filter((c) => c.isUnderstood).slice(0, 5);
  const strugglingConcepts = profile.concepts
    .filter((c) => !c.isUnderstood && c.userPerceivedDifficulty >= 3)
    .slice(0, 5);

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'technical':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaceColor = (pace: string) => {
    switch (pace) {
      case 'slow':
        return 'bg-yellow-100 text-yellow-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'fast':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Tabs defaultValue="overview" className="w-full space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="progress">Progress</TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-4">
        {/* Mastery Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Gauge className="w-4 h-4" />
              Overall Mastery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{Math.round(masteryLevel)}%</span>
              <div className="flex-1 mx-4 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                  style={{ width: `${masteryLevel}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Topics Explored</div>
                <div className="text-2xl font-bold mt-1">{profile.concepts.length}</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Questions Asked</div>
                <div className="text-2xl font-bold mt-1">
                  {profile.learningPattern.totalQuestionsAsked}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Strengths */}
        {topConcepts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Areas of Strength
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {topConcepts.map((concept) => (
                  <Badge key={concept.id} variant="secondary" className="bg-green-50 text-green-700">
                    {concept.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Areas for Improvement */}
        {strugglingConcepts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {strugglingConcepts.map((concept) => (
                  <div key={concept.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-sm">{concept.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {Math.round(concept.masteryScore * 100)}% mastery
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* Preferences Tab */}
      <TabsContent value="preferences" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Learning Preferences</CardTitle>
            <CardDescription>How you like to learn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Explanation Complexity */}
            <div>
              <label className="text-sm font-medium mb-3 block">Explanation Complexity</label>
              <div className="flex gap-2">
                {['simple', 'intermediate', 'technical'].map((level) => (
                  <Button
                    key={level}
                    variant={
                      profile.preferences.explanationComplexity === level ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() =>
                      updatePreferences({
                        explanationComplexity: level as 'simple' | 'intermediate' | 'technical',
                      })
                    }
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {profile.preferences.explanationComplexity === 'simple' &&
                  'Clear, beginner-friendly explanations with analogies'}
                {profile.preferences.explanationComplexity === 'intermediate' && 'Balanced explanations'}
                {profile.preferences.explanationComplexity === 'technical' &&
                  'In-depth technical details and advanced concepts'}
              </p>
            </div>

            {/* Learning Pace */}
            <div>
              <label className="text-sm font-medium mb-3 block">Learning Pace</label>
              <div className="flex gap-2">
                {['slow', 'medium', 'fast'].map((pace) => (
                  <Button
                    key={pace}
                    variant={profile.preferences.learningPace === pace ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      updatePreferences({
                        learningPace: pace as 'slow' | 'medium' | 'fast',
                      })
                    }
                  >
                    {pace.charAt(0).toUpperCase() + pace.slice(1)}
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {profile.preferences.learningPace === 'slow' && 'More examples and time per concept'}
                {profile.preferences.learningPace === 'medium' && 'Balanced approach'}
                {profile.preferences.learningPace === 'fast' && 'Concise explanations, quick progression'}
              </p>
            </div>

            {/* Format Preferences */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Format Preferences</label>
              {[
                {
                  key: 'prefersCodeExamples',
                  label: 'Code Examples',
                  icon: <Zap className="w-4 h-4" />,
                },
                {
                  key: 'prefersStepByStep',
                  label: 'Step-by-Step Guidance',
                  icon: <TrendingUp className="w-4 h-4" />,
                },
              ].map((pref) => (
                <Button
                  key={pref.key}
                  variant="outline"
                  className={`w-full justify-start gap-2 ${
                    profile.preferences[pref.key as keyof typeof profile.preferences]
                      ? 'bg-blue-50 border-blue-200'
                      : ''
                  }`}
                  onClick={() =>
                    updatePreferences({
                      [pref.key]: !profile.preferences[pref.key as keyof typeof profile.preferences],
                    })
                  }
                >
                  {pref.icon}
                  {pref.label}
                </Button>
              ))}
            </div>

            {/* Tone Preference */}
            <div>
              <label className="text-sm font-medium mb-3 block">Preferred Tone</label>
              <div className="flex gap-2">
                {['friendly', 'professional', 'encouraging'].map((tone) => (
                  <Button
                    key={tone}
                    variant={profile.preferences.preferredTone === tone ? 'default' : 'outline'}
                    size="sm"
                    onClick={() =>
                      updatePreferences({
                        preferredTone: tone as 'friendly' | 'professional' | 'encouraging',
                      })
                    }
                  >
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Progress Tab */}
      <TabsContent value="progress" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="w-4 h-4" />
              Learning Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Avg Response Time
                </div>
                <div className="text-xl font-bold mt-1">
                  {Math.round(profile.learningPattern.averageResponseTime)}s
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Session Duration
                </div>
                <div className="text-xl font-bold mt-1">
                  {Math.round(profile.learningPattern.averageSessionDuration)}min
                </div>
              </div>
            </div>

            {profile.learningPattern.improvedTopics.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Topics Showing Improvement</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.learningPattern.improvedTopics.slice(0, 4).map((topic) => (
                    <Badge key={topic} className="bg-green-50 text-green-700">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {profile.learningPattern.strugglingConcepts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Concepts Needing More Practice</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.learningPattern.strugglingConcepts.slice(0, 4).map((concept) => (
                    <Badge key={concept} className="bg-amber-50 text-amber-700">
                      {concept}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default UserLearningProfile;
