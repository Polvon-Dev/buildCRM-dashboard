'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Activity, FileText, CheckCircle, MessageSquare, CalendarCheck,
  Package, Search, ShieldAlert, Gavel, Star, Truck, Filter,
} from 'lucide-react';
import { mockActivityLogs } from '@/mock/activity';
import { UserRole, ActivityLog } from '@/shared/types';
import { formatDateTime, getInitials } from '@/shared/lib/utils';
import { cn } from '@/lib/utils';
import { ROLE_COLORS } from '@/shared/config/roles';

const actionConfig: Record<string, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  report_created: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100', label: 'Hisobot yaratildi' },
  request_approved: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100', label: 'Tasdiqlandi' },
  comment_added: { icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-100', label: 'Izoh qo\'shildi' },
  attendance_marked: { icon: CalendarCheck, color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Davomat belgilandi' },
  material_requested: { icon: Package, color: 'text-amber-600', bg: 'bg-amber-100', label: 'Material so\'raldi' },
  inventory_check: { icon: Search, color: 'text-orange-600', bg: 'bg-orange-100', label: 'Inventarizatsiya' },
  user_blocked: { icon: ShieldAlert, color: 'text-red-600', bg: 'bg-red-100', label: 'Foydalanuvchi bloklandi' },
  auction_approved: { icon: Gavel, color: 'text-teal-600', bg: 'bg-teal-100', label: 'Auktsion tasdiqlandi' },
  rating_added: { icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Baho qo\'yildi' },
  material_incoming: { icon: Truck, color: 'text-cyan-600', bg: 'bg-cyan-100', label: 'Material qabul qilindi' },
};

const roleLabels: Record<UserRole, string> = {
  rahbar: 'Rahbar',
  prorab: 'Prorab',
  ombor: 'Ombor',
  admin: 'Admin',
};

export default function AdminActivityPage() {
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');

  const filtered = filterRole === 'all'
    ? mockActivityLogs
    : mockActivityLogs.filter((log) => log.userRole === filterRole);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Faoliyat jurnali</h1>
        <p className="text-muted-foreground">Tizimda amalga oshirilgan barcha harakatlar</p>
      </div>

      {/* Role Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" /> Rol bo&apos;yicha:
            </div>
            <Button
              variant={filterRole === 'all' ? 'default' : 'outline'}
              size="sm"
              className="text-xs"
              onClick={() => setFilterRole('all')}
            >
              Barchasi ({mockActivityLogs.length})
            </Button>
            {(['rahbar', 'prorab', 'ombor', 'admin'] as UserRole[]).map((role) => {
              const count = mockActivityLogs.filter((l) => l.userRole === role).length;
              return (
                <Button
                  key={role}
                  variant={filterRole === role ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs"
                  onClick={() => setFilterRole(role)}
                >
                  {roleLabels[role]} ({count})
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Faoliyat ({filtered.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-gray-200 to-transparent" />

            <div className="space-y-1">
              {filtered.map((log) => {
                const config = actionConfig[log.action] || {
                  icon: Activity, color: 'text-gray-600', bg: 'bg-gray-100', label: log.action,
                };
                const Icon = config.icon;

                return (
                  <div key={log.id} className="flex gap-4 relative pl-0 py-3 group">
                    {/* Timeline dot */}
                    <div className={cn(
                      'relative z-10 h-10 w-10 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white transition-transform group-hover:scale-110',
                      config.bg,
                    )}>
                      <Icon className={cn('h-4.5 w-4.5', config.color)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px] bg-gray-200">
                              {getInitials(log.userName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-semibold">{log.userName}</span>
                          <Badge variant="outline" className={cn('text-xs px-1.5 py-0', ROLE_COLORS[log.userRole])}>
                            {roleLabels[log.userRole]}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{formatDateTime(log.createdAt)}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Badge className={cn('text-xs', config.bg, config.color, 'border-0 hover:opacity-80')}>
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1.5">{log.details}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
