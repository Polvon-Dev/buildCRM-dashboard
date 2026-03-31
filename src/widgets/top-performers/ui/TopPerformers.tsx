'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Trophy, TrendingDown, Medal } from 'lucide-react';
import { Rating } from '@/shared/types';
import { getInitials } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

interface TopPerformersProps {
  ratings: Rating[];
  title: string;
  type: 'best' | 'worst';
  nameMap: Record<string, string>;
  className?: string;
}

export function TopPerformers({ ratings, title, type, nameMap, className }: TopPerformersProps) {
  // Group ratings by targetId and calculate average
  const grouped: Record<string, { total: number; count: number; name: string }> = {};
  ratings.forEach((r) => {
    if (!grouped[r.targetId]) {
      grouped[r.targetId] = { total: 0, count: 0, name: nameMap[r.targetId] || 'Noma\'lum' };
    }
    grouped[r.targetId].total += r.stars;
    grouped[r.targetId].count += 1;
  });

  const sorted = Object.entries(grouped)
    .map(([id, data]) => ({
      id,
      name: data.name,
      avg: data.total / data.count,
      count: data.count,
    }))
    .sort((a, b) => (type === 'best' ? b.avg - a.avg : a.avg - b.avg))
    .slice(0, 5);

  const medalColors = ['text-yellow-500', 'text-gray-400', 'text-amber-600'];

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          {type === 'best' ? (
            <Trophy className="h-4 w-4 text-yellow-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Ma&apos;lumot yo&apos;q</p>
        ) : (
          <div className="space-y-3">
            {sorted.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-6 text-center">
                  {index < 3 ? (
                    <Medal className={cn('h-5 w-5', medalColors[index])} />
                  ) : (
                    <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
                  )}
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={cn(
                    'text-xs text-white',
                    type === 'best' ? 'bg-emerald-600' : 'bg-red-600'
                  )}>
                    {getInitials(item.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.count} ta baho</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className={cn(
                    'h-4 w-4',
                    item.avg >= 4 ? 'fill-yellow-400 text-yellow-400' :
                    item.avg >= 3 ? 'fill-orange-400 text-orange-400' :
                    'fill-red-400 text-red-400'
                  )} />
                  <Badge variant={type === 'best' ? 'default' : 'destructive'} className="text-xs">
                    {item.avg.toFixed(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
