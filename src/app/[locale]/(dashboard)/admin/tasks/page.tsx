'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  ClipboardList, Filter, CheckCircle, Clock, AlertTriangle,
  Circle, ArrowUpCircle, ArrowDownCircle,
} from 'lucide-react';
import { StatsGrid, StatCard } from '@/widgets/stats-cards/ui/StatsGrid';
import { mockTasks } from '@/mock/tasks';
import { mockProjects } from '@/mock/projects';
import { Task, TaskStatus, TaskPriority } from '@/shared/types';
import { getStatusColor, formatDate } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

const statusLabels: Record<TaskStatus, string> = {
  pending: 'Kutilmoqda',
  in_progress: 'Jarayonda',
  completed: 'Bajarildi',
  overdue: "Muddati o'tgan",
};

const priorityLabels: Record<TaskPriority, string> = {
  low: 'Past',
  medium: "O'rta",
  high: 'Yuqori',
  urgent: 'Shoshilinch',
};

const priorityColors: Record<TaskPriority, string> = {
  low: 'bg-gray-100 text-gray-700 border-gray-200',
  medium: 'bg-blue-100 text-blue-700 border-blue-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  urgent: 'bg-red-100 text-red-700 border-red-200',
};

export default function AdminTasksPage() {
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all');
  const [filterProject, setFilterProject] = useState<string>('all');

  const filtered = mockTasks.filter((t) => {
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterPriority !== 'all' && t.priority !== filterPriority) return false;
    if (filterProject !== 'all' && t.projectId !== filterProject) return false;
    return true;
  });

  const completedCount = mockTasks.filter((t) => t.status === 'completed').length;
  const inProgressCount = mockTasks.filter((t) => t.status === 'in_progress').length;
  const overdueCount = mockTasks.filter((t) => t.status === 'overdue').length;
  const pendingCount = mockTasks.filter((t) => t.status === 'pending').length;
  const totalTasks = mockTasks.length;

  const stats: StatCard[] = [
    { title: 'Bajarildi', value: completedCount, icon: 'CheckSquare', color: 'green' },
    { title: 'Jarayonda', value: inProgressCount, icon: 'ClipboardList', color: 'blue' },
    { title: "Muddati o'tgan", value: overdueCount, icon: 'AlertTriangle', color: 'red' },
    { title: 'Kutilmoqda', value: pendingCount, icon: 'CalendarCheck', color: 'yellow' },
  ];

  const getProjectName = (id: string) => mockProjects.find((p) => p.id === id)?.name || id;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vazifalar nazorati</h1>
        <p className="text-muted-foreground">Barcha loyihalar bo&apos;yicha vazifalar</p>
      </div>

      <StatsGrid stats={stats} />

      {/* Progress Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Umumiy bajarilish</span>
            <span className="text-sm font-bold text-blue-600">
              {Math.round((completedCount / totalTasks) * 100)}%
            </span>
          </div>
          <Progress value={(completedCount / totalTasks) * 100} className="h-3" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{completedCount} bajarildi</span>
            <span>{totalTasks} jami</span>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filterlar
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Holat</label>
              <div className="flex gap-1">
                {(['all', 'pending', 'in_progress', 'completed', 'overdue'] as const).map((s) => (
                  <Button
                    key={s}
                    variant={filterStatus === s ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                    onClick={() => setFilterStatus(s)}
                  >
                    {s === 'all' ? 'Barchasi' : statusLabels[s]}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Muhimlik</label>
              <div className="flex gap-1">
                {(['all', 'low', 'medium', 'high', 'urgent'] as const).map((p) => (
                  <Button
                    key={p}
                    variant={filterPriority === p ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                    onClick={() => setFilterPriority(p)}
                  >
                    {p === 'all' ? 'Barchasi' : priorityLabels[p]}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">Loyiha</label>
              <div className="flex gap-1">
                <Button
                  variant={filterProject === 'all' ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs"
                  onClick={() => setFilterProject('all')}
                >
                  Barchasi
                </Button>
                {mockProjects.map((p) => (
                  <Button
                    key={p.id}
                    variant={filterProject === p.id ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs"
                    onClick={() => setFilterProject(p.id)}
                  >
                    {p.name.split(' - ')[0]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Vazifalar ({filtered.length})
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Vazifa</TableHead>
                <TableHead>Loyiha</TableHead>
                <TableHead>Muhimlik</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead>Muddat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((task, index) => (
                <TableRow
                  key={task.id}
                  className={cn(
                    task.status === 'overdue' && 'bg-red-50/70 hover:bg-red-50',
                  )}
                >
                  <TableCell className="text-muted-foreground text-sm">{index + 1}</TableCell>
                  <TableCell>
                    <div>
                      <p className={cn(
                        'font-medium text-sm',
                        task.status === 'overdue' && 'text-red-700',
                        task.status === 'completed' && 'line-through text-muted-foreground',
                      )}>
                        {task.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">{task.description}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{getProjectName(task.projectId)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('text-xs', priorityColors[task.priority])}>
                      {task.priority === 'urgent' && <ArrowUpCircle className="h-3 w-3 mr-1" />}
                      {priorityLabels[task.priority]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('text-xs', getStatusColor(task.status))}>
                      {statusLabels[task.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={cn(
                      'text-sm font-mono',
                      task.status === 'overdue' ? 'text-red-600 font-semibold' : 'text-muted-foreground',
                    )}>
                      {task.dueDate}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Vazifalar topilmadi
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
