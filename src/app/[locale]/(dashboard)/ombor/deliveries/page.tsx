'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Truck, Clock, CheckCircle2, XCircle, Package, ArrowRight, CalendarClock,
} from 'lucide-react';
import { mockDeliveries } from '@/mock/deliveries';
import { Delivery, DeliveryStatus } from '@/shared/types';
import { formatDate } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

const statusLabels: Record<DeliveryStatus, string> = {
  pending: 'Kutilmoqda',
  in_transit: "Yo'lda",
  delivered: 'Yetkazildi',
  cancelled: 'Bekor qilindi',
};

const statusColors: Record<DeliveryStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  in_transit: 'bg-blue-100 text-blue-800 border-blue-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-gray-100 text-gray-800 border-gray-200',
};

const statusIcons: Record<DeliveryStatus, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  in_transit: <Truck className="h-4 w-4" />,
  delivered: <CheckCircle2 className="h-4 w-4" />,
  cancelled: <XCircle className="h-4 w-4" />,
};

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries);

  const updateStatus = (id: string, newStatus: DeliveryStatus) => {
    setDeliveries((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: newStatus,
              actualDate:
                newStatus === 'delivered'
                  ? new Date().toISOString().split('T')[0]
                  : d.actualDate,
            }
          : d
      )
    );
  };

  const getNextStatusActions = (status: DeliveryStatus) => {
    switch (status) {
      case 'pending':
        return [
          { label: "Yo'lga chiqdi", status: 'in_transit' as DeliveryStatus, variant: 'default' as const },
          { label: 'Bekor qilish', status: 'cancelled' as DeliveryStatus, variant: 'destructive' as const },
        ];
      case 'in_transit':
        return [
          { label: 'Yetkazildi', status: 'delivered' as DeliveryStatus, variant: 'default' as const },
          { label: 'Bekor qilish', status: 'cancelled' as DeliveryStatus, variant: 'destructive' as const },
        ];
      default:
        return [];
    }
  };

  const isLate = (delivery: Delivery) => {
    if (delivery.status === 'delivered' && delivery.actualDate) {
      return new Date(delivery.actualDate) > new Date(delivery.expectedDate);
    }
    if (delivery.status !== 'delivered' && delivery.status !== 'cancelled') {
      return new Date() > new Date(delivery.expectedDate);
    }
    return false;
  };

  // Group by status
  const grouped: Record<DeliveryStatus, Delivery[]> = {
    pending: deliveries.filter((d) => d.status === 'pending'),
    in_transit: deliveries.filter((d) => d.status === 'in_transit'),
    delivered: deliveries.filter((d) => d.status === 'delivered'),
    cancelled: deliveries.filter((d) => d.status === 'cancelled'),
  };

  const statusOrder: DeliveryStatus[] = ['in_transit', 'pending', 'delivered', 'cancelled'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Yetkazib berishlar</h1>
        <p className="text-muted-foreground">Materiallar yetkazib berish holati</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statusOrder.map((status) => (
          <Card key={status}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn('p-2 rounded-lg', statusColors[status])}>
                {statusIcons[status]}
              </div>
              <div>
                <p className="text-2xl font-bold">{grouped[status].length}</p>
                <p className="text-xs text-muted-foreground">{statusLabels[status]}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Deliveries List */}
      {statusOrder.map((status) => {
        const items = grouped[status];
        if (items.length === 0) return null;

        return (
          <Card key={status}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {statusIcons[status]}
                {statusLabels[status]}
                <Badge variant="outline" className={cn('text-xs', statusColors[status])}>
                  {items.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((delivery) => {
                const late = isLate(delivery);
                const actions = getNextStatusActions(delivery.status);

                return (
                  <div
                    key={delivery.id}
                    className={cn(
                      'p-4 rounded-lg border transition-colors',
                      late && 'border-red-200 bg-red-50'
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{delivery.supplierName}</h3>
                          <Badge
                            variant="outline"
                            className={cn('text-xs', statusColors[delivery.status])}
                          >
                            {statusLabels[delivery.status]}
                          </Badge>
                          {late && (
                            <Badge variant="destructive" className="text-xs">
                              Kechikkan
                            </Badge>
                          )}
                        </div>

                        {/* Materials */}
                        <div className="mt-2 flex flex-wrap gap-2">
                          {delivery.materials.map((mat, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs bg-muted">
                              <Package className="h-3 w-3 mr-1" />
                              {mat.materialName} — {mat.quantity} {mat.unit}
                            </Badge>
                          ))}
                        </div>

                        {/* Dates */}
                        <div className="mt-3 flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <CalendarClock className="h-3.5 w-3.5" />
                            Kutilgan: {formatDate(delivery.expectedDate)}
                          </div>
                          {delivery.actualDate && (
                            <>
                              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                              <div
                                className={cn(
                                  'flex items-center gap-1',
                                  late ? 'text-red-600' : 'text-green-600'
                                )}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Haqiqiy: {formatDate(delivery.actualDate)}
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      {actions.length > 0 && (
                        <div className="flex flex-col gap-2">
                          {actions.map((action) => (
                            <Button
                              key={action.status}
                              size="sm"
                              variant={action.variant}
                              onClick={() => updateStatus(delivery.id, action.status)}
                            >
                              {action.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
