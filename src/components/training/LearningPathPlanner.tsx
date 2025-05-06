import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import {
  GraduationCap,
  Target,
  Clock,
  Calendar,
  Brain,
  Compass,
  Flag,
  Plus,
  ChevronRight,
  CheckCircle2,
  Lock,
  AlertTriangle,
  Loader2,
  ArrowUpRight,
  BarChart2
} from 'lucide-react';
import { addDays, format } from 'date-fns';

interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  completed: boolean;
  skills: SkillRequirement[];
  resources: Resource[];
  dependencies: string[];
}

interface SkillRequirement {
  name: string;
  targetLevel: number;
  currentLevel: number;
}

interface Resource {
  id: string;
  title: string;
  type: 'course' | 'book' | 'project' | 'practice';
  url: string;
  completed: boolean;
  estimatedHours: number;
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number; // weeks
  milestones: Milestone[];
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  startDate?: Date;
  completionDate?: Date;
  tags: string[];
}

export function LearningPathPlanner() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePath, setActivePath] = useState<LearningPath | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPaths();
  }, []);

  const loadPaths = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockPaths: LearningPath[] = [
        {
          id: 'path-1',
          title: 'Full Stack Development',
          description: 'Complete journey from frontend to backend development',
          category: 'Web Development',
          difficulty: 'intermediate',
          estimatedDuration: 12,
          progress: 35,
          status: 'in_progress',
          startDate: addDays(new Date(), -30),
          tags: ['React', 'Node.js', 'MongoDB'],
          milestones: [
            {
              id: 'ms-1',
              title: 'Frontend Fundamentals',
              description: 'Master core frontend technologies',
              targetDate: addDays(new Date(), 14),
              completed: true,
              skills: [
                {
                  name: 'React',
                  targetLevel: 80,
                  currentLevel: 65
                },
                {
                  name: 'TypeScript',
                  targetLevel: 70,
                  currentLevel: 50
                }
              ],
              resources: [
                {
                  id: 'res-1',
                  title: 'React Course',
                  type: 'course',
                  url: 'https://example.com/react',
                  completed: true,
                  estimatedHours: 20
                }
              ],
              dependencies: []
            }
          ]
        }
      ];

      setPaths(mockPaths);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load learning paths',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletionDate = (path: LearningPath) => {
    if (!path.startDate) return undefined;
    return addDays(path.startDate, path.estimatedDuration * 7);
  };

  const getDifficultyColor = (difficulty: LearningPath['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'text-green-500';
    if (progress >= 25) return 'text-blue-500';
    return 'text-yellow-500';
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Compass className="h-5 w-5" />
              Learning Paths
            </CardTitle>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Path
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {paths.map(path => (
                <Card key={path.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{path.title}</h3>
                            <Badge className={getDifficultyColor(path.difficulty)}>
                              {path.difficulty}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {path.description}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => setActivePath(path)}
                        >
                          View Details
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {path.tags.map(tag => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Overall Progress</span>
                          <span className={getProgressColor(path.progress)}>
                            {path.progress}%
                          </span>
                        </div>
                        <Progress
                          value={path.progress}
                          className="h-2"
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            Started {path.startDate && format(path.startDate, 'PP')}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Flag className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            {calculateCompletionDate(path) && 
                              `Complete by ${format(calculateCompletionDate(path)!, 'PP')}`
                            }
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            {path.estimatedDuration} weeks
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            {path.milestones.length} milestones
                          </div>
                        </div>
                      </div>

                      {/* Milestone Preview */}
                      <div className="mt-4 space-y-2">
                        {path.milestones.slice(0, 3).map(milestone => (
                          <div
                            key={milestone.id}
                            className="flex items-center justify-between p-2 bg-muted rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              {milestone.completed ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                              )}
                              <span className="text-sm">{milestone.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {milestone.dependencies.length > 0 && (
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              )}
                              <Badge variant="outline">
                                {format(milestone.targetDate, 'MMM d')}
                              </Badge>
                            </div>
                          </div>
                        ))}
                        {path.milestones.length > 3 && (
                          <div className="text-sm text-center text-muted-foreground">
                            +{path.milestones.length - 3} more milestones
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}