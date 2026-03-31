'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ShieldAlert, MapPin, DollarSign, Eye, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Notification } from '@/shared/types';

interface AlertPanelProps {
  alerts: Notification[];
  onViewAll?: () => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  norm_violation: ShieldAlert,
  inventory_discrepancy: AlertTriangle,
  gps_mismatch: MapPin,
  salary_mismatch: DollarSign,
};

const categoryColors: Record<string, string> = {
  norm_violation: 'border-l-red-500 bg-red-50',
  inventory_discrepancy: 'border-l-orange-500 bg-orange-50',
  gps_mismatch: 'border-l-yellow-500 bg-yellow-50',
  salary_mismatch: 'border-l-purple-500 bg-purple-50',
};

export function AlertPanel({ alerts, onViewAll }: AlertPanelProps) {
  const criticalAlerts = alerts.filter((a) => a.type === 'critical');

  if (criticalAlerts.length === 0) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="p-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <ShieldAlert className="h-6 w-6 text-green-600" />
          </div>
          <p className="font-semibold text-green-800">Hamma narsa tartibda!</p>
          <p className="text-sm text-green-600 mt-1">Hozircha muhim ogohlantirishlar yo&apos;q</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-red-200 shadow-lg shadow-red-100/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100">
              <AlertTriangle className="h-4.5 w-4.5 text-red-600" />
            </div>
            <CardTitle className="text-lg text-red-800">
              Muhim ogohlantirishlar
            </CardTitle>
            <Badge variant="destructive" className="animate-pulse">
              {criticalAlerts.length}
            </Badge>
          </div>
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll} className="text-red-600 hover:text-red-800">
              Barchasini ko&apos;rish <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {criticalAlerts.map((alert) => {
          const Icon = categoryIcons[alert.category] || AlertTriangle;
          return (
            <div
              key={alert.id}
              className={cn(
                'flex items-start gap-3 rounded-lg border-l-4 p-4 transition-all hover:shadow-md cursor-pointer',
                categoryColors[alert.category] || 'border-l-red-500 bg-red-50'
              )}
            >
              <div className="mt-0.5">
                <Icon className="h-5 w-5 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{alert.title}</p>
                <p className="text-sm text-gray-600 mt-0.5">{alert.message}</p>
                <p className="text-xs text-gray-400 mt-1.5">
                  {new Date(alert.createdAt).toLocaleString('uz-UZ')}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="shrink-0">
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
