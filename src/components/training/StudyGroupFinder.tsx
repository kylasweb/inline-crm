import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
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
  Calendar,
  Search,
  Filter,
  Clock,
  Globe,
  Video,
  MessageSquare,
  Loader2,
  UserPlus,
  Tag,
  ChevronRight
} from 'lucide-react';
import { format, addDays } from 'date-fns';

interface GroupMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'leader' | 'member';
  expertise: string[];
  joinedAt: Date;
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  topics: string[];
  schedule: {
    day: string;
    time: string;
  }[];
  members: GroupMember[];
  maxSize: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  meetingType: 'online' | 'hybrid' | 'in-person';
  language: string;
  timezone: string;
  tags: string[];
}

export function StudyGroupFinder() {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    level: 'all',
    meetingType: 'all',
    availability: 'all'
  });
  const { toast } = useToast();

  const loadGroups = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock study groups data
      setGroups([
        {
          id: 'group-1',
          name: 'React Masters',
          description: 'Weekly discussions on advanced React patterns and best practices',
          topics: ['React', 'TypeScript', 'State Management'],
          schedule: [
            { day: 'Tuesday', time: '19:00' },
            { day: 'Saturday', time: '10:00' }
          ],
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
              expertise: ['React', 'Redux'],
              joinedAt: new Date('2025-04-15')
            }
          ],
          maxSize: 8,
          level: 'advanced',
          meetingType: 'online',
          language: 'English',
          timezone: 'UTC+0',
          tags: ['web development', 'frontend']
        }
      ]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load study groups',
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
        description: 'Request to join group sent successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to join group',
        variant: 'destructive'
      });
    }
  };

  const getLevelColor = (level: StudyGroup['level']) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
    }
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLevel = filters.level === 'all' || group.level === filters.level;
    const matchesMeetingType = filters.meetingType === 'all' || group.meetingType === filters.meetingType;
    const matchesAvailability = 
      filters.availability === 'all' ||
      (filters.availability === 'available' && group.members.length < group.maxSize);

    return matchesSearch && matchesLevel && matchesMeetingType && matchesAvailability;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Study Group Finder
            </div>
            <Button>
              Create New Group
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={filters.level}
                  onValueChange={(value) =>
                    setFilters(prev => ({ ...prev, level: value }))
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.meetingType}
                  onValueChange={(value) =>
                    setFilters(prev => ({ ...prev, meetingType: value }))
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Meeting Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="in-person">In-Person</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.availability}
                  onValueChange={(value) =>
                    setFilters(prev => ({ ...prev, availability: value }))
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Groups List */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredGroups.map(group => (
                    <Card key={group.id}>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium">{group.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {group.description}
                              </p>
                            </div>
                            <Badge className={getLevelColor(group.level)}>
                              {group.level}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {group.topics.map(topic => (
                              <Badge key={topic} variant="secondary">
                                {topic}
                              </Badge>
                            ))}
                          </div>

                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <div className="text-sm">
                                {group.schedule.map(s => 
                                  `${s.day}s at ${s.time}`
                                ).join(', ')}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <div className="text-sm">
                                {group.language} • {group.timezone}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4 text-muted-foreground" />
                              <div className="text-sm">
                                {group.meetingType}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex -space-x-2">
                                {group.members.slice(0, 3).map(member => (
                                  <Avatar key={member.id}>
                                    <AvatarFallback>
                                      {member.name.slice(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                                {group.members.length > 3 && (
                                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm">
                                    +{group.members.length - 3}
                                  </div>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {group.members.length}/{group.maxSize} members
                              </div>
                            </div>

                            {group.members.length < group.maxSize && (
                              <Button
                                variant="outline"
                                onClick={() => handleJoinGroup(group.id)}
                              >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Join Group
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}