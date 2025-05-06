import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import {
  Milestone,
  Calendar,
  Trophy,
  Timer,
  Star,
  Zap,
  CheckCircle2,
  Medal,
  Loader2,
  ChevronRight,
  Clock
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface TimelineEvent {
  id: string;
  type: 'module_completed' | 'test_passed' | 'certificate_earned' | 'streak_achieved' | 'milestone_reached';
  title: string;
  description: string;
  date: Date;
  metadata: {
    score?: number;
    streakDays?: number;
    programName?: string;
    moduleName?: string;
    achievement?: string;
  };
}

interface TimelineStats {
  totalModulesCompleted: number;
  averageScore: number;
  currentStreak: number;
  totalStudyHours: number;
  certificatesEarned: number;
  activeDays: number;
}

export function ProgressTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [stats, setStats] = useState<TimelineStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTimelineData();
  }, []);

  const loadTimelineData = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock timeline data
      setEvents([
        {
          id: '1',
          type: 'module_completed',
          title: 'Completed Introduction to React',
          description: 'Successfully completed all lessons and exercises',
          date: new Date('2025-05-05T10:30:00'),
          metadata: {
            moduleName: 'Introduction to React',
            programName: 'Frontend Development'
          }
        },
        {
          id: '2',
          type: 'test_passed',
          title: 'Passed Module Assessment',
          description: 'Demonstrated proficiency in React fundamentals',
          date: new Date('2025-05-05T11:45:00'),
          metadata: {
            score: 92,
            moduleName: 'React Fundamentals'
          }
        },
        {
          id: '3',
          type: 'streak_achieved',
          title: 'Learning Streak: 7 Days',
          description: 'Consistent learning progress for a week',
          date: new Date('2025-05-06T09:00:00'),
          metadata: {
            streakDays: 7
          }
        }
      ]);

      // Mock stats data
      setStats({
        totalModulesCompleted: 12,
        averageScore: 88,
        currentStreak: 7,
        totalStudyHours: 24,
        certificatesEarned: 1,
        activeDays: 15
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load timeline data.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'module_completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'test_passed':
        return <Star className="h-5 w-5 text-yellow-500" />;
      case 'certificate_earned':
        return <Medal className="h-5 w-5 text-purple-500" />;
      case 'streak_achieved':
        return <Zap className="h-5 w-5 text-orange-500" />;
      case 'milestone_reached':
        return <Trophy className="h-5 w-5 text-blue-500" />;
      default:
        return <Milestone className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Modules Completed
                  </div>
                  <div className="text-2xl font-bold">
                    {stats.totalModulesCompleted}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Average Score
                  </div>
                  <div className="text-2xl font-bold">
                    {stats.averageScore}%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Timer className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">
                    Study Hours
                  </div>
                  <div className="text-2xl font-bold">
                    {stats.totalStudyHours}h
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Learning Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No timeline events yet
              </div>
            ) : (
              <div className="relative pl-8 border-l">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className={`relative mb-8 ${index === events.length - 1 ? '' : 'pb-8'}`}
                  >
                    <div className="absolute -left-[41px] p-2 bg-background border rounded-full">
                      {getEventIcon(event.type)}
                    </div>

                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{event.title}</h4>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatDistanceToNow(event.date)} ago
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {event.description}
                          </p>
                          {event.metadata.score && (
                            <div className="flex items-center gap-2 mt-2">
                              <Progress value={event.metadata.score} className="h-2" />
                              <span className="text-sm font-medium">
                                {event.metadata.score}%
                              </span>
                            </div>
                          )}
                          {event.metadata.programName && (
                            <Badge variant="secondary">
                              {event.metadata.programName}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}