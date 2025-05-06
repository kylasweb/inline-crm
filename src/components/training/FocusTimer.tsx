import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
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
  Play,
  Pause,
  RotateCcw,
  Timer,
  Bell,
  Coffee,
  Brain,
  Zap,
  Volume2,
  VolumeX,
  Settings
} from 'lucide-react';

interface TimerSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  soundEnabled: boolean;
}

interface SessionStats {
  totalFocusTime: number;
  completedSessions: number;
  currentStreak: number;
}

type TimerState = 'focus' | 'short-break' | 'long-break';
type TimerStatus = 'idle' | 'running' | 'paused';

export function FocusTimer() {
  const [settings, setSettings] = useState<TimerSettings>({
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    soundEnabled: true
  });

  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [timerState, setTimerState] = useState<TimerState>('focus');
  const [timerStatus, setTimerStatus] = useState<TimerStatus>('idle');
  const [sessionCount, setSessionCount] = useState(0);
  const [stats, setStats] = useState<SessionStats>({
    totalFocusTime: 0,
    completedSessions: 0,
    currentStreak: 0
  });

  const timerRef = useRef<NodeJS.Timeout>();
  const audioRef = useRef<HTMLAudioElement>();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('/notification.mp3');
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    // Reset timer when state changes
    switch (timerState) {
      case 'focus':
        setTimeLeft(settings.focusDuration * 60);
        break;
      case 'short-break':
        setTimeLeft(settings.shortBreakDuration * 60);
        break;
      case 'long-break':
        setTimeLeft(settings.longBreakDuration * 60);
        break;
    }
  }, [timerState, settings]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const playNotification = () => {
    if (settings.soundEnabled && audioRef.current) {
      audioRef.current.play();
    }
  };

  const startTimer = () => {
    setTimerStatus('running');
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimerStatus('paused');
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setTimerStatus('idle');
    setTimeLeft(settings.focusDuration * 60);
    setTimerState('focus');
    setSessionCount(0);
  };

  const handleTimerComplete = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    playNotification();

    if (timerState === 'focus') {
      // Update stats
      setStats(prev => ({
        ...prev,
        totalFocusTime: prev.totalFocusTime + settings.focusDuration,
        completedSessions: prev.completedSessions + 1,
        currentStreak: prev.currentStreak + 1
      }));

      // Increment session count
      const newSessionCount = sessionCount + 1;
      setSessionCount(newSessionCount);

      // Determine next break type
      if (newSessionCount >= settings.sessionsUntilLongBreak) {
        setTimerState('long-break');
        setSessionCount(0);
        toast({
          title: 'Great work!',
          description: 'Time for a long break.'
        });
      } else {
        setTimerState('short-break');
        toast({
          title: 'Focus session complete!',
          description: 'Take a short break.'
        });
      }
    } else {
      // Break complete
      setTimerState('focus');
      toast({
        title: 'Break time over',
        description: 'Ready to focus again?'
      });
    }

    setTimerStatus('idle');
  };

  const getTimerColor = () => {
    switch (timerState) {
      case 'focus': return 'text-primary';
      case 'short-break': return 'text-green-500';
      case 'long-break': return 'text-blue-500';
      default: return '';
    }
  };

  const getProgress = () => {
    let total;
    switch (timerState) {
      case 'focus':
        total = settings.focusDuration * 60;
        break;
      case 'short-break':
        total = settings.shortBreakDuration * 60;
        break;
      case 'long-break':
        total = settings.longBreakDuration * 60;
        break;
      default:
        total = settings.focusDuration * 60;
    }
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Focus Timer
            </div>
            <Badge variant="outline">
              Session {sessionCount + 1}/{settings.sessionsUntilLongBreak}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Timer Display */}
            <div className="text-center space-y-4">
              <div className={`text-7xl font-bold ${getTimerColor()}`}>
                {formatTime(timeLeft)}
              </div>
              <Badge variant="secondary" className="text-base">
                {timerState === 'focus' ? (
                  <Brain className="h-4 w-4 mr-2" />
                ) : timerState === 'short-break' ? (
                  <Coffee className="h-4 w-4 mr-2" />
                ) : (
                  <Zap className="h-4 w-4 mr-2" />
                )}
                {timerState === 'focus'
                  ? 'Focus Time'
                  : timerState === 'short-break'
                  ? 'Short Break'
                  : 'Long Break'}
              </Badge>
            </div>

            {/* Progress Bar */}
            <Progress value={getProgress()} />

            {/* Controls */}
            <div className="flex justify-center gap-4">
              {timerStatus === 'running' ? (
                <Button size="lg" onClick={pauseTimer}>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </Button>
              ) : (
                <Button size="lg" onClick={startTimer}>
                  <Play className="h-4 w-4 mr-2" />
                  {timerStatus === 'idle' ? 'Start' : 'Resume'}
                </Button>
              )}
              <Button
                variant="outline"
                size="lg"
                onClick={resetTimer}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSettings(prev => ({
                  ...prev,
                  soundEnabled: !prev.soundEnabled
                }))}
              >
                {settings.soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold">
                    {Math.floor(stats.totalFocusTime / 60)}h {stats.totalFocusTime % 60}m
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total Focus Time
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold">
                    {stats.completedSessions}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Sessions Complete
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold">
                    {stats.currentStreak}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Current Streak
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}