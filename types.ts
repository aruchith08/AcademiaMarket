
export type UserRole = 'assigner' | 'writer';

export enum TaskStatus {
  PENDING = 'Pending', // Publicly visible
  REQUESTED = 'Requested', // Handshake in progress
  IN_PROGRESS = 'In Progress',
  REVIEW = 'In Review',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled'
}

export interface TaskAttachment {
  name: string;
  type: string;
  size: number;
  data: string; // Base64 representation for frontend-only persistence
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
  previewUrl?: string;
  submissionUrl?: string;
  // Mutual rating fields
  ratingFromAssigner?: number;
  reviewFromAssigner?: string;
  ratingFromWriter?: number;
  reviewFromWriter?: string;
}

export interface HubActivity {
  id: string;
  type: 'alert' | 'success' | 'info' | 'message';
  title: string;
  content: string;
  timestamp: string;
  icon: string;
}

export interface Message {
  id: string;
  taskId: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'bargain_offer' | 'file' | 'system';
  offerAmount?: number;
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
  pastWork?: string[]; // Titles of old tasks
}
