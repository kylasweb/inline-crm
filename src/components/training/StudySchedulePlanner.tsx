import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Bell,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { addDays, format, isSameDay } from 'date-fns';

interface StudySession {
  id: string;
  moduleId: string;
  moduleName: string;
  date: Date;
  duration: number; // in minutes
  completed: boolean;
  reminderSet: boolean;
}

interface ModuleOption {
  id: string;
  name: string;
  estimatedDuration: number;
}

export function StudySchedulePlanner() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedModule, setSelectedModule] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<string>('30');
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Mock module options
  const moduleOptions: ModuleOption[] = [
    { id: 'mod-1', name: 'Introduction to React', estimatedDuration: 60 },
    { id: 'mod-2', name: 'State Management', estimatedDuration: 90 },
    { id: 'mod-3', name: 'React Hooks', estimatedDuration: 120 },
  ];

  const handleAddSession = async () => {
    if (!selectedModule || !selectedDate) {
      toast({
        title: 'Error',
        description: 'Please select both a module and date',
        variant: 'destructive'
      });
      return;
    }

    const module = moduleOptions.find(m => m.id === selectedModule);
    if (!module) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const newSession: StudySession = {
        id: `session-${Date.now()}`,
        moduleId: selectedModule,
        moduleName: module.name,
        date: selectedDate,
        duration: parseInt(selectedDuration),
        completed: false,
        reminderSet: false
      };

      setSessions(prev => [...prev, newSession]);
      toast({
        title: 'Success',
        description: 'Study session scheduled successfully.'
      });

      // Reset selections
      setSelectedModule('');
      setSelectedDuration('30');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to schedule session.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = (sessionId: string) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, completed: !session.completed }
          : session
      )
    );
  };

  const handleToggleReminder = async (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    try {
      if (!session.reminderSet) {
        // Request notification permission if needed
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          if (permission !== 'granted') {
            throw new Error('Notification permission denied');
          }
        }
      }

      setSessions(prev =>
        prev.map(s =>
          s.id === sessionId
            ? { ...s, reminderSet: !s.reminderSet }
            : s
        )
      );

      toast({
        title: session.reminderSet ? 'Reminder Disabled' : 'Reminder Set',
        description: session.reminderSet
          ? 'You will no longer receive notifications for this session'
          : 'You will be notified before the session starts'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to set reminder. Please ensure notifications are enabled.',
        variant: 'destructive'
      });
    }
  };

  const sessionsForSelectedDate = sessions.filter(session =>
    isSameDay(session.date, selectedDate)
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Schedule Study Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Module</label>
                <Select
                  value={selectedModule}
                  onValueChange={setSelectedModule}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                  <SelectContent>
                    {moduleOptions.map(module => (
                      <SelectItem key={module.id} value={module.id}>
                        {module.name} ({module.estimatedDuration} min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (minutes)</label>
                <Select
                  value={selectedDuration}
                  onValueChange={setSelectedDuration}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {['15', '30', '45', '60', '90', '120'].map(duration => (
                      <SelectItem key={duration} value={duration}>
                        {duration} minutes
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
              />

              <Button
                className="w-full"
                onClick={handleAddSession}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CalendarDays className="h-4 w-4 mr-2" />
                )}
                Schedule Session
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                Sessions for {format(selectedDate, 'PP')}
              </span>
              <CalendarIcon className="h-5 w-5 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {sessionsForSelectedDate.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No study sessions scheduled for this date
                </div>
              ) : (
                <div className="space-y-4">
                  {sessionsForSelectedDate.map(session => (
                    <Card key={session.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-medium">{session.moduleName}</h3>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              {session.duration} minutes
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleComplete(session.id)}
                            >
                              <CheckCircle2 className={`h-4 w-4 ${session.completed ? 'text-green-500' : ''}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleReminder(session.id)}
                            >
                              <Bell className={`h-4 w-4 ${session.reminderSet ? 'text-yellow-500' : ''}`} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}