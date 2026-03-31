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
  ArrowUpFromLine, CheckCircle2, Clock, ShieldCheck, Users2,
} from 'lucide-react';
import { mockMaterials } from '@/mock/materials';
import { mockProjects } from '@/mock/projects';
import { mockUsers } from '@/mock/users';
import { mockInventoryMovements } from '@/mock/movements';
import { InventoryMovement } from '@/shared/types';
import { formatDate, generateId } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/model/authStore';

export default function OutgoingPage() {
  const { user } = useAuthStore();
  const [movements, setMovements] = useState<InventoryMovement[]>(
    mockInventoryMovements.filter((m) => m.type === 'outgoing')
  );

  const [materialId, setMaterialId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [projectId, setProjectId] = useState('');
  const [prorabId, setProrabId] = useState('');

  // Dual signature state
  const [omborSigned, setOmborSigned] = useState(false);
  const [omborSignedAt, setOmborSignedAt] = useState<string | null>(null);
  const [prorabSigned, setProrabSigned] = useState(false);
  const [prorabSignedAt, setProrabSignedAt] = useState<string | null>(null);

  const selectedMaterial = mockMaterials.find((m) => m.id === materialId);
  const prорабs = mockUsers.filter((u) => u.role === 'prorab' && u.status === 'active');
  const selectedProrab = mockUsers.find((u) => u.id === prorabId);
  const activeProjects = mockProjects.filter((p) => p.status === 'active');

  const handleOmborSign = () => {
    if (!user) return;
    setOmborSigned(true);
    setOmborSignedAt(new Date().toISOString());
  };

  const handleProrabSign = () => {
    setProrabSigned(true);
    setProrabSignedAt(new Date().toISOString());
  };

  const handleSubmit = () => {
    if (!materialId || !quantity || !projectId || !prorabId || !omborSigned || !prorabSigned) return;

    const material = mockMaterials.find((m) => m.id === materialId);
    const prorab = mockUsers.find((u) => u.id === prorabId);
    if (!material || !prorab) return;

    const newMovement: InventoryMovement = {
      id: generateId(),
      type: 'outgoing',
      materialId,
      materialName: material.name,
      quantity: Number(quantity),
      unit: material.unit,
      projectId,
      receivedBy: prorab.fullName,
      processedBy: user?.id || '',
      processedByName: user?.fullName || '',
      isSigned: true,
      signedBy: [user?.fullName || '', prorab.fullName],
      date: new Date().toISOString().split('T')[0],
    };

    setMovements([newMovement, ...movements]);
    setMaterialId('');
    setQuantity('');
    setProjectId('');
    setProrabId('');
    setOmborSigned(false);
    setOmborSignedAt(null);
    setProrabSigned(false);
    setProrabSignedAt(null);
  };

  const isFormValid = materialId && quantity && projectId && prorabId;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Material chiqim</h1>
        <p className="text-muted-foreground">Ombordan material chiqarish</p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowUpFromLine className="h-4 w-4 text-orange-600" />
            Yangi chiqim
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Material</label>
              <Select value={materialId} onValueChange={setMaterialId}>
                <SelectTrigger>
                  <SelectValue placeholder="Material tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {mockMaterials.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name} — {m.quantity} {m.unit} mavjud
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Miqdor</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder={selectedMaterial ? `Miqdor (${selectedMaterial.unit})` : 'Miqdor'}
              />
              {selectedMaterial && Number(quantity) > selectedMaterial.quantity && (
                <p className="text-xs text-red-500">
                  Omborda faqat {selectedMaterial.quantity} {selectedMaterial.unit} mavjud!
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Loyiha</label>
              <Select value={projectId} onValueChange={setProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Loyiha tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {activeProjects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Qabul qiluvchi prorab</label>
              <Select value={prorabId} onValueChange={setProrabId}>
                <SelectTrigger>
                  <SelectValue placeholder="Prorab tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {prорабs.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* DUAL Signature Section */}
          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Users2 className="h-4 w-4 text-blue-600" />
              <p className="text-sm font-medium">Ikki tomonlama imzo</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ombor Mudiri Signature */}
              <div
                className={cn(
                  'p-4 rounded-lg border-2 transition-colors',
                  omborSigned
                    ? 'border-green-300 bg-green-50'
                    : 'border-dashed border-gray-300'
                )}
              >
                <p className="text-sm font-medium mb-2">Ombor mudiri imzosi</p>
                {!omborSigned ? (
                  <Button
                    onClick={handleOmborSign}
                    variant="outline"
                    className="w-full border-green-300 text-green-700 hover:bg-green-50"
                    disabled={!isFormValid}
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Imzo qo&#39;yish
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-700">{user?.fullName}</p>
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {omborSignedAt && new Date(omborSignedAt).toLocaleString('uz-UZ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Prorab Signature */}
              <div
                className={cn(
                  'p-4 rounded-lg border-2 transition-colors',
                  prorabSigned
                    ? 'border-green-300 bg-green-50'
                    : 'border-dashed border-gray-300'
                )}
              >
                <p className="text-sm font-medium mb-2">Prorab imzosi</p>
                {!prorabSigned ? (
                  <Button
                    onClick={handleProrabSign}
                    variant="outline"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                    disabled={!omborSigned}
                  >
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Prorab imzo qo&#39;yadi
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        {selectedProrab?.fullName}
                      </p>
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {prorabSignedAt && new Date(prorabSignedAt).toLocaleString('uz-UZ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!isFormValid || !omborSigned || !prorabSigned}
          >
            <ArrowUpFromLine className="h-4 w-4 mr-2" />
            Chiqimni ro&#39;yxatga olish
          </Button>
        </CardContent>
      </Card>

      {/* History */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Chiqim tarixi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sana</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead className="text-right">Miqdor</TableHead>
                  <TableHead>Qabul qildi</TableHead>
                  <TableHead>Berdi</TableHead>
                  <TableHead>Imzolar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movements.map((mov) => (
                  <TableRow key={mov.id}>
                    <TableCell className="text-sm">{formatDate(mov.date)}</TableCell>
                    <TableCell className="font-medium">{mov.materialName}</TableCell>
                    <TableCell className="text-right font-medium">
                      {mov.quantity} {mov.unit}
                    </TableCell>
                    <TableCell className="text-sm">{mov.receivedBy}</TableCell>
                    <TableCell className="text-sm">{mov.processedByName}</TableCell>
                    <TableCell>
                      {mov.isSigned && mov.signedBy && mov.signedBy.length >= 2 ? (
                        <div className="flex flex-col gap-1">
                          {mov.signedBy.map((name, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-green-50 text-green-700 text-xs w-fit"
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {name}
                            </Badge>
                          ))}
                        </div>
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
