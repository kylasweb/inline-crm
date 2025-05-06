import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/auth.store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import {
  MessageSquare,
  ThumbsUp,
  Flag,
  MoreVertical,
  Loader2,
  Send
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  likes: number;
  userHasLiked: boolean;
  replies: Comment[];
}

interface ModuleDiscussionProps {
  moduleId: string;
}

export function ModuleDiscussion({ moduleId }: ModuleDiscussionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const { user } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    loadComments();
  }, [moduleId]);

  const loadComments = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock comments data
      setComments([
        {
          id: '1',
          userId: 'user1',
          userName: 'Alice Johnson',
          content: 'Great explanation of the concepts! I especially liked the practical examples.',
          createdAt: new Date('2025-05-06T08:30:00'),
          likes: 5,
          userHasLiked: false,
          replies: [
            {
              id: '2',
              userId: 'user2',
              userName: 'Bob Smith',
              content: 'Agreed! The examples really helped clarify the implementation details.',
              createdAt: new Date('2025-05-06T09:15:00'),
              likes: 2,
              userHasLiked: true,
              replies: []
            }
          ]
        }
      ]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load comments.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const newCommentObj: Comment = {
        id: `comment-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        content: newComment,
        createdAt: new Date(),
        likes: 0,
        userHasLiked: false,
        replies: []
      };

      if (replyingTo) {
        setComments(prev => prev.map(comment => {
          if (comment.id === replyingTo) {
            return {
              ...comment,
              replies: [...comment.replies, newCommentObj]
            };
          }
          return comment;
        }));
      } else {
        setComments(prev => [newCommentObj, ...prev]);
      }

      setNewComment('');
      setReplyingTo(null);
      
      toast({
        title: 'Success',
        description: 'Comment posted successfully.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post comment.',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId: string) => {
    // TODO: Implement like functionality with API
    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          likes: comment.userHasLiked ? comment.likes - 1 : comment.likes + 1,
          userHasLiked: !comment.userHasLiked
        };
      }
      return comment;
    }));
  };

  const handleReport = (commentId: string) => {
    toast({
      title: 'Report Submitted',
      description: 'Thank you for reporting this comment. We will review it shortly.'
    });
  };

  const renderComment = (comment: Comment, isReply: boolean = false) => (
    <div key={comment.id} className={`space-y-2 ${isReply ? 'ml-12 mt-2' : 'mb-6'}`}>
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src={comment.userAvatar} />
          <AvatarFallback>{comment.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">{comment.userName}</span>
              <span className="text-sm text-muted-foreground ml-2">
                {formatDistanceToNow(comment.createdAt)} ago
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleReport(comment.id)}>
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm">{comment.content}</p>
          <div className="flex items-center gap-4 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLike(comment.id)}
              className={comment.userHasLiked ? 'text-primary' : ''}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {comment.likes}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReplyingTo(comment.id)}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Reply
            </Button>
          </div>
        </div>
      </div>
      {comment.replies.map(reply => renderComment(reply, true))}
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discussion</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-4">
            {user && (  // Only show avatar if user is logged in
              <Avatar>
                <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            )}
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || submitting}
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {replyingTo ? 'Reply' : 'Post'}
                </Button>
              </div>
            </div>
          </div>

          <ScrollArea className="h-[500px]">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-6 pr-4">
                {comments.map(comment => renderComment(comment))}
              </div>
            )}
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}