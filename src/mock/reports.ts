import { DailyReport } from '@/shared/types';

export const mockReports: DailyReport[] = [
  {
    id: 'rep1', projectId: 'p1', prorabId: 'u2', prorabName: 'Karimov Botir',
    date: '2026-03-29', workDone: '3-qavatda beton quyish ishlari bajarildi. 2-sektsiya devorlarini suvash boshlandi.',
    materialsUsed: [
      { materialId: 'm1', materialName: 'Sement M400', quantity: 18.5, unit: 'tonna', workDescription: 'Beton quyish', workAmount: 50, workUnit: 'm³' },
      { materialId: 'm5', materialName: 'Qum', quantity: 35, unit: 'm3', workDescription: 'Beton quyish', workAmount: 50, workUnit: 'm³' },
      { materialId: 'm2', materialName: 'Armatura A500 (d12)', quantity: 5.2, unit: 'tonna', workDescription: 'Beton armatura', workAmount: 50, workUnit: 'm³' },
    ],
    workersPresent: 42, issues: 'Beton mikseri 2 soat kechikdi',
    photos: [
      { id: 'ph1', url: '/photos/site1-1.jpg', projectId: 'p1', uploadedBy: 'u2', uploadedByName: 'Karimov Botir', gpsLat: 41.3111, gpsLng: 69.2797, gpsAddress: 'Navoiy ko\'chasi 28', timestamp: '2026-03-29T10:30:00Z', description: '3-qavat beton quyish' },
      { id: 'ph2', url: '/photos/site1-2.jpg', projectId: 'p1', uploadedBy: 'u2', uploadedByName: 'Karimov Botir', gpsLat: 41.3111, gpsLng: 69.2797, gpsAddress: 'Navoiy ko\'chasi 28', timestamp: '2026-03-29T15:00:00Z', description: '2-sektsiya devor suvash' },
    ],
    isSigned: true, signedAt: '2026-03-29T17:30:00Z', createdAt: '2026-03-29T17:00:00Z',
  },
  {
    id: 'rep2', projectId: 'p2', prorabId: 'u3', prorabName: 'Yusupov Anvar',
    date: '2026-03-29', workDone: 'Poydevor armaturasini bog\'lash davom etdi. B blok xandaqini qazish tugallandi.',
    materialsUsed: [
      { materialId: 'm2', materialName: 'Armatura A500 (d12)', quantity: 3.8, unit: 'tonna', workDescription: 'Poydevor armatura', workAmount: 40, workUnit: 'm³' },
      { materialId: 'm5', materialName: 'Qum', quantity: 20, unit: 'm3', workDescription: 'Xandaq to\'ldirish', workAmount: 80, workUnit: 'm³' },
    ],
    workersPresent: 65, issues: undefined,
    photos: [
      { id: 'ph3', url: '/photos/site2-1.jpg', projectId: 'p2', uploadedBy: 'u3', uploadedByName: 'Yusupov Anvar', gpsLat: 41.2856, gpsLng: 69.2044, gpsAddress: 'Chilonzor 7-mavze', timestamp: '2026-03-29T11:00:00Z', description: 'B blok poydevor' },
    ],
    isSigned: true, signedAt: '2026-03-29T18:00:00Z', createdAt: '2026-03-29T17:45:00Z',
  },
  {
    id: 'rep3', projectId: 'p1', prorabId: 'u2', prorabName: 'Karimov Botir',
    date: '2026-03-30', workDone: '3-qavat beton quritish jarayonida. 4-qavatda opalobok o\'rnatish boshlandi.',
    materialsUsed: [
      { materialId: 'm7', materialName: "Yog'och (brus 100x100)", quantity: 2.5, unit: 'm3', workDescription: 'Opalobok', workAmount: 12, workUnit: 'dona' },
    ],
    workersPresent: 40,
    photos: [
      { id: 'ph4', url: '/photos/site1-3.jpg', projectId: 'p1', uploadedBy: 'u2', uploadedByName: 'Karimov Botir', gpsLat: 41.3111, gpsLng: 69.2797, gpsAddress: 'Navoiy ko\'chasi 28', timestamp: '2026-03-30T12:00:00Z', description: '4-qavat opalobok' },
    ],
    isSigned: true, signedAt: '2026-03-30T17:00:00Z', createdAt: '2026-03-30T16:30:00Z',
  },
];
