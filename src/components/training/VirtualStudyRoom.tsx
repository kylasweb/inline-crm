import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  MessageSquare,
  Clock,
  Timer,
  Users,
  Send,
  Share2,
  Coffee,
  Hand,
  Settings,
  Volume2,
  VolumeX,
  Plus,
  Loader2
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  avatar?: string;
  status: 'studying' | 'break' | 'away';
  videoEnabled: boolean;
  audioEnabled: boolean;
  focusScore: number;
  raisedHand: boolean;
  joinedAt: Date;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'system';
}

interface FocusSession {
  duration: number;
  remaining: number;
  type: 'focus' | 'break';
  status: 'idle' | 'running' | 'paused';
}

export function VirtualStudyRoom() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [focusSession, setFocusSession] = useState<FocusSession>({
    duration: 25 * 60, // 25 minutes in seconds
    remaining: 25 * 60,
    type: 'focus',
    status: 'idle'
  });

  const chatEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const { toast } = useToast();

  useEffect(() => {
    loadRoomData();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadRoomData = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const initialParticipants: Participant[] = [
        {
          id: 'user-1',
          name: 'Sarah Wilson',
          status: 'studying',
          videoEnabled: true,
          audioEnabled: true,
          focusScore: 85,
          raisedHand: false,
          joinedAt: new Date()
        },
        {
          id: 'user-2',
          name: 'Mike Johnson',
          status: 'studying',
          videoEnabled: true,
          audioEnabled: false,
          focusScore: 92,
          raisedHand: false,
          joinedAt: new Date()
        }
      ];

      const initialMessages: ChatMessage[] = [
        {
          id: 'msg-1',
          userId: 'system',
          userName: 'System',
          content: 'Study session started',
          timestamp: new Date(),
          type: 'system'
        }
      ];

      setParticipants(initialParticipants);
      setMessages(initialMessages);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to connect to study room',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const startFocusSession = (type: FocusSession['type']) => {
    const duration = type === 'focus' ? 25 * 60 : 5 * 60; // 25 or 5 minutes in seconds
    setFocusSession({
      duration,
      remaining: duration,
      type,
      status: 'running'
    });

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      setFocusSession(prev => {
        if (prev.remaining <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          handleSessionComplete(type);
          return {
            ...prev,
            remaining: 0,
            status: 'idle'
          };
        }
        return {
          ...prev,
          remaining: prev.remaining - 1
        };
      });
    }, 1000);
  };

  const handleSessionComplete = (type: FocusSession['type']) => {
    if (soundEnabled) {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(error => {
        console.error('Failed to play notification sound:', error);
      });
    }

    const systemMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId: 'system',
      userName: 'System',
      content: `${type === 'focus' ? 'Focus' : 'Break'} session completed`,
      timestamp: new Date(),
      type: 'system'
    };

    setMessages(prev => [...prev, systemMessage]);

    toast({
      title: 'Session Complete',
      description: `Your ${type} session has finished`
    });
  };

  const pauseSession = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setFocusSession(prev => ({
      ...prev,
      status: 'paused'
    }));
  };

  const resumeSession = () => {
    startFocusSession(focusSession.type);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId: 'current-user',
      userName: 'You',
      content: newMessage,
      timestamp: new Date(),
      type: 'message'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Study Area */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Virtual Study Room
              </div>
              <Badge variant={focusSession.status === 'running' ? 'default' : 'secondary'}>
                {focusSession.type === 'focus' ? 'Focus Time' : 'Break Time'}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Participant Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {participants.map(participant => (
                  <Card key={participant.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        {participant.avatar && (
                          <AvatarImage src={participant.avatar} alt={participant.name} />
                        )}
                        <AvatarFallback>
                          {participant.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{participant.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Focus Score: {participant.focusScore}%
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!participant.audioEnabled && (
                              <MicOff className="h-4 w-4 text-muted-foreground" />
                            )}
                            {!participant.videoEnabled && (
                              <VideoOff className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  variant={videoEnabled ? 'default' : 'secondary'}
                  onClick={() => setVideoEnabled(prev => !prev)}
                >
                  {videoEnabled ? (
                    <Video className="h-4 w-4 mr-2" />
                  ) : (
                    <VideoOff className="h-4 w-4 mr-2" />
                  )}
                  Video
                </Button>
                <Button
                  variant={audioEnabled ? 'default' : 'secondary'}
                  onClick={() => setAudioEnabled(prev => !prev)}
                >
                  {audioEnabled ? (
                    <Mic className="h-4 w-4 mr-2" />
                  ) : (
                    <MicOff className="h-4 w-4 mr-2" />
                  )}
                  Audio
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setSoundEnabled(prev => !prev)}
                >
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Focus Timer */}
              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="text-4xl font-bold">
                      {formatTime(focusSession.remaining)}
                    </div>
                    <div className="flex justify-center gap-2">
                      {focusSession.status === 'idle' ? (
                        <>
                          <Button onClick={() => startFocusSession('focus')}>
                            <Timer className="h-4 w-4 mr-2" />
                            Start Focus Session
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => startFocusSession('break')}
                          >
                            <Coffee className="h-4 w-4 mr-2" />
                            Take Break
                          </Button>
                        </>
                      ) : focusSession.status === 'running' ? (
                        <Button onClick={pauseSession}>
                          Pause Session
                        </Button>
                      ) : (
                        <Button onClick={resumeSession}>
                          Resume Session
                        </Button>
                      )}
                    </div>
                    {focusSession.status !== 'idle' && (
                      <Progress
                        value={(focusSession.remaining / focusSession.duration) * 100}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Chat */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Study Chat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ScrollArea className="h-[500px]">
                <div className="space-y-4 pr-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.type === 'system' ? 'justify-center' : ''
                      }`}
                    >
                      {message.type !== 'system' && (
                        <Avatar>
                          <AvatarFallback>
                            {message.userName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex-1">
                        {message.type !== 'system' && (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {message.userName}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {message.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                        )}
                        <p className={`text-sm ${
                          message.type === 'system' 
                            ? 'text-muted-foreground text-center'
                            : ''
                        }`}>
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}