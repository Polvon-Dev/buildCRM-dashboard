'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Warehouse, Package, AlertTriangle, CheckCircle,
  TrendingDown, Search, ShieldAlert,
} from 'lucide-react';
import { StatsGrid, StatCard } from '@/widgets/stats-cards/ui/StatsGrid';
import { mockMaterials } from '@/mock/materials';
import { mockInventoryChecks } from '@/mock/inventoryChecks';
import { formatCurrency, formatDate, calculatePercentage } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

export default function RahbarWarehousePage() {
  const totalValue = mockMaterials.reduce((s, m) => s + m.totalValue, 0);
  const lowStockCount = mockMaterials.filter((m) => m.quantity <= m.minQuantity * 1.5).length;
  const alertChecks = mockInventoryChecks.filter((c) => c.isAlert).length;

  const stats: StatCard[] = [
    { title: 'Jami materiallar', value: mockMaterials.length, icon: 'Package', color: 'blue' },
    { title: 'Ombor qiymati', value: formatCurrency(totalValue), icon: 'DollarSign', color: 'green' },
    { title: 'Kam qolgan', value: lowStockCount, icon: 'AlertTriangle', color: 'orange' },
    { title: 'Farq aniqlangan', value: alertChecks, icon: 'AlertTriangle', color: 'red' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ombor</h1>
        <p className="text-muted-foreground">Material zahirasi va inventarizatsiya</p>
      </div>

      <StatsGrid stats={stats} />

      {/* Materials Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />
            Material zahirasi ({mockMaterials.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Kategoriya</TableHead>
                <TableHead className="text-center">Miqdor</TableHead>
                <TableHead className="text-center">Minimum</TableHead>
                <TableHead>Zahira holati</TableHead>
                <TableHead className="text-right">Narx (dona)</TableHead>
                <TableHead className="text-right">Jami qiymat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockMaterials.map((material, index) => {
                const stockPercent = calculatePercentage(material.quantity, material.minQuantity * 5);
                const isLow = material.quantity <= material.minQuantity * 1.5;
                const isCritical = material.quantity <= material.minQuantity;
                return (
                  <TableRow key={material.id} className={cn(
                    isCritical && 'bg-red-50/50',
                    isLow && !isCritical && 'bg-orange-50/50',
                  )}>
                    <TableCell className="text-muted-foreground text-sm">{index + 1}</TableCell>
                    <TableCell className="font-medium text-sm">{material.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs capitalize">{material.category}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={cn(
                        'text-sm font-medium',
                        isCritical ? 'text-red-600' : isLow ? 'text-orange-600' : ''
                      )}>
                        {material.quantity} {material.unit}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {material.minQuantity} {material.unit}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <Progress
                          value={Math.min(100, stockPercent)}
                          className={cn(
                            'h-2 flex-1',
                            isCritical && '[&>div]:bg-red-500',
                            isLow && !isCritical && '[&>div]:bg-orange-500',
                          )}
                        />
                        {isCritical && <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />}
                        {isLow && !isCritical && <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-sm">{formatCurrency(material.pricePerUnit)}</TableCell>
                    <TableCell className="text-right text-sm font-medium">{formatCurrency(material.totalValue)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Inventory Checks */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-4 w-4" />
            Inventarizatsiya natijalari ({mockInventoryChecks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">#</TableHead>
                <TableHead>Material</TableHead>
                <TableHead className="text-center">Tizimdagi</TableHead>
                <TableHead className="text-center">Haqiqiy</TableHead>
                <TableHead className="text-center">Farq</TableHead>
                <TableHead className="text-center">Farq %</TableHead>
                <TableHead>Tekshiruvchi</TableHead>
                <TableHead>Izoh</TableHead>
                <TableHead>Sana</TableHead>
                <TableHead className="text-center">Holat</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInventoryChecks.map((check, index) => (
                <TableRow key={check.id} className={cn(check.isAlert && 'bg-red-50/50')}>
                  <TableCell className="text-muted-foreground text-sm">{index + 1}</TableCell>
                  <TableCell className="font-medium text-sm">{check.materialName}</TableCell>
                  <TableCell className="text-center text-sm">{check.systemQuantity}</TableCell>
                  <TableCell className="text-center text-sm">{check.actualQuantity}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      'text-sm font-bold',
                      check.difference < 0 ? 'text-red-600' : 'text-green-600'
                    )}>
                      {check.difference}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={cn(
                      'text-xs font-bold',
                      check.isAlert ? 'bg-red-100 text-red-800 border-red-300' : 'bg-green-100 text-green-800 border-green-300'
                    )}>
                      <TrendingDown className="h-3 w-3 mr-1" />
                      {check.differencePercent.toFixed(2)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{check.checkedByName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {check.comment || '—'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{check.date}</TableCell>
                  <TableCell className="text-center">
                    {check.isAlert ? (
                      <Badge variant="destructive" className="text-xs">
                        <ShieldAlert className="h-3 w-3 mr-1" /> Ogohlantirish
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" /> Normal
                      </Badge>
                    )}
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
