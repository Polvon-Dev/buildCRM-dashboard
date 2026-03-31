'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Bell, BellOff, CheckCheck, AlertTriangle, Info,
  AlertOctagon, CheckCircle, Filter, Trash2, Eye,
} from 'lucide-react';
import { mockNotifications } from '@/mock/notifications';
import { Notification, NotificationType, NotificationCategory } from '@/shared/types';
import { formatDateTime } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

const typeConfig: Record<NotificationType, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  critical: { icon: AlertOctagon, color: 'text-red-600', bg: 'bg-red-50', border: 'border-l-red-500' },
  warning: { icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-l-orange-500' },
  info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-l-blue-500' },
  success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-l-green-500' },
};

const typeLabels: Record<NotificationType, string> = {
  critical: 'Muhim', warning: 'Ogohlantirish', info: 'Ma\'lumot', success: 'Muvaffaqiyat',
};

const categoryLabels: Record<string, string> = {
  material_request: 'Material so\'rov',
  norm_violation: 'Normativ buzilish',
  inventory_discrepancy: 'Inventar farq',
  gps_mismatch: 'GPS nomuvofiqliq',
  salary_mismatch: 'Oylik farq',
  daily_report: 'Kundalik hisobot',
  low_stock: 'Kam zahira',
  auction: 'Auktsion',
  attendance: 'Davomat',
  user_blocked: 'Bloklash',
  comment: 'Izoh',
  rating: 'Baho',
  general: 'Umumiy',
};

export default function RahbarNotificationsPage() {
  // Filter only rahbar notifications
  const rahbarNotifications = mockNotifications.filter((n) => n.recipientRole === 'rahbar');
  const [notifications, setNotifications] = useState<Notification[]>(rahbarNotifications);
  const [filterType, setFilterType] = useState<NotificationType | 'all'>('all');

  const filtered = filterType === 'all'
    ? notifications
    : notifications.filter((n) => n.type === filterType);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const criticalCount = notifications.filter((n) => n.type === 'critical' && !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bildirishnomalar</h1>
          <p className="text-muted-foreground">
            {unreadCount} ta o&apos;qilmagan{criticalCount > 0 ? `, ${criticalCount} ta muhim` : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
            <CheckCheck className="h-4 w-4 mr-2" /> Barchasini o&apos;qish
          </Button>
        </div>
      </div>

      {/* Critical Alert Banner */}
      {criticalCount > 0 && (
        <Card className="border-red-300 bg-red-50 shadow-lg shadow-red-100/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
                <AlertOctagon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="font-bold text-red-800">{criticalCount} ta muhim ogohlantirish!</p>
                <p className="text-sm text-red-600">Zudlik bilan e&apos;tibor talab qiladi</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
              onClick={() => setFilterType('all')}
            >
              Barchasi ({notifications.length})
            </Button>
            {(['critical', 'warning', 'info', 'success'] as NotificationType[]).map((type) => {
              const config = typeConfig[type];
              const count = notifications.filter((n) => n.type === type).length;
              if (count === 0) return null;
              return (
                <Button
                  key={type}
                  variant={filterType === type ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs"
                  onClick={() => setFilterType(type)}
                >
                  {typeLabels[type]} ({count})
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">Bildirishnomalar yo&apos;q</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((notif) => {
            const config = typeConfig[notif.type];
            const Icon = config.icon;
            return (
              <Card
                key={notif.id}
                className={cn(
                  'border-l-4 transition-all hover:shadow-md cursor-pointer',
                  config.border,
                  !notif.isRead && config.bg,
                  notif.isRead && 'opacity-70',
                )}
                onClick={() => markAsRead(notif.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center shrink-0',
                      config.bg,
                    )}>
                      <Icon className={cn('h-5 w-5', config.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className={cn(
                            'text-sm',
                            !notif.isRead ? 'font-bold' : 'font-medium'
                          )}>
                            {notif.title}
                          </h3>
                          <Badge variant="outline" className={cn('text-xs', config.bg, config.color, 'border-0')}>
                            {typeLabels[notif.type]}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {categoryLabels[notif.category] || notif.category}
                          </Badge>
                          {!notif.isRead && (
                            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 shrink-0 text-muted-foreground hover:text-red-600"
                          onClick={(e) => { e.stopPropagation(); deleteNotification(notif.id); }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{notif.message}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        {notif.senderName && <span>Kimdan: {notif.senderName}</span>}
                        <span>{formatDateTime(notif.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
