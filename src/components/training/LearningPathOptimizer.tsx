import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import {
  Brain,
  Clock,
  Target,
  Calendar,
  ChevronRight,
  ArrowRight,
  Book,
  Star,
  Loader2,
  Settings,
  Sliders
} from 'lucide-react';
import { addMonths, format } from 'date-fns';

interface SkillLevel {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

interface LearningPreferences {
  availableHoursPerWeek: number;
  preferredLearningStyle: 'visual' | 'practical' | 'theoretical';
  targetCompletionDate: Date;
  currentSkills: SkillLevel[];
}

interface Course {
  id: string;
  name: string;
  description: string;
  duration: number; // in hours
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  learningStyle: 'visual' | 'practical' | 'theoretical';
  skills: string[];
}

interface OptimizedPath {
  courses: Course[];
  totalDuration: number;
  estimatedCompletionDate: Date;
  weeklyCommitment: number;
  skillsGained: string[];
  confidenceScore: number;
}

export function LearningPathOptimizer() {
  const [preferences, setPreferences] = useState<Partial<LearningPreferences>>({
    availableHoursPerWeek: 10,
    preferredLearningStyle: 'practical',
    targetCompletionDate: addMonths(new Date(), 3),
    currentSkills: []
  });
  const [optimizedPath, setOptimizedPath] = useState<OptimizedPath | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleOptimize = async () => {
    if (!preferences.availableHoursPerWeek || !preferences.preferredLearningStyle) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock optimized path
      setOptimizedPath({
        courses: [
          {
            id: 'course-1',
            name: 'JavaScript Fundamentals',
            description: 'Master the basics of JavaScript programming',
            duration: 20,
            difficulty: 'beginner',
            prerequisites: [],
            learningStyle: 'practical',
            skills: ['JavaScript', 'Programming Basics']
          },
          {
            id: 'course-2',
            name: 'React Essentials',
            description: 'Build modern web applications with React',
            duration: 30,
            difficulty: 'intermediate',
            prerequisites: ['JavaScript'],
            learningStyle: 'practical',
            skills: ['React', 'Web Development']
          }
        ],
        totalDuration: 50,
        estimatedCompletionDate: addMonths(new Date(), 2),
        weeklyCommitment: 8,
        skillsGained: ['JavaScript', 'React', 'Web Development'],
        confidenceScore: 85
      });

      toast({
        title: 'Success',
        description: 'Learning path optimized successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to optimize learning path',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: Course['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Learning Path Optimizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Preferences Form */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Learning Preferences
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Available Hours per Week
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={preferences.availableHoursPerWeek}
                        onChange={(e) =>
                          setPreferences(prev => ({
                            ...prev,
                            availableHoursPerWeek: parseInt(e.target.value)
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Preferred Learning Style
                      </label>
                      <Select
                        value={preferences.preferredLearningStyle}
                        onValueChange={(value: LearningPreferences['preferredLearningStyle']) =>
                          setPreferences(prev => ({
                            ...prev,
                            preferredLearningStyle: value
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="visual">Visual Learning</SelectItem>
                          <SelectItem value="practical">Practical Learning</SelectItem>
                          <SelectItem value="theoretical">Theoretical Learning</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Target Completion Date
                      </label>
                      <Input
                        type="date"
                        value={preferences.targetCompletionDate?.toISOString().split('T')[0]}
                        onChange={(e) =>
                          setPreferences(prev => ({
                            ...prev,
                            targetCompletionDate: new Date(e.target.value)
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleOptimize}
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sliders className="h-4 w-4 mr-2" />
                      )}
                      Optimize Path
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optimized Path */}
            {optimizedPath && (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="flex items-center gap-3">
                        <Clock className="h-8 w-8 text-blue-500" />
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">
                            Total Duration
                          </div>
                          <div className="text-2xl font-bold">
                            {optimizedPath.totalDuration}h
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Calendar className="h-8 w-8 text-green-500" />
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">
                            Weekly Commitment
                          </div>
                          <div className="text-2xl font-bold">
                            {optimizedPath.weeklyCommitment}h
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Target className="h-8 w-8 text-purple-500" />
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">
                            Confidence Score
                          </div>
                          <div className="text-2xl font-bold">
                            {optimizedPath.confidenceScore}%
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Recommended Course Path</h3>
                      <div className="space-y-4">
                        {optimizedPath.courses.map((course, index) => (
                          <Card key={course.id}>
                            <CardContent className="p-4">
                              <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-medium">{course.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {course.description}
                                    </p>
                                  </div>
                                  <Badge className={getDifficultyColor(course.difficulty)}>
                                    {course.difficulty}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-4 text-sm">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    {course.duration}h
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Book className="h-4 w-4" />
                                    {course.learningStyle}
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                  {course.skills.map(skill => (
                                    <Badge key={skill} variant="outline">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Estimated completion by {format(optimizedPath.estimatedCompletionDate, 'PP')}
                        </div>
                        <Button>
                          Start Learning
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}