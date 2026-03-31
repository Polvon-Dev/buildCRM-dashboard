import { Task } from '@/shared/types';

export const mockTasks: Task[] = [
  { id: 't1', title: '3-qavat beton quyish', description: '3-qavatning 2-sektsiyasida beton quyish ishlari', projectId: 'p1', assignedTo: 'w1', createdBy: 'u2', status: 'in_progress', priority: 'high', dueDate: '2026-04-01', createdAt: '2026-03-28T08:00:00Z' },
  { id: 't2', title: 'Elektr simlarni o\'tkazish', description: '2-qavatda elektr simlarni tortish', projectId: 'p1', assignedTo: 'w3', createdBy: 'u2', status: 'completed', priority: 'medium', dueDate: '2026-03-30', completedAt: '2026-03-29T16:00:00Z', createdAt: '2026-03-25T08:00:00Z' },
  { id: 't3', title: 'Poydevor armatura bog\'lash', description: 'B blok poydevor armaturasini bog\'lash', projectId: 'p2', assignedTo: 'w9', createdBy: 'u3', status: 'in_progress', priority: 'urgent', dueDate: '2026-03-31', createdAt: '2026-03-29T08:00:00Z' },
  { id: 't4', title: 'Suv trubalarini ulash', description: '1-qavatda suv tizimini ulash', projectId: 'p1', assignedTo: 'w4', createdBy: 'u2', status: 'pending', priority: 'medium', dueDate: '2026-04-03', createdAt: '2026-03-30T08:00:00Z' },
  { id: 't5', title: 'Tom yopish ishlari', description: 'A blok tomini yopish', projectId: 'p2', assignedTo: 'w8', createdBy: 'u3', status: 'overdue', priority: 'high', dueDate: '2026-03-28', createdAt: '2026-03-20T08:00:00Z' },
  { id: 't6', title: 'Ichki devorlarni suvash', description: '4-qavatda ichki devorlarni suvash', projectId: 'p1', assignedTo: 'w6', createdBy: 'u2', status: 'pending', priority: 'low', dueDate: '2026-04-05', createdAt: '2026-03-30T09:00:00Z' },
  { id: 't7', title: 'Kran bilan yuklarni ko\'tarish', description: 'Material va asboblarni 5-qavatga ko\'tarish', projectId: 'p2', assignedTo: 'w10', createdBy: 'u3', status: 'in_progress', priority: 'medium', dueDate: '2026-03-31', createdAt: '2026-03-30T07:00:00Z' },
  { id: 't8', title: 'Yog\'och opalobok o\'rnatish', description: '3-qavatda deraza opalobokalarini o\'rnatish', projectId: 'p1', assignedTo: 'w5', createdBy: 'u2', status: 'completed', priority: 'medium', dueDate: '2026-03-29', completedAt: '2026-03-28T17:00:00Z', createdAt: '2026-03-26T08:00:00Z' },
];
