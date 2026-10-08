// ============================================
// VITECH CLOUD — API LAYER
// ============================================

import { supabase } from '../supabase/client';
import { config } from '../../config';
import type {
  Profile, File, Folder, StorageUsage, Activity, Share, Notification,
  ApiResponse, ApiError, ErrorCode
} from '../../types/database';

// ============================================
// ERROR HANDLING
// ============================================

function createError(code: ErrorCode, message: string, details?: any): ApiError {
  return { code, message, details };
}

function handleSupabaseError(error: any): ApiError {
  console.error('Supabase error:', error);
  
  if (error.code === '23505') {
    return createError('INVALID_INPUT', 'Duplicate entry detected');
  }
  if (error.code === '23503') {
    return createError('INVALID_INPUT', 'Reference integrity violation');
  }
  if (error.message?.includes('JWT')) {
    return createError('AUTH_REQUIRED', 'Authentication required');
  }
  
  return createError('DATABASE_ERROR', error.message || 'Database error occurred');
}

// ============================================
// FILES API
// ============================================

export const filesApi = {
  async list(userId: string, folderId?: string | null): Promise<ApiResponse<File[]>> {
    if (config.isDemoMode) {
      const files = JSON.parse(localStorage.getItem('vitech-files') || '[]');
      const filtered = files.filter((f: File) => 
        f.owner_id === userId && 
        f.folder_id === folderId && 
        !f.deleted_at
      );
      return { data: filtered, error: null };
    }

    try {
      let query = supabase
        .from('files')
        .select('*')
        .eq('owner_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (folderId !== undefined) {
        query = folderId === null 
          ? query.is('folder_id', null)
          : query.eq('folder_id', folderId);
      }

      const { data, error } = await query;
      if (error) return { data: null, error: handleSupabaseError(error) };
      return { data: data as File[], error: null };
    } catch (error: any) {
      return { data: null, error: createError('DATABASE_ERROR', error.message) };
    }
  },

  async getById(fileId: string, userId: string): Promise<ApiResponse<File>> {
    if (config.isDemoMode) {
      const files = JSON.parse(localStorage.getItem('vitech-files') || '[]');
      const file = files.find((f: File) => f.id === fileId && f.owner_id === userId);
      return file 
        ? { data: file, error: null }
        : { data: null, error: createError('NOT_FOUND', 'File not found') };
    }

    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('id', fileId)
        .eq('owner_id', userId)
        .single();

      if (error) return { data: null, error: handleSupabaseError(error) };
      return { data: data as File, error: null };
    } catch (error: any) {
      return { data: null, error: createError('DATABASE_ERROR', error.message) };
    }
  },

  async create(file: Partial<File>): Promise<ApiResponse<File>> {
    if (config.isDemoMode) {
      const files = JSON.parse(localStorage.getItem('vitech-files') || '[]');
      const newFile = {
        ...file,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as File;
      files.push(newFile);
      localStorage.setItem('vitech-files', JSON.stringify(files));
      return { data: newFile, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('files')
        .insert(file)
        .select()
        .single();

      if (error) return { data: null, error: handleSupabaseError(error) };
      return { data: data as File, error: null };
    } catch (error: any) {
      return { data: null, error: createError('DATABASE_ERROR', error.message) };
    }
  },

  async update(fileId: string, updates: Partial<File>, userId: string): Promise<ApiResponse<File>> {
    if (config.isDemoMode) {
      const files = JSON.parse(localStorage.getItem('vitech-files') || '[]');
      const index = files.findIndex((f: File) => f.id === fileId && f.owner_id === userId);
      if (index === -1) {
        return { data: null, error: createError('NOT_FOUND', 'File not found') };
      }
      files[index] = { ...files[index], ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem('vitech-files', JSON.stringify(files));
      return { data: files[index], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('files')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', fileId)
        .eq('owner_id', userId)
        .select()
        .single();

      if (error) return { data: null, error: handleSupabaseError(error) };
      return { data: data as File, error: null };
    } catch (error: any) {
      return { data: null, error: createError('DATABASE_ERROR', error.message) };
    }
  },

  async delete(fileId: string, userId: string): Promise<ApiResponse<void>> {
    if (config.isDemoMode) {
      const files = JSON.parse(localStorage.getItem('vitech-files') || '[]');
      const index = files.findIndex((f: File) => f.id === fileId && f.owner_id === userId);
      if (index === -1) {
        return { data: null, error: createError('NOT_FOUND', 'File not found') };
      }
      files[index].deleted_at = new Date().toISOString();
      localStorage.setItem('vitech-files', JSON.stringify(files));
      return { data: undefined, error: null };
    }

    try {
      const { error } = await supabase
        .from('files')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', fileId)
        .eq('owner_id', userId);

      if (error) return { data: null, error: handleSupabaseError(error) };
      return { data: undefined, error: null };
    } catch (error: any) {
      return { data: null, error: createError('DATABASE_ERROR', error.message) };
    }
  },
};

// ============================================
// FOLDERS API
// ============================================

export const foldersApi = {
  async list(userId: string, parentId?: string | null): Promise<ApiResponse<Folder[]>> {
    if (config.isDemoMode) {
      const folders = JSON.parse(localStorage.getItem('vitech-folders') || '[]');
      const filtered = folders.filter((f: Folder) => 
        f.user_id === userId && 
        f.parent_id === parentId && 
        !f.deleted_at
      );
      return { data: filtered, error: null };
    }

    try {
      let query = supabase
        .from('folders')
        .select('*')
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('name');

      if (parentId !== undefined) {
        query = parentId === null 
          ? query.is('parent_id', null)
          : query.eq('parent_id', parentId);
      }

      const { data, error } = await query;
      if (error) return { data: null, error: handleSupabaseError(error) };
      return { data: data as Folder[], error: null };
    } catch (error: any) {
      return { data: null, error: createError('DATABASE_ERROR', error.message) };
    }
  },

  async create(folder: Partial<Folder>): Promise<ApiResponse<Folder>> {
    if (config.isDemoMode) {
      const folders = JSON.parse(localStorage.getItem('vitech-folders') || '[]');
      const newFolder = {
        ...folder,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Folder;
      folders.push(newFolder);
      localStorage.setItem('vitech-folders', JSON.stringify(folders));
      return { data: newFolder, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('folders')
        .insert(folder)
        .select()
        .single();

      if (error) return { data: null, error: handleSupabaseError(error) };
      return { data: data as Folder, error: null };
    } catch (error: any) {
      return { data: null, error: createError('DATABASE_ERROR', error.message) };
    }
  },

  async update(folderId: string, updates: Partial<Folder>, userId: string): Promise<ApiResponse<Folder>> {
    if (config.isDemoMode) {
      const folders = JSON.parse(localStorage.getItem('vitech-folders') || '[]');
      const index = folders.findIndex((f: Folder) => f.id === folderId && f.user_id === userId);
      if (index === -1) {
        return { data: null, error: createError('NOT_FOUND', 'Folder not found') };
      }
      folders[index] = { ...folders[index], ...updates, updated_at: new Date().toISOString() };
      localStorage.setItem('vitech-folders', JSON.stringify(folders));
      return { data: folders[index], error: null };
    }

    try {
      const { data, error } = await supabase
        .from('folders')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', folderId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) return { data: null, error: handleSupabaseError(error) };
      return { data: data as Folder, error: null };
    } catch (error: any) {
      return { data: null, error: createError('DATABASE_ERROR', error.message) };
    }
  },
};

// ============================================
// STORAGE USAGE API
// ============================================

export const storageApi = {
  async getUsage(userId: string): Promise<ApiResponse<StorageUsage>> {
    if (config.isDemoMode) {
      const files = JSON.parse(localStorage.getItem('vitech-files') || '[]');
      const userFiles = files.filter((f: File) => f.owner_id === userId && !f.deleted_at);
      const totalSize = userFiles.reduce((sum: number, f: File) => sum + f.size_bytes, 0);
      
      return {
        data: {
          id: 'demo-usage',
          user_id: userId,
          organization_id: null,
          files_count: userFiles.length,
          folders_count: 0,
          storage_used_bytes: totalSize,
          storage_limit_bytes: 10 * 1024 * 1024 * 1024, // 10 GB
          updated_at: new Date().toISOString(),
        },
        error: null,
      };
    }

    try {
      const { data, error } = await supabase
        .from('storage_usage')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) return { data: null, error: handleSupabaseError(error) };
      return { data: data as StorageUsage, error: null };
    } catch (error: any) {
      return { data: null, error: createError('DATABASE_ERROR', error.message) };
    }
  },
};

// ============================================
// ACTIVITIES API
// ============================================

export const activitiesApi = {
  async log(activity: Partial<Activity>): Promise<ApiResponse<Activity>> {
    if (config.isDemoMode) {
      const activities = JSON.parse(localStorage.getItem('vitech-activities') || '[]');
      const newActivity = {
        ...activity,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      } as Activity;
      activities.unshift(newActivity);
      localStorage.setItem('vitech-activities', JSON.stringify(activities.slice(0, 100)));
      return { data: newActivity, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('activities')
        .insert(activity)
        .select()
        .single();

      if (error) return { data: null, error: handleSupabaseError(error) };
      return { data: data as Activity, error: null };
    } catch (error: any) {
      return { data: null, error: createError('DATABASE_ERROR', error.message) };
    }
  },

  async list(userId: string, limit = 50): Promise<ApiResponse<Activity[]>> {
    if (config.isDemoMode) {
      const activities = JSON.parse(localStorage.getItem('vitech-activities') || '[]');
      return { data: activities.slice(0, limit), error: null };
    }

    try {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return { data: null, error: handleSupabaseError(error) };
      return { data: data as Activity[], error: null };
    } catch (error: any) {
      return { data: null, error: createError('DATABASE_ERROR', error.message) };
    }
  },
};

// ============================================
// SHARES API
// ============================================

export const sharesApi = {
  async create(share: Partial<Share>): Promise<ApiResponse<Share>> {
    if (config.isDemoMode) {
      const shares = JSON.parse(localStorage.getItem('vitech-shares') || '[]');
      const newShare = {
        ...share,
        id: crypto.randomUUID(),
        token: crypto.randomUUID().replace(/-/g, '').slice(0, 16),
        created_at: new Date().toISOString(),
      } as Share;
      shares.push(newShare);
      localStorage.setItem('vitech-shares', JSON.stringify(shares));
      return { data: newShare, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('shares')
        .insert(share)
        .select()
        .single();

      if (error) return { data: null, error: handleSupabaseError(error) };
      return { data: data as Share, error: null };
    } catch (error: any) {
      return { data: null, error: createError('DATABASE_ERROR', error.message) };
    }
  },

  async list(userId: string): Promise<ApiResponse<Share[]>> {
    if (config.isDemoMode) {
      const shares = JSON.parse(localStorage.getItem('vitech-shares') || '[]');
      return { data: shares.filter((s: Share) => s.created_by === userId), error: null };
    }

    try {
      const { data, error } = await supabase
        .from('shares')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (error) return { data: null, error: handleSupabaseError(error) };
      return { data: data as Share[], error: null };
    } catch (error: any) {
      return { data: null, error: createError('DATABASE_ERROR', error.message) };
    }
  },
};

// ============================================
// NOTIFICATIONS API
// ============================================

export const notificationsApi = {
  async create(notification: Partial<Notification>): Promise<ApiResponse<Notification>> {
    if (config.isDemoMode) {
      const notifications = JSON.parse(localStorage.getItem('vitech-notifications') || '[]');
      const newNotification = {
        ...notification,
        id: crypto.randomUUID(),
        is_read: false,
        created_at: new Date().toISOString(),
      } as Notification;
      notifications.unshift(newNotification);
      localStorage.setItem('vitech-notifications', JSON.stringify(notifications.slice(0, 50)));
      return { data: newNotification, error: null };
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)
        .select()
        .single();

      if (error) return { data: null, error: handleSupabaseError(error) };
      return { data: data as Notification, error: null };
    } catch (error: any) {
      return { data: null, error: createError('DATABASE_ERROR', error.message) };
    }
  },

  async list(userId: string, unreadOnly = false): Promise<ApiResponse<Notification[]>> {
    if (config.isDemoMode) {
      const notifications = JSON.parse(localStorage.getItem('vitech-notifications') || '[]');
      const filtered = unreadOnly 
        ? notifications.filter((n: Notification) => !n.is_read)
        : notifications;
      return { data: filtered, error: null };
    }

    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (unreadOnly) {
        query = query.eq('is_read', false);
      }

      const { data, error } = await query;
      if (error) return { data: null, error: handleSupabaseError(error) };
      return { data: data as Notification[], error: null };
    } catch (error: any) {
      return { data: null, error: createError('DATABASE_ERROR', error.message) };
    }
  },

  async markAsRead(notificationId: string, userId: string): Promise<ApiResponse<void>> {
    if (config.isDemoMode) {
      const notifications = JSON.parse(localStorage.getItem('vitech-notifications') || '[]');
      const index = notifications.findIndex((n: Notification) => n.id === notificationId);
      if (index !== -1) {
        notifications[index].is_read = true;
        localStorage.setItem('vitech-notifications', JSON.stringify(notifications));
      }
      return { data: undefined, error: null };
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) return { data: null, error: handleSupabaseError(error) };
      return { data: undefined, error: null };
    } catch (error: any) {
      return { data: null, error: createError('DATABASE_ERROR', error.message) };
    }
  },
};
