'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/model/authStore';
import { useNotificationStore } from '@/entities/notification/model/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Bell,
  Search,
  Globe,
  LogOut,
  User,
  Menu,
  AlertTriangle,
  Info,
  CheckCircle,
  X,
} from 'lucide-react';
import type { NotificationType, UserRole } from '@/shared/types';

const roleKeys: Record<UserRole, string> = {
  rahbar: 'roles.rahbar',
  prorab: 'roles.prorab',
  ombor: 'roles.ombor',
  admin: 'roles.admin',
};

// Map route segments to nav translation keys
const routeTitleKeys: Record<string, string> = {
  rahbar: 'nav.dashboard',
  prorab: 'nav.dashboard',
  ombor: 'nav.dashboard',
  admin: 'nav.dashboard',
  projects: 'nav.projects',
  finance: 'nav.finance',
  norms: 'nav.norms',
  auctions: 'nav.auctions',
  workers: 'nav.workers',
  warehouse: 'nav.warehouse',
  suppliers: 'nav.suppliers',
  photos: 'nav.photos',
  reports: 'nav.reports',
  ratings: 'nav.ratings',
  notifications: 'nav.notifications',
  tasks: 'nav.tasks',
  materials: 'nav.materials',
  'work-volume': 'nav.workVolume',
  incoming: 'nav.incoming',
  outgoing: 'nav.outgoing',
  requests: 'nav.requests',
  'inventory-check': 'nav.inventoryCheck',
  receipts: 'nav.receipts',
  deliveries: 'nav.deliveries',
  'low-stock': 'nav.lowStock',
  attendance: 'nav.attendance',
  issues: 'nav.issues',
  activity: 'nav.activity',
  users: 'nav.users',
};

const notificationTypeConfig: Record<
  NotificationType,
  { color: string; bg: string; icon: React.ElementType }
