'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { mockReports } from '@/mock/reports';
import { mockNorms, mockNormViolations } from '@/mock/materials';
import { formatDate, formatCurrency } from '@/shared/lib/utils';
import {
  BarChart3, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle2, Calendar, Ruler, Package,
} from 'lucide-react';

const PRORAB_ID = 'u2';
const PROJECT_ID = 'p1';

export default function ProrabWorkVolumePage() {
  const myReports = mockReports.filter((r) => r.prorabId === PRORAB_ID);
  const myViolations = mockNormViolations.filter((v) => v.prorabId === PRORAB_ID);
  const [periodTab, setPeriodTab] = useState('daily');

  // Aggregate work data from reports
  const workData = myReports.map((report) => {
    const totalMaterials = report.materialsUsed.reduce((sum, m) => sum + m.quantity, 0);
    return {
      date: report.date,
      workDone: report.workDone,
      workersPresent: report.workersPresent,
      materialsCount: report.materialsUsed.length,
      totalMaterialQuantity: totalMaterials,
      materials: report.materialsUsed,
    };
  });

  // Normativ comparison data
  const normComparisonData = myReports.flatMap((report) =>
    report.materialsUsed.map((usage) => {
      const norm = mockNorms.find((n) => n.materialId === usage.materialId);
      if (!norm) return null;
      const expectedUsage = norm.normPerUnit * usage.workAmount;
      const differencePercent = expectedUsage > 0
        ? ((usage.quantity - expectedUsage) / expectedUsage) * 100
        : 0;
      return {
        date: report.date,
        materialName: usage.materialName,
        workDescription: usage.workDescription,
        workAmount: usage.workAmount,
        workUnit: usage.workUnit,
        expectedUsage: Math.round(expectedUsage * 100) / 100,
        actualUsage: usage.quantity,
        unit: usage.unit,
        differencePercent: Math.round(differencePercent * 10) / 10,
        isViolation: Math.abs(differencePercent) > (norm.tolerance || 10),
        tolerance: norm.tolerance,
      };
    }).filter(Boolean)
  );

  // Summary stats
  const totalWorkDays = myReports.length;
  const avgWorkers = totalWorkDays > 0
    ? Math.round(myReports.reduce((sum, r) => sum + r.workersPresent, 0) / totalWorkDays)
    : 0;
  const violationCount = normComparisonData.filter((d) => d && d.isViolation).length;
  const withinNormCount = normComparisonData.filter((d) => d && !d.isViolation).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ish hajmi</h1>
        <p className="text-muted-foreground">Bajarilgan ishlar va normativ taqqoslash</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalWorkDays}</p>
                <p className="text-xs text-muted-foreground">Ish kunlari</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{avgWorkers}</p>
                <p className="text-xs text-muted-foreground">O&apos;rt. ishchi/kun</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <div>
                <p className="text-2xl font-bold">{withinNormCount}</p>
                <p className="text-xs text-muted-foreground">Normativ ichida</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-red-50 to-red-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{violationCount}</p>
                <p className="text-xs text-muted-foreground">Normativ buzilgan</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Work Volume Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Kunlik ish hajmi
            </CardTitle>
            <Tabs value={periodTab} onValueChange={setPeriodTab}>
              <TabsList className="h-8">
                <TabsTrigger value="daily" className="text-xs h-7">Kunlik</TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs h-7">Haftalik</TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs h-7">Oylik</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sana</TableHead>
                <TableHead>Bajarilgan ish</TableHead>
                <TableHead>Ishchilar</TableHead>
                <TableHead>Materiallar</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Ma&apos;lumotlar topilmadi
                  </TableCell>
                </TableRow>
              ) : (
                workData.map((day, index) => (
                  <TableRow key={index} className="hover:bg-accent/50">
                    <TableCell className="font-medium">{formatDate(day.date)}</TableCell>
                    <TableCell>
                      <p className="text-sm line-clamp-2">{day.workDone}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {day.workersPresent} kishi
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {day.materials.map((m, i) => (
                          <div key={i} className="text-xs text-muted-foreground">
                            {m.materialName}: {m.quantity} {m.unit}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Normativ Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Normativ taqqoslash (kutilgan vs haqiqiy sarfiyot)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sana</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Ish</TableHead>
                <TableHead>Kutilgan</TableHead>
                <TableHead>Haqiqiy</TableHead>
                <TableHead>Farq</TableHead>
                <TableHead>Holat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {normComparisonData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Ma&apos;lumotlar topilmadi
                  </TableCell>
                </TableRow>
              ) : (
                normComparisonData.map((item, index) => {
                  if (!item) return null;
                  return (
                    <TableRow key={index} className={item.isViolation ? 'bg-red-50/50' : ''}>
                      <TableCell className="text-sm">{formatDate(item.date)}</TableCell>
                      <TableCell className="font-medium text-sm">{item.materialName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {item.workAmount} {item.workUnit}
                      </TableCell>
                      <TableCell className="text-sm font-mono">
                        {item.expectedUsage} {item.unit}
                      </TableCell>
                      <TableCell className="text-sm font-mono">
                        {item.actualUsage} {item.unit}
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${
                          item.differencePercent > 0 ? 'text-red-600' :
                          item.differencePercent < 0 ? 'text-green-600' : 'text-gray-600'
                        }`}>
                          {item.differencePercent > 0 ? '+' : ''}{item.differencePercent}%
                        </span>
                      </TableCell>
                      <TableCell>
                        {item.isViolation ? (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Oshgan
                          </Badge>
                        ) : (
                          <Badge className="bg-green-100 text-green-800 text-xs" variant="secondary">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Normal
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Norm Violations */}
      {myViolations.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              Normativ buzilishlari
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myViolations.map((violation) => (
                <div
                  key={violation.id}
                  className="flex items-center gap-4 p-3 rounded-lg border border-red-200 bg-red-50/50"
                >
                  <AlertTriangle className="h-5 w-5 text-red-500 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{violation.materialName}</p>
                    <p className="text-xs text-muted-foreground">{violation.workDone}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs">Kutilgan: {violation.expectedUsage}</span>
                      <span className="text-xs">Haqiqiy: {violation.actualUsage}</span>
                      <span className="text-xs font-medium text-red-600">+{violation.differencePercent}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={
                      violation.status === 'new' ? 'bg-red-100 text-red-800' :
                      violation.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    } variant="secondary">
                      {violation.status === 'new' ? 'Yangi' :
                       violation.status === 'reviewed' ? "Ko'rib chiqilgan" : 'Hal qilingan'}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(violation.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visual Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Ish hajmi grafigi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workData.map((day, index) => (
              <div key={index}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="font-medium">{formatDate(day.date)}</span>
                  <span className="text-muted-foreground">{day.workersPresent} ishchi</span>
                </div>
                <div className="flex gap-2 items-center">
                  <Progress
                    value={Math.min((day.workersPresent / 50) * 100, 100)}
                    className="h-6 flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-12 text-right">
                    {Math.round((day.workersPresent / 50) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
