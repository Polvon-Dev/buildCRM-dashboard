import { UserRole } from '@/shared/types';

export const ROLE_LABELS: Record<UserRole, { uz: string; ru: string; en: string }> = {
  rahbar: { uz: 'Rahbar', ru: 'Директор', en: 'Director' },
  prorab: { uz: 'Prorab', ru: 'Прораб', en: 'Foreman' },
  ombor: { uz: 'Ombor mudiri', ru: 'Заведующий складом', en: 'Warehouse Manager' },
  admin: { uz: 'Admin', ru: 'Администратор', en: 'Administrator' },
};

export const ROLE_COLORS: Record<UserRole, string> = {
  rahbar: 'bg-purple-100 text-purple-800 border-purple-200',
  prorab: 'bg-blue-100 text-blue-800 border-blue-200',
  ombor: 'bg-amber-100 text-amber-800 border-amber-200',
  admin: 'bg-green-100 text-green-800 border-green-200',
};

// Kim kimni bloklashi mumkin
export const BLOCK_PERMISSIONS: Record<UserRole, UserRole[]> = {
  rahbar: ['prorab', 'ombor', 'admin'],
  admin: ['prorab', 'ombor'],
  prorab: [],
  ombor: [],
};

// Kim qayerda izoh qoldirishi mumkin
export const COMMENT_PERMISSIONS: Record<UserRole, string[]> = {
  rahbar: ['project', 'worker', 'prorab', 'report', 'task', 'material_request', 'inventory_check', 'photo', 'receipt', 'auction', 'attendance', 'supplier'],
  prorab: ['task', 'material_request', 'worker', 'attendance', 'supplier'],
  ombor: ['material_request', 'inventory_check', 'receipt', 'supplier'],
  admin: ['task', 'attendance', 'issue'],
};

// Kim kimni baholashi mumkin
export const RATING_PERMISSIONS: Record<UserRole, string[]> = {
  rahbar: ['worker', 'prorab', 'ombor_mudiri', 'supplier', 'auction_participant'],
  prorab: ['worker', 'supplier', 'material_quality', 'auction_participant'],
  ombor: ['supplier', 'material_quality'],
  admin: [],
};
