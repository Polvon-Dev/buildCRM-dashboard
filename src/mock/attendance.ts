import { Attendance } from '@/shared/types';

export const mockAttendance: Attendance[] = [
  { id: 'att1', workerId: 'w1', workerName: 'Hasanov Olim', projectId: 'p1', date: '2026-03-31', status: 'present', checkInTime: '08:05', markedBy: 'u5' },
  { id: 'att2', workerId: 'w2', workerName: 'Raximov Jasur', projectId: 'p1', date: '2026-03-31', status: 'present', checkInTime: '07:55', markedBy: 'u5' },
  { id: 'att3', workerId: 'w3', workerName: 'Tursunov Baxtiyor', projectId: 'p1', date: '2026-03-31', status: 'late', checkInTime: '09:15', comment: 'Transport muammosi', markedBy: 'u5' },
  { id: 'att4', workerId: 'w4', workerName: 'Qodirov Mansur', projectId: 'p1', date: '2026-03-31', status: 'present', checkInTime: '08:00', markedBy: 'u5' },
  { id: 'att5', workerId: 'w5', workerName: 'Mirzayev Aziz', projectId: 'p1', date: '2026-03-31', status: 'present', checkInTime: '07:50', markedBy: 'u5' },
  { id: 'att6', workerId: 'w6', workerName: 'Nurmatov Sherzod', projectId: 'p1', date: '2026-03-31', status: 'present', checkInTime: '08:10', markedBy: 'u5' },
  { id: 'att7', workerId: 'w7', workerName: 'Aliyev Farrux', projectId: 'p1', date: '2026-03-31', status: 'present', checkInTime: '07:45', markedBy: 'u5' },
  { id: 'att8', workerId: 'w8', workerName: 'Sobirov Dilmurod', projectId: 'p2', date: '2026-03-31', status: 'present', checkInTime: '08:20', markedBy: 'u5' },
  { id: 'att9', workerId: 'w9', workerName: 'Xolmatov Nodir', projectId: 'p2', date: '2026-03-31', status: 'present', checkInTime: '08:00', markedBy: 'u5' },
  { id: 'att10', workerId: 'w10', workerName: 'Ergashev Firdavs', projectId: 'p2', date: '2026-03-31', status: 'excused', comment: 'Kasallik varaqasi', markedBy: 'u5' },
  { id: 'att11', workerId: 'w11', workerName: 'Umarov Bobur', projectId: 'p2', date: '2026-03-31', status: 'present', checkInTime: '08:05', markedBy: 'u5' },
  { id: 'att12', workerId: 'w12', workerName: 'Kamolov Otabek', projectId: 'p2', date: '2026-03-31', status: 'absent', comment: 'Ruxsatsiz kelmadi', markedBy: 'u5' },
];
