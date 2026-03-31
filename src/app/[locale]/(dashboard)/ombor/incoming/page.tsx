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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  ArrowDownToLine, Upload, CheckCircle2, Clock, ShieldCheck, FileImage,
} from 'lucide-react';
import { mockMaterials } from '@/mock/materials';
import { mockSuppliers } from '@/mock/suppliers';
import { mockInventoryMovements } from '@/mock/movements';
import { InventoryMovement } from '@/shared/types';
import { formatCurrency, formatDate, generateId } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/model/authStore';

export default function IncomingPage() {
  const { user } = useAuthStore();
  const [movements, setMovements] = useState<InventoryMovement[]>(
    mockInventoryMovements.filter((m) => m.type === 'incoming')
  );

  const [supplierId, setSupplierId] = useState('');
  const [materialId, setMaterialId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [photoFile, setPhotoFile] = useState<string | null>(null);
  const [isSigned, setIsSigned] = useState(false);
  const [signedAt, setSignedAt] = useState<string | null>(null);

  const selectedSupplier = mockSuppliers.find((s) => s.id === supplierId);
  const selectedMaterial = mockMaterials.find((m) => m.id === materialId);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file.name);
    }
  };

  const handleSign = () => {
    if (!user) return;
    setIsSigned(true);
    setSignedAt(new Date().toISOString());
  };

  const handleSubmit = () => {
    if (!supplierId || !materialId || !quantity || !isSigned) return;

    const material = mockMaterials.find((m) => m.id === materialId);
    const supplier = mockSuppliers.find((s) => s.id === supplierId);
    if (!material || !supplier) return;

    const newMovement: InventoryMovement = {
      id: generateId(),
      type: 'incoming',
      materialId,
      materialName: material.name,
      quantity: Number(quantity),
      unit: material.unit,
      supplierId,
      supplierName: supplier.name,
      processedBy: user?.id || '',
      processedByName: user?.fullName || '',
      photo: photoFile || undefined,
      isSigned: true,
      signedBy: [user?.fullName || ''],
      date: new Date().toISOString().split('T')[0],
    };

    setMovements([newMovement, ...movements]);
    setSupplierId('');
    setMaterialId('');
    setQuantity('');
    setPricePerUnit('');
    setPhotoFile(null);
    setIsSigned(false);
    setSignedAt(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Material kirim</h1>
        <p className="text-muted-foreground">Omborga yangi material qabul qilish</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowDownToLine className="h-4 w-4 text-green-600" />
            Yangi kirim
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Yetkazib beruvchi</label>
              <Select value={supplierId} onValueChange={setSupplierId}>
                <SelectTrigger>
                  <SelectValue placeholder="Yetkazib beruvchi tanlang" />
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
                  <SelectValue placeholder="Material tanlang" />
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Miqdor</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={selectedMaterial ? `Miqdor (${selectedMaterial.unit})` : 'Miqdor'}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Birlik narxi</label>
              <Input
                type="number"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(e.target.value)}
                placeholder="Narx (so'm)"
              />
            </div>
          </div>

          {/* Total */}
          {quantity && pricePerUnit && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm">
                Jami summa:{' '}
                <span className="font-bold text-blue-700">
                  {formatCurrency(Number(quantity) * Number(pricePerUnit))}
                </span>
              </p>
            </div>
          )}

          {/* Photo upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Chek rasmi</label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
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
              {photoFile && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <FileImage className="h-3 w-3 mr-1" />
                  {photoFile}
                </Badge>
              )}
            </div>
          </div>

          {/* Digital Signature */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Raqamli imzo</p>
                <p className="text-xs text-muted-foreground">
                  Kirimni tasdiqlash uchun imzo qo&#39;ying
                </p>
              </div>
              {!isSigned ? (
                <Button
                  onClick={handleSign}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                  disabled={!supplierId || !materialId || !quantity}
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Imzo qo&#39;yish
                </Button>
              ) : (
                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-700">{user?.fullName}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {signedAt && new Date(signedAt).toLocaleString('uz-UZ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!supplierId || !materialId || !quantity || !isSigned}
          >
            <ArrowDownToLine className="h-4 w-4 mr-2" />
            Kirimni ro&#39;yxatga olish
          </Button>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Kirim tarixi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sana</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Yetkazib beruvchi</TableHead>
                  <TableHead className="text-right">Miqdor</TableHead>
                  <TableHead>Qabul qildi</TableHead>
                  <TableHead>Imzo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell className="text-sm">{formatDate(mov.date)}</TableCell>
                    <TableCell className="font-medium">{mov.materialName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {mov.supplierName}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {mov.quantity} {mov.unit}
                    </TableCell>
                    <TableCell className="text-sm">{mov.processedByName}</TableCell>
                    <TableCell>
                      {mov.isSigned ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Imzolangan
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          Kutilmoqda
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
