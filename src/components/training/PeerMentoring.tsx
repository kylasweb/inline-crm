import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  ArrowRight
} from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  expertise: string[];
  rating: number;
  reviews: number;
  languages: string[];
  timezone: string;
  availability: {
    days: string[];
    slots: string[];
  };
  experience: number;
  pricing: {
    hourly: number;
    currency: string;
  };
  bio: string;
  achievements: string[];
  menteeCount: number;
  successRate: number;
}

interface MentorFilters {
  expertise: string;
  language: string;
  availability: string;
  priceRange: string;
  rating: number;
}

export function PeerMentoring() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [filters, setFilters] = useState<MentorFilters>({
    expertise: 'all',
    language: 'all',
    availability: 'all',
    priceRange: 'all',
    rating: 0
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMentors();
  }, []);

  const loadMentors = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock mentor data
      const mockMentors: Mentor[] = [
        {
          id: 'mentor-1',
          name: 'Sarah Wilson',
          title: 'Senior Frontend Developer',
          expertise: ['React', 'TypeScript', 'Frontend Architecture'],
          rating: 4.9,
          reviews: 128,
          languages: ['English', 'Spanish'],
          timezone: 'UTC-5',
          availability: {
            days: ['Monday', 'Wednesday', 'Friday'],
            slots: ['09:00-10:00', '14:00-15:00']
          },
          experience: 8,
          pricing: {
            hourly: 75,
            currency: 'USD'
          },
          bio: 'Experienced frontend developer specializing in React and TypeScript. Passionate about teaching and mentoring.',
          achievements: [
            'Google Developer Expert',
            'Top-rated mentor 2024'
          ],
          menteeCount: 45,
          successRate: 92
        }
      ];

      setMentors(mockMentors);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load mentors',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMentoring = async (mentorId: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      toast({
        title: 'Success',
        description: 'Mentoring request sent successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send request',
        variant: 'destructive'
      });
    }
  };

  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = 
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some(skill => 
        skill.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesExpertise = filters.expertise === 'all' || 
      mentor.expertise.includes(filters.expertise);

    const matchesLanguage = filters.language === 'all' ||
      mentor.languages.includes(filters.language);

    const matchesRating = mentor.rating >= filters.rating;

    return matchesSearch && matchesExpertise && matchesLanguage && matchesRating;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Find a Mentor
            </CardTitle>
            <Button>
              Become a Mentor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search mentors by name or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={filters.expertise}
                  onValueChange={(value) =>
                    setFilters(prev => ({ ...prev, expertise: value }))
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Expertise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skills</SelectItem>
                    <SelectItem value="React">React</SelectItem>
                    <SelectItem value="TypeScript">TypeScript</SelectItem>
                    <SelectItem value="Node.js">Node.js</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.language}
                  onValueChange={(value) =>
                    setFilters(prev => ({ ...prev, language: value }))
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.rating.toString()}
                  onValueChange={(value) =>
                    setFilters(prev => ({ ...prev, rating: parseInt(value) }))
                  }
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Min Rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any Rating</SelectItem>
                    <SelectItem value="4">4.0+</SelectItem>
                    <SelectItem value="4.5">4.5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mentors List */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredMentors.map(mentor => (
                    <Card key={mentor.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-6">
                          <Avatar className="h-16 w-16">
                            {mentor.avatar && (
                              <AvatarImage src={mentor.avatar} alt={mentor.name} />
                            )}
                            <AvatarFallback>
                              {mentor.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 space-y-4">
                            <div>
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">{mentor.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {mentor.title}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">
                                    ${mentor.pricing.hourly}/{mentor.pricing.currency}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    per hour
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {mentor.expertise.map(skill => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>

                            <p className="text-sm">{mentor.bio}</p>

                            <div className="grid gap-4 md:grid-cols-4">
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-500" />
                                <div className="text-sm">
                                  <span className="font-medium">{mentor.rating}</span>
                                  <span className="text-muted-foreground">
                                    {' '}({mentor.reviews} reviews)
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <div className="text-sm">
                                  {mentor.experience} years exp.
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <div className="text-sm">
                                  {mentor.timezone}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <div className="text-sm">
                                  {mentor.menteeCount} mentees
                                </div>
                              </div>
                            </div>

                            {mentor.achievements.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {mentor.achievements.map((achievement, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="flex items-center gap-1"
                                  >
                                    <Award className="h-3 w-3" />
                                    {achievement}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Languages className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {mentor.languages.join(', ')}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Target className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm">
                                    {mentor.successRate}% success rate
                                  </span>
                                </div>
                              </div>
                              <Button onClick={() => handleRequestMentoring(mentor.id)}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Request Mentoring
                              </Button>
                            </div>
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