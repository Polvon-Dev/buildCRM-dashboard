'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/model/authStore';
import { useNotificationStore } from '@/entities/notification/model/store';
import { NAVIGATION } from '@/shared/config/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Building2,
  DollarSign,
  ShieldAlert,
  Gavel,
  Users,
  Warehouse,
  Truck,
  Camera,
  FileText,
  Star,
  Bell,
  CheckSquare,
  Package,
  BarChart3,
  ArrowDownToLine,
  ArrowUpFromLine,
  ClipboardList,
  ClipboardCheck,
  Receipt,
  AlertTriangle,
  CalendarCheck,
  AlertOctagon,
  Activity,
  UserCog,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import type { UserRole } from '@/shared/types';

// Map icon string names to actual Lucide icon components
const iconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  Building2,
  DollarSign,
  ShieldAlert,
  Gavel,
  Users,
  Warehouse,
  Truck,
  Camera,
  FileText,
  Star,
  Bell,
  CheckSquare,
  Package,
  BarChart3,
  ArrowDownToLine,
  ArrowUpFromLine,
  ClipboardList,
  ClipboardCheck,
  Receipt,
  AlertTriangle,
  CalendarCheck,
  AlertOctagon,
  Activity,
  UserCog,
};

const roleBadgeColors: Record<UserRole, string> = {
  rahbar: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  prorab: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  ombor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  admin: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

const roleLabels: Record<UserRole, string> = {
  rahbar: 'Rahbar',
  prorab: 'Prorab',
  ombor: 'Omborchi',
  admin: 'Admin',
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();

  const role = user?.role ?? 'admin';
  const navItems = NAVIGATION[role] ?? [];

  // Strip locale prefix from pathname for matching (e.g., /uz/rahbar -> /rahbar)
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '') || '/';

  const isActive = (href: string) => {
    if (href === `/${role}`) {
      return pathnameWithoutLocale === href;
    }
    return pathnameWithoutLocale.startsWith(href);
  };

  const sidebarContent = (
    <div
      className={cn(
        'flex h-full flex-col bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white transition-all duration-300',
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Logo Section */}
      <div className="flex h-16 items-center justify-between border-b border-white/5 px-4">
        <Link
          href={`/${locale}/${role}`}
          className={cn(
            'flex items-center gap-2.5 transition-all duration-300',
            isCollapsed && 'justify-center'
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
            <span className="text-lg" role="img" aria-label="building">
              🏗
            </span>
          </div>
          {!isCollapsed && (
            <span className="text-lg font-bold tracking-tight">
              Build<span className="text-blue-400">CRM</span>
            </span>
          )}
        </Link>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden rounded-md p-1 text-slate-400 transition-colors hover:bg-white/5 hover:text-white lg:block"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>

        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="rounded-md p-1 text-slate-400 transition-colors hover:bg-white/5 hover:text-white lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const IconComponent = iconMap[item.icon] ?? LayoutDashboard;
            const active = isActive(item.href);
            const isNotification = item.icon === 'Bell';
            const badgeCount = isNotification ? unreadCount : item.badge;

            return (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                onClick={onClose}
                className={cn(
                  'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isCollapsed && 'justify-center px-2',
                  active
                    ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                )}
              >
                {/* Active indicator bar */}
                {active && (
                  <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                )}

                <IconComponent
                  className={cn(
                    'h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110',
                    active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'
                  )}
                />

                {!isCollapsed && (
                  <>
                    <span className="flex-1 truncate">{item.title}</span>

                    {badgeCount && badgeCount > 0 ? (
                      <span
                        className={cn(
                          'flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-bold',
                          active
                            ? 'bg-white/20 text-white'
                            : 'bg-red-500/90 text-white shadow-sm shadow-red-500/30'
                        )}
                      >
                        {badgeCount > 99 ? '99+' : badgeCount}
                      </span>
                    ) : null}
                  </>
                )}

                {/* Collapsed badge dot */}
                {isCollapsed && badgeCount && badgeCount > 0 ? (
                  <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50 ring-2 ring-slate-900" />
                ) : null}

                {/* Collapsed tooltip */}
                {isCollapsed && (
                  <div className="pointer-events-none absolute left-full z-50 ml-2 hidden rounded-md bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-white shadow-xl group-hover:block">
                    {item.title}
                    <div className="absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-slate-800" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* User Info Section */}
      {user && (
        <div className="border-t border-white/5 p-3">
          <div
            className={cn(
              'flex items-center gap-3 rounded-lg bg-white/5 p-3 transition-all',
              isCollapsed && 'justify-center p-2'
            )}
          >
            {/* Avatar */}
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 text-sm font-bold text-white shadow-lg">
              {user.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400" />
            </div>

            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-white">
                  {user.fullName}
                </p>
                <span
                  className={cn(
                    'mt-0.5 inline-flex rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
                    roleBadgeColors[role]
                  )}
                >
                  {roleLabels[role]}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden h-screen shrink-0 lg:block">{sidebarContent}</aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          {/* Sidebar */}
          <aside className="relative z-10 h-full w-fit animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