> = {
  critical: { color: 'text-red-600', bg: 'bg-red-50 border-red-200', icon: AlertTriangle },
  warning: { color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: AlertTriangle },
  info: { color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200', icon: Info },
  success: { color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200', icon: CheckCircle },
};

const LOCALES = [
  { code: 'uz', label: 'UZ', name: "O'zbekcha" },
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'en', label: 'EN', name: 'English' },
] as const;

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations();
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markAsRead } = useNotificationStore();

  // Get current locale from pathname
  const segments = pathname.split('/').filter(Boolean);
  const currentLocale = segments[0] && ['uz', 'ru', 'en'].includes(segments[0]) ? segments[0] : 'uz';

  // Get page title from the last meaningful route segment
  const pathSegments = pathname.replace(/^\/[a-z]{2}/, '').split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1] || pathSegments[0] || '';
  const titleKey = routeTitleKeys[lastSegment] || 'nav.dashboard';
  const pageTitle = t(titleKey);

  // Get latest 5 unread notifications for this user
  const userNotifications = user
    ? notifications
        .filter((n) => n.recipientId === user.id)
        .slice(0, 5)
    : [];

  const switchLocale = (locale: string) => {
    const newPath = pathname.replace(/^\/[a-z]{2}/, `/${locale}`);
    router.push(newPath);
  };

  const handleLogout = () => {
    logout();
    router.push(`/${currentLocale}/login`);
  };

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) {
      const fullLink = link.startsWith(`/${currentLocale}`) ? link : `/${currentLocale}${link}`;
      router.push(fullLink);
    }
  };

  const initials = user
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-slate-200/80 bg-white/80 px-4 backdrop-blur-xl sm:px-6">
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-slate-500 hover:text-slate-700 lg:hidden"
        onClick={onMenuToggle}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Page Title */}
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <h1 className="truncate text-lg font-semibold text-slate-900 sm:text-xl">
          {pageTitle}
        </h1>
      </div>

      {/* Search */}
      <div className="hidden items-center md:flex">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="search"
            placeholder={t('header.search')}
            className="h-9 w-64 rounded-full border-slate-200 bg-slate-50/80 pl-9 text-sm transition-all duration-200 placeholder:text-slate-400 focus:w-80 focus:bg-white focus:shadow-md"
          />
        </div>
      </div>

      {/* Mobile search toggle */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-slate-500 hover:text-slate-700 md:hidden"
        onClick={() => setSearchOpen(!searchOpen)}
      >
        {searchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
      </Button>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="relative shrink-0 text-slate-500 hover:text-slate-700"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-sm shadow-red-500/30 ring-2 ring-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-0">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <DropdownMenuLabel className="p-0 text-sm font-semibold">
              {t('header.notifications')}
            </DropdownMenuLabel>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-[10px]">
                {unreadCount} {t('header.new')}
              </Badge>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {userNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-sm text-slate-400">
                <Bell className="mb-2 h-8 w-8 text-slate-300" />
                {t('header.noNotifications')}
              </div>
            ) : (
              userNotifications.map((notification) => {
                const config = notificationTypeConfig[notification.type];
                const TypeIcon = config.icon;
                return (
                  <DropdownMenuItem
                    key={notification.id}
                    className={cn(
                      'flex cursor-pointer items-start gap-3 rounded-none border-b border-slate-100 px-4 py-3 last:border-0',
                      !notification.isRead && 'bg-blue-50/50'
                    )}
                    onClick={() =>
                      handleNotificationClick(notification.id, notification.link)
                    }
                  >
                    <div
                      className={cn(
                        'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
                        config.bg
                      )}
                    >
                      <TypeIcon className={cn('h-4 w-4', config.color)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          'truncate text-sm',
                          !notification.isRead ? 'font-semibold text-slate-900' : 'text-slate-700'
                        )}
                      >
                        {notification.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {new Date(notification.createdAt).toLocaleDateString(currentLocale)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                  </DropdownMenuItem>
                );
              })
            )}
          </div>
          {userNotifications.length > 0 && (
            <div className="border-t px-4 py-2.5">
              <Link
                href={`/${currentLocale}/${user?.role || 'admin'}/notifications`}
                className="block text-center text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                {t('header.viewAll')}
              </Link>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Language Switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden shrink-0 gap-1 text-slate-500 hover:text-slate-700 sm:inline-flex"
          >
            <Globe className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase">{currentLocale}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuLabel className="text-xs text-slate-500">
            {t('header.selectLanguage')}
          </DropdownMenuLabel>
          {LOCALES.map((locale) => (
            <DropdownMenuItem
              key={locale.code}
              className={cn(
                'cursor-pointer gap-2',
                currentLocale === locale.code && 'bg-blue-50 font-medium text-blue-700'
              )}
              onClick={() => switchLocale(locale.code)}
            >
              <span className="w-6 text-xs font-bold text-slate-400">{locale.label}</span>
              <span>{locale.name}</span>
              {currentLocale === locale.code && (
                <CheckCircle className="ml-auto h-3.5 w-3.5 text-blue-500" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Avatar Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex shrink-0 items-center gap-2 rounded-full p-0.5 transition-all hover:ring-2 hover:ring-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white shadow-sm">
              {initials}
            </div>
            <div className="hidden flex-col items-start xl:flex">
              <span className="text-sm font-medium text-slate-700">
                {user?.fullName || 'User'}
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                {user?.role ? t(roleKeys[user.role]) : ''}
              </span>
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <div className="flex items-center gap-3 px-3 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900">
                {user?.fullName || 'User'}
              </p>
              <p className="truncate text-xs text-slate-500">{user?.email || user?.phone}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer gap-2">
            <User className="h-4 w-4 text-slate-400" />
            {t('header.profile')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer gap-2 text-red-600 focus:bg-red-50 focus:text-red-700"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {t('header.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mobile Search Bar (expanded) */}
      {searchOpen && (
        <div className="absolute inset-x-0 top-16 z-50 border-b bg-white p-3 shadow-md md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder={t('header.search')}
              autoFocus
              className="h-10 w-full rounded-full border-slate-200 bg-slate-50 pl-9 text-sm"
            />
          </div>
        </div>
      )}
    </header>
  );
}
