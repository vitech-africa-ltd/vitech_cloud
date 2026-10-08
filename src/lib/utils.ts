// ============================================
// VITECH CLOUD — UTILITY FUNCTIONS
// ============================================

import { FILE_CATEGORIES, DEFAULT_FILE_CATEGORY } from "../types";

/**
 * Format bytes to human-readable string
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/**
 * Format date to relative time
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: days > 365 ? "numeric" : undefined,
  });
}

/**
 * Format date to full date string
 */
export function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

/**
 * Get file category info (icon and color)
 */
export function getFileCategory(extension: string): { icon: string; color: string } {
  return FILE_CATEGORIES[extension.toLowerCase()] || DEFAULT_FILE_CATEGORY;
}

/**
 * Check if file is previewable
 */
export function isPreviewable(mimeType: string): boolean {
  if (mimeType.startsWith("image/")) return true;
  if (mimeType.startsWith("video/")) return true;
  if (mimeType.startsWith("audio/")) return true;
  if (mimeType === "application/pdf") return true;
  if (mimeType.startsWith("text/")) return true;
  return false;
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Password must contain an uppercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Password must contain a number" };
  }
  return { valid: true };
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/**
 * Calculate storage percentage
 */
export function calculateStoragePercent(used: number, quota: number): number {
  if (quota === 0) return 0;
  return Math.min(100, (used / quota) * 100);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error("Failed to copy:", error);
    return false;
  }
}

/**
 * Download file from blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  return window.innerWidth < 768;
}

/**
 * Check if device is tablet
 */
export function isTablet(): boolean {
  return window.innerWidth >= 768 && window.innerWidth < 1024;
}

/**
 * Check if device is desktop
 */
export function isDesktop(): boolean {
  return window.innerWidth >= 1024;
}

/**
 * Sort files by criteria
 */
export function sortFiles<T extends { name: string; updatedAt: string; size: number }>(
  files: T[],
  sortBy: "name" | "date" | "size",
  order: "asc" | "desc"
): T[] {
  return [...files].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "date") {
      comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else if (sortBy === "size") {
      comparison = b.size - a.size;
    }

    return order === "asc" ? comparison : -comparison;
  });
}

/**
 * Filter files by search query
 */
export function filterFiles<T extends { name: string }>(
  files: T[],
  query: string
): T[] {
  if (!query.trim()) return files;
  const lowerQuery = query.toLowerCase();
  return files.filter((file) => file.name.toLowerCase().includes(lowerQuery));
}

/**
 * Group files by extension
 */
export function groupFilesByExtension<T extends { extension: string }>(
  files: T[]
): Record<string, T[]> {
  return files.reduce((groups, file) => {
    const ext = file.extension || "other";
    if (!groups[ext]) {
      groups[ext] = [];
    }
    groups[ext].push(file);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Calculate total size of files
 */
export function calculateTotalSize<T extends { size: number }>(files: T[]): number {
  return files.reduce((total, file) => total + file.size, 0);
}

/**
 * Get file type category
 */
export function getFileTypeCategory(extension: string): string {
  const ext = extension.toLowerCase();
  if (["pdf", "doc", "docx", "txt", "xls", "xlsx", "csv", "ppt", "pptx"].includes(ext)) {
    return "document";
  }
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
    return "image";
  }
  if (["mp4", "webm", "mov"].includes(ext)) {
    return "video";
  }
  if (["mp3", "wav", "ogg"].includes(ext)) {
    return "audio";
  }
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
    return "archive";
  }
  return "other";
}
