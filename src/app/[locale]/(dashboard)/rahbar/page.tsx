'use client';

import { StatsGrid, StatCard } from '@/widgets/stats-cards/ui/StatsGrid';
import { AlertPanel } from '@/widgets/alert-panel/ui/AlertPanel';
import { ProjectTable } from '@/widgets/project-table/ui/ProjectTable';
import { TopPerformers } from '@/widgets/top-performers/ui/TopPerformers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity, FileText, Camera, ChevronRight, Clock,
  TrendingUp, Star, AlertTriangle
} from 'lucide-react';
import { mockProjects } from '@/mock/projects';
import { mockWorkers } from '@/mock/workers';
import { mockNotifications } from '@/mock/notifications';
import { mockNormViolations } from '@/mock/materials';
import { mockReports } from '@/mock/reports';
import { mockRatings } from '@/mock/ratings';
import { mockActivityLogs } from '@/mock/activity';
import { formatCurrency, formatDateTime, getStatusColor } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

export default function RahbarDashboard() {
  const activeProjects = mockProjects.filter((p) => p.status === 'active');
  const totalWorkers = mockWorkers.filter((w) => w.isActive).length;
  const totalSpent = mockProjects.reduce((sum, p) => sum + p.spent, 0);
  const criticalAlerts = mockNotifications.filter((n) => n.type === 'critical' && n.recipientRole === 'rahbar');
  const unreadNotifs = mockNotifications.filter((n) => !n.isRead && n.recipientRole === 'rahbar');

  const stats: StatCard[] = [
    { title: 'Faol loyihalar', value: activeProjects.length, icon: 'Building2', color: 'blue', change: { value: 12, label: 'o\'tgan oyga nisbatan' } },
    { title: 'Jami ishchilar', value: totalWorkers, icon: 'Users', color: 'green', change: { value: 5, label: 'yangi ishchi' } },
    { title: 'Oylik xarajat', value: formatCurrency(totalSpent), icon: 'DollarSign', color: 'purple' },
    { title: 'Muhim alertlar', value: criticalAlerts.length, icon: 'AlertTriangle', color: 'red', change: { value: -2, label: 'kechagiga nisbatan' } },
  ];

  // Name maps for TopPerformers
  const workerNameMap: Record<string, string> = {};
  mockWorkers.forEach((w) => { workerNameMap[w.id] = w.fullName; });
  const supplierNameMap: Record<string, string> = { 'sup1': 'Qizilqum Sement', 'sup2': 'Bekobod Sement', 'sup3': 'Toshkent Metall', 'sup4': 'MetallPro', 'sup5': 'Ohangaron Sement', 'sup6': 'YogochTrade' };

  const workerRatings = mockRatings.filter((r) => r.targetType === 'worker');
  const supplierRatings = mockRatings.filter((r) => r.targetType === 'supplier');

  return (
    <div className="space-y-6">
      {/* Stats */}
      <StatsGrid stats={stats} />

      {/* Alert Panel — Eng muhim! */}
      <AlertPanel alerts={mockNotifications.filter((n) => n.recipientRole === 'rahbar')} />

      {/* Norm Violations Quick View */}
      {mockNormViolations.filter((v) => v.status === 'new').length > 0 && (
        <Card className="border-orange-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Normativ buzilishlar
                <Badge variant="outline" className="bg-orange-100 text-orange-800">
                  {mockNormViolations.filter((v) => v.status === 'new').length} ta yangi
                </Badge>
              </CardTitle>
              <Button variant="ghost" size="sm">
                Batafsil <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {mockNormViolations.filter((v) => v.status === 'new').map((violation) => (
              <div key={violation.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{violation.materialName}</p>
                  <p className="text-xs text-muted-foreground">{violation.workDone} — {violation.date}</p>
                </div>
                <Badge variant="destructive">+{violation.differencePercent.toFixed(1)}%</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects Table — 2/3 */}
        <div className="lg:col-span-2">
          <ProjectTable projects={mockProjects} />
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Oxirgi faoliyatlar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockActivityLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={cn(
                    'mt-1 h-2 w-2 rounded-full shrink-0',
                    log.action.includes('block') ? 'bg-red-500' :
                    log.action.includes('alert') || log.action.includes('inventory') ? 'bg-orange-500' :
                    'bg-blue-500'
                  )} />
                  <div className="min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{log.userName}</span>
                      <span className="text-muted-foreground"> — {log.details}</span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3" />
                      {formatDateTime(log.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Latest Reports */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Oxirgi hisobotlar
                </CardTitle>
                <Button variant="ghost" size="sm">
                  Hammasi <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockReports.slice(0, 3).map((report) => (
                <div key={report.id} className="p-3 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{report.prorabName}</span>
                    <Badge variant="outline" className="text-xs">
                      {report.date}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{report.workDone}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Camera className="h-3 w-3" /> {report.photos.length} rasm
                    </span>
                    <span>{report.workersPresent} ishchi</span>
                    {report.isSigned && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                        Imzolangan
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ratings Section */}
      <Tabs defaultValue="workers" className="w-full">
        <TabsList>
          <TabsTrigger value="workers" className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5" /> Ishchilar reytingi
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> Yetkazib beruvchilar
          </TabsTrigger>
        </TabsList>
        <TabsContent value="workers" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TopPerformers ratings={workerRatings} title="Eng yaxshi ishchilar" type="best" nameMap={workerNameMap} />
            <TopPerformers ratings={workerRatings} title="Eng yomon ko'rsatkichlar" type="worst" nameMap={workerNameMap} />
          </div>
        </TabsContent>
        <TabsContent value="suppliers" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TopPerformers ratings={supplierRatings} title="Eng yaxshi yetkazib beruvchilar" type="best" nameMap={supplierNameMap} />
            <TopPerformers ratings={supplierRatings} title="Eng yomon yetkazib beruvchilar" type="worst" nameMap={supplierNameMap} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
