import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Line,
  LineChart
} from 'recharts';
import {
  Download,
  FileText,
  TrendingUp,
  Target,
  Timer,
  Brain,
  Calendar,
  Loader2,
  Activity,
  Filter,
  Share2
} from 'lucide-react';
import { format, subDays } from 'date-fns';

interface ReportData {
  period: 'week' | 'month' | 'quarter';
  overview: {
    totalStudyHours: number;
    completedModules: number;
    averageScore: number;
    activeDays: number;
  };
  progress: {
    course: string;
    completed: number;
    total: number;
  }[];
  timeDistribution: {
    category: string;
    hours: number;
  }[];
  scores: {
    date: string;
    score: number;
  }[];
  skills: {
    name: string;
    level: number;
    improvement: number;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export function ProgressReport() {
  const [period, setPeriod] = useState<ReportData['period']>('week');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const { toast } = useToast();

  const generateReport = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock report data
      setReportData({
        period,
        overview: {
          totalStudyHours: 24,
          completedModules: 12,
          averageScore: 85,
          activeDays: 5
        },
        progress: [
          { course: 'React Fundamentals', completed: 8, total: 10 },
          { course: 'TypeScript Basics', completed: 4, total: 8 },
          { course: 'Node.js Essentials', completed: 2, total: 6 }
        ],
        timeDistribution: [
          { category: 'Video Lectures', hours: 10 },
          { category: 'Exercises', hours: 8 },
          { category: 'Reading', hours: 4 },
          { category: 'Projects', hours: 2 }
        ],
        scores: Array.from({ length: 7 }, (_, i) => ({
          date: format(subDays(new Date(), 6 - i), 'MMM dd'),
          score: Math.floor(Math.random() * 20) + 80
        })),
        skills: [
          { name: 'React', level: 75, improvement: 15 },
          { name: 'TypeScript', level: 60, improvement: 10 },
          { name: 'Node.js', level: 45, improvement: 20 }
        ]
      });

      toast({
        title: 'Success',
        description: 'Progress report generated successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate report',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    // TODO: Implement PDF generation and download
    toast({
      title: 'Coming Soon',
      description: 'PDF download will be available soon'
    });
  };

  const handleShare = () => {
    // TODO: Implement report sharing
    toast({
      title: 'Coming Soon',
      description: 'Report sharing will be available soon'
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Progress Report
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select
                value={period}
                onValueChange={(value: ReportData['period']) => setPeriod(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Past Week</SelectItem>
                  <SelectItem value="month">Past Month</SelectItem>
                  <SelectItem value="quarter">Past Quarter</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={generateReport} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Generate Report'
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {reportData && (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Timer className="h-8 w-8 text-blue-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Study Hours
                        </div>
                        <div className="text-2xl font-bold">
                          {reportData.overview.totalStudyHours}h
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Brain className="h-8 w-8 text-green-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Modules Completed
                        </div>
                        <div className="text-2xl font-bold">
                          {reportData.overview.completedModules}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Target className="h-8 w-8 text-yellow-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Average Score
                        </div>
                        <div className="text-2xl font-bold">
                          {reportData.overview.averageScore}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <Calendar className="h-8 w-8 text-purple-500" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Active Days
                        </div>
                        <div className="text-2xl font-bold">
                          {reportData.overview.activeDays}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Course Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {reportData.progress.map(course => (
                      <div key={course.course} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{course.course}</span>
                          <span>
                            {course.completed}/{course.total} modules
                          </span>
                        </div>
                        <Progress
                          value={(course.completed / course.total) * 100}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Charts */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Time Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Time Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={reportData.timeDistribution}
                            dataKey="hours"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label
                          >
                            {reportData.timeDistribution.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Trend */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={reportData.scores}>
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
              </div>

              {/* Skill Progress */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skill Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {reportData.skills.map(skill => (
                      <div key={skill.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{skill.name}</span>
                            <Badge
                              variant="secondary"
                              className="ml-2 text-green-600"
                            >
                              +{skill.improvement}%
                            </Badge>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {skill.level}%
                          </span>
                        </div>
                        <Progress value={skill.level} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Report
                </Button>
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}