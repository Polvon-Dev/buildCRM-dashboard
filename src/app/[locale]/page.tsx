import { redirect } from '@/i18n/routing';

export default function HomePage({ params }: { params: { locale: string } }) {
  redirect({ href: '/login', locale: params.locale });
}
