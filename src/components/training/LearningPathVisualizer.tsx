import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  GitBranch,
  CheckCircle2,
  Lock,
  ArrowRight,
  Target,
  Clock,
  Calendar,
  Play,
  Flag,
  BarChart2,
  Award,
  Star,
  Loader2
} from 'lucide-react';
import { addDays, format } from 'date-fns';

interface PathNode {
  id: string;
  title: string;
  description: string;
  type: 'course' | 'project' | 'assessment';
  status: 'completed' | 'in_progress' | 'locked' | 'available';
  duration: number;
  progress?: number;
  dependencies: string[];
  achievements?: Achievement[];
  skills: {
    name: string;
    level: number;
  }[];
  estimatedCompletion?: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'completion' | 'mastery' | 'speed';
  icon: 'star' | 'award' | 'flag';
  unlockedAt?: Date;
}

interface PathStats {
  totalNodes: number;
  completedNodes: number;
  totalDuration: number;
  skillsMastered: number;
  achievementsEarned: number;
  estimatedCompletion: Date;
}

export function LearningPathVisualizer() {
  const [nodes, setNodes] = useState<PathNode[]>([]);
  const [stats, setStats] = useState<PathStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadPathData = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock path data
      const mockNodes: PathNode[] = [
        {
          id: 'node-1',
          title: 'JavaScript Fundamentals',
          description: 'Core concepts of JavaScript programming',
          type: 'course',
          status: 'completed',
          duration: 120,
          progress: 100,
          dependencies: [],
          skills: [
            { name: 'JavaScript', level: 80 }
          ],
          achievements: [
            {
              id: 'ach-1',
              title: 'Speed Learner',
              description: 'Completed course 30% faster than average',
              type: 'speed',
              icon: 'flag',
              unlockedAt: new Date('2025-04-15')
            }
          ]
        },
        {
          id: 'node-2',
          title: 'React Essentials',
          description: 'Introduction to React development',
          type: 'course',
          status: 'in_progress',
          duration: 180,
          progress: 45,
          dependencies: ['node-1'],
          skills: [
            { name: 'React', level: 40 },
            { name: 'JavaScript', level: 85 }
          ],
          estimatedCompletion: addDays(new Date(), 14)
        },
        {
          id: 'node-3',
          title: 'Portfolio Project',
          description: 'Build a personal portfolio with React',
          type: 'project',
          status: 'locked',
          duration: 90,
          dependencies: ['node-2'],
          skills: [
            { name: 'React', level: 60 },
            { name: 'CSS', level: 70 }
          ]
        }
      ];

      setNodes(mockNodes);
      setStats({
        totalNodes: mockNodes.length,
        completedNodes: mockNodes.filter(n => n.status === 'completed').length,
        totalDuration: mockNodes.reduce((acc, n) => acc + n.duration, 0),
        skillsMastered: 2,
        achievementsEarned: 1,
        estimatedCompletion: addDays(new Date(), 45)
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load learning path data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: PathNode['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'in_progress': return <Play className="h-5 w-5 text-blue-500" />;
      case 'locked': return <Lock className="h-5 w-5 text-muted-foreground" />;
      case 'available': return <ArrowRight className="h-5 w-5 text-primary" />;
    }
  };

  const getAchievementIcon = (icon: Achievement['icon']) => {
    switch (icon) {
      case 'star': return <Star className="h-5 w-5" />;
      case 'award': return <Award className="h-5 w-5" />;
      case 'flag': return <Flag className="h-5 w-5" />;
    }
  };

  const getNodeColor = (status: PathNode['status']) => {
    switch (status) {
      case 'completed': return 'border-green-500';
      case 'in_progress': return 'border-blue-500';
      case 'locked': return 'border-muted';
      case 'available': return 'border-primary';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Learning Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Path Stats */}
              {stats && (
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <BarChart2 className="h-8 w-8 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Progress
                          </div>
                          <div className="text-2xl font-bold">
                            {Math.round((stats.completedNodes / stats.totalNodes) * 100)}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <Clock className="h-8 w-8 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Total Duration
                          </div>
                          <div className="text-2xl font-bold">
                            {Math.round(stats.totalDuration / 60)}h
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <Calendar className="h-8 w-8 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Est. Completion
                          </div>
                          <div className="text-2xl font-bold">
                            {format(stats.estimatedCompletion, 'MMM d')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Path Visualization */}
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {nodes.map((node, index) => (
                    <div key={node.id} className="relative">
                      {index > 0 && (
                        <div className="absolute top-0 left-6 h-full w-px bg-muted-foreground/20" />
                      )}
                      <Card className={`ml-12 border-l-4 ${getNodeColor(node.status)}`}>
                        <CardContent className="p-6">
                          <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 bg-background p-1 rounded-full">
                            {getStatusIcon(node.status)}
                          </div>

                          <div className="space-y-4">
                            <div>
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{node.title}</h3>
                                <Badge variant="outline">
                                  {node.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {node.description}
                              </p>
                            </div>

                            {node.progress !== undefined && (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span>{node.progress}%</span>
                                </div>
                                <Progress value={node.progress} />
                              </div>
                            )}

                            <div className="flex flex-wrap gap-2">
                              {node.skills.map(skill => (
                                <Badge key={skill.name} variant="secondary">
                                  {skill.name} Lv.{skill.level}
                                </Badge>
                              ))}
                            </div>

                            {node.achievements && node.achievements.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {node.achievements.map(achievement => (
                                  <Badge
                                    key={achievement.id}
                                    className="bg-yellow-100 text-yellow-800 flex items-center gap-1"
                                  >
                                    {getAchievementIcon(achievement.icon)}
                                    {achievement.title}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                {node.duration} minutes
                              </div>
                              {node.estimatedCompletion && (
                                <div className="flex items-center gap-2">
                                  <Target className="h-4 w-4" />
                                  Complete by {format(node.estimatedCompletion, 'MMM d')}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}