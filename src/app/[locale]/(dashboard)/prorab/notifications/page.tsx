'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockNotifications } from '@/mock/notifications';
import { Notification, NotificationType } from '@/shared/types';
import { formatDateTime } from '@/shared/lib/utils';
import {
  Bell, AlertTriangle, Info, CheckCircle2, Eye, EyeOff,
  Filter, CheckCheck, Trash2,
} from 'lucide-react';

const PRORAB_ID = 'u2';

export default function ProrabNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(
    mockNotifications.filter((n) => n.recipientId === PRORAB_ID)
  );
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifications = activeTab === 'all'
    ? notifications
    : activeTab === 'unread'
    ? notifications.filter((n) => !n.isRead)
    : notifications.filter((n) => n.type === activeTab);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getTypeBadge = (type: NotificationType) => {
    switch (type) {
      case 'critical':
        return <Badge variant="destructive" className="text-xs">Muhim</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800 text-xs" variant="secondary">Ogohlantirish</Badge>;
      case 'success':
        return <Badge className="bg-green-100 text-green-800 text-xs" variant="secondary">Muvaffaqiyat</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800 text-xs" variant="secondary">Ma&apos;lumot</Badge>;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      material_request: 'Material so\'rov',
      norm_violation: 'Normativ buzilishi',
      inventory_discrepancy: 'Inventarizatsiya',
      gps_mismatch: 'GPS nomuvofiqlik',
      salary_mismatch: 'Oylik nomuvofiqlik',
      daily_report: 'Kundalik hisobot',
      low_stock: 'Kam material',
      auction: 'Auktsion',
      attendance: 'Davomat',
      user_blocked: 'Bloklash',
      comment: 'Izoh',
      rating: 'Baholash',
      general: 'Umumiy',
    };
    return labels[category] || category;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bildirishnomalar</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} ta o'qilmagan xabar` : "Barcha xabarlar o'qilgan"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCheck className="h-4 w-4 mr-2" />
            Barchasini o&apos;qilgan deb belgilash
          </Button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => setActiveTab('all')}>
          <CardContent className="p-4 flex items-center gap-3">
            <Bell className="h-8 w-8 text-gray-600" />
            <div>
              <p className="text-2xl font-bold">{notifications.length}</p>
              <p className="text-xs text-muted-foreground">Jami</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => setActiveTab('critical')}>
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-2xl font-bold">
                {notifications.filter((n) => n.type === 'critical').length}
              </p>
              <p className="text-xs text-muted-foreground">Muhim</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => setActiveTab('warning')}>
          <CardContent className="p-4 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">
                {notifications.filter((n) => n.type === 'warning').length}
              </p>
              <p className="text-xs text-muted-foreground">Ogohlantirish</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-all" onClick={() => setActiveTab('info')}>
          <CardContent className="p-4 flex items-center gap-3">
            <Info className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">
                {notifications.filter((n) => n.type === 'info').length}
              </p>
              <p className="text-xs text-muted-foreground">Ma&apos;lumot</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Barchasi</TabsTrigger>
          <TabsTrigger value="unread">
            O&apos;qilmagan
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-1.5 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="critical">Muhim</TabsTrigger>
          <TabsTrigger value="warning">Ogohlantirish</TabsTrigger>
          <TabsTrigger value="info">Ma&apos;lumot</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Notifications List */}
      <div className="space-y-2">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>Bildirishnomalar topilmadi</p>
            </CardContent>
          </Card>
        ) : (
          filteredNotifications
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all duration-200 hover:shadow-md ${
                  notification.isRead
                    ? 'bg-card'
                    : 'bg-blue-50/50 border-blue-200 shadow-sm'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 mt-0.5">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className={`text-sm ${notification.isRead ? 'font-medium' : 'font-bold'}`}>
                          {notification.title}
                        </h3>
                        {getTypeBadge(notification.type)}
                        <Badge variant="outline" className="text-xs">
                          {getCategoryLabel(notification.category)}
                        </Badge>
                        {!notification.isRead && (
                          <div className="h-2 w-2 rounded-full bg-blue-500" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(notification.createdAt)}
                        </span>
                        {notification.senderName && (
                          <span className="text-xs text-muted-foreground">
                            Kimdan: {notification.senderName}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0">
                      {!notification.isRead && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          O&apos;qildi
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  );
}
