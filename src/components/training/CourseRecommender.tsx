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
  BookOpen,
  Clock,
  Star,
  Users,
  BarChart2,
  Brain,
  Target,
  ArrowRight,
  Loader2,
  Video,
  FileText,
  Code,
  ExternalLink,
  Filter
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  provider: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  format: 'video' | 'interactive' | 'text';
  duration: number;
  rating: number;
  reviews: number;
  enrolled: number;
  price: number;
  currency: string;
  topics: string[];
  skills: string[];
  matchScore: number;
  prerequisites: string[];
  outcomes: string[];
  url: string;
}

interface LearnerProfile {
  interests: string[];
  currentLevel: string;
  preferredFormat: string[];
  timeAvailable: number;
  budget: number;
  goals: string[];
}

export function CourseRecommender() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [profile, setProfile] = useState<LearnerProfile>({
    interests: [],
    currentLevel: 'beginner',
    preferredFormat: ['video', 'interactive'],
    timeAvailable: 5,
    budget: 100,
    goals: []
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    level: 'all',
    format: 'all',
    maxPrice: 'all'
  });
  const { toast } = useToast();

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock course recommendations
      const mockCourses: Course[] = [
        {
          id: 'course-1',
          title: 'Advanced React Patterns & Performance',
          provider: 'Frontend Masters',
          description: 'Deep dive into advanced React patterns and optimization techniques',
          level: 'advanced',
          format: 'video',
          duration: 480, // minutes
          rating: 4.8,
          reviews: 1250,
          enrolled: 15000,
          price: 39.99,
          currency: 'USD',
          topics: ['React', 'Performance', 'Patterns'],
          skills: ['Component Design', 'State Management', 'Optimization'],
          matchScore: 95,
          prerequisites: ['React Basics', 'JavaScript Fundamentals'],
          outcomes: [
            'Master React design patterns',
            'Optimize React applications',
            'Build scalable components'
          ],
          url: 'https://example.com/course'
        }
      ];

      setCourses(mockCourses);
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

  const getFormatIcon = (format: Course['format']) => {
    switch (format) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'interactive': return <Code className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: Course['level']) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(price);
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  const filteredCourses = courses.filter(course => {
    const matchesLevel = filters.level === 'all' || course.level === filters.level;
    const matchesFormat = filters.format === 'all' || course.format === filters.format;
    const matchesPrice = filters.maxPrice === 'all' || course.price <= parseInt(filters.maxPrice);
    return matchesLevel && matchesFormat && matchesPrice;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Course Recommendations
            </CardTitle>
            <div className="flex gap-2">
              <Select
                value={filters.level}
                onValueChange={(value) => setFilters(prev => ({ ...prev, level: value }))}
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
                value={filters.format}
                onValueChange={(value) => setFilters(prev => ({ ...prev, format: value }))}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Formats</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="interactive">Interactive</SelectItem>
                  <SelectItem value="text">Text</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.maxPrice}
                onValueChange={(value) => setFilters(prev => ({ ...prev, maxPrice: value }))}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Max Price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any Price</SelectItem>
                  <SelectItem value="25">Under $25</SelectItem>
                  <SelectItem value="50">Under $50</SelectItem>
                  <SelectItem value="100">Under $100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6">
              {filteredCourses.map(course => (
                <Card key={course.id}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{course.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            by {course.provider}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getLevelColor(course.level)}>
                            {course.level}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getFormatIcon(course.format)}
                            {course.format}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {course.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {course.topics.map(topic => (
                          <Badge key={topic} variant="secondary">
                            {topic}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid gap-4 md:grid-cols-4">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <div className="text-sm">
                            <span className="font-medium">{course.rating}</span>
                            <span className="text-muted-foreground">
                              {' '}({course.reviews.toLocaleString()} reviews)
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            {course.enrolled.toLocaleString()} enrolled
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div className="text-sm">
                            {formatDuration(course.duration)}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-muted-foreground" />
                          <div className={`text-sm font-medium ${getMatchColor(course.matchScore)}`}>
                            {course.matchScore}% match
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <div className="text-sm font-medium mb-2">Prerequisites</div>
                          <div className="text-sm text-muted-foreground">
                            {course.prerequisites.join(', ')}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm font-medium mb-2">You'll Learn</div>
                          <div className="text-sm text-muted-foreground">
                            {course.outcomes.join(', ')}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t pt-4">
                        <div className="text-xl font-bold">
                          {formatPrice(course.price, course.currency)}
                        </div>
                        <Button onClick={() => window.open(course.url, '_blank')}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Course
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}