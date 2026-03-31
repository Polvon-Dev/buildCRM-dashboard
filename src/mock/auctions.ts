import { Auction } from '@/shared/types';

export const mockAuctions: Auction[] = [
  {
    id: 'auc1', title: 'Sement yetkazib berish (100 tonna)', description: 'Navoiy 28 va Chilonzor Plaza uchun sement M400 yetkazib berish', projectId: 'p1',
    createdBy: 'u2', createdByName: 'Karimov Botir', status: 'open',
    startDate: '2026-03-25', endDate: '2026-04-05',
    bids: [
      { id: 'b1', auctionId: 'auc1', bidderId: 'sup1', bidderName: 'Qizilqum Sement', company: 'Qizilqum Sement OAJ', amount: 115000000, description: '2 hafta ichida yetkazamiz, sifat kafolati 1 yil', createdAt: '2026-03-26T10:00:00Z' },
      { id: 'b2', auctionId: 'auc1', bidderId: 'sup2', bidderName: 'Bekobod Sement', company: 'Bekobod Sement Zavodi', amount: 108000000, description: '10 kun ichida, temir yo\'l orqali', createdAt: '2026-03-27T14:00:00Z' },
      { id: 'b3', auctionId: 'auc1', bidderId: 'sup5', bidderName: 'Ohangaron Sement', company: 'Ohangaron Sement', amount: 120000000, description: '1 hafta, avto transport, yuklab berish bepul', createdAt: '2026-03-28T09:00:00Z' },
    ],
    createdAt: '2026-03-25T08:00:00Z',
  },
  {
    id: 'auc2', title: 'Armatura yetkazib berish (50 tonna)', description: 'A500 d12 va d16 armatura', projectId: 'p2',
    createdBy: 'u3', createdByName: 'Yusupov Anvar', status: 'closed',
    startDate: '2026-03-10', endDate: '2026-03-20',
    winnerId: 'sup3', winnerName: 'Toshkent Metall',
    approvedBy: 'u1', approvedAt: '2026-03-21T10:00:00Z',
    bids: [
      { id: 'b4', auctionId: 'auc2', bidderId: 'sup3', bidderName: 'Toshkent Metall', company: 'Toshkent Metall Zavodi', amount: 425000000, description: 'Eng yaxshi narx, sertifikat bilan', createdAt: '2026-03-12T10:00:00Z' },
      { id: 'b5', auctionId: 'auc2', bidderId: 'sup4', bidderName: 'MetallPro', company: 'MetallPro LLC', amount: 440000000, description: '3 kun ichida yetkazamiz', createdAt: '2026-03-15T11:00:00Z' },
    ],
    createdAt: '2026-03-10T08:00:00Z',
  },
];
