import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  LineChart,
  BarChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  Brain,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  BarChart2,
  CheckCircle2,
  Star,
  Award,
  Zap,
  Loader2
} from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';

interface AnalyticsSummary {
  totalStudyHours: number;
  averageDailyHours: number;
  learningStreak: number;
  totalAssessments: number;
  skillsImproved: number;
  goalsCompleted: number;
  upcomingDeadlines: number;
  averageScore: number;
}

interface StudyTrend {
  date: string;
  hours: number;
  sessions: number;
  efficiency: number;
}

interface SkillProgress {
  skill: string;
  current: number;
  previous: number;
  target: number;
}

interface AssessmentResult {
  id: string;
  topic: string;
  score: number;
  date: Date;
  duration: number;
  type: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export function LearningAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [trends, setTrends] = useState<StudyTrend[]>([]);
  const [skills, setSkills] = useState<SkillProgress[]>([]);
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock analytics data
      setSummary({
        totalStudyHours: 120,
        averageDailyHours: 2.5,
        learningStreak: 14,
        totalAssessments: 8,
        skillsImproved: 5,
        goalsCompleted: 12,
        upcomingDeadlines: 3,
        averageScore: 85
      });

      // Mock study trends
      const trendData: StudyTrend[] = Array.from({ length: 7 }, (_, i) => ({
        date: format(subDays(new Date(), 6 - i), 'MMM dd'),
        hours: 1 + Math.random() * 4,
        sessions: 1 + Math.floor(Math.random() * 3),
        efficiency: 60 + Math.random() * 30
      }));
      setTrends(trendData);

      // Mock skill progress
      setSkills([
        { skill: 'React', current: 75, previous: 60, target: 90 },
        { skill: 'TypeScript', current: 65, previous: 45, target: 80 },
        { skill: 'Node.js', current: 55, previous: 40, target: 75 }
      ]);

      // Mock assessment results
      setAssessments([
        {
          id: 'ass-1',
          topic: 'React Fundamentals',
          score: 85,
          date: subDays(new Date(), 7),
          duration: 45,
          type: 'Quiz'
        }
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getProgressIndicator = (current: number, previous: number) => {
    const diff = current - previous;
    if (diff > 0) {
      return (
        <Badge variant="outline" className="text-green-500">
          <TrendingUp className="h-3 w-3 mr-1" />
          +{diff}%
        </Badge>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5" />
              Learning Analytics
            </CardTitle>
            <Select
              value={timeRange}
              onValueChange={(value: 'week' | 'month' | 'year') => 
                setTimeRange(value)
              }
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="year">Past Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary Stats */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Clock className="h-8 w-8 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Study Hours
                        </div>
                        <div className="text-2xl font-bold">
                          {summary?.totalStudyHours}h
                        </div>
                        <div className="text-sm text-muted-foreground">
                          ~{summary?.averageDailyHours}h daily
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Zap className="h-8 w-8 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Learning Streak
                        </div>
                        <div className="text-2xl font-bold">
                          {summary?.learningStreak} days
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
                          {summary?.averageScore}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Star className="h-8 w-8 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Skills Improved
                        </div>
                        <div className="text-2xl font-bold">
                          {summary?.skillsImproved}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Study Trends Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Study Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trends}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="hours"
                          stroke="#8884d8"
                          name="Hours"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="efficiency"
                          stroke="#82ca9d"
                          name="Efficiency %"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Skill Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skill Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {skills.map(skill => (
                        <div key={skill.skill} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{skill.skill}</span>
                            {getProgressIndicator(skill.current, skill.previous)}
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${skill.current}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">
                              {skill.current}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Assessments */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Assessments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assessments.map(assessment => (
                        <Card key={assessment.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{assessment.topic}</div>
                                <div className="text-sm text-muted-foreground">
                                  {format(assessment.date, 'PP')} • {assessment.duration} mins
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className={getScoreColor(assessment.score)}
                              >
                                {assessment.score}%
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}