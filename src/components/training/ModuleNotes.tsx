import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
  Pencil,
  Save,
  Trash2,
  Clock,
  Tag,
  Search,
  Loader2,
  StickyNote,
  Highlighter
} from 'lucide-react';

interface Note {
  id: string;
  moduleId: string;
  content: string;
  tags: string[];
  createdAt: Date;
  color?: string;
  position?: {
    start: number;
    end: number;
  };
}

interface ModuleNotesProps {
  moduleId: string;
  moduleContent: string;
}

export function ModuleNotes({ moduleId, moduleContent }: ModuleNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>('#FFD700');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Available tags and colors for notes
  const availableTags = ['Important', 'Question', 'Review', 'Definition', 'Example'];
  const highlightColors = [
    { name: 'Yellow', value: '#FFD700' },
    { name: 'Green', value: '#90EE90' },
    { name: 'Blue', value: '#87CEFA' },
    { name: 'Pink', value: '#FFB6C1' }
  ];

  useEffect(() => {
    loadNotes();
  }, [moduleId]);

  const loadNotes = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock notes data
      setNotes([
        {
          id: 'note-1',
          moduleId,
          content: 'Remember to review this concept later',
          tags: ['Review'],
          createdAt: new Date(),
          color: '#FFD700'
        }
      ]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load notes.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const note: Note = {
        id: `note-${Date.now()}`,
        moduleId,
        content: newNote,
        tags: selectedTags,
        createdAt: new Date(),
        color: selectedColor
      };

      setNotes(prev => [note, ...prev]);
      setNewNote('');
      setSelectedTags([]);
      
      toast({
        title: 'Success',
        description: 'Note added successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add note.',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      setNotes(prev => prev.filter(note => note.id !== noteId));
      toast({
        title: 'Success',
        description: 'Note deleted successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete note.',
        variant: 'destructive'
      });
    }
  };

  const handleHighlightText = () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const start = range.startOffset;
    const end = range.endOffset;
    const text = selection.toString();

    if (!text) return;

    const note: Note = {
      id: `highlight-${Date.now()}`,
      moduleId,
      content: text,
      tags: ['Highlight'],
      createdAt: new Date(),
      color: selectedColor,
      position: { start, end }
    };

    setNotes(prev => [note, ...prev]);
  };

  const filteredNotes = notes.filter(note =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <StickyNote className="h-5 w-5" />
              Notes & Highlights
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleHighlightText}
            >
              <Highlighter className="h-4 w-4 mr-2" />
              Highlight Selection
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Select
                value={selectedColor}
                onValueChange={setSelectedColor}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Color" />
                </SelectTrigger>
                <SelectContent>
                  {highlightColors.map(color => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex flex-wrap gap-2 flex-1">
                {availableTags.map(tag => (
                  <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedTags(prev =>
                        prev.includes(tag)
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Note
                </Button>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 rounded-md border border-input bg-background h-10 px-3"
              />
            </div>

            <ScrollArea className="h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No notes found
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredNotes.map(note => (
                    <Card key={note.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap gap-2">
                              {note.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <p
                              style={note.color ? {
                                backgroundColor: `${note.color}50`
                              } : undefined}
                              className="text-sm p-2 rounded"
                            >
                              {note.content}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {note.createdAt.toLocaleString()}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNote(note.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}