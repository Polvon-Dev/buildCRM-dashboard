'use client';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Building2, Users, DollarSign, AlertTriangle, Package, ClipboardList,
  CalendarCheck, CheckSquare, TrendingUp, TrendingDown,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Building2, Users, DollarSign, AlertTriangle, Package, ClipboardList,
  CalendarCheck, CheckSquare, TrendingUp, TrendingDown,
};

export interface StatCard {
  title: string;
  value: string | number;
  icon: string;
  change?: { value: number; label: string };
  color: 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange';
}

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-emerald-500 to-emerald-600',
  red: 'from-red-500 to-red-600',
  yellow: 'from-amber-500 to-amber-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
};

const iconBgClasses = {
  blue: 'bg-blue-400/20',
  green: 'bg-emerald-400/20',
  red: 'bg-red-400/20',
  yellow: 'bg-amber-400/20',
  purple: 'bg-purple-400/20',
  orange: 'bg-orange-400/20',
};

export function StatsGrid({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = iconMap[stat.icon] || Building2;
        return (
          <Card
            key={index}
            className={cn(
              'relative overflow-hidden border-0 bg-gradient-to-br text-white shadow-lg',
              'hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5',
              colorClasses[stat.color]
            )}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white/80">{stat.title}</p>
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                </div>
                <div className={cn('p-2.5 rounded-xl', iconBgClasses[stat.color])}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              {stat.change && (
                <div className="mt-3 flex items-center gap-1 text-sm">
                  {stat.change.value >= 0 ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  <span className="font-medium">
                    {stat.change.value > 0 ? '+' : ''}{stat.change.value}%
                  </span>
                  <span className="text-white/70">{stat.change.label}</span>
                </div>
              )}
            </CardContent>
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-white/5" />
            <div className="absolute -top-4 -right-8 h-20 w-20 rounded-full bg-white/5" />
          </Card>
        );
      })}
    </div>
  );
}
