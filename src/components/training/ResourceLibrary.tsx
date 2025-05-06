import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  FileText,
  Video,
  Link,
  Book,
  Bookmark,
  Search,
  Filter,
  Clock,
  Download,
  Share2,
  Star,
  Tag,
  Loader2,
  Plus,
  ExternalLink
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'book';
  url: string;
  tags: string[];
  category: string;
  dateAdded: Date;
  lastAccessed?: Date;
  bookmarked: boolean;
  rating?: number;
  fileSize?: string;
  duration?: string;
  author?: string;
}

interface ResourceFilters {
  type: string;
  category: string;
  tag: string;
  sort: 'date' | 'name' | 'rating';
}

const RESOURCE_CATEGORIES = [
  'Programming',
  'Design',
  'Data Science',
  'Business',
  'Languages'
];

const RESOURCE_TAGS = [
  'React',
  'TypeScript',
  'UI/UX',
  'Backend',
  'Database',
  'API',
  'Testing'
];

export function ResourceLibrary() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filters, setFilters] = useState<ResourceFilters>({
    type: 'all',
    category: 'all',
    tag: 'all',
    sort: 'date'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock resource data
      const mockResources: Resource[] = [
        {
          id: 'res-1',
          title: 'Advanced React Patterns',
          description: 'Learn advanced React patterns and best practices',
          type: 'video',
          url: 'https://example.com/react-patterns',
          tags: ['React', 'Frontend'],
          category: 'Programming',
          dateAdded: new Date('2025-05-01'),
          bookmarked: true,
          rating: 4.5,
          duration: '1h 20m'
        },
        {
          id: 'res-2',
          title: 'TypeScript Handbook',
          description: 'Official TypeScript documentation',
          type: 'document',
          url: 'https://example.com/ts-handbook',
          tags: ['TypeScript', 'Programming'],
          category: 'Programming',
          dateAdded: new Date('2025-05-02'),
          bookmarked: false,
          fileSize: '2.5 MB'
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

  const toggleBookmark = async (resourceId: string) => {
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
      case 'document': return <FileText className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'link': return <Link className="h-4 w-4" />;
      case 'book': return <Book className="h-4 w-4" />;
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesType = filters.type === 'all' || resource.type === filters.type;
    const matchesCategory = filters.category === 'all' || resource.category === filters.category;
    const matchesTag = filters.tag === 'all' || resource.tags.includes(filters.tag);
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesCategory && matchesTag && matchesSearch;
  }).sort((a, b) => {
    switch (filters.sort) {
      case 'date':
        return b.dateAdded.getTime() - a.dateAdded.getTime();
      case 'name':
        return a.title.localeCompare(b.title);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  const handleAddResource = () => {
    // TODO: Implement resource addition
    toast({
      title: 'Coming Soon',
      description: 'Resource addition will be available soon'
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Resource Library
            </CardTitle>
            <Button onClick={handleAddResource}>
              <Plus className="h-4 w-4 mr-2" />
              Add Resource
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
                    <SelectItem value="document">Documents</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="link">Links</SelectItem>
                    <SelectItem value="book">Books</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    setFilters(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {RESOURCE_CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.sort}
                  onValueChange={(value: ResourceFilters['sort']) =>
                    setFilters(prev => ({ ...prev, sort: value }))
                  }
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Latest</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

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
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-muted rounded-lg">
                            {getResourceIcon(resource.type)}
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium">{resource.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {resource.description}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleBookmark(resource.id)}
                              >
                                <Bookmark
                                  className={`h-4 w-4 ${
                                    resource.bookmarked ? 'fill-current' : ''
                                  }`}
                                />
                              </Button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {resource.tags.map(tag => (
                                <Badge key={tag} variant="secondary">
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-4">
                                {resource.rating && (
                                  <div className="flex items-center">
                                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                                    {resource.rating}
                                  </div>
                                )}
                                {resource.duration && (
                                  <div className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {resource.duration}
                                  </div>
                                )}
                                {resource.fileSize && (
                                  <div className="flex items-center">
                                    <Download className="h-4 w-4 mr-1" />
                                    {resource.fileSize}
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(resource.url, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Open Resource
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