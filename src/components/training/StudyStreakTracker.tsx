import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  Trophy,
  Flame,
  Target,
  Clock,
  Star,
  Zap,
  Award,
  Loader2
} from 'lucide-react';
import {
  addDays,
  format,
  isSameDay,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval
} from 'date-fns';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalStudyDays: number;
  lastStudyDate: Date | null;
  weeklyGoal: number;
  weeklyProgress: number;
  studyDates: Date[];
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'trophy' | 'star' | 'flame' | 'zap';
  unlockedAt: Date;
}

export function StudyStreakTracker() {
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadStreakData();
  }, []);

  const loadStreakData = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock streak data
      setStreakData({
        currentStreak: 5,
        longestStreak: 12,
        totalStudyDays: 25,
        lastStudyDate: new Date(),
        weeklyGoal: 5,
        weeklyProgress: 4,
        studyDates: Array.from({ length: 25 }, (_, i) => 
          addDays(new Date(), -Math.floor(Math.random() * 60))
        ).sort((a, b) => a.getTime() - b.getTime()),
        achievements: [
          {
            id: '1',
            title: '7-Day Streak',
            description: 'Studied for 7 consecutive days',
            icon: 'flame',
            unlockedAt: addDays(new Date(), -5)
          },
          {
            id: '2',
            title: 'Early Bird',
            description: 'Completed 5 morning study sessions',
            icon: 'star',
            unlockedAt: addDays(new Date(), -2)
          }
        ]
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load streak data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStreakIcon = (days: number) => {
    if (days >= 30) return '🔥';
    if (days >= 14) return '⚡';
    if (days >= 7) return '🌟';
    return '✨';
  };

  const renderAchievementIcon = (icon: Achievement['icon']) => {
    switch (icon) {
      case 'trophy': return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'star': return <Star className="h-5 w-5 text-purple-500" />;
      case 'flame': return <Flame className="h-5 w-5 text-red-500" />;
      case 'zap': return <Zap className="h-5 w-5 text-blue-500" />;
    }
  };

  const renderWeeklyCalendar = () => {
    if (!streakData) return null;

    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekEnd = endOfWeek(today);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map(day => {
          const isStudyDay = streakData.studyDates.some(d => isSameDay(d, day));
          const isToday = isSameDay(day, today);

          return (
            <div
              key={day.toISOString()}
              className={`
                aspect-square rounded-lg flex items-center justify-center
                ${isStudyDay ? 'bg-primary/20' : 'bg-muted'}
                ${isToday ? 'ring-2 ring-primary' : ''}
              `}
            >
              <div className="text-center">
                <div className="text-xs text-muted-foreground">
                  {format(day, 'EEE')}
                </div>
                <div className="font-medium">
                  {format(day, 'd')}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!streakData) return null;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Streak Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Flame className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Current Streak
                </div>
                <div className="text-2xl font-bold">
                  {streakData.currentStreak} days {getStreakIcon(streakData.currentStreak)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Longest Streak
                </div>
                <div className="text-2xl font-bold">
                  {streakData.longestStreak} days {getStreakIcon(streakData.longestStreak)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Total Study Days
                </div>
                <div className="text-2xl font-bold">
                  {streakData.totalStudyDays}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Weekly Progress
                </div>
                <div className="text-2xl font-bold">
                  {streakData.weeklyProgress}/{streakData.weeklyGoal}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderWeeklyCalendar()}
          <div className="mt-4">
            <Progress 
              value={(streakData.weeklyProgress / streakData.weeklyGoal) * 100}
            />
            <p className="text-sm text-muted-foreground mt-2">
              {streakData.weeklyGoal - streakData.weeklyProgress} days left to reach your weekly goal
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {streakData.achievements.map(achievement => (
              <Card key={achievement.id}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-muted rounded-lg">
                      {renderAchievementIcon(achievement.icon)}
                    </div>
                    <div>
                      <h4 className="font-medium">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {achievement.description}
                      </p>
                      <div className="text-xs text-muted-foreground mt-1">
                        Unlocked {format(achievement.unlockedAt, 'PP')}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}