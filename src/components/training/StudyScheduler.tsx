import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Calendar,
  Clock,
  Brain,
  Timer,
  Bell,
  Volume2,
  Play,
  Pause,
  SkipForward,
  Settings,
  Check,
  Plus,
  Trash2,
  Loader2,
  CalendarClock
} from 'lucide-react';
import {
  format,
  addMinutes,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday
} from 'date-fns';

interface StudySession {
  id: string;
  title: string;
  startTime: Date;
  duration: number; // minutes
  type: 'focus' | 'review' | 'practice';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  subject: string;
  recurringDays?: number[];
  reminder: boolean;
  notes?: string;
}

interface SessionPreferences {
  focusDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  autoStartBreaks: boolean;
  notifications: boolean;
  sound: boolean;
}

export function StudyScheduler() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [preferences, setPreferences] = useState<SessionPreferences>({
    focusDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    autoStartBreaks: true,
    notifications: true,
    sound: true
  });
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const loadSessions = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockSessions: StudySession[] = [
        {
          id: 'session-1',
          title: 'React Deep Dive',
          startTime: addMinutes(new Date(), 30),
          duration: 25,
          type: 'focus',
          status: 'scheduled',
          subject: 'React',
          reminder: true
        }
      ];

      setSessions(mockSessions);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load sessions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStartSession = (session: StudySession) => {
    setActiveSession(session);
    setTimeLeft(session.duration * 60);
    setIsRunning(true);
    setSessions(prev =>
      prev.map(s =>
        s.id === session.id
          ? { ...s, status: 'in_progress' }
          : s
      )
    );
  };

  const handlePauseSession = () => {
    setIsRunning(false);
  };

  const handleResumeSession = () => {
    setIsRunning(true);
  };

  const handleSessionComplete = () => {
    if (!activeSession) return;

    setIsRunning(false);
    setCompletedSessions(prev => prev + 1);

    setSessions(prev =>
      prev.map(s =>
        s.id === activeSession.id
          ? { ...s, status: 'completed' }
          : s
      )
    );

    if (preferences.notifications) {
      if (Notification.permission === 'granted') {
        new Notification('Session Complete!', {
          body: `Great job completing your ${activeSession.title} session!`
        });
      }
    }

    if (preferences.sound) {
      new Audio('/notification.mp3').play().catch(console.error);
    }

    const isLongBreak = completedSessions + 1 >= preferences.sessionsUntilLongBreak;
    const breakDuration = isLongBreak
      ? preferences.longBreakDuration
      : preferences.breakDuration;

    if (preferences.autoStartBreaks) {
      setTimeLeft(breakDuration * 60);
      setIsRunning(true);
      setActiveSession(null);
    } else {
      setActiveSession(null);
    }

    toast({
      title: 'Session Complete',
      description: 'Take a well-deserved break!'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderWeeklyCalendar = () => {
    const weekStart = startOfWeek(selectedDate);
    const weekEnd = endOfWeek(selectedDate);
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map(day => {
          const daySessions = sessions.filter(s => 
            isSameDay(s.startTime, day)
          );

          return (
            <div
              key={day.toISOString()}
              className={`
                p-4 rounded-lg border
                ${isToday(day) ? 'border-primary' : 'border-muted'}
                ${daySessions.length > 0 ? 'bg-muted/50' : ''}
              `}
            >
              <div className="text-sm font-medium">
                {format(day, 'EEE')}
              </div>
              <div className="text-2xl font-bold">
                {format(day, 'd')}
              </div>
              {daySessions.length > 0 && (
                <div className="mt-2 space-y-1">
                  {daySessions.map(session => (
                    <div
                      key={session.id}
                      className="text-xs p-1 rounded bg-muted"
                    >
                      {format(session.startTime, 'HH:mm')} - {session.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const getSessionTypeColor = (type: StudySession['type']) => {
    switch (type) {
      case 'focus': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      case 'practice': return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5" />
              Study Session Scheduler
            </CardTitle>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Session
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
              {/* Active Session Timer */}
              {activeSession && (
                <Card className="bg-muted/50">
                  <CardContent className="p-6">
                    <div className="text-center space-y-4">
                      <div className="text-4xl font-mono font-bold">
                        {formatTime(timeLeft)}
                      </div>
                      <div className="flex items-center justify-center gap-4">
                        {isRunning ? (
                          <Button
                            size="lg"
                            onClick={handlePauseSession}
                          >
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </Button>
                        ) : (
                          <Button
                            size="lg"
                            onClick={handleResumeSession}
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={handleSessionComplete}
                        >
                          <SkipForward className="h-4 w-4 mr-2" />
                          Skip
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Weekly Calendar */}
              {renderWeeklyCalendar()}

              {/* Session List */}
              <div className="space-y-4">
                {sessions.map(session => (
                  <Card key={session.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{session.title}</h3>
                            <Badge className={getSessionTypeColor(session.type)}>
                              {session.type}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {format(session.startTime, 'PPp')} ({session.duration} minutes)
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {session.status === 'scheduled' && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleStartSession(session)}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Start
                            </Button>
                          )}
                          {session.status === 'completed' && (
                            <Badge variant="outline" className="text-green-500">
                              <Check className="h-4 w-4 mr-1" />
                              Completed
                            </Badge>
                          )}
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}