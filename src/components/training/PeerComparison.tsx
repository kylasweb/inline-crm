import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
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
  Users,
  Search,
  Filter,
  MessageSquare,
  Calendar,
  Star,
  Clock,
  Award,
  GraduationCap,
  Target,
  Languages,
  Globe,
  Loader2,
  UserPlus,
  ArrowRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { format } from 'date-fns';

interface PeerData {
  id: string;
  name: string;
  avatar?: string;
  level: string;
  progress: number;
  averageScore: number;
  skills: {
    name: string;
    level: number;
  }[];
  achievements: string[];
  studyHours: number;
}

export function PeerComparison() {
  const [peers, setPeers] = useState<PeerData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<'progress' | 'score' | 'hours'>('progress');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadPeerData();
  }, []);

  const loadPeerData = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock peer data
      const mockPeers: PeerData[] = [
        {
          id: 'peer-1',
          name: 'Alice Johnson',
          level: 'Advanced',
          progress: 85,
          averageScore: 92,
          skills: [
            { name: 'React', level: 90 },
            { name: 'TypeScript', level: 85 }
          ],
          achievements: ['7-Day Streak', 'Perfect Score'],
          studyHours: 150
        },
        {
          id: 'peer-2',
          name: 'Bob Smith',
          level: 'Intermediate',
          progress: 60,
          averageScore: 78,
          skills: [
            { name: 'React', level: 70 },
            { name: 'JavaScript', level: 65 }
          ],
          achievements: ['Completed Fundamentals'],
          studyHours: 90
        }
      ];

      setPeers(mockPeers);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load peer data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    if (level === 'Beginner') return 'bg-green-100 text-green-800';
    if (level === 'Intermediate') return 'bg-blue-100 text-blue-800';
    if (level === 'Advanced') return 'bg-purple-100 text-purple-800';
    return '';
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  const getMetricValue = (peer: PeerData, metric: string) => {
    switch (metric) {
      case 'progress': return peer.progress;
      case 'score': return peer.averageScore;
      case 'hours': return peer.studyHours;
      default: return 0;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Peer Comparison
            </CardTitle>
            <Select
              value={selectedMetric}
              onValueChange={(value: 'progress' | 'score' | 'hours') => setSelectedMetric(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Compare by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="score">Average Score</SelectItem>
                <SelectItem value="hours">Study Hours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <ScrollArea className="h-[600px]">
              <div className="space-y-4">
                {peers.sort((a, b) => getMetricValue(b, selectedMetric) - getMetricValue(a, selectedMetric)).map(peer => (
                  <Card key={peer.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar>
                          <AvatarFallback>
                            {peer.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{peer.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {peer.level} Learner
                              </p>
                            </div>
                            <div className="text-2xl font-bold">
                              {getMetricValue(peer, selectedMetric)}
                              {selectedMetric === 'score' && '%'}
                              {selectedMetric === 'hours' && 'h'}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Overall Progress</span>
                              <span>{peer.progress}%</span>
                            </div>
                            <Progress value={peer.progress} />
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {peer.skills.map(skill => (
                              <Badge key={skill.name} variant="secondary">
                                {skill.name} (Lv. {skill.level})
                              </Badge>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {peer.achievements.map(achievement => (
                              <Badge key={achievement} variant="outline">
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}