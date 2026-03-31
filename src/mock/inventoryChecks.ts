import { InventoryCheck } from '@/shared/types';

export const mockInventoryChecks: InventoryCheck[] = [
  { id: 'ic1', materialId: 'm2', materialName: 'Armatura A500 (d12)', systemQuantity: 45, actualQuantity: 42, difference: -3, differencePercent: -6.67, checkedBy: 'u4', checkedByName: 'Toshmatov Javlon', comment: '3 tonna farq bor, tekshirilmoqda', date: '2026-03-30', isAlert: true },
  { id: 'ic2', materialId: 'm1', materialName: 'Sement M400', systemQuantity: 85, actualQuantity: 84, difference: -1, differencePercent: -1.18, checkedBy: 'u4', checkedByName: 'Toshmatov Javlon', comment: 'Kichik farq, o\'lchash xatoligi', date: '2026-03-30', isAlert: false },
  { id: 'ic3', materialId: 'm4', materialName: "G'isht (qizil)", systemQuantity: 45000, actualQuantity: 44800, difference: -200, differencePercent: -0.44, checkedBy: 'u4', checkedByName: 'Toshmatov Javlon', date: '2026-03-28', isAlert: false },
  { id: 'ic4', materialId: 'm8', materialName: 'Elektr kabel (2.5mm)', systemQuantity: 3500, actualQuantity: 3480, difference: -20, differencePercent: -0.57, checkedBy: 'u4', checkedByName: 'Toshmatov Javlon', date: '2026-03-25', isAlert: false },
];
