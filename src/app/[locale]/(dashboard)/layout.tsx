'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/model/authStore';
import { useNotificationStore } from '@/entities/notification/model/store';
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar';
import { Header } from '@/widgets/header/ui/Header';
import { AlertTriangle, X } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const { notifications } = useNotificationStore();

  // Get locale from pathname
  const locale = pathname.split('/')[1] || 'uz';

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${locale}/login`);
    }
  }, [isAuthenticated, router, locale]);

  // Get critical notifications for this user
  const criticalNotifications = user
    ? notifications.filter(
        (n) =>
          n.recipientId === user.id &&
          n.type === 'critical' &&
          !n.isRead
      )
    : [];

  const hasCriticalAlerts = criticalNotifications.length > 0 && !alertDismissed;

  // Don't render dashboard until authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-sm text-slate-500">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Critical Alert Banner */}
        {hasCriticalAlerts && (
          <div className="relative flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-500 px-4 py-2.5 text-white shadow-md sm:px-6">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {criticalNotifications.length === 1
                  ? criticalNotifications[0].title
                  : `${criticalNotifications.length} ta muhim ogohlantirish mavjud!`}
              </p>
              {criticalNotifications.length === 1 && (
                <p className="truncate text-xs text-red-100">
                  {criticalNotifications[0].message}
                </p>
              )}
            </div>
            <button
              onClick={() => setAlertDismissed(true)}
              className="shrink-0 rounded-md p-1 text-red-200 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Header */}
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main
          className={cn(
            'flex-1 overflow-y-auto',
            'scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300'
          )}
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
