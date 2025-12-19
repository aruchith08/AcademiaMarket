
export type UserRole = 'assigner' | 'writer';

export enum TaskStatus {
  PENDING = 'Pending',
  REQUESTED = 'Requested',
  IN_PROGRESS = 'In Progress',
  REVIEW = 'In Review',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export interface TaskAttachment {
  name: string;
  type: string;
  size: number;
  url: string; // URL from Firebase Storage
  path?: string; // Reference path in storage
}

export interface Task {
  id: string;
  title: string;
  description: string;
  subject: string;
  pageCount: number;
  deadline: string;
  status: TaskStatus;
  estimatedPrice: number;
  agreedPrice?: number;
  assignerId: string;
  writerId?: string;
  createdAt: string;
  format: 'Digital' | 'Handwritten' | 'Mixed';
  bargainEnabled: boolean;
  attachments?: TaskAttachment[];
  handshakeStatus?: 'none' | 'writer_requested' | 'assigner_invited' | 'accepted';
  lastMessage?: string;
  lastMessageAt?: any;
}

export interface Message {
  id: string;
  taskId: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: any; // Firestore Timestamp
  type: 'text' | 'file' | 'system';
  fileUrl?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  rating: number;
  completedTasks: number;
  earnings?: number;
  pricePerPage?: number;
  avatar: string;
  password?: string;
  bio?: string;
  specialties?: string[];
  isBusy?: boolean;
  collegeName?: string;
  pincode?: string;
  isBargainable?: boolean;
}
