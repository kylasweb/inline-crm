import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  Clock,
  Brain,
  Target,
  BarChart2,
  Settings,
  Loader2,
  Sliders,
  Check,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { format, addDays, getHours, setHours, setMinutes } from 'date-fns';

interface StudyBlock {
  id: string;
  day: number; // 0-6 for Sunday-Saturday
  startTime: string;
  duration: number;
  topic: string;
  priority: 'high' | 'medium' | 'low';
  energy: 'high' | 'medium' | 'low';
  type: 'focus' | 'review' | 'practice';
}

interface StudyPreferences {
  availableDays: number[];
  preferredTimes: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
  };
  maxSessionLength: number;
  breaksFrequency: number;
  weeklyGoalHours: number;
  energyPatterns: {
    morning: 'high' | 'medium' | 'low';
    afternoon: 'high' | 'medium' | 'low';
    evening: 'high' | 'medium' | 'low';
  };
}

interface OptimizedSchedule {
  blocks: StudyBlock[];
  totalHours: number;
  distribution: {
    type: string;
    hours: number;
  }[];
  recommendations: string[];
}

export function StudyScheduleOptimizer() {
  const [preferences, setPreferences] = useState<StudyPreferences>({
    availableDays: [1, 2, 3, 4, 5],
    preferredTimes: {
      morning: true,
      afternoon: true,
      evening: false
    },
    maxSessionLength: 60,
    breaksFrequency: 25,
    weeklyGoalHours: 10,
    energyPatterns: {
      morning: 'high',
      afternoon: 'medium',
      evening: 'low'
    }
  });
  
  const [schedule, setSchedule] = useState<OptimizedSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateSchedule = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock optimized schedule
      setSchedule({
        blocks: [
          {
            id: 'b1',
            day: 1,
            startTime: '09:00',
            duration: 45,
            topic: 'React State Management',
            priority: 'high',
            energy: 'high',
            type: 'focus'
          },
          {
            id: 'b2',
            day: 2,
            startTime: '14:00',
            duration: 30,
            topic: 'TypeScript Fundamentals Review',
            priority: 'medium',
            energy: 'medium',
            type: 'review'
          },
          {
            id: 'b3',
            day: 3,
            startTime: '10:00',
            duration: 60,
            topic: 'React Hooks Practice',
            priority: 'high',
            energy: 'high',
            type: 'practice'
          }
        ],
        totalHours: 10,
        distribution: [
          { type: 'focus', hours: 5 },
          { type: 'review', hours: 2 },
          { type: 'practice', hours: 3 }
        ],
        recommendations: [
          'Schedule challenging topics during high-energy morning slots',
          'Include 5-minute breaks every 25 minutes',
          'Review sessions are most effective in the afternoon'
        ]
      });

      toast({
        title: 'Success',
        description: 'Study schedule optimized successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate schedule',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getDayName = (day: number) => {
    return format(addDays(new Date(2024, 0, 7), day), 'EEEE');
  };

  const getEnergyColor = (energy: StudyBlock['energy']) => {
    switch (energy) {
      case 'high': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-red-500';
    }
  };

  const getTypeIcon = (type: StudyBlock['type']) => {
    switch (type) {
      case 'focus': return <Brain className="h-4 w-4" />;
      case 'review': return <Clock className="h-4 w-4" />;
      case 'practice': return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Study Schedule Optimizer
            </div>
            <Button onClick={generateSchedule} disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Sliders className="h-4 w-4 mr-2" />
              )}
              Optimize Schedule
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Preferences Form */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Weekly Study Goal (hours)
                    </label>
                    <Input
                      type="number"
                      value={preferences.weeklyGoalHours}
                      onChange={(e) =>
                        setPreferences(prev => ({
                          ...prev,
                          weeklyGoalHours: parseInt(e.target.value)
                        }))
                      }
                      className="w-[120px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Max Session Length (minutes)
                    </label>
                    <Select
                      value={preferences.maxSessionLength.toString()}
                      onValueChange={(value) =>
                        setPreferences(prev => ({
                          ...prev,
                          maxSessionLength: parseInt(value)
                        }))
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optimized Schedule */}
            {schedule && (
              <div className="space-y-6">
                {/* Schedule Overview */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <BarChart2 className="h-8 w-8 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Total Hours
                          </div>
                          <div className="text-2xl font-bold">
                            {schedule.totalHours}h
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Clock className="h-8 w-8 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Study Blocks
                          </div>
                          <div className="text-2xl font-bold">
                            {schedule.blocks.length}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Target className="h-8 w-8 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Goal Progress
                          </div>
                          <div className="text-2xl font-bold">
                            {Math.round((schedule.totalHours / preferences.weeklyGoalHours) * 100)}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Schedule Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Weekly Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4">
                        {schedule.blocks.map(block => (
                          <Card key={block.id}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    {getTypeIcon(block.type)}
                                    <span className="font-medium">
                                      {block.topic}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    {getDayName(block.day)} at {block.startTime}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">
                                    {block.duration}m
                                  </Badge>
                                  <Badge className={getEnergyColor(block.energy)}>
                                    {block.energy} energy
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {schedule.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                          <span>{rec}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}