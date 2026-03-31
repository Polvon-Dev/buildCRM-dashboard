import { Salary } from '@/shared/types';

export const mockSalaries: Salary[] = [
  { id: 's1', workerId: 'w1', workerName: 'Hasanov Olim', position: 'mason', projectId: 'p1', month: '2026-03', workDays: 26, attendedDays: 24, dailyRate: 250000, totalAmount: 6000000, bonus: 500000, deduction: 0, finalAmount: 6500000, isPaid: false, isSigned: false },
  { id: 's2', workerId: 'w2', workerName: 'Raximov Jasur', position: 'welder', projectId: 'p1', month: '2026-03', workDays: 26, attendedDays: 26, dailyRate: 300000, totalAmount: 7800000, bonus: 1000000, deduction: 0, finalAmount: 8800000, isPaid: false, isSigned: false },
  { id: 's3', workerId: 'w3', workerName: 'Tursunov Baxtiyor', position: 'electrician', projectId: 'p1', month: '2026-03', workDays: 26, attendedDays: 25, dailyRate: 280000, totalAmount: 7000000, bonus: 300000, deduction: 0, finalAmount: 7300000, isPaid: false, isSigned: false },
  { id: 's4', workerId: 'w7', workerName: 'Aliyev Farrux', position: 'crane_operator', projectId: 'p1', month: '2026-03', workDays: 26, attendedDays: 26, dailyRate: 350000, totalAmount: 9100000, bonus: 800000, deduction: 0, finalAmount: 9900000, isPaid: false, isSigned: false },
  { id: 's5', workerId: 'w8', workerName: 'Sobirov Dilmurod', position: 'mason', projectId: 'p2', month: '2026-03', workDays: 26, attendedDays: 22, dailyRate: 240000, totalAmount: 5280000, bonus: 0, deduction: 500000, finalAmount: 4780000, isPaid: false, isSigned: false },
  { id: 's6', workerId: 'w12', workerName: 'Kamolov Otabek', position: 'laborer', projectId: 'p2', month: '2026-03', workDays: 26, attendedDays: 15, dailyRate: 170000, totalAmount: 2550000, bonus: 0, deduction: 300000, finalAmount: 2250000, isPaid: false, isSigned: false },
];
