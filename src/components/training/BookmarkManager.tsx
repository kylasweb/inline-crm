import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  Bookmark,
  Search,
  Folder,
  Star,
  Clock,
  MoreVertical,
  Plus,
  Loader2,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface BookmarkItem {
  id: string;
  moduleId: string;
  moduleName: string;
  programName: string;
  courseName: string;
  notes?: string;
  favorite: boolean;
  createdAt: Date;
  lastVisited?: Date;
  folderId?: string;
}

interface BookmarkFolder {
  id: string;
  name: string;
  color: string;
  bookmarkCount: number;
}

export function BookmarkManager() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [folders, setFolders] = useState<BookmarkFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setFolders([
        { id: 'f1', name: 'Important', color: '#ef4444', bookmarkCount: 2 },
        { id: 'f2', name: 'Review Later', color: '#3b82f6', bookmarkCount: 1 },
        { id: 'f3', name: 'References', color: '#22c55e', bookmarkCount: 3 }
      ]);
      
      setBookmarks([
        {
          id: 'b1',
          moduleId: 'mod-1',
          moduleName: 'Introduction to React Hooks',
          programName: 'React Development',
          courseName: 'Advanced React',
          notes: 'Great examples of useState and useEffect',
          favorite: true,
          createdAt: new Date('2025-05-01'),
          lastVisited: new Date('2025-05-05'),
          folderId: 'f1'
        },
        {
          id: 'b2',
          moduleId: 'mod-2',
          moduleName: 'State Management Patterns',
          programName: 'React Development',
          courseName: 'Advanced React',
          favorite: false,
          createdAt: new Date('2025-05-03'),
          folderId: 'f2'
        }
      ]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load bookmarks.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = 
      bookmark.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.courseName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFolder = !selectedFolder || bookmark.folderId === selectedFolder;
    
    return matchesSearch && matchesFolder;
  });

  const handleToggleFavorite = async (bookmarkId: string) => {
    setBookmarks(prev =>
      prev.map(b =>
        b.id === bookmarkId ? { ...b, favorite: !b.favorite } : b
      )
    );
  };

  const handleDeleteBookmark = async (bookmarkId: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
      toast({
        title: 'Success',
        description: 'Bookmark deleted successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete bookmark.',
        variant: 'destructive'
      });
    }
  };

  const navigateToModule = (moduleId: string) => {
    // TODO: Implement proper navigation
    navigate(`/training/modules/${moduleId}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Bookmarks</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Folder
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Folders Sidebar */}
        <Card className="w-64">
          <CardContent className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start mb-2"
              onClick={() => setSelectedFolder(null)}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              All Bookmarks
            </Button>
            
            <div className="space-y-1">
              {folders.map(folder => (
                <Button
                  key={folder.id}
                  variant={selectedFolder === folder.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <Folder
                    className="h-4 w-4 mr-2"
                    style={{ color: folder.color }}
                  />
                  {folder.name}
                  <span className="ml-auto text-muted-foreground">
                    {folder.bookmarkCount}
                  </span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bookmarks List */}
        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bookmarks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredBookmarks.length === 0 ? (
                <div className="text-center py-8">
                  <Bookmark className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="mt-4 font-semibold">No bookmarks found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? 'Try adjusting your search' : 'Start bookmarking modules to see them here'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredBookmarks.map(bookmark => (
                    <Card key={bookmark.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <h3 className="font-medium hover:text-primary cursor-pointer"
                              onClick={() => navigateToModule(bookmark.moduleId)}>
                            {bookmark.moduleName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {bookmark.courseName} • {bookmark.programName}
                          </p>
                          {bookmark.notes && (
                            <p className="text-sm mt-2">{bookmark.notes}</p>
                          )}
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {formatDistanceToNow(bookmark.createdAt)} ago
                            </span>
                            {bookmark.lastVisited && (
                              <span>Last visited {formatDistanceToNow(bookmark.lastVisited)} ago</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFavorite(bookmark.id)}
                          >
                            <Star
                              className={`h-4 w-4 ${bookmark.favorite ? 'fill-yellow-400 text-yellow-400' : ''}`}
                            />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleDeleteBookmark(bookmark.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
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