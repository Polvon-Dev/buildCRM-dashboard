'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DollarSign, Receipt, Wallet, TrendingUp, TrendingDown,
  CheckCircle, Clock, Users, CalendarCheck,
} from 'lucide-react';
import { StatsGrid, StatCard } from '@/widgets/stats-cards/ui/StatsGrid';
import { mockSalaries } from '@/mock/salaries';
import { mockReceipts } from '@/mock/receipts';
import { mockAttendance } from '@/mock/attendance';
import { mockProjects } from '@/mock/projects';
import { formatCurrency, formatDate } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

export default function RahbarFinancePage() {
  const totalSalaries = mockSalaries.reduce((s, sal) => s + sal.finalAmount, 0);
  const totalReceipts = mockReceipts.reduce((s, r) => s + r.totalAmount, 0);
  const balance = mockProjects.reduce((s, p) => s + p.budget, 0) - mockProjects.reduce((s, p) => s + p.spent, 0);
  const paidCount = mockSalaries.filter((s) => s.isPaid).length;

  const stats: StatCard[] = [
    { title: 'Jami oyliklar', value: formatCurrency(totalSalaries), icon: 'Users', color: 'blue' },
    { title: 'Jami xaridlar', value: formatCurrency(totalReceipts), icon: 'DollarSign', color: 'orange' },
    { title: 'Qolgan byudjet', value: formatCurrency(balance), icon: 'TrendingUp', color: 'green' },
    { title: "To'langan oyliklar", value: `${paidCount}/${mockSalaries.length}`, icon: 'CheckSquare', color: 'purple' },
  ];

  const getProjectName = (id: string) => mockProjects.find((p) => p.id === id)?.name?.split(' - ')[0] || id;

  // Attendance vs Salary comparison
  const salaryWithAttendance = mockSalaries.map((sal) => {
    const attendanceRecords = mockAttendance.filter((a) => a.workerId === sal.workerId);
    const presentDays = attendanceRecords.filter((a) => a.status === 'present' || a.status === 'late').length;
    return { ...sal, presentDays };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Moliya</h1>
        <p className="text-muted-foreground">Oylik va xarajatlar hisobi</p>
      </div>

      <StatsGrid stats={stats} />

      <Tabs defaultValue="salaries">
        <TabsList>
          <TabsTrigger value="salaries">Oyliklar</TabsTrigger>
          <TabsTrigger value="receipts">Xarid cheklari</TabsTrigger>
          <TabsTrigger value="comparison">Davomat vs Oylik</TabsTrigger>
        </TabsList>

        {/* Salaries Tab */}
        <TabsContent value="salaries">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                Oylik jadvali — 2026-03
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">#</TableHead>
                    <TableHead>Ishchi</TableHead>
                    <TableHead>Lavozim</TableHead>
                    <TableHead>Loyiha</TableHead>
                    <TableHead className="text-center">Ish kunlari</TableHead>
                    <TableHead className="text-center">Kelgan kunlar</TableHead>
                    <TableHead className="text-right">Kunlik stavka</TableHead>
                    <TableHead className="text-right">Bonus</TableHead>
                    <TableHead className="text-right">Ushlanma</TableHead>
                    <TableHead className="text-right">Yakuniy</TableHead>
                    <TableHead className="text-center">Holat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSalaries.map((sal, index) => (
                    <TableRow key={sal.id}>
                      <TableCell className="text-muted-foreground text-sm">{index + 1}</TableCell>
                      <TableCell className="font-medium text-sm">{sal.workerName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground capitalize">{sal.position}</TableCell>
                      <TableCell className="text-sm">{getProjectName(sal.projectId)}</TableCell>
                      <TableCell className="text-center text-sm">{sal.workDays}</TableCell>
                      <TableCell className="text-center">
                        <span className={cn(
                          'text-sm font-medium',
                          sal.attendedDays < sal.workDays - 2 ? 'text-red-600' : 'text-green-600'
                        )}>
                          {sal.attendedDays}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(sal.dailyRate)}</TableCell>
                      <TableCell className="text-right text-sm text-green-600">
                        {sal.bonus > 0 ? `+${formatCurrency(sal.bonus)}` : '—'}
                      </TableCell>
                      <TableCell className="text-right text-sm text-red-600">
                        {sal.deduction > 0 ? `-${formatCurrency(sal.deduction)}` : '—'}
                      </TableCell>
                      <TableCell className="text-right font-bold text-sm">
                        {formatCurrency(sal.finalAmount)}
                      </TableCell>
                      <TableCell className="text-center">
                        {sal.isPaid ? (
                          <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" /> To&apos;langan
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800 border-yellow-200">
                            <Clock className="h-3 w-3 mr-1" /> Kutilmoqda
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-end">
                  <span className="text-sm font-bold">Jami: {formatCurrency(totalSalaries)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Receipts Tab */}
        <TabsContent value="receipts">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="h-4 w-4" />
                Xarid cheklari
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-8">#</TableHead>
                    <TableHead>Yetkazib beruvchi</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead className="text-center">Miqdor</TableHead>
                    <TableHead className="text-right">Narx (dona)</TableHead>
                    <TableHead className="text-right">Jami</TableHead>
                    <TableHead>Sana</TableHead>
                    <TableHead>Kiritgan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReceipts.map((rec, index) => (
                    <TableRow key={rec.id}>
                      <TableCell className="text-muted-foreground text-sm">{index + 1}</TableCell>
                      <TableCell className="font-medium text-sm">{rec.supplierName}</TableCell>
                      <TableCell className="text-sm">{rec.materialName}</TableCell>
                      <TableCell className="text-center text-sm">{rec.quantity} {rec.unit}</TableCell>
                      <TableCell className="text-right text-sm">{formatCurrency(rec.pricePerUnit)}</TableCell>
                      <TableCell className="text-right font-bold text-sm">{formatCurrency(rec.totalAmount)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{rec.date}</TableCell>
                      <TableCell className="text-sm">{rec.addedByName}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="p-4 border-t bg-gray-50">
                <div className="flex justify-end">
                  <span className="text-sm font-bold">Jami: {formatCurrency(totalReceipts)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarCheck className="h-4 w-4" />
                Davomat vs Oylik taqqoslash
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salaryWithAttendance.map((sal) => {
                  const attendanceRate = sal.workDays > 0 ? Math.round((sal.attendedDays / sal.workDays) * 100) : 0;
                  return (
                    <div key={sal.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium">{sal.workerName}</p>
                          <p className="text-xs text-muted-foreground capitalize">{sal.position} — {getProjectName(sal.projectId)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatCurrency(sal.finalAmount)}</p>
                          <p className="text-xs text-muted-foreground">
                            {sal.attendedDays}/{sal.workDays} kun
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Davomat</span>
                            <span className={cn('font-medium', attendanceRate < 85 ? 'text-red-600' : 'text-green-600')}>
                              {attendanceRate}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all',
                                attendanceRate >= 90 ? 'bg-green-500' :
                                attendanceRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                              )}
                              style={{ width: `${attendanceRate}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Oylik (max dan %)</span>
                            <span className="font-medium">
                              {Math.round((sal.finalAmount / (sal.dailyRate * sal.workDays)) * 100)}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{ width: `${Math.min(100, Math.round((sal.finalAmount / (sal.dailyRate * sal.workDays)) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
