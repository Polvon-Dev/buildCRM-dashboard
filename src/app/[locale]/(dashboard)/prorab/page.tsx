'use client';

import { useState } from 'react';
import { StatsGrid, StatCard } from '@/widgets/stats-cards/ui/StatsGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { mockTasks } from '@/mock/tasks';
import { mockWorkers } from '@/mock/workers';
import { mockMaterialRequests } from '@/mock/requests';
import { mockNotifications } from '@/mock/notifications';
import { mockProjects } from '@/mock/projects';
import { mockReports } from '@/mock/reports';
import { formatDate, formatDateTime, getStatusColor } from '@/shared/lib/utils';
import {
  ClipboardList, Users, Package, AlertTriangle,
  Clock, CheckCircle2, ArrowRight, Bell, Calendar,
  FileText, ChevronRight,
} from 'lucide-react';

const PRORAB_ID = 'u2';
const PROJECT_ID = 'p1';

export default function ProrabDashboardPage() {
  const project = mockProjects.find((p) => p.id === PROJECT_ID)!;
  const myWorkers = mockWorkers.filter((w) => w.prorabId === PRORAB_ID);
  const myTasks = mockTasks.filter((t) => t.projectId === PROJECT_ID && t.createdBy === PRORAB_ID);
  const todayTasks = myTasks.filter((t) => t.status === 'pending' || t.status === 'in_progress');
  const myRequests = mockMaterialRequests.filter((r) => r.requestedBy === PRORAB_ID);
  const pendingRequests = myRequests.filter((r) => r.status === 'pending');
  const myNotifications = mockNotifications.filter((n) => n.recipientId === PRORAB_ID);
  const unreadNotifications = myNotifications.filter((n) => !n.isRead);
  const myReports = mockReports.filter((r) => r.prorabId === PRORAB_ID);

  const completedTasks = myTasks.filter((t) => t.status === 'completed').length;
  const totalTasks = myTasks.length;

  const stats: StatCard[] = [
    {
      title: "O'z ishchilari soni",
      value: myWorkers.length,
      icon: 'Users',
      color: 'blue',
      change: { value: 2, label: "o'tgan oyga nisbatan" },
    },
    {
      title: 'Bugungi vazifalar',
      value: todayTasks.length,
      icon: 'ClipboardList',
      color: 'green',
      change: { value: -1, label: 'kechagiga nisbatan' },
    },
    {
      title: "So'rovlar holati",
      value: `${pendingRequests.length} kutilmoqda`,
      icon: 'Package',
      color: 'yellow',
    },
    {
      title: 'Ish hajmi',
      value: `${project.progress}%`,
      icon: 'TrendingUp',
      color: 'purple',
      change: { value: 5, label: "o'tgan haftaga" },
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-blue-500 text-white';
      case 'low': return 'bg-gray-400 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bosh sahifa</h1>
        <p className="text-muted-foreground">
          Xush kelibsiz, Karimov Botir! Bugun {new Date().toLocaleDateString('uz-UZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Project info banner */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Joriy loyiha</p>
              <h2 className="text-lg font-semibold">{project.name}</h2>
              <p className="text-sm text-muted-foreground">{project.address}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{project.progress}%</p>
                <p className="text-xs text-muted-foreground">Tugallangan</p>
              </div>
              <div className="w-32">
                <Progress value={project.progress} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <StatsGrid stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Tasks */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Bugungi vazifalar
              </CardTitle>
              <Badge variant="secondary">{todayTasks.length} ta</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Bugungi vazifalar yo&apos;q</p>
            ) : (
              todayTasks.map((task) => {
                const worker = mockWorkers.find((w) => w.id === task.assignedTo);
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className={`w-1.5 h-10 rounded-full ${
                      task.priority === 'urgent' ? 'bg-red-500' :
                      task.priority === 'high' ? 'bg-orange-500' :
                      task.priority === 'medium' ? 'bg-blue-500' : 'bg-gray-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {worker?.fullName || 'Noma\'lum'}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          &middot; {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(task.status)} variant="secondary">
                      {task.status === 'in_progress' ? 'Jarayonda' :
                       task.status === 'pending' ? 'Kutilmoqda' :
                       task.status === 'completed' ? 'Tugallangan' : 'Muddati o\'tgan'}
                    </Badge>
                  </div>
                );
              })
            )}
            <Button variant="ghost" className="w-full text-sm" size="sm">
              Barcha vazifalar <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Pending Material Requests */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                Material so&apos;rovlari
              </CardTitle>
              <Badge variant="secondary">{myRequests.length} ta</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {myRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className={`w-1.5 h-10 rounded-full ${
                  req.status === 'pending' ? 'bg-yellow-500' :
                  req.status === 'approved' ? 'bg-green-500' :
                  req.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{req.materialName}</p>
                  <p className="text-xs text-muted-foreground">
                    {req.quantity} {req.unit} &middot; {formatDate(req.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {req.urgency === 'urgent' && (
                    <Badge variant="destructive" className="text-xs">Shoshilinch</Badge>
                  )}
                  <Badge className={getStatusColor(req.status)} variant="secondary">
                    {req.status === 'pending' ? 'Kutilmoqda' :
                     req.status === 'approved' ? 'Tasdiqlangan' :
                     req.status === 'rejected' ? 'Rad etilgan' : 'Yetkazilgan'}
                  </Badge>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-sm" size="sm">
              Barcha so&apos;rovlar <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="h-4 w-4" />
                So&apos;nggi bildirishnomalar
              </CardTitle>
              {unreadNotifications.length > 0 && (
                <Badge variant="destructive">{unreadNotifications.length} yangi</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {myNotifications.slice(0, 5).map((notif) => (
                <div
                  key={notif.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    notif.isRead ? 'bg-card' : 'bg-blue-50/50 border-blue-200'
                  } hover:bg-accent/50`}
                >
                  {getNotificationIcon(notif.type)}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!notif.isRead ? 'font-semibold' : 'font-medium'}`}>{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDateTime(notif.createdAt)}
                  </span>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full text-sm mt-3" size="sm">
              Barcha bildirishnomalar <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
