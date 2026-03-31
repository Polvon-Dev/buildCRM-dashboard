'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import { Building2, HardHat, Warehouse, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/model/authStore';
import type { UserRole } from '@/shared/types';

const roles: {
  key: UserRole;
  icon: typeof Building2;
  gradient: string;
  hoverGradient: string;
  shadowColor: string;
}[] = [
  {
    key: 'rahbar',
    icon: Building2,
    gradient: 'from-blue-500 to-blue-700',
    hoverGradient: 'group-hover:from-blue-400 group-hover:to-blue-600',
    shadowColor: 'shadow-blue-500/25',
  },
  {
    key: 'prorab',
    icon: HardHat,
    gradient: 'from-amber-500 to-orange-600',
    hoverGradient: 'group-hover:from-amber-400 group-hover:to-orange-500',
    shadowColor: 'shadow-amber-500/25',
  },
  {
    key: 'ombor',
    icon: Warehouse,
    gradient: 'from-emerald-500 to-teal-600',
    hoverGradient: 'group-hover:from-emerald-400 group-hover:to-teal-500',
    shadowColor: 'shadow-emerald-500/25',
  },
  {
    key: 'admin',
    icon: Shield,
    gradient: 'from-purple-500 to-indigo-600',
    hoverGradient: 'group-hover:from-purple-400 group-hover:to-indigo-500',
    shadowColor: 'shadow-purple-500/25',
  },
];

const roleDescriptions: Record<UserRole, Record<string, string>> = {
  rahbar: {
    uz: 'Barcha loyihalar, moliya va xodimlarni boshqarish',
    ru: 'Управление проектами, финансами и персоналом',
    en: 'Manage all projects, finances and personnel',
  },
  prorab: {
    uz: "Obyektdagi ishlarni nazorat qilish va hisobot berish",
    ru: 'Контроль работ на объекте и отчётность',
    en: 'Supervise on-site work and reporting',
  },
  ombor: {
    uz: "Materiallarni qabul qilish, saqlash va tarqatish",
    ru: 'Приём, хранение и выдача материалов',
    en: 'Receive, store and distribute materials',
  },
  admin: {
    uz: "Tizim sozlamalari, foydalanuvchilar va xavfsizlik",
    ru: 'Системные настройки, пользователи и безопасность',
    en: 'System settings, users and security',
  },
};

const roleNames: Record<UserRole, Record<string, string>> = {
  rahbar: { uz: 'Rahbar', ru: 'Руководитель', en: 'Director' },
  prorab: { uz: 'Prorab', ru: 'Прораб', en: 'Foreman' },
  ombor: { uz: 'Omborchi', ru: 'Кладовщик', en: 'Warehouse' },
  admin: { uz: 'Admin', ru: 'Админ', en: 'Admin' },
};

const languages = [
  { code: 'uz', label: 'UZ' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
] as const;

export default function LoginPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const login = useAuthStore((s) => s.login);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (role: UserRole) => {
    setSelectedRole(role);
    setIsLoading(true);

    // Small delay for visual feedback
    await new Promise((r) => setTimeout(r, 400));

    const success = login(role);
    if (success) {
      router.push(`/${locale}/${role}`);
    } else {
      setIsLoading(false);
      setSelectedRole(null);
    }
  };

  const switchLanguage = (lang: string) => {
    router.push(`/${lang}${pathname}`);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 animate-pulse rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 animate-pulse rounded-full bg-purple-500/10 blur-3xl [animation-delay:1s]" />
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-emerald-500/5 blur-3xl [animation-delay:2s]" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Language switcher */}
      <div className="absolute right-6 top-6 z-20 flex items-center gap-1 rounded-full bg-white/10 p-1 backdrop-blur-md">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
              locale === lang.code
                ? 'bg-white text-slate-900 shadow-lg'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-3xl px-4">
        {/* Logo and title */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-50" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-2xl shadow-blue-500/30">
                <Building2 className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
          <h1 className="mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            BuildCRM
          </h1>
          <p className="text-lg text-slate-400">{t('subtitle')}</p>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-slate-500 to-transparent" />
          <p className="mt-4 text-sm font-medium uppercase tracking-wider text-slate-500">
            {t('selectRole')}
          </p>
        </div>

        {/* Role cards grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.key;

            return (
              <Card
                key={role.key}
                className={`group relative cursor-pointer border-0 bg-white/[0.03] ring-white/[0.08] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.06] hover:ring-white/[0.15] ${
                  isSelected
                    ? `scale-[0.97] ring-2 ring-white/30 ${role.shadowColor} shadow-2xl`
                    : ''
                }`}
                onClick={() => !isLoading && handleLogin(role.key)}
              >
                <CardContent className="flex items-center gap-4 p-5">
                  {/* Icon container */}
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${role.gradient} ${role.hoverGradient} shadow-lg ${role.shadowColor} transition-all duration-300`}
                  >
                    {isSelected && isLoading ? (
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <Icon className="h-6 w-6 text-white transition-transform duration-300 group-hover:scale-110" />
                    )}
                  </div>

                  {/* Text content */}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-white/90 transition-colors group-hover:text-white">
                      {roleNames[role.key][locale] || roleNames[role.key]['uz']}
                    </h3>
                    <p className="mt-0.5 text-sm leading-snug text-slate-400 transition-colors group-hover:text-slate-300">
                      {roleDescriptions[role.key][locale] || roleDescriptions[role.key]['uz']}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 text-white/30 transition-all duration-300 group-hover:bg-white/10 group-hover:text-white/60">
                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-600">
            &copy; 2026 BuildCRM. {t('subtitle')}
          </p>
        </div>
      </div>
    </div>
  );
}
