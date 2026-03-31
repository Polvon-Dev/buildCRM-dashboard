import { MaterialRequest } from '@/shared/types';

export const mockMaterialRequests: MaterialRequest[] = [
  { id: 'mr1', materialId: 'm1', materialName: 'Sement M400', quantity: 5, unit: 'tonna', projectId: 'p1', requestedBy: 'u2', requestedByName: 'Karimov Botir', status: 'approved', urgency: 'normal', comment: '3-qavat beton uchun', approvedBy: 'u4', approvedAt: '2026-03-30T11:00:00Z', createdAt: '2026-03-30T10:30:00Z' },
  { id: 'mr2', materialId: 'm2', materialName: 'Armatura A500 (d12)', quantity: 3, unit: 'tonna', projectId: 'p2', requestedBy: 'u3', requestedByName: 'Yusupov Anvar', status: 'pending', urgency: 'urgent', comment: 'Ertaga poydevor quyamiz, tezkor kerak!', createdAt: '2026-03-31T08:00:00Z' },
  { id: 'mr3', materialId: 'm8', materialName: 'Elektr kabel (2.5mm)', quantity: 500, unit: 'metr', projectId: 'p1', requestedBy: 'u2', requestedByName: 'Karimov Botir', status: 'delivered', urgency: 'normal', approvedBy: 'u4', approvedAt: '2026-03-28T10:00:00Z', createdAt: '2026-03-28T09:00:00Z' },
  { id: 'mr4', materialId: 'm10', materialName: "Bo'yoq (oq)", quantity: 50, unit: 'litr', projectId: 'p2', requestedBy: 'u3', requestedByName: 'Yusupov Anvar', status: 'rejected', urgency: 'normal', rejectionReason: "Hozircha suvash ishlari tugamagan, bo'yoqqa erta", createdAt: '2026-03-29T14:00:00Z' },
  { id: 'mr5', materialId: 'm5', materialName: 'Qum', quantity: 15, unit: 'm3', projectId: 'p1', requestedBy: 'u2', requestedByName: 'Karimov Botir', status: 'pending', urgency: 'normal', comment: 'Beton aralashma uchun', createdAt: '2026-03-31T07:30:00Z' },
];
