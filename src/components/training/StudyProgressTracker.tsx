import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  Clock,
  Calendar,
  Target,
  CheckCircle2,
  Star,
  TrendingUp,
  Brain,
  Book,
  Plus,
  Award,
  Zap,
  Loader2,
  Flame,
  Medal,
  Trophy
} from 'lucide-react';
import { format, startOfWeek, eachDayOfInterval, isSameDay, addDays, subDays } from 'date-fns';

interface StudyDay {
  date: Date;
  hoursSpent: number;
  topicsStudied: string[];
  completedItems: {
    id: string;
    type: 'lesson' | 'exercise' | 'quiz';
    title: string;
    score?: number;
  }[];
  achievements: {
    id: string;
    title: string;
    type: 'streak' | 'milestone' | 'performance';
    icon: 'star' | 'award' | 'medal';
  }[];
  mood: 'great' | 'good' | 'okay' | 'tired';
  notes?: string;
}

interface StudyGoal {
  id: string;
  title: string;
  targetHours: number;
  currentHours: number;
  deadline: Date;
  priority: 'high' | 'medium' | 'low';
}

interface StudyStreak {
  current: number;
  longest: number;
  thisWeek: number;
  totalDays: number;
}

export function StudyProgressTracker() {
  const [studyDays, setStudyDays] = useState<StudyDay[]>([]);
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [streak, setStreak] = useState<StudyStreak>({
    current: 0,
    longest: 0,
    thisWeek: 0,
    totalDays: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock study data
      const mockStudyDays: StudyDay[] = Array.from({ length: 7 }, (_, i) => ({
        date: subDays(new Date(), 6 - i),
        hoursSpent: 1 + Math.random() * 3,
        topicsStudied: ['React', 'TypeScript'],
        completedItems: [
          {
            id: `item-${i}-1`,
            type: 'lesson',
            title: 'React Hooks Deep Dive',
            score: 85
          }
        ],
        achievements: i === 6 ? [
          {
            id: 'ach-1',
            title: '7 Day Streak',
            type: 'streak',
            icon: 'star'
          }
        ] : [],
        mood: 'good'
      }));

      const mockGoals: StudyGoal[] = [
        {
          id: 'goal-1',
          title: 'Master React Fundamentals',
          targetHours: 40,
          currentHours: 25,
          deadline: addDays(new Date(), 14),
          priority: 'high'
        }
      ];

      const mockStreak: StudyStreak = {
        current: 7,
        longest: 14,
        thisWeek: 5,
        totalDays: 32
      };

      setStudyDays(mockStudyDays);
      setGoals(mockGoals);
      setStreak(mockStreak);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load progress data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: StudyGoal['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
    }
  };

  const getAchievementIcon = (icon: 'star' | 'award' | 'medal') => {
    switch (icon) {
      case 'star': return <Star className="h-4 w-4" />;
      case 'award': return <Award className="h-4 w-4" />;
      case 'medal': return <Medal className="h-4 w-4" />;
    }
  };

  const renderCalendarWeek = () => {
    const startDate = startOfWeek(selectedDate);
    const weekDays = eachDayOfInterval({
      start: startDate,
      end: addDays(startDate, 6)
    });

    return (
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map(day => {
          const studyDay = studyDays.find(sd => isSameDay(sd.date, day));
          
          return (
            <div
              key={day.toISOString()}
              className={`
                p-4 rounded-lg border 
                ${isSameDay(day, new Date()) ? 'border-primary' : 'border-muted'}
                ${studyDay ? 'bg-muted/50' : ''}
              `}
            >
              <div className="text-sm font-medium">
                {format(day, 'EEE')}
              </div>
              <div className="text-2xl font-bold">
                {format(day, 'd')}
              </div>
              {studyDay && (
                <div className="mt-2 space-y-1">
                  <div className="text-xs font-medium">
                    {studyDay.hoursSpent.toFixed(1)}h studied
                  </div>
                  <div className="flex gap-1">
                    {studyDay.achievements.map(achievement => (
                      <Badge
                        key={achievement.id}
                        variant="secondary"
                        className="inline-flex items-center"
                      >
                        {getAchievementIcon(achievement.icon)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Study Progress
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Log Study Session
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
              {/* Stats Overview */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Flame className="h-8 w-8 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Current Streak
                        </div>
                        <div className="text-2xl font-bold">
                          {streak.current} days
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Trophy className="h-8 w-8 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Longest Streak
                        </div>
                        <div className="text-2xl font-bold">
                          {streak.longest} days
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
                          This Week
                        </div>
                        <div className="text-2xl font-bold">
                          {streak.thisWeek}/7 days
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Book className="h-8 w-8 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Total Study Days
                        </div>
                        <div className="text-2xl font-bold">
                          {streak.totalDays}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Weekly Calendar */}
              {renderCalendarWeek()}

              {/* Current Goals */}
              <div className="space-y-4">
                <h3 className="font-medium">Active Study Goals</h3>
                {goals.map(goal => (
                  <Card key={goal.id}>
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{goal.title}</h4>
                            <div className="text-sm text-muted-foreground">
                              Due {format(goal.deadline, 'PP')}
                            </div>
                          </div>
                          <Badge className={getPriorityColor(goal.priority)}>
                            {goal.priority}
                          </Badge>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>
                              {goal.currentHours}/{goal.targetHours} hours
                            </span>
                          </div>
                          <Progress
                            value={(goal.currentHours / goal.targetHours) * 100}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recent Achievements */}
              <div className="space-y-4">
                <h3 className="font-medium">Recent Achievements</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {studyDays
                    .flatMap(day => day.achievements)
                    .slice(0, 3)
                    .map(achievement => (
                      <Card key={achievement.id}>
                        <CardContent className="p-4 flex items-center gap-4">
                          {getAchievementIcon(achievement.icon)}
                          <div>
                            <div className="font-medium">{achievement.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {achievement.type}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}