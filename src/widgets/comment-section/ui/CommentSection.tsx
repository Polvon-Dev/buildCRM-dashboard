'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Reply, Send, Trash2 } from 'lucide-react';
import { Comment, CommentTargetType, UserRole } from '@/shared/types';
import { mockComments } from '@/mock/comments';
import { useAuthStore } from '@/features/auth/model/authStore';
import { getInitials } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';
import { ROLE_COLORS } from '@/shared/config/roles';

interface CommentSectionProps {
  targetType: CommentTargetType;
  targetId: string;
  className?: string;
}

const roleAvatarColors: Record<UserRole, string> = {
  rahbar: 'bg-purple-600',
  prorab: 'bg-blue-600',
  ombor: 'bg-amber-600',
  admin: 'bg-green-600',
};

export function CommentSection({ targetType, targetId, className }: CommentSectionProps) {
  const { user } = useAuthStore();
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>(
    mockComments.filter((c) => c.targetType === targetType && c.targetId === targetId)
  );

  const rootComments = comments.filter((c) => !c.parentId);
  const getReplies = (parentId: string) => comments.filter((c) => c.parentId === parentId);

  const handleSubmit = () => {
    if (!newComment.trim() || !user) return;
    const comment: Comment = {
      id: `c-${Date.now()}`,
      targetType,
      targetId,
      authorId: user.id,
      authorName: user.fullName,
      authorRole: user.role,
      text: newComment.trim(),
      parentId: replyTo || undefined,
      createdAt: new Date().toISOString(),
    };
    setComments([...comments, comment]);
    setNewComment('');
    setReplyTo(null);
  };

  const handleDelete = (id: string) => {
    setComments(comments.filter((c) => c.id !== id && c.parentId !== id));
  };

  const canDelete = (comment: Comment) => {
    return user?.role === 'rahbar' || user?.role === 'admin' || comment.authorId === user?.id;
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={cn('group', isReply && 'ml-10 mt-2')}>
      <div className="flex gap-3">
        <Avatar className={cn('h-8 w-8', roleAvatarColors[comment.authorRole])}>
          <AvatarFallback className="text-white text-xs">
            {getInitials(comment.authorName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{comment.authorName}</span>
            <Badge variant="outline" className={cn('text-xs px-1.5 py-0', ROLE_COLORS[comment.authorRole])}>
              {comment.authorRole}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(comment.createdAt).toLocaleString('uz-UZ')}
            </span>
          </div>
          <p className="text-sm text-gray-700 mt-1">{comment.text}</p>
          <div className="flex gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-muted-foreground"
                onClick={() => setReplyTo(comment.id)}
              >
                <Reply className="h-3 w-3 mr-1" /> Javob
              </Button>
            )}
            {canDelete(comment) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-red-500 hover:text-red-700"
                onClick={() => handleDelete(comment.id)}
              >
                <Trash2 className="h-3 w-3 mr-1" /> O&apos;chirish
              </Button>
            )}
          </div>
        </div>
      </div>
      {getReplies(comment.id).map((reply) => renderComment(reply, true))}
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Izohlar ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rootComments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Hali izoh yo&apos;q</p>
        ) : (
          <div className="space-y-4">
            {rootComments.map((comment) => renderComment(comment))}
          </div>
        )}

        {user && (
          <div className="border-t pt-4 mt-4">
            {replyTo && (
              <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                <Reply className="h-3 w-3" />
                <span>Javob yozilmoqda...</span>
                <Button variant="ghost" size="sm" className="h-5 text-xs" onClick={() => setReplyTo(null)}>
                  Bekor
                </Button>
              </div>
            )}
            <div className="flex gap-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Izoh yozing..."
                className="min-h-[60px] resize-none text-sm"
              />
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={!newComment.trim()}
                className="self-end"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
