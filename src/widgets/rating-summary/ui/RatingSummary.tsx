'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Star, Plus } from 'lucide-react';
import { Rating, RatingTargetType } from '@/shared/types';
import { useAuthStore } from '@/features/auth/model/authStore';
import { cn } from '@/lib/utils';

interface RatingSummaryProps {
  ratings: Rating[];
  targetType: RatingTargetType;
  targetId: string;
  targetName: string;
  onRate?: (stars: number, comment: string) => void;
  className?: string;
}

function StarDisplay({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sizes = { sm: 'h-4 w-4', lg: 'h-6 w-6' };
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            sizes[size],
            star <= Math.round(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          )}
        />
      ))}
    </div>
  );
}

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              'h-8 w-8 transition-colors',
              star <= (hover || value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            )}
          />
        </button>
      ))}
    </div>
  );
}

export function RatingSummary({ ratings, targetType, targetId, targetName, onRate, className }: RatingSummaryProps) {
  const { user } = useAuthStore();
  const [newStars, setNewStars] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [open, setOpen] = useState(false);
  const [localRatings, setLocalRatings] = useState(ratings);

  const targetRatings = localRatings.filter((r) => r.targetType === targetType && r.targetId === targetId);
  const avgRating = targetRatings.length > 0
    ? targetRatings.reduce((sum, r) => sum + r.stars, 0) / targetRatings.length
    : 0;

  const handleSubmit = () => {
    if (newStars === 0 || !newComment.trim() || !user) return;
    const rating: Rating = {
      id: `r-${Date.now()}`,
      targetType,
      targetId,
      authorId: user.id,
      authorName: user.fullName,
      authorRole: user.role,
      stars: newStars as 1 | 2 | 3 | 4 | 5,
      comment: newComment.trim(),
      createdAt: new Date().toISOString(),
    };
    setLocalRatings([...localRatings, rating]);
    onRate?.(newStars, newComment);
    setNewStars(0);
    setNewComment('');
    setOpen(false);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{targetName}</CardTitle>
          {user && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Baho qo&apos;yish
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Baho qo&apos;yish — {targetName}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex justify-center">
                    <StarInput value={newStars} onChange={setNewStars} />
                  </div>
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Izoh yozing (majburiy)..."
                    className="min-h-[80px]"
                  />
                  <Button
                    onClick={handleSubmit}
                    disabled={newStars === 0 || !newComment.trim()}
                    className="w-full"
                  >
                    Saqlash
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl font-bold">{avgRating.toFixed(1)}</span>
          <div>
            <StarDisplay rating={avgRating} size="lg" />
            <p className="text-xs text-muted-foreground mt-0.5">{targetRatings.length} ta baho</p>
          </div>
        </div>
        {targetRatings.length > 0 && (
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {targetRatings.slice(0, 5).map((r) => (
              <div key={r.id} className="border-b pb-2 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{r.authorName}</span>
                  <StarDisplay rating={r.stars} />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { StarDisplay };
