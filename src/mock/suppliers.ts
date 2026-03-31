import { Supplier } from '@/shared/types';

export const mockSuppliers: Supplier[] = [
  { id: 'sup1', name: 'Qizilqum Sement OAJ', contactPerson: 'Mahmudov Rustam', phone: '+998712345001', email: 'info@qizilqum.uz', address: 'Navoiy viloyati', materials: ['Sement M400', 'Sement M500'], rating: 4.2, totalOrders: 15, createdAt: '2025-01-01' },
  { id: 'sup2', name: 'Bekobod Sement Zavodi', contactPerson: 'Toshpulatov Anvar', phone: '+998712345002', address: 'Toshkent viloyati, Bekobod', materials: ['Sement M400'], rating: 3.8, totalOrders: 8, createdAt: '2025-02-01' },
  { id: 'sup3', name: 'Toshkent Metall Zavodi', contactPerson: 'Ismoilov Dilshod', phone: '+998712345003', email: 'sales@tashmetall.uz', address: 'Toshkent sh., Sergeli', materials: ['Armatura A500 (d12)', 'Armatura A500 (d16)'], rating: 4.7, totalOrders: 22, createdAt: '2025-01-15' },
  { id: 'sup4', name: 'MetallPro LLC', contactPerson: 'Umarov Shahzod', phone: '+998712345004', address: 'Toshkent sh., Zangiota', materials: ['Armatura A500 (d12)', 'Armatura A500 (d16)'], rating: 4.0, totalOrders: 12, createdAt: '2025-03-01' },
  { id: 'sup5', name: 'Ohangaron Sement', contactPerson: 'Xudoyberdiyev Mirzo', phone: '+998712345005', address: 'Toshkent viloyati, Ohangaron', materials: ['Sement M400', 'Sement M500'], rating: 4.5, totalOrders: 18, createdAt: '2025-01-20' },
  { id: 'sup6', name: 'YogochTrade', contactPerson: 'Normatov Bexruz', phone: '+998712345006', address: 'Farg\'ona viloyati', materials: ['Yog\'och (brus)', 'Faner'], rating: 3.5, totalOrders: 6, createdAt: '2025-05-01' },
];
