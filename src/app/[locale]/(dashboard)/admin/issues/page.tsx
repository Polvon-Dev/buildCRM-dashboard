'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import {
  AlertOctagon, Plus, ArrowRight, ShieldAlert, AlertTriangle,
  Info, Flame, CheckCircle, Clock, Eye,
} from 'lucide-react';
import { StatsGrid, StatCard } from '@/widgets/stats-cards/ui/StatsGrid';
import { Issue, IssuePriority, IssueStatus } from '@/shared/types';
import { useAuthStore } from '@/features/auth/model/authStore';
import { getStatusColor, formatDate, generateId } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

const mockIssuesData: Issue[] = [
  {
    id: 'iss1', title: 'Beton sifati past', description: '3-qavatda quyilgan beton normativ talablarga javob bermayapti. Sinov natijalari past.',
    projectId: 'p1', reportedBy: 'u2', reportedByName: 'Karimov Botir',
    priority: 'critical', status: 'open', createdAt: '2026-03-30T10:00:00Z',
  },
  {
    id: 'iss2', title: 'Kran nosozligi', description: 'Asosiy kran ishlamayapti, ta\'mirlash kerak. Ishlar to\'xtab qoldi.',
    projectId: 'p2', reportedBy: 'u3', reportedByName: 'Yusupov Anvar',
    priority: 'high', status: 'in_progress', assignedTo: 'w7', createdAt: '2026-03-29T14:00:00Z',
  },
  {
    id: 'iss3', title: 'Material yetkazib berish kechikishi', description: 'Sement buyurtmasi 3 kun kechikdi. Qurilish jadvali buzilmoqda.',
    projectId: 'p1', reportedBy: 'u4', reportedByName: 'Toshmatov Javlon',
    priority: 'medium', status: 'resolved', resolvedAt: '2026-03-30T16:00:00Z', createdAt: '2026-03-27T09:00:00Z',
  },
  {
    id: 'iss4', title: 'Xavfsizlik kaski yetishmaydi', description: '15 ta ishchi uchun xavfsizlik kaski kerak.',
    projectId: 'p2', reportedBy: 'u5', reportedByName: 'Rahimov Sardor',
    priority: 'low', status: 'closed', resolvedAt: '2026-03-28T11:00:00Z', createdAt: '2026-03-25T08:00:00Z',
  },
  {
    id: 'iss5', title: 'Elektr tarmog\'ida uzilish', description: 'Qurilish maydonchasida elektr tarmog\'i uzildi. Generator kerak.',
    projectId: 'p1', reportedBy: 'u2', reportedByName: 'Karimov Botir',
    priority: 'high', status: 'open', createdAt: '2026-03-31T07:00:00Z',
  },
];

const priorityLabels: Record<IssuePriority, string> = {
  low: 'Past', medium: "O'rta", high: 'Yuqori', critical: 'Juda muhim',
};

const priorityIcons: Record<IssuePriority, React.ElementType> = {
  low: Info, medium: AlertTriangle, high: ShieldAlert, critical: Flame,
};

const priorityBadgeColors: Record<IssuePriority, string> = {
  low: 'bg-gray-100 text-gray-700 border-gray-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  high: 'bg-orange-100 text-orange-800 border-orange-300',
  critical: 'bg-red-100 text-red-800 border-red-300',
};

const statusLabels: Record<IssueStatus, string> = {
  open: 'Ochiq', in_progress: 'Jarayonda', resolved: 'Hal qilindi', closed: 'Yopildi',
};

const nextStatus: Record<IssueStatus, IssueStatus | null> = {
  open: 'in_progress', in_progress: 'resolved', resolved: 'closed', closed: null,
};

export default function AdminIssuesPage() {
  const { user } = useAuthStore();
  const [issues, setIssues] = useState<Issue[]>(mockIssuesData);
  const [createOpen, setCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<IssuePriority>('medium');

  const openCount = issues.filter((i) => i.status === 'open').length;
  const inProgressCount = issues.filter((i) => i.status === 'in_progress').length;
  const resolvedCount = issues.filter((i) => i.status === 'resolved').length;
  const criticalCount = issues.filter((i) => i.priority === 'critical' && i.status !== 'closed').length;

  const stats: StatCard[] = [
    { title: 'Ochiq muammolar', value: openCount, icon: 'AlertTriangle', color: 'red' },
    { title: 'Jarayonda', value: inProgressCount, icon: 'ClipboardList', color: 'blue' },
    { title: 'Hal qilingan', value: resolvedCount, icon: 'CheckSquare', color: 'green' },
    { title: 'Kritik', value: criticalCount, icon: 'AlertTriangle', color: 'orange' },
  ];

  const handleCreate = () => {
    if (!newTitle.trim() || !newDesc.trim()) return;
    const issue: Issue = {
      id: generateId(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      reportedBy: user?.id || 'u5',
      reportedByName: user?.fullName || 'Admin',
      priority: newPriority,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    setIssues([issue, ...issues]);
    setNewTitle('');
    setNewDesc('');
    setNewPriority('medium');
    setCreateOpen(false);
  };

  const handleStatusUpdate = (issueId: string) => {
    setIssues(
      issues.map((i) => {
        if (i.id !== issueId) return i;
        const next = nextStatus[i.status];
        if (!next) return i;
        return {
          ...i,
          status: next,
          resolvedAt: next === 'resolved' ? new Date().toISOString() : i.resolvedAt,
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Muammolar</h1>
          <p className="text-muted-foreground">Qurilish jarayonidagi muammolar va ularning holati</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Yangi muammo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yangi muammo qo&apos;shish</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Sarlavha</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Muammo sarlavhasi..."
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Tavsif</label>
                <Textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Muammoni batafsil tavsiflang..."
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Muhimlik darajasi</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high', 'critical'] as IssuePriority[]).map((p) => {
                    const Icon = priorityIcons[p];
                    return (
                      <Button
                        key={p}
                        variant={newPriority === p ? 'default' : 'outline'}
                        size="sm"
                        className="flex-1"
                        onClick={() => setNewPriority(p)}
                      >
                        <Icon className="h-3.5 w-3.5 mr-1" />
                        {priorityLabels[p]}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Bekor</Button>
              </DialogClose>
              <Button onClick={handleCreate} disabled={!newTitle.trim() || !newDesc.trim()}>
                Yaratish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <StatsGrid stats={stats} />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertOctagon className="h-4 w-4" />
            Barcha muammolar ({issues.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Muammo</TableHead>
                <TableHead>Xabar beruvchi</TableHead>
                <TableHead>Muhimlik</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead>Sana</TableHead>
                <TableHead className="text-right">Amal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue, index) => {
                const PriorityIcon = priorityIcons[issue.priority];
                const next = nextStatus[issue.status];
                return (
                  <TableRow key={issue.id} className={cn(
                    issue.priority === 'critical' && issue.status === 'open' && 'bg-red-50/50',
                  )}>
                    <TableCell className="text-muted-foreground text-sm">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{issue.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-[300px] truncate">
                          {issue.description}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{issue.reportedByName}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-xs gap-1', priorityBadgeColors[issue.priority])}>
                        <PriorityIcon className="h-3 w-3" />
                        {priorityLabels[issue.priority]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-xs', getStatusColor(issue.status))}>
                        {statusLabels[issue.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(issue.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {next ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => handleStatusUpdate(issue.id)}
                        >
                          <ArrowRight className="h-3 w-3 mr-1" />
                          {statusLabels[next]}
                        </Button>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-gray-50">
                          <CheckCircle className="h-3 w-3 mr-1" /> Yopilgan
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
