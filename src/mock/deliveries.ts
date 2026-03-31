import { Delivery } from '@/shared/types';

export const mockDeliveries: Delivery[] = [
  {
    id: 'del1',
    supplierId: 'sup1',
    supplierName: 'Qizilqum Sement OAJ',
    materials: [
      { materialName: 'Sement M400', quantity: 20, unit: 'tonna' },
    ],
    status: 'delivered',
    expectedDate: '2026-03-25',
    actualDate: '2026-03-25',
    projectId: 'p1',
    createdAt: '2026-03-22T10:00:00Z',
  },
  {
    id: 'del2',
    supplierId: 'sup3',
    supplierName: 'Toshkent Metall Zavodi',
    materials: [
      { materialName: 'Armatura A500 (d12)', quantity: 10, unit: 'tonna' },
      { materialName: 'Armatura A500 (d16)', quantity: 5, unit: 'tonna' },
    ],
    status: 'in_transit',
    expectedDate: '2026-04-01',
    projectId: 'p2',
    createdAt: '2026-03-28T14:00:00Z',
  },
  {
    id: 'del3',
    supplierId: 'sup5',
    supplierName: 'Ohangaron Sement',
    materials: [
      { materialName: 'Sement M500', quantity: 15, unit: 'tonna' },
    ],
    status: 'pending',
    expectedDate: '2026-04-03',
    projectId: 'p1',
    createdAt: '2026-03-30T09:00:00Z',
  },
  {
    id: 'del4',
    supplierId: 'sup6',
    supplierName: 'YogochTrade',
    materials: [
      { materialName: "Yog'och (brus 100x100)", quantity: 10, unit: 'm3' },
    ],
    status: 'cancelled',
    expectedDate: '2026-03-20',
    projectId: 'p1',
    createdAt: '2026-03-15T08:00:00Z',
  },
  {
    id: 'del5',
    supplierId: 'sup4',
    supplierName: 'MetallPro LLC',
    materials: [
      { materialName: 'Armatura A500 (d12)', quantity: 8, unit: 'tonna' },
    ],
    status: 'delivered',
    expectedDate: '2026-03-28',
    actualDate: '2026-03-29',
    projectId: 'p2',
    createdAt: '2026-03-25T11:00:00Z',
  },
];
