// ============================================
// VITECH CLOUD — SUPABASE CLIENT
// ============================================

import { createClient } from '@supabase/supabase-js';
import { config } from '../../config';

// Create Supabase client
export const supabase = config.isDemoMode
  ? createClient('https://placeholder.supabase.co', 'placeholder-key', {
      auth: { persistSession: false }
    })
  : createClient(config.supabase.url, config.supabase.anonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    });

// Type helpers for Supabase
export type SupabaseClient = typeof supabase;
