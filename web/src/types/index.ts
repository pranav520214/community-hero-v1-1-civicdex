// Type definitions for CivicDex Web

export type UserRole = 'CITIZEN' | 'OFFICER' | 'WORKER' | 'ADMINISTRATOR' | 'HELPER';

export type IssueStatus = 
  | 'PENDING'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'AWAITING_VERIFICATION'
  | 'WORK_COMPLETED'
  | 'OFFICER_AUDIT'
  | 'CLOSED'
  | 'REJECTED';

export type IssueSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type IssueCategory = 
  | 'ROADS'
  | 'WATER'
  | 'ELECTRICITY'
  | 'WASTE'
  | 'STREETLIGHTS'
  | 'DRAINAGE'
  | 'OTHER';

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  division?: string;
  phone?: string;
  avatarUrl?: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface Issue {
  id: string;
  reporterId: string;
  reporterName: string;
  title: string;
  description: string;
  category: IssueCategory;
  severity: IssueSeverity;
  status: IssueStatus;
  location: GeoPoint;
  address: string;
  imageUrl?: string;
  verificationCount: number;
  priorityScore: number;
  createdAt: Date;
  updatedAt: Date;
  assignedTeamId?: string;
  completedAt?: Date;
  closedAt?: Date;
  aiAnalysis?: {
    isFraud: boolean;
    fraudReason?: string;
    confidenceScore: number;
  };
}

export interface Team {
  id: string;
  name: string;
  division: string;
  leadWorkerId: string;
  members: string[];
  specialties: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'BUSY';
  activeAssignmentId?: string;
  createdAt: Date;
}

export interface TeamAssignment {
  id: string;
  issueId: string;
  teamId: string;
  assignedBy: string;
  status: IssueStatus;
  assignedAt: Date;
  estimatedCompletionTime?: Date;
  workerConfirmations: Record<string, boolean>;
}

export interface WorkerAvailability {
  id: string;
  name: string;
  trade: string;
  currentLocation: GeoPoint;
  isAvailable: boolean;
  currentWorkloadCount: number;
  lastShiftStarted?: Date;
  division: string;
}

export interface TaskHistory {
  id: string;
  issueId: string;
  status: IssueStatus;
  assignedTeamId: string;
  workersInvolved: string[];
  beforeImageUrl?: string;
  afterImageUrl?: string;
  validation?: {
    improvementScore: number;
    confidenceScore: number;
    fraudRiskScore: number;
    feedback: string;
  };
  completedAt?: Date;
  closedAt?: Date;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  division: string;
  creatorId: string;
  moderators: string[];
  isPublic: boolean;
  inviteCode?: string;
  createdAt: Date;
  memberCount: number;
}

export interface Message {
  id: string;
  channelOrGroupId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatarUrl?: string;
  text: string;
  imageUrl?: string;
  documentUrl?: string;
  voiceNoteUrl?: string;
  voiceNoteDuration?: number;
  reactions: Record<string, string[]>;
  replyToId?: string;
  isPinned: boolean;
  timestamp: Date;
}

export interface Announcement {
  id: string;
  channelId: string;
  postedBy: string;
  title: string;
  content: string;
  category: string;
  imageUrl?: string;
  timestamp: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'ALERT' | 'TASK' | 'UPDATE';
  issueId?: string;
  isRead: boolean;
  createdAt: Date;
}

export interface AIRecommendation {
  id: string;
  issueId: string;
  requiredSkills: string[];
  recommendedTeams: Array<{
    teamId: string;
    distanceKm: number;
    estimatedHours: number;
    priorityScore: number;
    reasoning: string;
  }>;
  generatedAt: Date;
}

export interface SupportZone {
  polygonBounds: Array<[number, number]>;
  division: string;
  ward: string;
  officerName: string;
  officerPhone: string;
  officerEmail: string;
  officeAddress: string;
  workingHours: string;
}
