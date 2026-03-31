'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell, CheckCheck, AlertTriangle, Info, AlertCircle, CheckCircle2,
  Trash2, Eye,
} from 'lucide-react';
import { mockNotifications } from '@/mock/notifications';
import { Notification, NotificationType } from '@/shared/types';
import { formatDateTime } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';

const typeConfig: Record<NotificationType, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  info: {
    icon: <Info className="h-4 w-4" />,
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
    label: 'Ma\'lumot',
  },
  warning: {
    icon: <AlertTriangle className="h-4 w-4" />,
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200',
    label: 'Ogohlantirish',
  },
  critical: {
    icon: <AlertCircle className="h-4 w-4" />,
    color: 'text-red-600',
    bg: 'bg-red-50 border-red-200',
    label: 'Muhim',
  },
  success: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'text-green-600',
    bg: 'bg-green-50 border-green-200',
    label: 'Muvaffaqiyat',
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(
    mockNotifications.filter((n) => n.recipientRole === 'ombor')
  );

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bildirishnomalar</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0
              ? `${unreadCount} ta o'qilmagan xabar`
              : 'Barcha xabarlar o\'qilgan'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Barchasini o&#39;qilgan deb belgilash
          </Button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {(['critical', 'warning', 'info', 'success'] as NotificationType[]).map((type) => {
          const count = notifications.filter((n) => n.type === type).length;
          const config = typeConfig[type];
          return (
            <Card key={type}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', config.bg)}>
                  <span className={config.color}>{config.icon}</span>
                </div>
                <div>
                  <p className="text-xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{config.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Barcha bildirishnomalar ({notifications.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sortedNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Bildirishnoma yo&#39;q</p>
            </div>
          ) : (
            sortedNotifications.map((notif) => {
              const config = typeConfig[notif.type];
              return (
                <div
                  key={notif.id}
                  className={cn(
                    'p-4 rounded-lg border transition-all',
                    config.bg,
                    !notif.isRead && 'ring-2 ring-offset-1',
                    notif.type === 'critical' && !notif.isRead && 'ring-red-300',
                    notif.type === 'warning' && !notif.isRead && 'ring-amber-300',
                    notif.type === 'info' && !notif.isRead && 'ring-blue-300',
                    notif.type === 'success' && !notif.isRead && 'ring-green-300'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn('mt-0.5', config.color)}>{config.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-sm">{notif.title}</h3>
                        {!notif.isRead && (
                          <Badge className="text-xs bg-blue-600">Yangi</Badge>
                        )}
                        <Badge variant="outline" className={cn('text-xs', config.bg)}>
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        {notif.senderName && <span>Yuboruvchi: {notif.senderName}</span>}
                        <span>{formatDateTime(notif.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {!notif.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notif.id)}
                          title="O'qilgan deb belgilash"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => deleteNotification(notif.id)}
                        title="O'chirish"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
