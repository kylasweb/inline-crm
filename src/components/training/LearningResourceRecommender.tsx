import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import {
  Book,
  Video,
  Globe,
  File,
  Star,
  Filter,
  ExternalLink,
  Bookmark,
  Clock,
  ThumbsUp,
  BarChart,
  Loader2,
  GraduationCap
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'video' | 'article' | 'course' | 'documentation';
  provider: string;
  url: string;
  description: string;
  duration?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  rating: number;
  votes: number;
  skillMatch: number;
  bookmarked: boolean;
}

interface LearningPreference {
  preferredTypes: ('video' | 'article' | 'course' | 'documentation')[];
  maxDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
}

export function LearningResourceRecommender() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [preferences, setPreferences] = useState<LearningPreference>({
    preferredTypes: ['video', 'article'],
    maxDuration: 30,
    difficulty: 'intermediate',
    topics: ['React', 'TypeScript']
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'bookmarked'>('all');
  const { toast } = useToast();

  useEffect(() => {
    loadResources();
  }, [preferences]);

  const loadResources = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock resources data
      const mockResources: Resource[] = [
        {
          id: 'r1',
          title: 'Advanced React Patterns',
          type: 'video',
          provider: 'Frontend Masters',
          url: 'https://example.com/react-patterns',
          description: 'Learn advanced React patterns and best practices',
          duration: 25,
          difficulty: 'intermediate',
          tags: ['React', 'JavaScript', 'Patterns'],
          rating: 4.8,
          votes: 256,
          skillMatch: 95,
          bookmarked: false
        },
        {
          id: 'r2',
          title: 'TypeScript Handbook',
          type: 'documentation',
          provider: 'TypeScript Docs',
          url: 'https://example.com/ts-handbook',
          description: 'Official TypeScript documentation and guides',
          difficulty: 'intermediate',
          tags: ['TypeScript', 'Documentation'],
          rating: 4.9,
          votes: 512,
          skillMatch: 88,
          bookmarked: true
        }
      ];

      setResources(mockResources);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load resources',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = async (resourceId: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300));

      setResources(prev =>
        prev.map(resource =>
          resource.id === resourceId
            ? { ...resource, bookmarked: !resource.bookmarked }
            : resource
        )
      );

      toast({
        title: 'Success',
        description: 'Resource bookmark updated'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update bookmark',
        variant: 'destructive'
      });
    }
  };

  const getResourceIcon = (type: Resource['type']) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'article': return <File className="h-4 w-4" />;
      case 'course': return <GraduationCap className="h-4 w-4" />;
      case 'documentation': return <Book className="h-4 w-4" />;
    }
  };

  const getDifficultyColor = (difficulty: Resource['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-blue-100 text-blue-800';
      case 'advanced': return 'bg-purple-100 text-purple-800';
    }
  };

  const filteredResources = resources.filter(resource => 
    filter === 'all' || (filter === 'bookmarked' && resource.bookmarked)
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Recommended Resources
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant={filter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'bookmarked' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter('bookmarked')}
              >
                Bookmarked
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Learning Preferences */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4">
                  <Select
                    value={preferences.difficulty}
                    onValueChange={(value: LearningPreference['difficulty']) =>
                      setPreferences(prev => ({ ...prev, difficulty: value }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={preferences.maxDuration.toString()}
                    onValueChange={(value) =>
                      setPreferences(prev => ({
                        ...prev,
                        maxDuration: parseInt(value)
                      }))
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Max Duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Resource List */}
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredResources.map(resource => (
                    <Card key={resource.id}>
                      <CardContent className="p-4">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                {getResourceIcon(resource.type)}
                                <span className="text-sm text-muted-foreground">
                                  {resource.provider}
                                </span>
                              </div>
                              <h3 className="font-medium">{resource.title}</h3>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleBookmark(resource.id)}
                            >
                              <Bookmark
                                className={`h-4 w-4 ${
                                  resource.bookmarked ? 'fill-current' : ''
                                }`}
                              />
                            </Button>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {resource.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            <Badge className={getDifficultyColor(resource.difficulty)}>
                              {resource.difficulty}
                            </Badge>
                            {resource.duration && (
                              <Badge variant="outline">
                                <Clock className="h-3 w-3 mr-1" />
                                {resource.duration}m
                              </Badge>
                            )}
                            {resource.tags.map(tag => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                                {resource.rating}
                              </div>
                              <div className="flex items-center">
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                {resource.votes}
                              </div>
                              <div className="flex items-center">
                                <BarChart className="h-4 w-4 mr-1" />
                                {resource.skillMatch}% match
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open Resource
                            </Button>
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