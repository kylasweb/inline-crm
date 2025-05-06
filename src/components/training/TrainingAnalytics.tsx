import { useState, useEffect } from 'react';
import { useTrainingAuth } from '@/contexts/TrainingAuthContext';
import { trainingService } from '@/services/training/trainingService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
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
  TrendingUp,
  Calendar,
  BarChart2,
  Loader2
} from 'lucide-react';

interface AnalyticsData {
  overallProgress: number;
  totalModules: number;
  completedModules: number;
  averageScore: number;
  studyTime: number;
  lastActive: Date;
  completionRate: number;
  progressByProgram: Array<{
    name: string;
    completed: number;
    total: number;
  }>;
  scoreDistribution: Array<{
    range: string;
    count: number;
  }>;
  weeklyActivity: Array<{
    date: string;
    modules: number;
    minutes: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function TrainingAnalytics() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const { userProgress } = useTrainingAuth();

  useEffect(() => {
    loadAnalytics();
  }, [userProgress]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock analytics data
      setAnalytics({
        overallProgress: 65,
        totalModules: 48,
        completedModules: 31,
        averageScore: 87,
        studyTime: 2460, // minutes
        lastActive: new Date(),
        completionRate: 78,
        progressByProgram: [
          { name: 'Web Development', completed: 15, total: 20 },
          { name: 'Cloud Computing', completed: 8, total: 12 },
          { name: 'Data Science', completed: 8, total: 16 }
        ],
        scoreDistribution: [
          { range: '90-100', count: 12 },
          { range: '80-89', count: 15 },
          { range: '70-79', count: 3 },
          { range: '<70', count: 1 }
        ],
        weeklyActivity: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
          modules: Math.floor(Math.random() * 5),
          minutes: Math.floor(Math.random() * 120)
        }))
      });
    } catch (error) {
      console.error('Failed to load analytics:', error);
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

  if (!analytics) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Trophy className="h-8 w-8 text-yellow-500" />
              <div>
                <div className="text-sm font-medium">Completion Rate</div>
                <div className="text-2xl font-bold">{analytics.completionRate}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-sm font-medium">Average Score</div>
                <div className="text-2xl font-bold">{analytics.averageScore}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-green-500" />
              <div>
                <div className="text-sm font-medium">Total Study Time</div>
                <div className="text-2xl font-bold">
                  {Math.round(analytics.studyTime / 60)}h
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-purple-500" />
              <div>
                <div className="text-sm font-medium">Modules Complete</div>
                <div className="text-2xl font-bold">
                  {analytics.completedModules}/{analytics.totalModules}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Program Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Program Progress</CardTitle>
          <CardDescription>Your progress across different programs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.progressByProgram.map((program, index) => {
              const progress = (program.completed / program.total) * 100;
              return (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{program.name}</span>
                    <span className="text-muted-foreground">
                      {program.completed}/{program.total} modules
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Modules completed and study time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="modules" fill="#8884d8" name="Modules" />
                  <Bar yAxisId="right" dataKey="minutes" fill="#82ca9d" name="Minutes" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Score Distribution</CardTitle>
            <CardDescription>Test scores across all modules</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.scoreDistribution}
                    dataKey="count"
                    nameKey="range"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {analytics.scoreDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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