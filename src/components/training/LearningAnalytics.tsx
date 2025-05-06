import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Brain,
  Clock,
  Calendar,
  ChartBar,
  Target,
  TrendingUp,
  Star,
  Timer,
  BookOpen,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Loader2
} from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';

interface AnalyticsData {
  overview: {
    totalStudyHours: number;
    averageDailyHours: number;
    completedModules: number;
    averageScore: number;
    learningStreak: number;
    skillsImproved: number;
  };
  studyHabits: {
    timeDistribution: {
      hour: number;
      duration: number;
    }[];
    focusScores: {
      date: string;
      score: number;
    }[];
    breakPatterns: {
      type: string;
      frequency: number;
    }[];
  };
  performance: {
    moduleScores: {
      module: string;
      score: number;
      average: number;
    }[];
    skillProgress: {
      skill: string;
      current: number;
      previous: number;
      change: number;
    }[];
    learningPace: {
      week: string;
      completed: number;
      expected: number;
    }[];
  };
  predictions: {
    nextMilestone: string;
    estimatedCompletion: Date;
    recommendedFocus: string[];
    projectedGrowth: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function LearningAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock analytics data
      setData({
        overview: {
          totalStudyHours: 120,
          averageDailyHours: 2.5,
          completedModules: 24,
          averageScore: 85,
          learningStreak: 12,
          skillsImproved: 5
        },
        studyHabits: {
          timeDistribution: Array.from({ length: 24 }, (_, i) => ({
            hour: i,
            duration: Math.floor(Math.random() * 120)
          })),
          focusScores: Array.from({ length: 7 }, (_, i) => ({
            date: format(subDays(new Date(), 6 - i), 'MMM dd'),
            score: 70 + Math.floor(Math.random() * 20)
          })),
          breakPatterns: [
            { type: 'Short Break', frequency: 45 },
            { type: 'Long Break', frequency: 20 },
            { type: 'Extended Break', frequency: 10 }
          ]
        },
        performance: {
          moduleScores: [
            { module: 'React Basics', score: 92, average: 85 },
            { module: 'State Management', score: 88, average: 82 },
            { module: 'API Integration', score: 85, average: 80 }
          ],
          skillProgress: [
            { skill: 'React', current: 85, previous: 70, change: 15 },
            { skill: 'TypeScript', current: 75, previous: 60, change: 15 },
            { skill: 'Testing', current: 65, previous: 45, change: 20 }
          ],
          learningPace: Array.from({ length: 4 }, (_, i) => ({
            week: `Week ${i + 1}`,
            completed: 3 + Math.floor(Math.random() * 2),
            expected: 4
          }))
        },
        predictions: {
          nextMilestone: 'Complete Advanced React Patterns',
          estimatedCompletion: addDays(new Date(), 30),
          recommendedFocus: [
            'API Security',
            'Performance Optimization',
            'Error Handling'
          ],
          projectedGrowth: 25
        }
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Clock className="h-8 w-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">
                  Total Study Time
                </div>
                <div className="text-2xl font-bold">
                  {data.overview.totalStudyHours}h
                </div>
                <div className="text-sm text-muted-foreground">
                  ~{data.overview.averageDailyHours}h daily
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Target className="h-8 w-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">
                  Average Score
                </div>
                <div className="text-2xl font-bold">
                  {data.overview.averageScore}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {data.overview.completedModules} modules
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">
                  Skills Improved
                </div>
                <div className="text-2xl font-bold">
                  {data.overview.skillsImproved}
                </div>
                <div className="text-sm text-muted-foreground">
                  {data.overview.learningStreak} day streak
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Focus Scores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Focus Scores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.studyHabits.focusScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Learning Pace */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ChartBar className="h-5 w-5" />
              Learning Pace
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.performance.learningPace}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="completed"
                    fill="#8884d8"
                    name="Completed"
                  />
                  <Bar
                    dataKey="expected"
                    fill="#82ca9d"
                    name="Expected"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Skill Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Skill Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {data.performance.skillProgress.map(skill => (
                <div key={skill.skill} className="space-y-2">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{skill.skill}</span>
                      <Badge
                        variant="secondary"
                        className={skill.change > 0 ? 'text-green-600' : 'text-red-600'}
                      >
                        {skill.change > 0 ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(skill.change)}%
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {skill.current}%
                    </span>
                  </div>
                  <Progress value={skill.current} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Study Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Study Time Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.studyHabits.timeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="hour"
                    tickFormatter={(hour) => `${hour}:00`}
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(hour) => `${hour}:00`}
                    formatter={(value) => [`${value} min`, 'Duration']}
                  />
                  <Bar
                    dataKey="duration"
                    fill="#8884d8"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Learning Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="text-sm text-muted-foreground">Next Milestone</div>
              <div className="text-lg font-medium mt-1">
                {data.predictions.nextMilestone}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Estimated completion by{' '}
                {format(data.predictions.estimatedCompletion, 'PPP')}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Recommended Focus Areas
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.predictions.recommendedFocus.map((focus, index) => (
                  <Badge key={index} variant="secondary">
                    {focus}
                  </Badge>
                ))}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Projected skill growth: +{data.predictions.projectedGrowth}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}