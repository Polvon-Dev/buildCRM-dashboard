import { Material, MaterialNorm, NormViolation } from '@/shared/types';

export const mockMaterials: Material[] = [
  { id: 'm1', name: 'Sement M400', category: 'cement', unit: 'tonna', quantity: 85, minQuantity: 20, pricePerUnit: 1200000, totalValue: 102000000, lastUpdated: '2026-03-30' },
  { id: 'm2', name: 'Armatura A500 (d12)', category: 'metal', unit: 'tonna', quantity: 42, minQuantity: 10, pricePerUnit: 8500000, totalValue: 357000000, lastUpdated: '2026-03-30' },
  { id: 'm3', name: 'Armatura A500 (d16)', category: 'metal', unit: 'tonna', quantity: 28, minQuantity: 8, pricePerUnit: 8800000, totalValue: 246400000, lastUpdated: '2026-03-29' },
  { id: 'm4', name: 'G\'isht (qizil)', category: 'brick', unit: 'dona', quantity: 45000, minQuantity: 10000, pricePerUnit: 1500, totalValue: 67500000, lastUpdated: '2026-03-28' },
  { id: 'm5', name: 'Qum', category: 'sand', unit: 'm3', quantity: 120, minQuantity: 30, pricePerUnit: 180000, totalValue: 21600000, lastUpdated: '2026-03-30' },
  { id: 'm6', name: 'Shag\'al', category: 'sand', unit: 'm3', quantity: 95, minQuantity: 25, pricePerUnit: 250000, totalValue: 23750000, lastUpdated: '2026-03-29' },
  { id: 'm7', name: 'Yog\'och (brus 100x100)', category: 'wood', unit: 'm3', quantity: 18, minQuantity: 5, pricePerUnit: 3500000, totalValue: 63000000, lastUpdated: '2026-03-27' },
  { id: 'm8', name: 'Elektr kabel (2.5mm)', category: 'electrical', unit: 'metr', quantity: 3500, minQuantity: 500, pricePerUnit: 8000, totalValue: 28000000, lastUpdated: '2026-03-25' },
  { id: 'm9', name: 'Truba (PPR d20)', category: 'plumbing', unit: 'metr', quantity: 800, minQuantity: 200, pricePerUnit: 12000, totalValue: 9600000, lastUpdated: '2026-03-26' },
  { id: 'm10', name: 'Bo\'yoq (oq)', category: 'paint', unit: 'litr', quantity: 450, minQuantity: 100, pricePerUnit: 45000, totalValue: 20250000, lastUpdated: '2026-03-28' },
  { id: 'm11', name: 'Izolyatsiya (penoplast)', category: 'insulation', unit: 'm2', quantity: 600, minQuantity: 100, pricePerUnit: 35000, totalValue: 21000000, lastUpdated: '2026-03-24' },
  { id: 'm12', name: 'Sement M500', category: 'cement', unit: 'tonna', quantity: 15, minQuantity: 10, pricePerUnit: 1400000, totalValue: 21000000, lastUpdated: '2026-03-30' },
];

export const mockNorms: MaterialNorm[] = [
  { id: 'n1', materialId: 'm1', materialName: 'Sement M400', unit: 'tonna', normPerUnit: 0.3, workUnit: 'm³ beton', tolerance: 10 },
  { id: 'n2', materialId: 'm2', materialName: 'Armatura A500 (d12)', unit: 'tonna', normPerUnit: 0.08, workUnit: 'm³ beton', tolerance: 10 },
  { id: 'n3', materialId: 'm4', materialName: "G'isht (qizil)", unit: 'dona', normPerUnit: 400, workUnit: 'm³ devor', tolerance: 8 },
  { id: 'n4', materialId: 'm5', materialName: 'Qum', unit: 'm3', normPerUnit: 0.6, workUnit: 'm³ beton', tolerance: 12 },
  { id: 'n5', materialId: 'm6', materialName: "Shag'al", unit: 'm3', normPerUnit: 0.8, workUnit: 'm³ beton', tolerance: 12 },
  { id: 'n6', materialId: 'm8', materialName: 'Elektr kabel (2.5mm)', unit: 'metr', normPerUnit: 15, workUnit: 'xona', tolerance: 15 },
  { id: 'n7', materialId: 'm9', materialName: 'Truba (PPR d20)', unit: 'metr', normPerUnit: 8, workUnit: 'xona', tolerance: 10 },
];

export const mockNormViolations: NormViolation[] = [
  {
    id: 'nv1', normId: 'n1', projectId: 'p1', prorabId: 'u2',
    materialName: 'Sement M400', expectedUsage: 15, actualUsage: 18.5,
    differencePercent: 23.3, workDone: '50 m³ beton quyish',
    date: '2026-03-28', status: 'new',
  },
  {
    id: 'nv2', normId: 'n2', projectId: 'p2', prorabId: 'u3',
    materialName: 'Armatura A500 (d12)', expectedUsage: 4, actualUsage: 5.2,
    differencePercent: 30, workDone: '50 m³ beton armatura',
    date: '2026-03-29', status: 'new',
  },
  {
    id: 'nv3', normId: 'n3', projectId: 'p1', prorabId: 'u2',
    materialName: "G'isht (qizil)", expectedUsage: 8000, actualUsage: 8500,
    differencePercent: 6.25, workDone: '20 m³ devor',
    date: '2026-03-27', status: 'reviewed', reviewComment: "O'lchash xatoligi bo'lishi mumkin",
  },
];
