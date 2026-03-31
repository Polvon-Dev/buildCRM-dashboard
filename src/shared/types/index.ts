// ==================== ROLLAR ====================
export type UserRole = 'rahbar' | 'prorab' | 'ombor' | 'admin';

export type UserStatus = 'active' | 'blocked';

// ==================== USER ====================
export interface User {
  id: string;
  fullName: string;
  role: UserRole;
  phone: string;
  email?: string;
  avatar?: string;
  status: UserStatus;
  blockedBy?: string;
  blockReason?: string;
  projectId?: string; // qaysi obyektga biriktirilgan
  createdAt: string;
}

// ==================== LOYIHA ====================
export type ProjectStatus = 'planning' | 'active' | 'paused' | 'completed';

export interface Project {
  id: string;
  name: string;
  address: string;
  status: ProjectStatus;
  progress: number; // 0-100%
  prorabId: string;
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  workersCount: number;
  description?: string;
  createdAt: string;
}

// ==================== ISHCHI ====================
export type WorkerPosition = 'mason' | 'welder' | 'electrician' | 'plumber' | 'carpenter' | 'painter' | 'laborer' | 'driver' | 'crane_operator' | 'other';

export interface Worker {
  id: string;
  fullName: string;
  position: WorkerPosition;
  phone: string;
  projectId: string;
  prorabId: string;
  dailyRate: number; // kunlik ish haqi
  monthlySalary: number;
  rating: number; // 1-5 o'rtacha
  isActive: boolean;
  hireDate: string;
}

// ==================== MATERIAL ====================
export type MaterialCategory = 'cement' | 'metal' | 'wood' | 'brick' | 'sand' | 'electrical' | 'plumbing' | 'paint' | 'insulation' | 'other';
export type MaterialUnit = 'kg' | 'tonna' | 'metr' | 'm2' | 'm3' | 'dona' | 'litr' | 'paket' | 'rulon';

export interface Material {
  id: string;
  name: string;
  category: MaterialCategory;
  unit: MaterialUnit;
  quantity: number;
  minQuantity: number; // minimum chegara
  pricePerUnit: number;
  totalValue: number;
  lastUpdated: string;
}

// ==================== NORMATIV ====================
export interface MaterialNorm {
  id: string;
  materialId: string;
  materialName: string;
  unit: MaterialUnit;
  normPerUnit: number; // masalan: 1m² beton uchun 300kg sement
  workUnit: string; // masalan: "m² beton", "m² g'isht", "metr truba"
  tolerance: number; // ruxsat etilgan farq % (masalan: 10)
}

export interface NormViolation {
  id: string;
  normId: string;
  projectId: string;
  prorabId: string;
  materialName: string;
  expectedUsage: number;
  actualUsage: number;
  differencePercent: number;
  workDone: string;
  date: string;
  status: 'new' | 'reviewed' | 'resolved';
  reviewComment?: string;
}

// ==================== VAZIFA ====================
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assignedTo: string; // worker yoki prorab
  createdBy: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  completedAt?: string;
  createdAt: string;
}

// ==================== MATERIAL SO'ROV ====================
export type RequestStatus = 'pending' | 'approved' | 'rejected' | 'delivered';

