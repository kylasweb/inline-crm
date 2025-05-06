import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  Clock,
  Target,
  TrendingUp,
  ChevronRight,
  Brain,
  Star,
  Trophy,
  Zap,
  Loader2,
  Check,
  X,
  Plus,
  BarChart2,
  Book
} from 'lucide-react';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  subDays,
  isToday
} from 'date-fns';

interface Habit {
  id: string;
  name: string;
  target: number;
  unit: 'minutes' | 'hours' | 'sessions';
  streak: number;
  frequency: 'daily' | 'weekly';
  progress: number;
  category: 'focus' | 'practice' | 'review';
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  completionDates: Date[];
}

interface HabitStats {
  totalHabits: number;
  completedToday: number;
  longestStreak: number;
  weeklyProgress: number;
  consistencyRate: number;
  bestPerforming: string;
}

interface ActivityHeatmap {
  date: Date;
  completed: number;
  total: number;
}

export function StudyHabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stats, setStats] = useState<HabitStats | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock habits data
      const mockHabits: Habit[] = [
        {
          id: 'habit-1',
          name: 'Deep Focus Study',
          target: 120,
          unit: 'minutes',
          streak: 7,
          frequency: 'daily',
          progress: 80,
          category: 'focus',
          timeOfDay: 'morning',
          completionDates: Array.from({ length: 7 }, (_, i) => 
            subDays(new Date(), i)
          )
        },
        {
          id: 'habit-2',
          name: 'Code Practice',
          target: 3,
          unit: 'sessions',
          streak: 4,
          frequency: 'daily',
          progress: 66,
          category: 'practice',
          timeOfDay: 'afternoon',
          completionDates: Array.from({ length: 4 }, (_, i) => 
            subDays(new Date(), i)
          )
        }
      ];

      setHabits(mockHabits);
      setStats({
        totalHabits: mockHabits.length,
        completedToday: mockHabits.filter(h => 
          h.completionDates.some(d => isToday(d))
        ).length,
        longestStreak: Math.max(...mockHabits.map(h => h.streak)),
        weeklyProgress: 75,
        consistencyRate: 85,
        bestPerforming: 'Deep Focus Study'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load habits',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (habitId: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300));

      setHabits(prev =>
        prev.map(habit =>
          habit.id === habitId
            ? {
                ...habit,
                completionDates: [...habit.completionDates, new Date()],
                streak: habit.streak + 1,
                progress: Math.min(100, habit.progress + 10)
              }
            : habit
        )
      );

      toast({
        title: 'Success',
        description: 'Habit marked as completed'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update habit',
        variant: 'destructive'
      });
    }
  };

  const renderWeeklyCalendar = () => {
    const weekStart = startOfWeek(selectedDate);
    const weekEnd = endOfWeek(selectedDate);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map(day => {
          const completedHabits = habits.filter(habit =>
            habit.completionDates.some(d => isSameDay(d, day))
          ).length;

          return (
            <div
              key={day.toISOString()}
              className={`
                aspect-square rounded-lg flex flex-col items-center justify-center
                ${isToday(day) ? 'ring-2 ring-primary' : ''}
                ${completedHabits > 0 ? 'bg-primary/20' : 'bg-muted'}
              `}
            >
              <div className="text-xs text-muted-foreground">
                {format(day, 'EEE')}
              </div>
              <div className="font-medium">{format(day, 'd')}</div>
              {completedHabits > 0 && (
                <div className="text-xs text-primary mt-1">
                  {completedHabits} done
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const filteredHabits = habits.filter(habit => {
    switch (filter) {
      case 'completed':
        return habit.completionDates.some(d => isToday(d));
      case 'active':
        return !habit.completionDates.some(d => isToday(d));
      default:
        return true;
    }
  });

  const getHabitCategoryIcon = (category: Habit['category']) => {
    switch (category) {
      case 'focus': return <Brain className="h-4 w-4" />;
      case 'practice': return <Target className="h-4 w-4" />;
      case 'review': return <Book className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Study Habits
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Habit
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
              {stats && (
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-4">
                        <Trophy className="h-8 w-8 text-primary" />
                        <div>
                          <div className="text-sm text-muted-foreground">
                            Progress Today
                          </div>
                          <div className="text-2xl font-bold">
                            {stats.completedToday}/{stats.totalHabits}
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
                            Longest Streak
                          </div>
                          <div className="text-2xl font-bold">
                            {stats.longestStreak} days
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
                            Consistency Rate
                          </div>
                          <div className="text-2xl font-bold">
                            {stats.consistencyRate}%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Weekly Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  {renderWeeklyCalendar()}
                </CardContent>
              </Card>

              {/* Habits List */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Daily Habits</CardTitle>
                    <Select
                      value={filter}
                      onValueChange={(value: 'all' | 'active' | 'completed') => 
                        setFilter(value)
                      }
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter habits" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Habits</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {filteredHabits.map(habit => (
                        <Card key={habit.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  {getHabitCategoryIcon(habit.category)}
                                  <h3 className="font-medium">{habit.name}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary">
                                    {habit.timeOfDay}
                                  </Badge>
                                  <Badge variant="outline">
                                    {habit.target} {habit.unit}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                variant={habit.completionDates.some(d => isToday(d))
                                  ? 'secondary'
                                  : 'default'
                                }
                                onClick={() => handleMarkComplete(habit.id)}
                                disabled={habit.completionDates.some(d => isToday(d))}
                              >
                                {habit.completionDates.some(d => isToday(d)) ? (
                                  <Check className="h-4 w-4 mr-2" />
                                ) : (
                                  <Plus className="h-4 w-4 mr-2" />
                                )}
                                {habit.completionDates.some(d => isToday(d))
                                  ? 'Completed'
                                  : 'Complete'
                                }
                              </Button>
                            </div>

                            <div className="mt-4 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{habit.progress}%</span>
                              </div>
                              <Progress value={habit.progress} />
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                  <Zap className="h-4 w-4" />
                                  {habit.streak} day streak
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {habit.frequency}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}