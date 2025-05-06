import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  MessageSquare,
  HandHelping,
  Calendar,
  Video,
  Search,
  Plus,
  Clock,
  Loader2,
  Star,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';

interface PeerGroup {
  id: string;
  name: string;
  description: string;
  members: PeerMember[];
  topics: string[];
  nextMeeting?: Date;
  capacity: number;
}

interface PeerMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'leader' | 'member';
  expertise: string[];
  joinedAt: Date;
}

interface StudySession {
  id: string;
  groupId: string;
  type: 'discussion' | 'review' | 'practice';
  topic: string;
  date: Date;
  duration: number;
  participants: string[];
  status: 'scheduled' | 'in-progress' | 'completed';
}

export function PeerLearning() {
  const [groups, setGroups] = useState<PeerGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<PeerGroup | null>(null);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'joined' | 'available'>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadPeerGroups();
  }, []);

  const loadPeerGroups = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock data
      setGroups([
        {
          id: 'group-1',
          name: 'React Study Circle',
          description: 'Weekly discussions on React best practices and advanced concepts',
          members: [
            {
              id: 'user-1',
              name: 'Sarah Wilson',
              role: 'leader',
              expertise: ['React', 'TypeScript'],
              joinedAt: new Date('2025-04-01')
            },
            {
              id: 'user-2',
              name: 'Mike Johnson',
              role: 'member',
              expertise: ['JavaScript', 'Redux'],
              joinedAt: new Date('2025-04-15')
            }
          ],
          topics: ['Hooks', 'Performance', 'State Management'],
          nextMeeting: new Date('2025-05-10T15:00:00'),
          capacity: 8
        }
      ]);

      setSessions([
        {
          id: 'session-1',
          groupId: 'group-1',
          type: 'discussion',
          topic: 'Custom Hooks Development',
          date: new Date('2025-05-10T15:00:00'),
          duration: 60,
          participants: ['user-1', 'user-2'],
          status: 'scheduled'
        }
      ]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load peer groups',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: 'Success',
        description: 'Successfully joined the group'
      });
      
      // Update local state
      setGroups(prevGroups =>
        prevGroups.map(group =>
          group.id === groupId
            ? {
                ...group,
                members: [
                  ...group.members,
                  {
                    id: 'current-user',
                    name: 'Current User',
                    role: 'member',
                    expertise: ['Learning'],
                    joinedAt: new Date()
                  }
                ]
              }
            : group
        )
      );
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to join group',
        variant: 'destructive'
      });
    }
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = 
      filter === 'all' ||
      (filter === 'joined' && group.members.some(m => m.id === 'current-user')) ||
      (filter === 'available' && !group.members.some(m => m.id === 'current-user') && group.members.length < group.capacity);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Peer Learning Groups
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                onClick={() => setFilter('all')}
              >
                All Groups
              </Button>
              <Button
                variant={filter === 'joined' ? 'default' : 'outline'}
                onClick={() => setFilter('joined')}
              >
                My Groups
              </Button>
              <Button
                variant={filter === 'available' ? 'default' : 'outline'}
                onClick={() => setFilter('available')}
              >
                Available
              </Button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : filteredGroups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No groups found matching your criteria
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredGroups.map(group => (
                  <Card key={group.id}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{group.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {group.description}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {group.members.length}/{group.capacity} Members
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {group.topics.map(topic => (
                            <Badge key={topic} variant="secondary">
                              {topic}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex -space-x-2">
                          {group.members.slice(0, 4).map(member => (
                            <Avatar key={member.id} className="border-2 border-background">
                              <AvatarFallback>
                                {member.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {group.members.length > 4 && (
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm">
                              +{group.members.length - 4}
                            </div>
                          )}
                        </div>

                        {group.nextMeeting && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            Next session: {format(group.nextMeeting, 'PPp')}
                          </div>
                        )}

                        {!group.members.some(m => m.id === 'current-user') && (
                          <Button
                            className="w-full"
                            onClick={() => handleJoinGroup(group.id)}
                            disabled={group.members.length >= group.capacity}
                          >
                            <HandHelping className="h-4 w-4 mr-2" />
                            Join Group
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}