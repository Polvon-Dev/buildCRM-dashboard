import { ActivityLog } from '@/shared/types';

export const mockActivityLogs: ActivityLog[] = [
  { id: 'al1', userId: 'u2', userName: 'Karimov Botir', userRole: 'prorab', action: 'report_created', details: 'Kundalik hisobot yaratdi (Navoiy 28)', targetType: 'report', targetId: 'rep3', createdAt: '2026-03-30T16:30:00Z' },
  { id: 'al2', userId: 'u4', userName: 'Toshmatov Javlon', userRole: 'ombor', action: 'request_approved', details: 'Material so\'rov tasdiqladi: Sement M400 — 5 tonna', targetType: 'material_request', targetId: 'mr1', createdAt: '2026-03-30T11:00:00Z' },
  { id: 'al3', userId: 'u1', userName: 'Abdullayev Shavkat', userRole: 'rahbar', action: 'comment_added', details: 'Hisobotga izoh qoldirdi (Navoiy 28)', targetType: 'comment', targetId: 'c1', createdAt: '2026-03-29T19:00:00Z' },
  { id: 'al4', userId: 'u5', userName: 'Rahimov Sardor', userRole: 'admin', action: 'attendance_marked', details: 'Bugungi davomat belgilandi (12 ishchi)', targetType: 'attendance', targetId: 'att1', createdAt: '2026-03-31T09:00:00Z' },
  { id: 'al5', userId: 'u3', userName: 'Yusupov Anvar', userRole: 'prorab', action: 'material_requested', details: 'Armatura A500 — 3 tonna so\'radi (Tezkor)', targetType: 'material_request', targetId: 'mr2', createdAt: '2026-03-31T08:00:00Z' },
  { id: 'al6', userId: 'u4', userName: 'Toshmatov Javlon', userRole: 'ombor', action: 'inventory_check', details: 'Inventarizatsiya o\'tkazdi — Armatura A500 da 3t farq!', targetType: 'inventory_check', targetId: 'ic1', createdAt: '2026-03-30T16:00:00Z' },
  { id: 'al7', userId: 'u1', userName: 'Abdullayev Shavkat', userRole: 'rahbar', action: 'user_blocked', details: 'Normatov Dilshod bloklandi: Hisobotlarda nomuvofiqliq', targetType: 'user', targetId: 'u6', createdAt: '2026-03-28T10:00:00Z' },
  { id: 'al8', userId: 'u1', userName: 'Abdullayev Shavkat', userRole: 'rahbar', action: 'auction_approved', details: 'Armatura auktsioni tasdiqlandi, g\'olib: Toshkent Metall', targetType: 'auction', targetId: 'auc2', createdAt: '2026-03-21T10:00:00Z' },
  { id: 'al9', userId: 'u2', userName: 'Karimov Botir', userRole: 'prorab', action: 'rating_added', details: 'Raximov Jasur ga 5 yulduz baho berdi', targetType: 'rating', targetId: 'r1', createdAt: '2026-03-25T17:00:00Z' },
  { id: 'al10', userId: 'u4', userName: 'Toshmatov Javlon', userRole: 'ombor', action: 'material_incoming', details: 'Sement M400 — 20 tonna qabul qilindi (Qizilqum Sement)', targetType: 'receipt', targetId: 'rec1', createdAt: '2026-03-25T10:00:00Z' },
];
