// ============================================
// VITECH CLOUD — DATABASE TYPES
// ============================================

export type UserRole = 'owner' | 'admin' | 'manager' | 'member' | 'viewer';
export type UserStatus = 'active' | 'suspended' | 'pending' | 'deleted';
export type FileStatus = 'uploading' | 'processing' | 'ready' | 'failed' | 'deleted';
export type SharePermission = 'view' | 'download' | 'edit';
export type ShareStatus = 'active' | 'expired' | 'revoked';
export type NotificationType = 'upload' | 'share' | 'security' | 'storage' | 'system' | 'admin';
export type ActivityAction = 
  | 'login' | 'logout' | 'upload' | 'download' | 'create_folder' | 'rename' | 'move'
  | 'copy' | 'share' | 'unshare' | 'favorite' | 'delete' | 'restore' | 'permanent_delete'
  | 'update_profile' | 'change_password';
export type SecurityEventType = 
  | 'failed_login' | 'successful_login' | 'password_changed' | 'email_changed'
  | 'session_created' | 'session_revoked' | 'suspicious_activity';
export type StorageEventType = 'upload' | 'delete' | 'restore' | 'permanent_delete' | 'download';

// ============================================
// TABLE INTERFACES
// ============================================

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  timezone: string;
  language: string;
  created_at: string;
  updated_at: string;
  last_seen_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  email_notifications: boolean;
  security_notifications: boolean;
  marketing_notifications: boolean;
  default_view: 'grid' | 'list';
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  owner_id: string | null;
  plan: 'free' | 'pro' | 'business' | 'enterprise';
  status: UserStatus;
  storage_limit: number;
  created_at: string;
  updated_at: string;
}

export interface OrganizationMember {
  id: string;
  organization_id: string;
  user_id: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
}

export interface Folder {
  id: string;
  organization_id: string | null;
  user_id: string;
  parent_id: string | null;
  name: string;
  path: string | null;
  depth: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface File {
  id: string;
  organization_id: string | null;
  owner_id: string;
  folder_id: string | null;
  name: string;
  original_name: string;
  storage_provider: 'r2' | 'local' | 's3' | 'minio';
  storage_bucket: string | null;
  storage_key: string;
  mime_type: string;
  extension: string;
  size_bytes: number;
  checksum: string | null;
  status: FileStatus;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface FileVersion {
  id: string;
  file_id: string;
  version_number: number;
  storage_key: string;
  size_bytes: number;
  checksum: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Share {
  id: string;
  file_id: string | null;
  folder_id: string | null;
  created_by: string;
  token: string;
  permission: SharePermission;
  password_hash: string | null;
  expires_at: string | null;
  max_downloads: number | null;
  download_count: number;
  status: ShareStatus;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  file_id: string | null;
  folder_id: string | null;
  created_at: string;
}

export interface Trash {
  id: string;
  user_id: string;
  file_id: string | null;
  folder_id: string | null;
  original_parent_id: string | null;
  deleted_at: string;
  scheduled_permanent_delete_at: string | null;
}

export interface StorageUsage {
  id: string;
  organization_id: string | null;
  user_id: string;
  files_count: number;
  folders_count: number;
  storage_used_bytes: number;
  storage_limit_bytes: number;
  updated_at: string;
}

export interface StorageEvent {
  id: string;
  organization_id: string | null;
  user_id: string;
  file_id: string | null;
  event_type: StorageEventType;
  size_bytes: number;
  created_at: string;
}

export interface Activity {
  id: string;
  organization_id: string | null;
  user_id: string;
  action: ActivityAction;
  entity_type: 'file' | 'folder' | 'share' | 'user' | 'organization' | null;
  entity_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface SecurityEvent {
  id: string;
  user_id: string;
  event_type: SecurityEventType;
  ip_address: string | null;
  user_agent: string | null;
  location: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Record<string, any>;
  ip_address: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string | null;
  action_url: string | null;
  is_read: boolean;
  created_at: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  type: 'string' | 'number' | 'boolean' | 'json';
  description: string | null;
  updated_by: string | null;
  updated_at: string;
}

// ============================================
// ANALYTICS TYPES
// ============================================

export interface DailyStorageStats {
  date: string;
  user_id: string;
  uploaded_bytes: number;
  deleted_bytes: number;
  upload_count: number;
  download_count: number;
}

export interface UserActivitySummary {
  user_id: string;
  total_activities: number;
  upload_count: number;
  download_count: number;
  share_count: number;
  last_activity: string;
}

export interface FileTypeDistribution {
  extension: string;
  file_count: number;
  total_size: number;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: any;
}

export type ErrorCode = 
  | 'AUTH_REQUIRED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'QUOTA_EXCEEDED'
  | 'UPLOAD_FAILED'
  | 'STORAGE_ERROR'
  | 'DATABASE_ERROR'
  | 'INVALID_INPUT'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR';

// ============================================
// DASHBOARD TYPES
// ============================================

export interface DashboardStats {
  totalFiles: number;
  totalFolders: number;
  storageUsed: number;
  storageLimit: number;
  storagePercentage: number;
  recentUploads: number;
  recentDownloads: number;
  totalShares: number;
}

export interface AnalyticsData {
  period: '7d' | '30d' | '90d' | '1y';
  storageOverTime: Array<{
    date: string;
    storageUsed: number;
  }>;
  activityOverTime: Array<{
    date: string;
    uploads: number;
    downloads: number;
    deletes: number;
  }>;
  fileTypes: Array<{
    type: string;
    count: number;
    size: number;
  }>;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalFiles: number;
  totalStorage: number;
  uploadsToday: number;
  downloadsToday: number;
  totalShares: number;
  failedOperations: number;
}

export interface UserWithStats {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  filesCount: number;
  storageUsed: number;
  storageLimit: number;
  usagePercentage: number;
  lastActivity: string;
  createdAt: string;
}

// ============================================
// HEALTH CHECK TYPES
// ============================================

export interface SystemHealth {
  database: HealthStatus;
  storage: HealthStatus;
  authentication: HealthStatus;
  api: HealthStatus;
}

export interface HealthStatus {
  status: 'operational' | 'degraded' | 'down';
  latency?: number;
  lastChecked: string;
  message?: string;
}
