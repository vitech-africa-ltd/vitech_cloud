// ============================================
// VITECH CLOUD — CORE TYPES
// ============================================

export type Role = "USER" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  storageUsed: number;
  storageQuota: number;
  createdAt: string;
  updatedAt: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  extension: string;
  folderId: string | null;
  isFavorite: boolean;
  isTrashed: boolean;
  trashedAt?: string;
  createdAt: string;
  updatedAt: string;
  fileData?: string; // Base64 for demo downloads
}

export interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UploadTask {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error" | "paused";
  error?: string;
  folderId: string | null;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: ActivityAction;
  fileName?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export type ActivityAction =
  | "LOGIN"
  | "LOGOUT"
  | "UPLOAD"
  | "DOWNLOAD"
  | "DELETE"
  | "RESTORE"
  | "SHARE"
  | "RENAME"
  | "MOVE"
  | "CREATE_FOLDER"
  | "FAVORITE";

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message?: string;
  duration?: number;
}

export interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

// File type categories for icons and colors
export const FILE_CATEGORIES: Record<string, { icon: string; color: string }> = {
  pdf: { icon: "FileText", color: "#ef4444" },
  doc: { icon: "FileText", color: "#2563eb" },
  docx: { icon: "FileText", color: "#2563eb" },
  txt: { icon: "FileText", color: "#64748b" },
  xls: { icon: "FileSpreadsheet", color: "#16a34a" },
  xlsx: { icon: "FileSpreadsheet", color: "#16a34a" },
  csv: { icon: "FileSpreadsheet", color: "#16a34a" },
  ppt: { icon: "Presentation", color: "#ea580c" },
  pptx: { icon: "Presentation", color: "#ea580c" },
  jpg: { icon: "Image", color: "#ec4899" },
  jpeg: { icon: "Image", color: "#ec4899" },
  png: { icon: "Image", color: "#ec4899" },
  gif: { icon: "Image", color: "#ec4899" },
  webp: { icon: "Image", color: "#ec4899" },
  svg: { icon: "Image", color: "#ec4899" },
  mp4: { icon: "Video", color: "#8b5cf6" },
  webm: { icon: "Video", color: "#8b5cf6" },
  mov: { icon: "Video", color: "#8b5cf6" },
  mp3: { icon: "Music", color: "#f59e0b" },
  wav: { icon: "Music", color: "#f59e0b" },
  ogg: { icon: "Music", color: "#f59e0b" },
  zip: { icon: "Archive", color: "#ca8a04" },
  rar: { icon: "Archive", color: "#ca8a04" },
  "7z": { icon: "Archive", color: "#ca8a04" },
  tar: { icon: "Archive", color: "#ca8a04" },
  gz: { icon: "Archive", color: "#ca8a04" },
};

export const DEFAULT_FILE_CATEGORY = { icon: "File", color: "#64748b" };

// Storage quota alerts
export const QUOTA_ALERTS = {
  WARNING: 75, // 75%
  DANGER: 90, // 90%
  FULL: 100, // 100%
};

// Allowed file extensions
export const ALLOWED_EXTENSIONS = [
  "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "csv",
  "zip", "rar", "7z", "tar", "gz",
  "jpg", "jpeg", "png", "webp", "gif", "svg",
  "mp4", "webm", "mov",
  "mp3", "wav", "ogg",
];

// Max file size (5 GB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024;

// Default quota (10 GB)
export const DEFAULT_QUOTA = 10 * 1024 * 1024 * 1024;
