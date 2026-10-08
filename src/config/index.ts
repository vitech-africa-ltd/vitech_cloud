// ============================================
// VITECH CLOUD — CONFIGURATION
// ============================================

export const config = {
  // Application
  appName: 'VITECH Cloud',
  appVersion: '2.0.0',
  appUrl: import.meta.env.VITE_APP_URL || 'http://localhost:5173',
  
  // Supabase
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  },
  
  // Cloudflare R2
  r2: {
    accountId: import.meta.env.R2_ACCOUNT_ID || '',
    accessKeyId: import.meta.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: import.meta.env.R2_SECRET_ACCESS_KEY || '',
    bucketName: import.meta.env.R2_BUCKET_NAME || 'vitech-cloud',
    endpoint: import.meta.env.R2_ENDPOINT || '',
  },
  
  // Feature flags
  features: {
    enableOrganizations: false,
    enableFileVersions: false,
    enableRealtime: false,
    enableAnalytics: true,
  },
  
  // Limits
  limits: {
    maxUploadSize: 5 * 1024 * 1024 * 1024, // 5 GB
    defaultQuota: 10 * 1024 * 1024 * 1024, // 10 GB
    maxFilesPerUpload: 100,
    shareLinkDuration: 7 * 24 * 60 * 60, // 7 days in seconds
    trashRetentionDays: 30,
  },
  
  // Demo mode
  isDemoMode: !import.meta.env.VITE_SUPABASE_URL,
};
