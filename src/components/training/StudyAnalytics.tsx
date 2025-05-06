import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Brain,
  Clock,
  Calendar,
  Target,
  TrendingUp,
  Activity,
  BarChart2,
  PieChart as PieChartIcon,
  Loader2
} from 'lucide-react';

interface StudyMetrics {
  totalStudyTime: number;
  averageSessionDuration: number;
  completedModules: number;
  averageScore: number;
  streak: number;
  activeDays: number;
}

interface StudySession {
  date: string;
  duration: number;
  modulesCompleted: number;
  score?: number;
}

interface SkillProgress {
  skill: string;
  progress: number;
  color: string;
}

export function StudyAnalytics() {
  const [metrics, setMetrics] = useState<StudyMetrics | null>(null);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [skillProgress, setSkillProgress] = useState<SkillProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock data
      setMetrics({
        totalStudyTime: 48,
        averageSessionDuration: 45,
        completedModules: 24,
        averageScore: 88,
        streak: 7,
        activeDays: 15
      });

      setSessions(
        Array.from({ length: 14 }, (_, i) => ({
          date: format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), 'MMM dd'),
          duration: Math.floor(Math.random() * 120) + 30,
          modulesCompleted: Math.floor(Math.random() * 3),
          score: Math.random() > 0.3 ? Math.floor(Math.random() * 20) + 80 : undefined
        })).reverse()
      );

      setSkillProgress([
        { skill: 'React', progress: 75, color: '#0088FE' },
        { skill: 'TypeScript', progress: 60, color: '#00C49F' },
        { skill: 'Node.js', progress: 45, color: '#FFBB28' },
        { skill: 'Testing', progress: 30, color: '#FF8042' }
      ]);
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

  if (!metrics) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Total Study Time
                </div>
                <div className="text-2xl font-bold">
                  {metrics.totalStudyTime}h
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Modules Completed
                </div>
                <div className="text-2xl font-bold">
                  {metrics.completedModules}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground">
                  Average Score
                </div>
                <div className="text-2xl font-bold">
                  {metrics.averageScore}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Study Time Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Study Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sessions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="duration"
                  stroke="#8884d8"
                  name="Minutes"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Skill Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Skill Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillProgress.map(skill => (
              <div key={skill.skill} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{skill.skill}</span>
                  <span className="text-muted-foreground">{skill.progress}%</span>
                </div>
                <Progress
                  value={skill.progress}
                  style={{ color: skill.color }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Module Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessions}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="modulesCompleted"
                    fill="#8884d8"
                    name="Modules"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillProgress}
                    dataKey="progress"
                    nameKey="skill"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {skillProgress.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}