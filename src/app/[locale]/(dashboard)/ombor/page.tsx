'use client';

import { StatsGrid, StatCard } from '@/widgets/stats-cards/ui/StatsGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Package, DollarSign, TrendingUp, TrendingDown,
  AlertTriangle, ClipboardList, ChevronRight, Clock,
  ArrowDownToLine, ArrowUpFromLine,
} from 'lucide-react';
import { mockMaterials } from '@/mock/materials';
import { mockMaterialRequests } from '@/mock/requests';
import { mockInventoryMovements } from '@/mock/movements';
import { mockNotifications } from '@/mock/notifications';
import { formatCurrency, formatDate, getStatusColor } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/model/authStore';
import Link from 'next/link';

export default function OmborDashboard() {
  const { user } = useAuthStore();

  const totalMaterials = mockMaterials.length;
  const totalValue = mockMaterials.reduce((sum, m) => sum + m.totalValue, 0);
  const lowStockItems = mockMaterials.filter((m) => m.quantity <= m.minQuantity);
  const pendingRequests = mockMaterialRequests.filter((r) => r.status === 'pending');

  const todayIncoming = mockInventoryMovements.filter(
    (m) => m.type === 'incoming' && m.date === '2026-03-31'
  );
  const todayOutgoing = mockInventoryMovements.filter(
    (m) => m.type === 'outgoing' && m.date === '2026-03-31'
  );

  const todayIncomingQty = todayIncoming.reduce((sum, m) => sum + m.quantity, 0);
  const todayOutgoingQty = todayOutgoing.reduce((sum, m) => sum + m.quantity, 0);

  const stats: StatCard[] = [
    {
      title: 'Jami materiallar',
      value: totalMaterials,
      icon: 'Package',
      color: 'blue',
      change: { value: 2, label: "yangi qo'shildi" },
    },
    {
      title: 'Umumiy qiymat',
      value: formatCurrency(totalValue),
      icon: 'DollarSign',
      color: 'green',
    },
    {
      title: 'Bugungi kirim',
      value: `${todayIncomingQty} ta`,
      icon: 'TrendingUp',
      color: 'purple',
    },
    {
      title: 'Bugungi chiqim',
      value: `${todayOutgoingQty} ta`,
      icon: 'TrendingDown',
      color: 'orange',
    },
    {
      title: "Kutilayotgan so'rovlar",
      value: pendingRequests.length,
      icon: 'ClipboardList',
      color: 'yellow',
    },
  ];

  const recentMovements = mockInventoryMovements
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  const omborNotifications = mockNotifications.filter(
    (n) => n.recipientRole === 'ombor' && !n.isRead
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Ombor boshqaruv paneli</h1>
        <p className="text-muted-foreground">
          Xush kelibsiz, {user?.fullName || 'Ombor mudiri'}
        </p>
      </div>

      {/* Stats */}
      <StatsGrid stats={stats} />

      {/* Low Stock Warnings & Pending Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Warnings */}
        <Card className="border-red-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Kam qolgan materiallar
                <Badge variant="destructive">{lowStockItems.length}</Badge>
              </CardTitle>
              <Link href="/uz/ombor/low-stock">
                <Button variant="ghost" size="sm">
                  Batafsil <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {lowStockItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Barcha materiallar yetarli
              </p>
            ) : (
              lowStockItems.map((material) => (
                <div
                  key={material.id}
                  className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100"
                >
                  <div>
                    <p className="text-sm font-medium">{material.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Minimum: {material.minQuantity} {material.unit}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-red-600">
                      {material.quantity} {material.unit}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card className="border-yellow-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-yellow-600" />
                Kutilayotgan so&#39;rovlar
                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                  {pendingRequests.length}
                </Badge>
              </CardTitle>
              <Link href="/uz/ombor/requests">
                <Button variant="ghost" size="sm">
                  Batafsil <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingRequests.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Kutilayotgan so&#39;rov yo&#39;q
              </p>
            ) : (
              pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className={cn(
                    'flex items-center justify-between p-3 rounded-lg border',
                    req.urgency === 'urgent'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-yellow-50 border-yellow-100'
                  )}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{req.materialName}</p>
                      {req.urgency === 'urgent' && (
                        <Badge variant="destructive" className="text-xs">
                          Tezkor
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {req.requestedByName} — {req.quantity} {req.unit}
                    </p>
                  </div>
                  <Badge variant="outline" className={getStatusColor('pending')}>
                    Kutilmoqda
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Movements */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Package className="h-4 w-4" />
              Oxirgi harakatlar
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentMovements.map((movement) => (
              <div
                key={movement.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div
                  className={cn(
                    'p-2 rounded-lg',
                    movement.type === 'incoming'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  )}
                >
                  {movement.type === 'incoming' ? (
                    <ArrowDownToLine className="h-4 w-4" />
                  ) : (
                    <ArrowUpFromLine className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{movement.materialName}</p>
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs',
                        movement.type === 'incoming'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-orange-50 text-orange-700'
                      )}
                    >
                      {movement.type === 'incoming' ? 'Kirim' : 'Chiqim'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {movement.quantity} {movement.unit}
                    {movement.supplierName && ` — ${movement.supplierName}`}
                    {movement.receivedBy && ` — ${movement.receivedBy}`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(movement.date)}
                  </p>
                  {movement.isSigned && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 mt-1">
                      Imzolangan
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Unread Notifications */}
      {omborNotifications.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                O&#39;qilmagan bildirishnomalar
                <Badge variant="outline" className="bg-amber-100 text-amber-800">
                  {omborNotifications.length}
                </Badge>
              </CardTitle>
              <Link href="/uz/ombor/notifications">
                <Button variant="ghost" size="sm">
                  Hammasi <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {omborNotifications.map((notif) => (
              <div
                key={notif.id}
                className={cn(
                  'p-3 rounded-lg border',
                  notif.type === 'critical'
                    ? 'bg-red-50 border-red-200'
                    : notif.type === 'warning'
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-blue-50 border-blue-200'
                )}
              >
                <p className="text-sm font-medium">{notif.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{notif.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
