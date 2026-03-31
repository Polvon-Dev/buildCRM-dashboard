'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  CalendarCheck, CheckSquare, AlertTriangle, Users,
  Clock, ArrowRight, Activity, Circle,
} from 'lucide-react';
import { StatsGrid, StatCard } from '@/widgets/stats-cards/ui/StatsGrid';
import { mockAttendance } from '@/mock/attendance';
import { mockTasks } from '@/mock/tasks';
import { mockActivityLogs } from '@/mock/activity';
import { mockUsers } from '@/mock/users';
import { mockNotifications } from '@/mock/notifications';
import { getStatusColor, formatDateTime, getInitials, calculatePercentage } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

const actionColors: Record<string, string> = {
  report_created: 'bg-blue-500',
  request_approved: 'bg-green-500',
  comment_added: 'bg-purple-500',
  attendance_marked: 'bg-emerald-500',
  material_requested: 'bg-amber-500',
  inventory_check: 'bg-orange-500',
  user_blocked: 'bg-red-500',
  auction_approved: 'bg-teal-500',
  rating_added: 'bg-yellow-500',
  material_incoming: 'bg-cyan-500',
};

const actionLabels: Record<string, string> = {
  report_created: 'Hisobot',
  request_approved: 'Tasdiqlash',
  comment_added: 'Izoh',
  attendance_marked: 'Davomat',
  material_requested: "So'rov",
  inventory_check: 'Inventar',
  user_blocked: 'Bloklash',
  auction_approved: 'Auktsion',
  rating_added: 'Baho',
  material_incoming: 'Qabul',
};

export default function AdminDashboardPage() {
  const todayAttendance = mockAttendance.filter((a) => a.date === '2026-03-31');
  const presentCount = todayAttendance.filter((a) => a.status === 'present').length;
  const lateCount = todayAttendance.filter((a) => a.status === 'late').length;
  const absentCount = todayAttendance.filter((a) => a.status === 'absent').length;
  const excusedCount = todayAttendance.filter((a) => a.status === 'excused').length;
  const totalWorkers = todayAttendance.length;
  const attendancePercent = calculatePercentage(presentCount + lateCount, totalWorkers);

  const completedTasks = mockTasks.filter((t) => t.status === 'completed').length;
  const totalTasks = mockTasks.length;
  const taskPercent = calculatePercentage(completedTasks, totalTasks);

  const overdueTasks = mockTasks.filter((t) => t.status === 'overdue');
  const criticalIssues = mockNotifications.filter((n) => n.type === 'critical').length;
  const activeUsers = mockUsers.filter((u) => u.status === 'active').length;

  const stats: StatCard[] = [
    {
      title: 'Bugungi davomat',
      value: `${attendancePercent}%`,
      icon: 'CalendarCheck',
      color: 'green',
      change: { value: 3, label: 'kechagi kundan' },
    },
    {
      title: 'Bajarilgan vazifalar',
      value: `${taskPercent}%`,
      icon: 'CheckSquare',
      color: 'blue',
      change: { value: 12, label: 'bu hafta' },
    },
    {
      title: 'Muammolar soni',
      value: criticalIssues,
      icon: 'AlertTriangle',
      color: 'red',
      change: { value: -2, label: "o'tgan haftadan" },
    },
    {
      title: 'Faol foydalanuvchilar',
      value: activeUsers,
      icon: 'Users',
      color: 'purple',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Tizim umumiy ko&apos;rinishi va monitoring</p>
      </div>

      <StatsGrid stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Attendance Summary */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-emerald-600" />
                Bugungi davomat xulosasi
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {totalWorkers} ishchi
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-3 rounded-lg border p-3 bg-green-50">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Circle className="h-4 w-4 fill-green-500 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-700">{presentCount}</p>
                  <p className="text-xs text-green-600">Kelgan</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3 bg-orange-50">
                <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-700">{lateCount}</p>
                  <p className="text-xs text-orange-600">Kechikkan</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3 bg-red-50">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Circle className="h-4 w-4 fill-red-500 text-red-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-700">{absentCount}</p>
                  <p className="text-xs text-red-600">Kelmagan</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3 bg-blue-50">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Circle className="h-4 w-4 fill-blue-500 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-700">{excusedCount}</p>
                  <p className="text-xs text-blue-600">Sababli</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Overdue Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Muddati o&apos;tgan vazifalar
              </CardTitle>
              <Badge variant="destructive" className="text-xs">
                {overdueTasks.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {overdueTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Muddati o&apos;tgan vazifalar yo&apos;q
              </p>
            ) : (
              <div className="space-y-3">
                {overdueTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3"
                  >
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-red-900">{task.title}</p>
                      <p className="text-xs text-red-700 mt-0.5">{task.description}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="outline" className="text-xs bg-red-100 text-red-800 border-red-300">
                          Muddat: {task.dueDate}
                        </Badge>
                        <Badge variant="outline" className={cn('text-xs', getStatusColor(task.priority))}>
                          {task.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Feed */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              So&apos;nggi faoliyat
            </CardTitle>
            <Button variant="outline" size="sm" className="text-xs">
              Barchasini ko&apos;rish <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-0">
            {mockActivityLogs.slice(0, 8).map((log, index) => (
              <div key={log.id} className="flex gap-4 pb-6 last:pb-0 relative">
                {index < mockActivityLogs.slice(0, 8).length - 1 && (
                  <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gray-200" />
                )}
                <div className="relative z-10 shrink-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={cn('text-white text-xs', actionColors[log.action] || 'bg-gray-500')}>
                      {getInitials(log.userName)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium">{log.userName}</span>
                    <Badge variant="outline" className="text-xs px-1.5 py-0">
                      {actionLabels[log.action] || log.action}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDateTime(log.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{log.details}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
