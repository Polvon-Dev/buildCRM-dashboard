'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Building2, MapPin, Calendar, Users, DollarSign,
  TrendingUp, ChevronDown, ChevronUp,
} from 'lucide-react';
import { CommentSection } from '@/widgets/comment-section/ui/CommentSection';
import { mockProjects } from '@/mock/projects';
import { mockUsers } from '@/mock/users';
import { formatCurrency, formatDate, getStatusColor, calculatePercentage } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

const statusLabels: Record<string, string> = {
  planning: 'Rejalashtirish',
  active: 'Faol',
  paused: "To'xtatilgan",
  completed: 'Tugallangan',
};

export default function RahbarProjectsPage() {
  const [expandedProject, setExpandedProject] = useState<string | null>(mockProjects[0]?.id || null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Loyihalar</h1>
        <p className="text-muted-foreground">Barcha loyihalar batafsil ma&apos;lumoti</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
          <CardContent className="p-4">
            <p className="text-sm text-white/80">Jami loyihalar</p>
            <p className="text-2xl font-bold">{mockProjects.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
          <CardContent className="p-4">
            <p className="text-sm text-white/80">Faol</p>
            <p className="text-2xl font-bold">{mockProjects.filter(p => p.status === 'active').length}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
          <CardContent className="p-4">
            <p className="text-sm text-white/80">Umumiy byudjet</p>
            <p className="text-xl font-bold">{formatCurrency(mockProjects.reduce((s, p) => s + p.budget, 0))}</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white border-0">
          <CardContent className="p-4">
            <p className="text-sm text-white/80">Sarflangan</p>
            <p className="text-xl font-bold">{formatCurrency(mockProjects.reduce((s, p) => s + p.spent, 0))}</p>
          </CardContent>
        </Card>
      </div>

      {/* Project Cards */}
      <div className="space-y-4">
        {mockProjects.map((project) => {
          const prorab = mockUsers.find((u) => u.id === project.prorabId);
          const budgetPercent = calculatePercentage(project.spent, project.budget);
          const isExpanded = expandedProject === project.id;

          return (
            <Card key={project.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpandedProject(isExpanded ? null : project.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      'h-12 w-12 rounded-xl flex items-center justify-center',
                      project.status === 'active' ? 'bg-green-100' :
                      project.status === 'paused' ? 'bg-orange-100' :
                      project.status === 'planning' ? 'bg-purple-100' : 'bg-blue-100'
                    )}>
                      <Building2 className={cn(
                        'h-6 w-6',
                        project.status === 'active' ? 'text-green-600' :
                        project.status === 'paused' ? 'text-orange-600' :
                        project.status === 'planning' ? 'text-purple-600' : 'text-blue-600'
                      )} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-0.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{project.address}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={cn('text-xs', getStatusColor(project.status))}>
                      {statusLabels[project.status]}
                    </Badge>
                    {isExpanded ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Umumiy jarayon</span>
                    <span className="text-sm font-bold text-blue-600">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-3" />
                </div>

                {/* Budget */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Byudjet sarfi</span>
                    <span className={cn('text-sm font-bold', budgetPercent > 80 ? 'text-red-600' : 'text-green-600')}>
                      {budgetPercent}%
                    </span>
                  </div>
                  <Progress value={budgetPercent} className={cn('h-3', budgetPercent > 80 && '[&>div]:bg-red-500')} />
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>Sarflangan: {formatCurrency(project.spent)}</span>
                    <span>Byudjet: {formatCurrency(project.budget)}</span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <Users className="h-3.5 w-3.5" />
                      <span className="text-xs">Prorab</span>
                    </div>
                    <p className="text-sm font-medium">{prorab?.fullName || '—'}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <Users className="h-3.5 w-3.5" />
                      <span className="text-xs">Ishchilar</span>
                    </div>
                    <p className="text-sm font-medium">{project.workersCount} kishi</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="text-xs">Boshlanish</span>
                    </div>
                    <p className="text-sm font-medium">{project.startDate}</p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span className="text-xs">Tugash</span>
                    </div>
                    <p className="text-sm font-medium">{project.endDate || '—'}</p>
                  </div>
                </div>

                {project.description && (
                  <p className="text-sm text-gray-600 border-t pt-3">{project.description}</p>
                )}

                {/* Comment Section */}
                {isExpanded && (
                  <CommentSection targetType="project" targetId={project.id} />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
