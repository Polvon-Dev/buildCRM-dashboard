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
import { Package, Plus, Search, Pencil, AlertTriangle } from 'lucide-react';
import { mockMaterials } from '@/mock/materials';
import { Material, MaterialCategory, MaterialUnit } from '@/shared/types';
import { formatCurrency } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';
import { generateId } from '@/shared/lib/utils';

const categoryLabels: Record<MaterialCategory, string> = {
  cement: 'Sement',
  metal: 'Metall',
  wood: "Yog'och",
  brick: "G'isht",
  sand: 'Qum/Shag\'al',
  electrical: 'Elektr',
  plumbing: 'Santexnika',
  paint: "Bo'yoq",
  insulation: 'Izolyatsiya',
  other: 'Boshqa',
};

const unitLabels: Record<MaterialUnit, string> = {
  kg: 'kg',
  tonna: 'tonna',
  metr: 'metr',
  m2: 'm\u00B2',
  m3: 'm\u00B3',
  dona: 'dona',
  litr: 'litr',
  paket: 'paket',
  rulon: 'rulon',
};

const allCategories: MaterialCategory[] = [
  'cement', 'metal', 'wood', 'brick', 'sand', 'electrical', 'plumbing', 'paint', 'insulation', 'other',
];
const allUnits: MaterialUnit[] = ['kg', 'tonna', 'metr', 'm2', 'm3', 'dona', 'litr', 'paket', 'rulon'];

interface MaterialFormData {
  name: string;
  category: MaterialCategory;
  unit: MaterialUnit;
  quantity: number;
  minQuantity: number;
  pricePerUnit: number;
}

const emptyForm: MaterialFormData = {
  name: '',
  category: 'cement',
  unit: 'tonna',
  quantity: 0,
  minQuantity: 0,
  pricePerUnit: 0,
};

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<MaterialFormData>(emptyForm);

  const filtered = materials.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleOpenEdit = (material: Material) => {
    setEditingId(material.id);
    setForm({
      name: material.name,
      category: material.category,
      unit: material.unit,
      quantity: material.quantity,
      minQuantity: material.minQuantity,
      pricePerUnit: material.pricePerUnit,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;

    if (editingId) {
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === editingId
            ? {
                ...m,
                ...form,
                totalValue: form.quantity * form.pricePerUnit,
                lastUpdated: new Date().toISOString().split('T')[0],
              }
            : m
        )
      );
    } else {
      const newMaterial: Material = {
        id: generateId(),
        ...form,
        totalValue: form.quantity * form.pricePerUnit,
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      setMaterials((prev) => [...prev, newMaterial]);
    }
    setDialogOpen(false);
    setForm(emptyForm);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Materiallar</h1>
          <p className="text-muted-foreground">Ombordagi barcha materiallar ro&#39;yxati</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleOpenAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Yangi material
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingId ? 'Materialni tahrirlash' : "Yangi material qo'shish"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nomi</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Material nomi"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kategoriya</label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => setForm({ ...form, category: v as MaterialCategory })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {categoryLabels[c]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Birlik</label>
                  <Select
                    value={form.unit}
                    onValueChange={(v) => setForm({ ...form, unit: v as MaterialUnit })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {allUnits.map((u) => (
                        <SelectItem key={u} value={u}>
                          {unitLabels[u]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Miqdor</label>
                  <Input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum miqdor</label>
                  <Input
                    type="number"
                    value={form.minQuantity}
                    onChange={(e) => setForm({ ...form, minQuantity: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Narxi (birlik uchun)</label>
                <Input
                  type="number"
                  value={form.pricePerUnit}
                  onChange={(e) => setForm({ ...form, pricePerUnit: Number(e.target.value) })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Bekor qilish
              </Button>
              <Button onClick={handleSave}>
                {editingId ? 'Saqlash' : "Qo'shish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Material qidirish..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Kategoriya" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha kategoriyalar</SelectItem>
                {allCategories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {categoryLabels[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Package className="h-4 w-4" />
            Materiallar ro&#39;yxati ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomi</TableHead>
                  <TableHead>Kategoriya</TableHead>
                  <TableHead className="text-right">Miqdor</TableHead>
                  <TableHead>Birlik</TableHead>
                  <TableHead className="text-right">Min. miqdor</TableHead>
                  <TableHead className="text-right">Narxi</TableHead>
                  <TableHead className="text-right">Umumiy qiymat</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((material) => {
                  const isLow = material.quantity <= material.minQuantity;
                  return (
                    <TableRow
                      key={material.id}
                      className={cn(isLow && 'bg-red-50 hover:bg-red-100')}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{material.name}</span>
                          {isLow && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {categoryLabels[material.category]}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className={cn(
                          'text-right font-medium',
                          isLow ? 'text-red-600' : ''
                        )}
                      >
                        {material.quantity.toLocaleString()}
                      </TableCell>
                      <TableCell>{unitLabels[material.unit]}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {material.minQuantity.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(material.pricePerUnit)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(material.totalValue)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEdit(material)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
