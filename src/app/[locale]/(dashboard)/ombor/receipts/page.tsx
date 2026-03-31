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
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Receipt as ReceiptIcon, Plus, Eye, Upload, FileImage, ChevronDown, ChevronUp,
  MessageSquare,
} from 'lucide-react';
import { mockReceipts } from '@/mock/receipts';
import { mockSuppliers } from '@/mock/suppliers';
import { mockMaterials } from '@/mock/materials';
import { Receipt } from '@/shared/types';
import { formatCurrency, formatDate, generateId } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/model/authStore';
import { CommentSection } from '@/widgets/comment-section/ui/CommentSection';

export default function ReceiptsPage() {
  const { user } = useAuthStore();
  const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form
  const [supplierId, setSupplierId] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [photoFile, setPhotoFile] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file.name);
    }
  };

  const handleViewPhoto = (photo: string) => {
    setSelectedPhoto(photo);
    setPhotoDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!supplierId || !materialId || !quantity || !pricePerUnit) return;

    const supplier = mockSuppliers.find((s) => s.id === supplierId);
    const material = mockMaterials.find((m) => m.id === materialId);
    if (!supplier || !material) return;

    const newReceipt: Receipt = {
      id: generateId(),
      supplierId,
      supplierName: supplier.name,
      materialId,
      materialName: material.name,
      quantity: Number(quantity),
      unit: material.unit,
      pricePerUnit: Number(pricePerUnit),
      totalAmount: Number(quantity) * Number(pricePerUnit),
      receiptPhoto: photoFile || undefined,
      date: new Date().toISOString().split('T')[0],
      addedBy: user?.id || '',
      addedByName: user?.fullName || '',
    };

    setReceipts([newReceipt, ...receipts]);
    setAddDialogOpen(false);
    setSupplierId('');
    setMaterialId('');
    setQuantity('');
    setPricePerUnit('');
    setPhotoFile(null);
  };

  const totalAmount = receipts.reduce((sum, r) => sum + r.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Xarid cheklari</h1>
          <p className="text-muted-foreground">Barcha xarid cheklari va hujjatlar</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yangi chek
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Yangi xarid cheki</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Yetkazib beruvchi</label>
                <Select value={supplierId} onValueChange={setSupplierId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockSuppliers.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Material</label>
                <Select value={materialId} onValueChange={setMaterialId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockMaterials.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.name} ({m.unit})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Miqdor</label>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Birlik narxi</label>
                  <Input
                    type="number"
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(e.target.value)}
                  />
                </div>
              </div>
              {quantity && pricePerUnit && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm">
                    Jami:{' '}
                    <span className="font-bold text-blue-700">
                      {formatCurrency(Number(quantity) * Number(pricePerUnit))}
                    </span>
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium">Chek rasmi</label>
                <label className="flex items-center gap-2 px-4 py-3 border border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {photoFile || 'Rasm yuklash'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Bekor qilish
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!supplierId || !materialId || !quantity || !pricePerUnit}
              >
                Saqlash
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <ReceiptIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Jami cheklar soni</p>
              <p className="text-lg font-bold">{receipts.length}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Umumiy summa</p>
            <p className="text-lg font-bold text-blue-700">{formatCurrency(totalAmount)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Photo View Dialog */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chek rasmi</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center p-8 bg-muted rounded-lg min-h-[300px]">
            <div className="text-center text-muted-foreground">
              <FileImage className="h-16 w-16 mx-auto mb-3 opacity-50" />
              <p className="text-sm">{selectedPhoto || 'Rasm mavjud emas'}</p>
              <p className="text-xs mt-1">Rasm ko&#39;rinishi demo rejimda mavjud emas</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ReceiptIcon className="h-4 w-4" />
            Cheklar ro&#39;yxati
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {receipts.map((receipt) => {
              const isExpanded = expandedId === receipt.id;
              return (
                <div key={receipt.id} className="border rounded-lg">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{receipt.materialName}</h3>
                          <Badge variant="outline" className="text-xs">
                            {receipt.quantity} {receipt.unit}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {receipt.supplierName}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{formatDate(receipt.date)}</span>
                          <span>Qo&#39;shdi: {receipt.addedByName}</span>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <p className="font-bold text-lg">{formatCurrency(receipt.totalAmount)}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(receipt.pricePerUnit)} x {receipt.quantity}
                        </p>
                        <div className="flex gap-2">
                          {receipt.receiptPhoto && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewPhoto(receipt.receiptPhoto!)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Rasm
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Comments toggle */}
                  <div className="border-t px-4 py-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs text-muted-foreground w-full"
                      onClick={() => setExpandedId(isExpanded ? null : receipt.id)}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Izohlar
                      {isExpanded ? (
                        <ChevronUp className="h-3 w-3 ml-1" />
                      ) : (
                        <ChevronDown className="h-3 w-3 ml-1" />
                      )}
                    </Button>
                    {isExpanded && (
                      <div className="mt-2 pb-2">
                        <CommentSection targetType="receipt" targetId={receipt.id} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
