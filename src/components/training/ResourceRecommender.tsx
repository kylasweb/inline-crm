import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  BookOpen,
  Video,
  FileText,
  Code,
  Target,
  Star,
  BarChart2,
  Clock,
  Users,
  ExternalLink,
  Filter,
  Search,
  ThumbsUp,
  Brain,
  TrendingUp,
  Loader2
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'course' | 'exercise';
  provider: string;
  url: string;
  description: string;
  topics: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // minutes
  rating: number;
  reviews: number;
  matchScore: number;
  prerequisites: string[];
  learningOutcomes: string[];
  format: string;
  price?: {
    amount: number;
    currency: string;
  };
  popularity: number;
  completionRate: number;
  lastUpdated: Date;
}

interface LearnerProfile {
  preferredFormats: string[];
  currentSkillLevels: Record<string, number>;
  learningGoals: string[];
  timeAvailable: number;
  completedResources: string[];
  interests: string[];
}

export function ResourceRecommender() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [profile, setProfile] = useState<LearnerProfile | null>(null);
  const [filters, setFilters] = useState({
    type: 'all',
    skillLevel: 'all',
    duration: 'all',
    price: 'all'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock learner profile
      const mockProfile: LearnerProfile = {
        preferredFormats: ['video', 'exercise'],
        currentSkillLevels: {
          'React': 70,
          'TypeScript': 60
        },
        learningGoals: ['Master React', 'Learn TypeScript'],
        timeAvailable: 120, // minutes per day
        completedResources: [],
        interests: ['Frontend Development', 'Web Development']
      };

      // Mock recommended resources
      const mockResources: Resource[] = [
        {
          id: 'res-1',
          title: 'Advanced React Patterns',
          type: 'course',
          provider: 'Frontend Masters',
          url: 'https://example.com/course',
          description: 'Deep dive into advanced React patterns and best practices',
          topics: ['React', 'Design Patterns', 'Performance'],
          skillLevel: 'advanced',
          duration: 240,
          rating: 4.8,
          reviews: 1250,
          matchScore: 95,
          prerequisites: ['React Basics', 'JavaScript Fundamentals'],
          learningOutcomes: [
            'Master React design patterns',
            'Optimize performance',
            'Build scalable components'
          ],
          format: 'Video + Exercises',
          price: {
            amount: 39.99,
            currency: 'USD'
          },
          popularity: 9500,
          completionRate: 85,
          lastUpdated: new Date('2025-04-01')
        }
      ];

      setProfile(mockProfile);
      setResources(mockResources);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load recommendations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'article': return <FileText className="h-4 w-4" />;
      case 'course': return <BookOpen className="h-4 w-4" />;
      case 'exercise': return <Code className="h-4 w-4" />;
    }
  };

  const getSkillLevelColor = (level: Resource['skillLevel']) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-blue-500';
    return 'text-yellow-500';
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatPrice = (price?: { amount: number; currency: string }) => {
    if (!price) return 'Free';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currency
    }).format(price.amount);
  };

  const filteredResources = resources.filter(resource => {
    const matchesType = filters.type === 'all' || resource.type === filters.type;
    const matchesLevel = filters.skillLevel === 'all' || resource.skillLevel === filters.skillLevel;
    const matchesDuration = filters.duration === 'all' || 
      (filters.duration === 'short' && resource.duration <= 30) ||
      (filters.duration === 'medium' && resource.duration > 30 && resource.duration <= 120) ||
      (filters.duration === 'long' && resource.duration > 120);
    const matchesPrice = filters.price === 'all' ||
      (filters.price === 'free' && !resource.price) ||
      (filters.price === 'paid' && resource.price);
    const matchesSearch = !searchQuery ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.topics.some(topic => 
        topic.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesType && matchesLevel && matchesDuration && matchesPrice && matchesSearch;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Recommended Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex gap-2">
                  <Select
                    value={filters.type}
                    onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                      <SelectItem value="article">Articles</SelectItem>
                      <SelectItem value="course">Courses</SelectItem>
                      <SelectItem value="exercise">Exercises</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.skillLevel}
                    onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, skillLevel: value }))
                    }
                  >
                    <SelectTrigger className="w-[130px]">
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
                    value={filters.duration}
                    onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, duration: value }))
                    }
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Duration</SelectItem>
                      <SelectItem value="short">&lt; 30 mins</SelectItem>
                      <SelectItem value="medium">30-120 mins</SelectItem>
                      <SelectItem value="long">&gt; 120 mins</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.price}
                    onValueChange={(value) => 
                      setFilters(prev => ({ ...prev, price: value }))
                    }
                  >
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder="Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Resource List */}
              <div className="space-y-4">
                {filteredResources.map(resource => (
                  <Card key={resource.id}>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              {getTypeIcon(resource.type)}
                              <h3 className="font-medium">{resource.title}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              by {resource.provider}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getSkillLevelColor(resource.skillLevel)}>
                              {resource.skillLevel}
                            </Badge>
                            <Badge variant="outline" className={getMatchScoreColor(resource.matchScore)}>
                              {resource.matchScore}% match
                            </Badge>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground">
                          {resource.description}
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {resource.topics.map(topic => (
                            <Badge key={topic} variant="secondary">
                              {topic}
                            </Badge>
                          ))}
                        </div>

                        <div className="grid gap-4 md:grid-cols-4">
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <div className="text-sm">
                              <span className="font-medium">{resource.rating}</span>
                              <span className="text-muted-foreground">
                                {' '}({resource.reviews.toLocaleString()} reviews)
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              {formatDuration(resource.duration)}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              {resource.popularity.toLocaleString()} enrolled
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <BarChart2 className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm">
                              {resource.completionRate}% completion rate
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t pt-4">
                          <div className="text-lg font-bold">
                            {formatPrice(resource.price)}
                          </div>
                          <Button onClick={() => window.open(resource.url, '_blank')}>
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Resource
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