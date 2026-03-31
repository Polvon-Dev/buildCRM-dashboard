'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from '@/components/ui/dialog';
import {
  ShieldAlert, TrendingUp, TrendingDown, Eye, CheckCircle,
  AlertTriangle, ArrowRight,
} from 'lucide-react';
import { StatsGrid, StatCard } from '@/widgets/stats-cards/ui/StatsGrid';
import { mockNormViolations } from '@/mock/materials';
import { mockProjects } from '@/mock/projects';
import { mockUsers } from '@/mock/users';
import { NormViolation } from '@/shared/types';
import { getStatusColor, formatDate } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

const statusLabels: Record<string, string> = {
  new: 'Yangi', reviewed: "Ko'rib chiqildi", resolved: 'Hal qilindi',
};

export default function RahbarNormsPage() {
  const [violations, setViolations] = useState<NormViolation[]>(mockNormViolations);
  const [reviewDialog, setReviewDialog] = useState<NormViolation | null>(null);
  const [reviewComment, setReviewComment] = useState('');

  const newCount = violations.filter((v) => v.status === 'new').length;
  const reviewedCount = violations.filter((v) => v.status === 'reviewed').length;
  const resolvedCount = violations.filter((v) => v.status === 'resolved').length;
  const avgDifference = violations.length > 0
    ? (violations.reduce((s, v) => s + v.differencePercent, 0) / violations.length).toFixed(1)
    : '0';

  const stats: StatCard[] = [
    { title: 'Yangi buzilishlar', value: newCount, icon: 'AlertTriangle', color: 'red' },
    { title: "Ko'rib chiqildi", value: reviewedCount, icon: 'ClipboardList', color: 'yellow' },
    { title: 'Hal qilindi', value: resolvedCount, icon: 'CheckSquare', color: 'green' },
    { title: "O'rtacha farq", value: `${avgDifference}%`, icon: 'TrendingUp', color: 'orange' },
  ];

  const getProjectName = (id: string) => mockProjects.find((p) => p.id === id)?.name?.split(' - ')[0] || id;
  const getProrabName = (id: string) => mockUsers.find((u) => u.id === id)?.fullName || id;

  const handleReview = (violationId: string) => {
    setViolations(violations.map((v) =>
      v.id === violationId
        ? { ...v, status: 'reviewed' as const, reviewComment: reviewComment.trim() || undefined }
        : v
    ));
    setReviewComment('');
    setReviewDialog(null);
  };

  const handleResolve = (violationId: string) => {
    setViolations(violations.map((v) =>
      v.id === violationId ? { ...v, status: 'resolved' as const } : v
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Normativ buzilishlar</h1>
        <p className="text-muted-foreground">Material sarfi normativdan oshgan holatlar</p>
      </div>

      <StatsGrid stats={stats} />

      {/* Trend Info */}
      <Card className="border-orange-200 bg-orange-50/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-orange-900">Trend ma&apos;lumoti</p>
              <p className="text-sm text-orange-700">
                So&apos;nggi 7 kunda {violations.length} ta normativ buzilish aniqlandi.
                O&apos;rtacha farq {avgDifference}% ni tashkil etadi. Eng ko&apos;p buzilish sement va armatura bo&apos;yicha kuzatilmoqda.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Violations Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            Buzilishlar ro&apos;yxati ({violations.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Loyiha</TableHead>
                <TableHead>Prorab</TableHead>
                <TableHead>Bajarilgan ish</TableHead>
                <TableHead className="text-center">Kutilgan</TableHead>
                <TableHead className="text-center">Haqiqiy</TableHead>
                <TableHead className="text-center">Farq %</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead>Sana</TableHead>
                <TableHead className="text-right">Amal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {violations.map((v, index) => (
                <TableRow key={v.id} className={cn(
                  v.status === 'new' && v.differencePercent > 20 && 'bg-red-50/50',
                )}>
                  <TableCell className="text-muted-foreground text-sm">{index + 1}</TableCell>
                  <TableCell className="font-medium text-sm">{v.materialName}</TableCell>
                  <TableCell className="text-sm">{getProjectName(v.projectId)}</TableCell>
                  <TableCell className="text-sm">{getProrabName(v.prorabId)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{v.workDone}</TableCell>
                  <TableCell className="text-center text-sm">{v.expectedUsage}</TableCell>
                  <TableCell className="text-center text-sm font-medium">{v.actualUsage}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn(
                      'text-xs font-bold',
                      v.differencePercent > 20 ? 'bg-red-100 text-red-800 border-red-300' :
                      v.differencePercent > 10 ? 'bg-orange-100 text-orange-800 border-orange-300' :
                      'bg-yellow-100 text-yellow-800 border-yellow-300'
                    )}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +{v.differencePercent}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn('text-xs', getStatusColor(v.status))}>
                      {statusLabels[v.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{v.date}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      {v.status === 'new' && (
                        <Dialog
                          open={reviewDialog?.id === v.id}
                          onOpenChange={(open) => {
                            if (open) setReviewDialog(v);
                            else { setReviewDialog(null); setReviewComment(''); }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-xs">
                              <Eye className="h-3 w-3 mr-1" /> Ko&apos;rish
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Buzilishni ko&apos;rib chiqish</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="rounded-lg bg-red-50 border border-red-200 p-4 space-y-2">
                                <p className="text-sm"><strong>Material:</strong> {v.materialName}</p>
                                <p className="text-sm"><strong>Ish:</strong> {v.workDone}</p>
                                <p className="text-sm"><strong>Kutilgan:</strong> {v.expectedUsage} | <strong>Haqiqiy:</strong> {v.actualUsage}</p>
                                <p className="text-sm font-bold text-red-600">Farq: +{v.differencePercent}%</p>
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-1.5 block">Izoh</label>
                                <Textarea
                                  value={reviewComment}
                                  onChange={(e) => setReviewComment(e.target.value)}
                                  placeholder="Izoh yozing..."
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button variant="outline">Yopish</Button>
                              </DialogClose>
                              <Button onClick={() => handleReview(v.id)}>
                                <CheckCircle className="h-4 w-4 mr-2" /> Ko&apos;rib chiqildi
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                      {v.status === 'reviewed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs text-green-600"
                          onClick={() => handleResolve(v.id)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" /> Hal qilish
                        </Button>
                      )}
                      {v.status === 'resolved' && (
                        <Badge variant="outline" className="text-xs bg-green-50">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-600" /> Hal qilindi
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
