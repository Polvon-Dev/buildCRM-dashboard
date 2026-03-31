import { Notification } from '@/shared/types';

export const mockNotifications: Notification[] = [
  {
    id: 'notif1', type: 'critical', category: 'norm_violation',
    title: 'Normativ buzildi!', message: 'Navoiy 28 - Sement sarfi normativdan 23.3% oshgan',
    recipientId: 'u1', recipientRole: 'rahbar', senderId: 'system', senderName: 'Tizim',
    link: '/rahbar/norms', isRead: false, createdAt: '2026-03-28T14:30:00Z',
  },
  {
    id: 'notif2', type: 'critical', category: 'norm_violation',
    title: 'Normativ buzildi!', message: 'Chilonzor Plaza - Armatura sarfi normativdan 30% oshgan',
    recipientId: 'u1', recipientRole: 'rahbar', senderId: 'system', senderName: 'Tizim',
    link: '/rahbar/norms', isRead: false, createdAt: '2026-03-29T09:15:00Z',
  },
  {
    id: 'notif3', type: 'warning', category: 'low_stock',
    title: 'Material kam qoldi', message: 'Sement M500 — faqat 15 tonna qoldi (minimum: 10)',
    recipientId: 'u4', recipientRole: 'ombor', senderId: 'system', senderName: 'Tizim',
    link: '/ombor/low-stock', isRead: false, createdAt: '2026-03-30T08:00:00Z',
  },
  {
    id: 'notif4', type: 'info', category: 'material_request',
    title: 'Yangi material so\'rov', message: 'Karimov Botir — 5 tonna sement so\'radi (Navoiy 28)',
    recipientId: 'u4', recipientRole: 'ombor', senderId: 'u2', senderName: 'Karimov Botir',
    link: '/ombor/requests', isRead: false, createdAt: '2026-03-30T10:30:00Z',
  },
  {
    id: 'notif5', type: 'info', category: 'material_request',
    title: 'So\'rov tasdiqlandi', message: 'Sement M400 — 5 tonna so\'rov tasdiqlandi',
    recipientId: 'u2', recipientRole: 'prorab', senderId: 'u4', senderName: 'Toshmatov Javlon',
    link: '/prorab/materials', isRead: true, createdAt: '2026-03-30T11:00:00Z',
  },
  {
    id: 'notif6', type: 'info', category: 'daily_report',
    title: 'Kundalik hisobot', message: 'Karimov Botir kundalik hisobot yubordi (Navoiy 28)',
    recipientId: 'u1', recipientRole: 'rahbar', senderId: 'u2', senderName: 'Karimov Botir',
    link: '/rahbar/reports', isRead: true, createdAt: '2026-03-29T18:00:00Z',
  },
  {
    id: 'notif7', type: 'warning', category: 'attendance',
    title: 'Ishchi kelmadi', message: 'Kamolov Otabek bugun ishga kelmadi (Chilonzor Plaza)',
    recipientId: 'u1', recipientRole: 'rahbar', senderId: 'u5', senderName: 'Rahimov Sardor',
    link: '/rahbar/workers', isRead: false, createdAt: '2026-03-31T09:00:00Z',
  },
  {
    id: 'notif8', type: 'critical', category: 'inventory_discrepancy',
    title: 'Inventarizatsiya farqi!', message: 'Armatura A500 (d12) — 3 tonna farq aniqlandi!',
    recipientId: 'u1', recipientRole: 'rahbar', senderId: 'u4', senderName: 'Toshmatov Javlon',
    link: '/rahbar/warehouse', isRead: false, createdAt: '2026-03-30T16:00:00Z',
  },
  {
    id: 'notif9', type: 'info', category: 'comment',
    title: 'Yangi izoh', message: 'Rahbar sizning hisobotingizga izoh qoldirdi',
    recipientId: 'u2', recipientRole: 'prorab', senderId: 'u1', senderName: 'Abdullayev Shavkat',
    link: '/prorab/reports', isRead: false, createdAt: '2026-03-30T12:00:00Z',
  },
  {
    id: 'notif10', type: 'info', category: 'auction',
    title: 'Auktsion yangilandi', message: 'Sement yetkazib berish auktsioniga yangi taklif kelib tushdi',
    recipientId: 'u1', recipientRole: 'rahbar', senderId: 'system', senderName: 'Tizim',
    link: '/rahbar/auctions', isRead: true, createdAt: '2026-03-29T15:00:00Z',
  },
];
