import { Receipt } from '@/shared/types';

export const mockReceipts: Receipt[] = [
  { id: 'rec1', supplierId: 'sup1', supplierName: 'Qizilqum Sement OAJ', materialId: 'm1', materialName: 'Sement M400', quantity: 20, unit: 'tonna', pricePerUnit: 1200000, totalAmount: 24000000, date: '2026-03-25', addedBy: 'u4', addedByName: 'Toshmatov Javlon' },
  { id: 'rec2', supplierId: 'sup3', supplierName: 'Toshkent Metall Zavodi', materialId: 'm2', materialName: 'Armatura A500 (d12)', quantity: 10, unit: 'tonna', pricePerUnit: 8500000, totalAmount: 85000000, date: '2026-03-20', addedBy: 'u4', addedByName: 'Toshmatov Javlon' },
  { id: 'rec3', supplierId: 'sup5', supplierName: 'Ohangaron Sement', materialId: 'm12', materialName: 'Sement M500', quantity: 15, unit: 'tonna', pricePerUnit: 1400000, totalAmount: 21000000, date: '2026-03-28', addedBy: 'u4', addedByName: 'Toshmatov Javlon' },
  { id: 'rec4', supplierId: 'sup6', supplierName: 'YogochTrade', materialId: 'm7', materialName: "Yog'och (brus 100x100)", quantity: 8, unit: 'm3', pricePerUnit: 3500000, totalAmount: 28000000, date: '2026-03-15', addedBy: 'u4', addedByName: 'Toshmatov Javlon' },
];
