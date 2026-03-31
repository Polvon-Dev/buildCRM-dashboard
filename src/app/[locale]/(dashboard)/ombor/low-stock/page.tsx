'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertTriangle, Package, ShoppingCart, Send,
} from 'lucide-react';
import { mockMaterials } from '@/mock/materials';
import { Material } from '@/shared/types';
import { formatCurrency } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

export default function LowStockPage() {
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [requestQuantity, setRequestQuantity] = useState('');
  const [requestComment, setRequestComment] = useState('');
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set());

  // All materials with stock level info
  const materialsWithLevel = mockMaterials
    .map((m) => ({
      ...m,
      stockLevel: m.minQuantity > 0 ? (m.quantity / m.minQuantity) * 100 : 100,
      isLow: m.quantity <= m.minQuantity,
      isCritical: m.quantity <= m.minQuantity * 0.5,
    }))
    .sort((a, b) => a.stockLevel - b.stockLevel);

  const lowStockItems = materialsWithLevel.filter((m) => m.isLow);
  const warningItems = materialsWithLevel.filter(
    (m) => !m.isLow && m.stockLevel < 150
  );

  const handleOpenRequest = (material: Material) => {
    setSelectedMaterial(material);
    setRequestQuantity('');
    setRequestComment('');
    setRequestDialogOpen(true);
  };

  const handleSendRequest = () => {
    if (!selectedMaterial || !requestQuantity) return;
    setSentRequests((prev) => new Set([...Array.from(prev), selectedMaterial.id]));
    setRequestDialogOpen(false);
  };

  const getStockColor = (level: number) => {
    if (level <= 50) return 'text-red-600';
    if (level <= 100) return 'text-orange-600';
    if (level <= 150) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getProgressColor = (level: number) => {
    if (level <= 50) return '[&>div]:bg-red-500';
    if (level <= 100) return '[&>div]:bg-orange-500';
    if (level <= 150) return '[&>div]:bg-yellow-500';
    return '[&>div]:bg-green-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kam qolgan materiallar</h1>
        <p className="text-muted-foreground">Minimum chegaradan kam yoki yaqin materiallar</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100 text-red-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-700">
                {lowStockItems.filter((m) => m.isCritical).length}
              </p>
              <p className="text-xs text-muted-foreground">Kritik darajada kam</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-orange-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 text-orange-700">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-700">{lowStockItems.length}</p>
              <p className="text-xs text-muted-foreground">Minimum chegaradan kam</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 text-yellow-700">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-700">{warningItems.length}</p>
              <p className="text-xs text-muted-foreground">Ogohlantirish</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Request Dialog */}
      <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Tezkor so&#39;rov yuborish
            </DialogTitle>
          </DialogHeader>
          {selectedMaterial && (
            <div className="space-y-4 py-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{selectedMaterial.name}</p>
                <p className="text-sm text-muted-foreground">
                  Hozirgi: {selectedMaterial.quantity} {selectedMaterial.unit} | Minimum:{' '}
                  {selectedMaterial.minQuantity} {selectedMaterial.unit}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">So&#39;raladigan miqdor</label>
                <Input
                  type="number"
                  value={requestQuantity}
                  onChange={(e) => setRequestQuantity(e.target.value)}
                  placeholder={`Miqdor (${selectedMaterial.unit})`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Izoh</label>
                <Textarea
                  value={requestComment}
                  onChange={(e) => setRequestComment(e.target.value)}
                  placeholder="Qo'shimcha izoh..."
                  className="min-h-[60px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRequestDialogOpen(false)}>
              Bekor qilish
            </Button>
            <Button onClick={handleSendRequest} disabled={!requestQuantity}>
              <Send className="h-4 w-4 mr-2" />
              So&#39;rov yuborish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Low Stock Items */}
      {lowStockItems.length > 0 && (
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              Minimum chegaradan kam
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {lowStockItems.map((material) => (
              <div
                key={material.id}
                className={cn(
                  'p-4 rounded-lg border',
                  material.isCritical
                    ? 'bg-red-50 border-red-300'
                    : 'bg-orange-50 border-orange-200'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{material.name}</h3>
                      {material.isCritical ? (
                        <Badge variant="destructive" className="text-xs">Kritik</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-orange-100 text-orange-800 border-orange-200">
                          Kam
                        </Badge>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span>
                        Mavjud:{' '}
                        <span className={cn('font-bold', getStockColor(material.stockLevel))}>
                          {material.quantity.toLocaleString()} {material.unit}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        Minimum: {material.minQuantity.toLocaleString()} {material.unit}
                      </span>
                    </div>
                    <div className="mt-2">
                      <Progress
                        value={Math.min(material.stockLevel, 100)}
                        className={cn('h-2', getProgressColor(material.stockLevel))}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {material.stockLevel.toFixed(0)}% minimum chegaraga nisbatan
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-sm font-medium">{formatCurrency(material.totalValue)}</p>
                    {sentRequests.has(material.id) ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        So&#39;rov yuborildi
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenRequest(material)}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        So&#39;rov
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Warning Items */}
      {warningItems.length > 0 && (
        <Card className="border-yellow-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-yellow-700">
              <Package className="h-4 w-4" />
              Ogohlantirish (150% dan kam)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {warningItems.map((material) => (
              <div
                key={material.id}
                className="p-3 rounded-lg border bg-yellow-50 border-yellow-200"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium">{material.name}</h3>
                    <div className="flex items-center gap-4 text-sm mt-1">
                      <span>
                        <span className="font-medium text-yellow-700">
                          {material.quantity.toLocaleString()} {material.unit}
                        </span>
                      </span>
                      <span className="text-muted-foreground">
                        Min: {material.minQuantity.toLocaleString()} {material.unit}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(material.stockLevel, 200) / 2}
                      className={cn('h-1.5 mt-2', getProgressColor(material.stockLevel))}
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenRequest(material)}
                  >
                    <ShoppingCart className="h-3 w-3 mr-1" />
                    So&#39;rov
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* All OK */}
      {lowStockItems.length === 0 && warningItems.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <h3 className="text-lg font-medium">Barcha materiallar yetarli</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Hozircha kam qolgan material yo&#39;q
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