export interface MaterialRequest {
  id: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: MaterialUnit;
  projectId: string;
  requestedBy: string; // prorab
  requestedByName: string;
  status: RequestStatus;
  urgency: 'normal' | 'urgent';
  comment?: string;
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

// ==================== HISOBOT ====================
export interface DailyReport {
  id: string;
  projectId: string;
  prorabId: string;
  prorabName: string;
  date: string;
  workDone: string; // bajarilgan ish tavsifi
  materialsUsed: MaterialUsage[];
  workersPresent: number;
  issues?: string;
  photos: PhotoEntry[];
  isSigned: boolean;
  signedAt?: string;
  createdAt: string;
}

export interface MaterialUsage {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: MaterialUnit;
  workDescription: string; // qanday ishga ishlatildi
  workAmount: number; // qancha ish bajarildi (masalan: 50 m²)
  workUnit: string;
}

// ==================== RASM ====================
export interface PhotoEntry {
  id: string;
  url: string;
  projectId: string;
  uploadedBy: string;
  uploadedByName: string;
  gpsLat?: number;
  gpsLng?: number;
  gpsAddress?: string;
  timestamp: string;
  description?: string;
}

// ==================== AUKTSION ====================
export type AuctionStatus = 'open' | 'closed' | 'approved' | 'rejected';

export interface Auction {
  id: string;
  title: string;
  description: string;
  projectId?: string;
  createdBy: string;
  createdByName: string;
  status: AuctionStatus;
  startDate: string;
  endDate: string;
  bids: AuctionBid[];
  winnerId?: string;
  winnerName?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface AuctionBid {
  id: string;
  auctionId: string;
  bidderId: string;
  bidderName: string;
  company: string;
  amount: number;
  description: string;
  createdAt: string;
}

// ==================== OYLIK ====================
export interface Salary {
  id: string;
  workerId: string;
  workerName: string;
  position: WorkerPosition;
  projectId: string;
  month: string; // "2026-03"
  workDays: number;
  attendedDays: number;
  dailyRate: number;
  totalAmount: number;
  bonus: number;
  deduction: number;
  finalAmount: number;
  isPaid: boolean;
  paidAt?: string;
  isSigned: boolean;
}

// ==================== XARID CHEK ====================
export interface Receipt {
  id: string;
  supplierId: string;
  supplierName: string;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: MaterialUnit;
  pricePerUnit: number;
  totalAmount: number;
  receiptPhoto?: string;
  date: string;
  addedBy: string;
  addedByName: string;
}

// ==================== YETKAZIB BERUVCHI ====================
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address: string;
  materials: string[]; // qaysi materiallarni yetkazadi
  rating: number; // 1-5 o'rtacha
  totalOrders: number;
  createdAt: string;
}

// ==================== YETKAZIB BERISH ====================
export type DeliveryStatus = 'pending' | 'in_transit' | 'delivered' | 'cancelled';

export interface Delivery {
  id: string;
  supplierId: string;
  supplierName: string;
  materials: { materialName: string; quantity: number; unit: MaterialUnit }[];
  status: DeliveryStatus;
  expectedDate: string;
  actualDate?: string;
  projectId: string;
  createdAt: string;
}

// ==================== OMBOR KIRIM/CHIQIM ====================
export type InventoryMovementType = 'incoming' | 'outgoing';

export interface InventoryMovement {
  id: string;
  type: InventoryMovementType;
  materialId: string;
  materialName: string;
  quantity: number;
  unit: MaterialUnit;
  projectId?: string;
  supplierId?: string;
  supplierName?: string;
  receivedBy?: string; // prorab ismi (chiqimda)
  processedBy: string; // ombor mudiri
  processedByName: string;
  receiptId?: string;
  photo?: string;
  isSigned: boolean;
  signedBy?: string[];
  date: string;
}

// ==================== INVENTARIZATSIYA ====================
export interface InventoryCheck {
  id: string;
  materialId: string;
  materialName: string;
  systemQuantity: number;
  actualQuantity: number;
  difference: number;
  differencePercent: number;
  checkedBy: string;
  checkedByName: string;
  comment?: string;
  date: string;
  isAlert: boolean;
}

// ==================== DAVOMAT ====================
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface Attendance {
  id: string;
  workerId: string;
  workerName: string;
  projectId: string;
  date: string;
  status: AttendanceStatus;
  checkInTime?: string;
  comment?: string;
  markedBy: string;
}

// ==================== NOTIFICATION ====================
export type NotificationType = 'info' | 'warning' | 'critical' | 'success';
export type NotificationCategory =
  | 'material_request'
  | 'norm_violation'
  | 'inventory_discrepancy'
  | 'gps_mismatch'
  | 'salary_mismatch'
  | 'daily_report'
  | 'low_stock'
  | 'auction'
  | 'attendance'
  | 'user_blocked'
  | 'comment'
  | 'rating'
  | 'general';

export interface Notification {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  message: string;
  recipientId: string;
  recipientRole: UserRole;
  senderId?: string;
  senderName?: string;
  link?: string; // qaysi sahifaga olib boradi
  isRead: boolean;
  createdAt: string;
}

// ==================== IZOH ====================
export type CommentTargetType =
  | 'project'
  | 'worker'
  | 'prorab'
  | 'report'
  | 'task'
  | 'material_request'
  | 'inventory_check'
  | 'photo'
  | 'receipt'
  | 'auction'
  | 'attendance'
  | 'supplier';

export interface Comment {
  id: string;
  targetType: CommentTargetType;
  targetId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  text: string;
  parentId?: string; // javob uchun
  createdAt: string;
}

// ==================== REYTING ====================
export type RatingTargetType = 'worker' | 'prorab' | 'ombor_mudiri' | 'supplier' | 'material_quality' | 'auction_participant';

export interface Rating {
  id: string;
  targetType: RatingTargetType;
  targetId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  stars: 1 | 2 | 3 | 4 | 5;
  comment: string; // majburiy izoh
  createdAt: string;
}

// ==================== MUAMMO ====================
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface Issue {
  id: string;
  title: string;
  description: string;
  projectId?: string;
  reportedBy: string;
  reportedByName: string;
  priority: IssuePriority;
  status: IssueStatus;
  assignedTo?: string;
  resolvedAt?: string;
  createdAt: string;
}

// ==================== FAOLIYAT LOGI ====================
export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  targetType?: string;
  targetId?: string;
  createdAt: string;
}

// ==================== IMZO ====================
export interface DigitalSignature {
  id: string;
  documentType: string;
  documentId: string;
  signedBy: string;
  signerName: string;
  signerRole: UserRole;
  signedAt: string;
}

// ==================== NAVIGATION ====================
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}
