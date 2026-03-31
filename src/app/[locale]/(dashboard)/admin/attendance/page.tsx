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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose, DialogFooter,
} from '@/components/ui/dialog';
import {
  CalendarCheck, UserCheck, UserX, Clock, FileText,
  Circle, CheckCircle, XCircle, AlertCircle,
} from 'lucide-react';
import { StatsGrid, StatCard } from '@/widgets/stats-cards/ui/StatsGrid';
import { mockAttendance } from '@/mock/attendance';
import { mockProjects } from '@/mock/projects';
import { Attendance, AttendanceStatus } from '@/shared/types';
import { getStatusColor, calculatePercentage } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

const statusLabels: Record<AttendanceStatus, string> = {
  present: 'Kelgan',
  absent: 'Kelmagan',
  late: 'Kechikkan',
  excused: 'Sababli',
};

const statusIcons: Record<AttendanceStatus, React.ElementType> = {
  present: CheckCircle,
  absent: XCircle,
  late: Clock,
  excused: AlertCircle,
};

export default function AdminAttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>(mockAttendance);
  const [markDialogOpen, setMarkDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Attendance | null>(null);
  const [comment, setComment] = useState('');

  const todayRecords = attendance.filter((a) => a.date === '2026-03-31');
  const presentCount = todayRecords.filter((a) => a.status === 'present').length;
  const lateCount = todayRecords.filter((a) => a.status === 'late').length;
  const absentCount = todayRecords.filter((a) => a.status === 'absent').length;
  const excusedCount = todayRecords.filter((a) => a.status === 'excused').length;

  const stats: StatCard[] = [
    { title: 'Kelgan', value: presentCount, icon: 'CheckSquare', color: 'green' },
    { title: 'Kechikkan', value: lateCount, icon: 'CalendarCheck', color: 'orange' },
    { title: 'Kelmagan', value: absentCount, icon: 'AlertTriangle', color: 'red' },
    { title: 'Sababli', value: excusedCount, icon: 'Users', color: 'blue' },
  ];

  const getProjectName = (projectId: string) => {
    return mockProjects.find((p) => p.id === projectId)?.name || projectId;
  };

  const handleStatusChange = (record: Attendance, newStatus: AttendanceStatus) => {
    setAttendance(
      attendance.map((a) =>
        a.id === record.id
          ? { ...a, status: newStatus, comment: comment || a.comment }
          : a
      )
    );
    setComment('');
    setMarkDialogOpen(false);
    setSelectedWorker(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Davomat</h1>
        <p className="text-muted-foreground">Bugungi davomat nazorati — 2026-03-31</p>
      </div>

      <StatsGrid stats={stats} />

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarCheck className="h-4 w-4" />
              Bugungi davomat jadvali
            </CardTitle>
            <Badge variant="outline">{todayRecords.length} ishchi</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Ishchi</TableHead>
                <TableHead>Loyiha</TableHead>
                <TableHead>Holati</TableHead>
                <TableHead>Kelish vaqti</TableHead>
                <TableHead>Izoh</TableHead>
                <TableHead className="text-right">Amallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todayRecords.map((record, index) => {
                const StatusIcon = statusIcons[record.status];
                return (
                  <TableRow key={record.id} className={cn(
                    record.status === 'absent' && 'bg-red-50/50',
                    record.status === 'late' && 'bg-orange-50/50',
                  )}>
                    <TableCell className="text-muted-foreground text-sm">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-medium',
                          record.status === 'present' ? 'bg-green-500' :
                          record.status === 'late' ? 'bg-orange-500' :
                          record.status === 'absent' ? 'bg-red-500' : 'bg-blue-500'
                        )}>
                          {record.workerName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-medium text-sm">{record.workerName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {getProjectName(record.projectId)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn('text-xs gap-1', getStatusColor(record.status))}>
                        <StatusIcon className="h-3 w-3" />
                        {statusLabels[record.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {record.checkInTime ? (
                        <span className={cn(
                          'font-mono',
                          record.status === 'late' ? 'text-orange-600 font-medium' : 'text-gray-600'
                        )}>
                          {record.checkInTime}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {record.comment || '—'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog open={markDialogOpen && selectedWorker?.id === record.id} onOpenChange={(open) => {
                        setMarkDialogOpen(open);
                        if (open) setSelectedWorker(record);
                        else { setSelectedWorker(null); setComment(''); }
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" /> O&apos;zgartirish
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Davomat holati — {record.workerName}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-2">
                              {(['present', 'late', 'absent', 'excused'] as AttendanceStatus[]).map((status) => {
                                const Icon = statusIcons[status];
                                return (
                                  <Button
                                    key={status}
                                    variant={record.status === status ? 'default' : 'outline'}
                                    className={cn('justify-start gap-2', getStatusColor(status))}
                                    onClick={() => handleStatusChange(record, status)}
                                  >
                                    <Icon className="h-4 w-4" />
                                    {statusLabels[status]}
                                  </Button>
                                );
                              })}
                            </div>
                            <div>
                              <label className="text-sm font-medium mb-1.5 block">Izoh</label>
                              <Textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Sabab yoki izoh..."
                                className="resize-none"
                              />
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
