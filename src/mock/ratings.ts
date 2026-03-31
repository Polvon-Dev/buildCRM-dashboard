import { Rating } from '@/shared/types';

export const mockRatings: Rating[] = [
  { id: 'r1', targetType: 'worker', targetId: 'w2', authorId: 'u2', authorName: 'Karimov Botir', authorRole: 'prorab', stars: 5, comment: 'Eng yaxshi payvandchi, sifatli ish, hech qachon kechmaydi', createdAt: '2026-03-25T17:00:00Z' },
  { id: 'r2', targetType: 'worker', targetId: 'w7', authorId: 'u2', authorName: 'Karimov Botir', authorRole: 'prorab', stars: 5, comment: 'Professional kran operatori, xavfsizlik qoidalariga rioya qiladi', createdAt: '2026-03-26T17:00:00Z' },
  { id: 'r3', targetType: 'worker', targetId: 'w12', authorId: 'u3', authorName: 'Yusupov Anvar', authorRole: 'prorab', stars: 2, comment: 'Ko\'p ishga kelmaydi, intizomi past', createdAt: '2026-03-28T17:00:00Z' },
  { id: 'r4', targetType: 'supplier', targetId: 'sup3', authorId: 'u4', authorName: 'Toshmatov Javlon', authorRole: 'ombor', stars: 5, comment: 'Eng ishonchli yetkazib beruvchi, doim vaqtida va sifatli', createdAt: '2026-03-22T12:00:00Z' },
  { id: 'r5', targetType: 'supplier', targetId: 'sup1', authorId: 'u4', authorName: 'Toshmatov Javlon', authorRole: 'ombor', stars: 3, comment: 'Sifat yaxshi, lekin oxirgi safar kechikdi', createdAt: '2026-03-27T12:00:00Z' },
  { id: 'r6', targetType: 'supplier', targetId: 'sup6', authorId: 'u2', authorName: 'Karimov Botir', authorRole: 'prorab', stars: 2, comment: 'Yog\'och sifati past, ko\'p nuqsonli', createdAt: '2026-03-16T17:00:00Z' },
  { id: 'r7', targetType: 'prorab', targetId: 'u2', authorId: 'u1', authorName: 'Abdullayev Shavkat', authorRole: 'rahbar', stars: 4, comment: 'Yaxshi boshqaruv, lekin normativlarga e\'tibor kerak', createdAt: '2026-03-30T10:00:00Z' },
  { id: 'r8', targetType: 'prorab', targetId: 'u3', authorId: 'u1', authorName: 'Abdullayev Shavkat', authorRole: 'rahbar', stars: 4, comment: 'Zo\'r prorab, obyekt yaxshi ketayapti', createdAt: '2026-03-30T10:05:00Z' },
  { id: 'r9', targetType: 'material_quality', targetId: 'rec1', authorId: 'u4', authorName: 'Toshmatov Javlon', authorRole: 'ombor', stars: 4, comment: 'Sement sifati yaxshi, qadoqlash ham to\'g\'ri', createdAt: '2026-03-25T14:00:00Z' },
  { id: 'r10', targetType: 'worker', targetId: 'w5', authorId: 'u1', authorName: 'Abdullayev Shavkat', authorRole: 'rahbar', stars: 5, comment: 'Juda mohir duradgor, sifatli ish', createdAt: '2026-03-29T09:00:00Z' },
];
