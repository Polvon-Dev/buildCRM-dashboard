'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { mockMaterialRequests } from '@/mock/requests';
import { mockMaterials } from '@/mock/materials';
import { MaterialRequest } from '@/shared/types';
import { formatDate, formatDateTime, getStatusColor, generateId } from '@/shared/lib/utils';
import {
  Plus, Package, Clock, CheckCircle2, XCircle, Truck,
  AlertTriangle, FileText,
} from 'lucide-react';

const PRORAB_ID = 'u2';
const PROJECT_ID = 'p1';

export default function ProrabMaterialsPage() {
  const [requests, setRequests] = useState<MaterialRequest[]>(
    mockMaterialRequests.filter((r) => r.requestedBy === PRORAB_ID)
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [newRequest, setNewRequest] = useState({
    materialId: '',
    quantity: '',
    urgency: 'normal' as 'normal' | 'urgent',
    comment: '',
  });

  const filteredRequests = activeTab === 'all'
    ? requests
    : requests.filter((r) => r.status === activeTab);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Kutilmoqda';
      case 'approved': return 'Tasdiqlangan';
      case 'rejected': return 'Rad etilgan';
      case 'delivered': return 'Yetkazilgan';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'delivered': return <Truck className="h-4 w-4 text-blue-500" />;
      default: return null;
    }
  };

  const handleCreateRequest = () => {
    if (!newRequest.materialId || !newRequest.quantity) return;
    const material = mockMaterials.find((m) => m.id === newRequest.materialId);
    if (!material) return;

    const request: MaterialRequest = {
      id: generateId(),
      materialId: newRequest.materialId,
      materialName: material.name,
      quantity: Number(newRequest.quantity),
      unit: material.unit,
      projectId: PROJECT_ID,
      requestedBy: PRORAB_ID,
      requestedByName: 'Karimov Botir',
      status: 'pending',
      urgency: newRequest.urgency,
      comment: newRequest.comment || undefined,
      createdAt: new Date().toISOString(),
    };
    setRequests([request, ...requests]);
    setNewRequest({ materialId: '', quantity: '', urgency: 'normal', comment: '' });
    setDialogOpen(false);
  };

  const getTabCount = (status: string) => {
    if (status === 'all') return requests.length;
    return requests.filter((r) => r.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Material so&apos;rovlari</h1>
          <p className="text-muted-foreground">Materiallarni so&apos;rash va kuzatish</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yangi so&apos;rov
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Yangi material so&apos;rovi</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Material</label>
                <Select
                  value={newRequest.materialId}
                  onValueChange={(v) => setNewRequest({ ...newRequest, materialId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Materialni tanlang" />
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
                    placeholder="Miqdorni kiriting"
                    value={newRequest.quantity}
                    onChange={(e) => setNewRequest({ ...newRequest, quantity: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Shoshilinchlik</label>
                  <Select
                    value={newRequest.urgency}
                    onValueChange={(v) => setNewRequest({ ...newRequest, urgency: v as 'normal' | 'urgent' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Oddiy</SelectItem>
                      <SelectItem value="urgent">Shoshilinch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Izoh</label>
                <Textarea
                  placeholder="Qo'shimcha ma'lumot..."
                  value={newRequest.comment}
                  onChange={(e) => setNewRequest({ ...newRequest, comment: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Bekor qilish</Button>
              <Button onClick={handleCreateRequest} disabled={!newRequest.materialId || !newRequest.quantity}>
                So&apos;rov yuborish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Kutilmoqda', count: getTabCount('pending'), color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Clock },
          { label: 'Tasdiqlangan', count: getTabCount('approved'), color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle2 },
          { label: 'Rad etilgan', count: getTabCount('rejected'), color: 'text-red-600', bg: 'bg-red-50', icon: XCircle },
          { label: 'Yetkazilgan', count: getTabCount('delivered'), color: 'text-blue-600', bg: 'bg-blue-50', icon: Truck },
        ].map((item) => (
          <Card key={item.label} className={item.bg}>
            <CardContent className="p-4 flex items-center gap-3">
              <item.icon className={`h-8 w-8 ${item.color}`} />
              <div>
                <p className="text-2xl font-bold">{item.count}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Barchasi ({getTabCount('all')})</TabsTrigger>
          <TabsTrigger value="pending">Kutilmoqda ({getTabCount('pending')})</TabsTrigger>
          <TabsTrigger value="approved">Tasdiqlangan ({getTabCount('approved')})</TabsTrigger>
          <TabsTrigger value="rejected">Rad etilgan ({getTabCount('rejected')})</TabsTrigger>
          <TabsTrigger value="delivered">Yetkazilgan ({getTabCount('delivered')})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Requests Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Miqdor</TableHead>
                <TableHead>Shoshilinchlik</TableHead>
                <TableHead>Holat</TableHead>
                <TableHead>Sana</TableHead>
                <TableHead>Izoh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    So&apos;rovlar topilmadi
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((req) => (
                  <TableRow key={req.id} className="hover:bg-accent/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{req.materialName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">{req.quantity} {req.unit}</span>
                    </TableCell>
                    <TableCell>
                      {req.urgency === 'urgent' ? (
                        <Badge variant="destructive" className="text-xs">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Shoshilinch
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Oddiy</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(req.status)} variant="secondary">
                        {getStatusIcon(req.status)}
                        <span className="ml-1">{getStatusLabel(req.status)}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDateTime(req.createdAt)}
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      {req.comment && (
                        <p className="text-xs text-muted-foreground truncate" title={req.comment}>
                          {req.comment}
                        </p>
                      )}
                      {req.rejectionReason && (
                        <p className="text-xs text-red-600 truncate" title={req.rejectionReason}>
                          Sabab: {req.rejectionReason}
                        </p>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Request History Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            So&apos;rovlar tarixi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((req, index) => (
                <div key={req.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      req.status === 'pending' ? 'bg-yellow-500' :
                      req.status === 'approved' ? 'bg-green-500' :
                      req.status === 'rejected' ? 'bg-red-500' : 'bg-blue-500'
                    }`} />
                    {index < requests.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{req.materialName}</span>
                      <Badge className={getStatusColor(req.status)} variant="secondary">
                        {getStatusLabel(req.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {req.quantity} {req.unit} &middot; {formatDateTime(req.createdAt)}
                    </p>
                    {req.comment && (
                      <p className="text-xs text-muted-foreground mt-1">{req.comment}</p>
                    )}
                    {req.approvedAt && (
                      <p className="text-xs text-green-600 mt-1">
                        Tasdiqlangan: {formatDateTime(req.approvedAt)}
                      </p>
                    )}
                    {req.rejectionReason && (
                      <p className="text-xs text-red-600 mt-1">
                        Rad etildi: {req.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
