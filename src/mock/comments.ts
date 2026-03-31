import { Comment } from '@/shared/types';

export const mockComments: Comment[] = [
  { id: 'c1', targetType: 'report', targetId: 'rep1', authorId: 'u1', authorName: 'Abdullayev Shavkat', authorRole: 'rahbar', text: 'Sement sarfi normativdan oshgan, sababi nima? Tushuntiring.', createdAt: '2026-03-29T19:00:00Z' },
  { id: 'c2', targetType: 'report', targetId: 'rep1', authorId: 'u2', authorName: 'Karimov Botir', authorRole: 'prorab', text: 'Qo\'shimcha beton quyish kerak bo\'ldi, chunki loyihada o\'zgarish bo\'lgan.', parentId: 'c1', createdAt: '2026-03-29T20:00:00Z' },
  { id: 'c3', targetType: 'worker', targetId: 'w2', authorId: 'u2', authorName: 'Karimov Botir', authorRole: 'prorab', text: 'Juda yaxshi ishchi, doim vaqtida keladi va sifatli ish qiladi.', createdAt: '2026-03-28T17:00:00Z' },
  { id: 'c4', targetType: 'supplier', targetId: 'sup1', authorId: 'u4', authorName: 'Toshmatov Javlon', authorRole: 'ombor', text: 'Oxirgi buyurtma 2 kun kechikdi. Yaxshilab tekshirish kerak.', createdAt: '2026-03-27T10:00:00Z' },
  { id: 'c5', targetType: 'supplier', targetId: 'sup1', authorId: 'u1', authorName: 'Abdullayev Shavkat', authorRole: 'rahbar', text: 'Kelasi safar boshqa yetkazib beruvchini ko\'rib chiqamiz.', parentId: 'c4', createdAt: '2026-03-27T14:00:00Z' },
  { id: 'c6', targetType: 'project', targetId: 'p1', authorId: 'u1', authorName: 'Abdullayev Shavkat', authorRole: 'rahbar', text: 'Bu obyektga e\'tibor kerak, muddat qisqartirilsin.', createdAt: '2026-03-30T08:00:00Z' },
  { id: 'c7', targetType: 'material_request', targetId: 'mr4', authorId: 'u4', authorName: 'Toshmatov Javlon', authorRole: 'ombor', text: "Hozircha suvash ishlari tugamagan, bo'yoqqa erta. 2 haftadan keyin qayta so'rang.", createdAt: '2026-03-29T15:00:00Z' },
  { id: 'c8', targetType: 'photo', targetId: 'ph1', authorId: 'u1', authorName: 'Abdullayev Shavkat', authorRole: 'rahbar', text: 'Bu yerda ish sifati past ko\'rinyapti, tekshirib ko\'ring.', createdAt: '2026-03-30T11:00:00Z' },
  { id: 'c9', targetType: 'task', targetId: 't5', authorId: 'u3', authorName: 'Yusupov Anvar', authorRole: 'prorab', text: 'Yomg\'ir tufayli kechikdi, ertaga davom etamiz.', createdAt: '2026-03-29T18:00:00Z' },
  { id: 'c10', targetType: 'attendance', targetId: 'att12', authorId: 'u5', authorName: 'Rahimov Sardor', authorRole: 'admin', text: 'Bu ishchi 3-marta ruxsatsiz kelmayapti, ogohlantirish kerak.', createdAt: '2026-03-31T09:30:00Z' },
];
