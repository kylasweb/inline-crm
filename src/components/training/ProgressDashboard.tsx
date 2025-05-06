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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Trophy,
  Clock,
  Target,
  BarChart2,
  Calendar,
  Star,
  Brain,
  BookOpen,
  Loader2,
  GraduationCap,
  TrendingUp,
  Award
} from 'lucide-react';
import { format, subDays } from 'date-fns';

interface ProgressStats {
  totalHours: number;
  coursesCompleted: number;
  currentStreak: number;
  averageScore: number;
  skillsInProgress: number;
  nextMilestone: string;
}

interface ActivityData {
  date: string;
  hours: number;
  modules: number;
}

interface SkillProgress {
  name: string;
  progress: number;
  lastAssessment: Date;
  trend: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  earnedAt: Date;
  type: string;
  icon: 'trophy' | 'star' | 'award';
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function ProgressDashboard() {
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [skills, setSkills] = useState<SkillProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // TODO: Replace with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock data
      setStats({
        totalHours: 120,
        coursesCompleted: 8,
        currentStreak: 12,
        averageScore: 85,
        skillsInProgress: 5,
        nextMilestone: 'Complete Advanced React Course'
      });

      setActivityData(
        Array.from({ length: 14 }, (_, i) => ({
          date: format(subDays(new Date(), 13 - i), 'MMM dd'),
          hours: Math.floor(Math.random() * 5) + 1,
          modules: Math.floor(Math.random() * 3)
        }))
      );

      setSkills([
        {
          name: 'React',
          progress: 75,
          lastAssessment: new Date('2025-05-01'),
          trend: 15
        },
        {
          name: 'TypeScript',
          progress: 60,
          lastAssessment: new Date('2025-05-03'),
          trend: 10
        },
        {
          name: 'Node.js',
          progress: 45,
          lastAssessment: new Date('2025-05-04'),
          trend: 5
        }
      ]);

      setAchievements([
        {
          id: 'ach1',
          title: 'Fast Learner',
          description: 'Completed 5 modules in one week',
          earnedAt: new Date('2025-05-02'),
          type: 'milestone',
          icon: 'trophy'
        },
        {
          id: 'ach2',
          title: 'Perfect Score',
          description: 'Scored 100% in an assessment',
          earnedAt: new Date('2025-05-04'),
          type: 'performance',
          icon: 'star'
        }
      ]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getAchievementIcon = (icon: Achievement['icon']) => {
    switch (icon) {
      case 'trophy': return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'star': return <Star className="h-5 w-5 text-purple-500" />;
      case 'award': return <Award className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Clock className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Total Study Hours
                    </div>
                    <div className="text-2xl font-bold">
                      {stats?.totalHours}h
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Courses Completed
                    </div>
                    <div className="text-2xl font-bold">
                      {stats?.coursesCompleted}
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
                      {stats?.averageScore}%
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
                      Current Streak
                    </div>
                    <div className="text-2xl font-bold">
                      {stats?.currentStreak} days
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="hours"
                      stroke="#8884d8"
                      name="Hours"
                    />
                    <Line
                      type="monotone"
                      dataKey="modules"
                      stroke="#82ca9d"
                      name="Modules"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Skills Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Skills Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {skills.map(skill => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{skill.name}</span>
                          <Badge variant="secondary" className="text-green-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +{skill.trend}%
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {format(skill.lastAssessment, 'MMM d')}
                        </span>
                      </div>
                      <Progress value={skill.progress} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-4">
                    {achievements.map(achievement => (
                      <Card key={achievement.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-muted rounded-lg">
                              {getAchievementIcon(achievement.icon)}
                            </div>
                            <div>
                              <h4 className="font-medium">{achievement.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {achievement.description}
                              </p>
                              <div className="text-xs text-muted-foreground mt-1">
                                Earned {format(achievement.earnedAt, 'PP')}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Next Milestone</h4>
                  <p className="text-sm text-muted-foreground">
                    {stats?.nextMilestone}
                  </p>
                </div>
                <Button>
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}