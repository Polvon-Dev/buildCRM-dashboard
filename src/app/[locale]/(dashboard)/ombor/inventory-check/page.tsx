'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  ClipboardCheck, AlertTriangle, Send, Clock, CheckCircle2, TriangleAlert,
} from 'lucide-react';
import { mockMaterials } from '@/mock/materials';
import { mockInventoryChecks } from '@/mock/inventoryChecks';
import { InventoryCheck, Material } from '@/shared/types';
import { formatDate, generateId } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/model/authStore';

interface CheckItem {
  materialId: string;
  materialName: string;
  systemQuantity: number;
  actualQuantity: string;
  unit: string;
}

export default function InventoryCheckPage() {
  const { user } = useAuthStore();
  const [checks, setChecks] = useState<InventoryCheck[]>(mockInventoryChecks);
  const [isChecking, setIsChecking] = useState(false);
  const [checkItems, setCheckItems] = useState<CheckItem[]>([]);
  const [submitDialogOpen, setSubmitDialogOpen] = useState(false);
  const [alertItems, setAlertItems] = useState<InventoryCheck[]>([]);

  const startCheck = () => {
    const items: CheckItem[] = mockMaterials.map((m) => ({
      materialId: m.id,
      materialName: m.name,
      systemQuantity: m.quantity,
      actualQuantity: '',
      unit: m.unit,
    }));
    setCheckItems(items);
    setIsChecking(true);
  };

  const updateActualQuantity = (materialId: string, value: string) => {
    setCheckItems((prev) =>
      prev.map((item) =>
        item.materialId === materialId ? { ...item, actualQuantity: value } : item
      )
    );
  };

  const getDifference = (systemQty: number, actualStr: string) => {
    if (!actualStr) return null;
    const actual = Number(actualStr);
    const diff = actual - systemQty;
    const percent = systemQty > 0 ? (diff / systemQty) * 100 : 0;
    return { diff, percent };
  };

  const handleSubmit = () => {
    const filledItems = checkItems.filter((item) => item.actualQuantity !== '');
    const newChecks: InventoryCheck[] = filledItems.map((item) => {
      const actual = Number(item.actualQuantity);
      const diff = actual - item.systemQuantity;
      const percent = item.systemQuantity > 0 ? (diff / item.systemQuantity) * 100 : 0;
      const isAlert = Math.abs(percent) > 5;
      return {
        id: generateId(),
        materialId: item.materialId,
        materialName: item.materialName,
        systemQuantity: item.systemQuantity,
        actualQuantity: actual,
        difference: diff,
        differencePercent: parseFloat(percent.toFixed(2)),
        checkedBy: user?.id || '',
        checkedByName: user?.fullName || '',
        date: new Date().toISOString().split('T')[0],
        isAlert,
      };
    });

    const alerts = newChecks.filter((c) => c.isAlert);
    if (alerts.length > 0) {
      setAlertItems(alerts);
      setSubmitDialogOpen(true);
    }

    setChecks([...newChecks, ...checks]);
    setIsChecking(false);
    setCheckItems([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventarizatsiya</h1>
          <p className="text-muted-foreground">Ombor materiallarini tekshirish</p>
        </div>
        {!isChecking && (
          <Button onClick={startCheck}>
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Yangi tekshiruv
          </Button>
        )}
      </div>

      {/* Active Check */}
      {isChecking && (
        <Card className="border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4 text-blue-600" />
              Joriy tekshiruv
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Jarayonda
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead className="text-right">Tizim miqdori</TableHead>
                    <TableHead className="text-right">Haqiqiy miqdor</TableHead>
                    <TableHead className="text-right">Farq</TableHead>
                    <TableHead className="text-center">Holat</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {checkItems.map((item) => {
                    const result = getDifference(item.systemQuantity, item.actualQuantity);
                    const isAlert = result && Math.abs(result.percent) > 5;
                    return (
                      <TableRow
                        key={item.materialId}
                        className={cn(isAlert && 'bg-red-50')}
                      >
                        <TableCell className="font-medium">
                          {item.materialName}
                          <span className="text-xs text-muted-foreground ml-1">
                            ({item.unit})
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.systemQuantity.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            value={item.actualQuantity}
                            onChange={(e) =>
                              updateActualQuantity(item.materialId, e.target.value)
                            }
                            className="w-32 ml-auto text-right"
                            placeholder="Kiriting"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {result ? (
                            <div>
                              <span
                                className={cn(
                                  'font-medium',
                                  result.diff > 0 && 'text-green-600',
                                  result.diff < 0 && 'text-red-600',
                                  result.diff === 0 && 'text-gray-600'
                                )}
                              >
                                {result.diff > 0 ? '+' : ''}
                                {result.diff.toLocaleString()}
                              </span>
                              <span
                                className={cn(
                                  'text-xs ml-1',
                                  Math.abs(result.percent) > 5
                                    ? 'text-red-500 font-medium'
                                    : 'text-muted-foreground'
                                )}
                              >
                                ({result.percent > 0 ? '+' : ''}
                                {result.percent.toFixed(1)}%)
                              </span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {result ? (
                            isAlert ? (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Alert
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 text-xs"
                              >
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                OK
                              </Badge>
                            )
                          ) : null}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setIsChecking(false)}>
                Bekor qilish
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={checkItems.every((i) => i.actualQuantity === '')}
              >
                <Send className="h-4 w-4 mr-2" />
                Tekshiruvni yakunlash
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Alert Dialog */}
      <Dialog open={submitDialogOpen} onOpenChange={setSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <TriangleAlert className="h-5 w-5" />
              Farq aniqlandi — Rahbarga xabar yuboriladi!
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <p className="text-sm text-muted-foreground">
              Quyidagi materiallarda 5% dan ortiq farq aniqlandi:
            </p>
            {alertItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200"
              >
                <div>
                  <p className="font-medium">{item.materialName}</p>
                  <p className="text-xs text-muted-foreground">
                    Tizim: {item.systemQuantity} | Haqiqiy: {item.actualQuantity}
                  </p>
                </div>
                <Badge variant="destructive">
                  {item.differencePercent > 0 ? '+' : ''}
                  {item.differencePercent}%
                </Badge>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSubmitDialogOpen(false)}>
              Yopish
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setSubmitDialogOpen(false);
                // In real app: send alert to rahbar
              }}
            >
              <Send className="h-4 w-4 mr-2" />
              Rahbarga xabar yuborish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Tekshiruvlar tarixi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sana</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead className="text-right">Tizim</TableHead>
                  <TableHead className="text-right">Haqiqiy</TableHead>
                  <TableHead className="text-right">Farq</TableHead>
                  <TableHead>Tekshiruvchi</TableHead>
                  <TableHead>Holat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {checks.map((check) => (
                  <TableRow
                    key={check.id}
                    className={cn(check.isAlert && 'bg-red-50')}
                  >
                    <TableCell className="text-sm">{formatDate(check.date)}</TableCell>
                    <TableCell className="font-medium">{check.materialName}</TableCell>
                    <TableCell className="text-right">
                      {check.systemQuantity.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {check.actualQuantity.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          'font-medium',
                          check.difference > 0 && 'text-green-600',
                          check.difference < 0 && 'text-red-600'
                        )}
                      >
                        {check.difference > 0 ? '+' : ''}
                        {check.difference} ({check.differencePercent}%)
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{check.checkedByName}</TableCell>
                    <TableCell>
                      {check.isAlert ? (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Alert
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 text-xs"
                        >
                          Normal
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
