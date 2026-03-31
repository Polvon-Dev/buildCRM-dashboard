import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'BuildCRM - Qurilish boshqaruv tizimi',
  description: 'Construction management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className={cn('font-sans', inter.variable)}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
