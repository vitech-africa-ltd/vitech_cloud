-- ============================================
-- VITECH CLOUD — ENTERPRISE DATABASE SCHEMA
-- Version: 2.0.0
-- Description: Complete SaaS-ready schema
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

CREATE TYPE user_role AS ENUM ('owner', 'admin', 'manager', 'member', 'viewer');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'pending', 'deleted');
CREATE TYPE file_status AS ENUM ('uploading', 'processing', 'ready', 'failed', 'deleted');
CREATE TYPE share_permission AS ENUM ('view', 'download', 'edit');
CREATE TYPE share_status AS ENUM ('active', 'expired', 'revoked');
CREATE TYPE notification_type AS ENUM ('upload', 'share', 'security', 'storage', 'system', 'admin');
CREATE TYPE activity_action AS ENUM (
    'login', 'logout', 'upload', 'download', 'create_folder', 'rename', 'move', 
    'copy', 'share', 'unshare', 'favorite', 'delete', 'restore', 'permanent_delete',
    'update_profile', 'change_password'
);
CREATE TYPE security_event_type AS ENUM (
    'failed_login', 'successful_login', 'password_changed', 'email_changed',
    'session_created', 'session_revoked', 'suspicious_activity'
);
CREATE TYPE storage_event_type AS ENUM ('upload', 'delete', 'restore', 'permanent_delete', 'download');

-- ============================================
-- 1. PROFILES TABLE
-- ============================================

CREATE TABLE profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role user_role DEFAULT 'member' NOT NULL,
    status user_status DEFAULT 'active' NOT NULL,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_seen_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_role ON profiles(role);

-- ============================================
-- 2. USER SETTINGS TABLE
-- ============================================

CREATE TABLE user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    language TEXT DEFAULT 'en',
    timezone TEXT DEFAULT 'UTC',
    email_notifications BOOLEAN DEFAULT true,
    security_notifications BOOLEAN DEFAULT true,
    marketing_notifications BOOLEAN DEFAULT false,
    default_view TEXT DEFAULT 'grid' CHECK (default_view IN ('grid', 'list')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- ============================================
-- 3. ORGANIZATIONS TABLE
-- ============================================

CREATE TABLE organizations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'business', 'enterprise')),
    status user_status DEFAULT 'active' NOT NULL,
    storage_limit BIGINT DEFAULT 10737418240 NOT NULL, -- 10 GB
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_organizations_owner_id ON organizations(owner_id);
CREATE INDEX idx_organizations_status ON organizations(status);
CREATE INDEX idx_organizations_slug ON organizations(slug);

-- ============================================
-- 4. ORGANIZATION MEMBERS TABLE
-- ============================================

CREATE TABLE organization_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role user_role DEFAULT 'member' NOT NULL,
    status user_status DEFAULT 'active' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(organization_id, user_id)
);

CREATE INDEX idx_org_members_org_id ON organization_members(organization_id);
CREATE INDEX idx_org_members_user_id ON organization_members(user_id);

-- ============================================
-- 5. FOLDERS TABLE
-- ============================================

CREATE TABLE folders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    path TEXT,
    depth INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_folders_user_id ON folders(user_id);
CREATE INDEX idx_folders_org_id ON folders(organization_id);
CREATE INDEX idx_folders_parent_id ON folders(parent_id);
CREATE INDEX idx_folders_deleted_at ON folders(deleted_at);
CREATE INDEX idx_folders_path ON folders(path);

-- ============================================
-- 6. FILES TABLE
-- ============================================

CREATE TABLE files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    original_name TEXT NOT NULL,
    storage_provider TEXT DEFAULT 'r2' CHECK (storage_provider IN ('r2', 'local', 's3', 'minio')),
    storage_bucket TEXT,
    storage_key TEXT UNIQUE NOT NULL,
    mime_type TEXT NOT NULL,
    extension TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    checksum TEXT,
    status file_status DEFAULT 'uploading' NOT NULL,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_files_owner_id ON files(owner_id);
CREATE INDEX idx_files_org_id ON files(organization_id);
CREATE INDEX idx_files_folder_id ON files(folder_id);
CREATE INDEX idx_files_status ON files(status);
CREATE INDEX idx_files_storage_key ON files(storage_key);
CREATE INDEX idx_files_deleted_at ON files(deleted_at);
CREATE INDEX idx_files_is_favorite ON files(is_favorite);
CREATE INDEX idx_files_extension ON files(extension);

-- ============================================
-- 7. FILE VERSIONS TABLE
-- ============================================

CREATE TABLE file_versions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    file_id UUID REFERENCES files(id) ON DELETE CASCADE NOT NULL,
    version_number INTEGER NOT NULL,
    storage_key TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    checksum TEXT,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(file_id, version_number)
);

CREATE INDEX idx_file_versions_file_id ON file_versions(file_id);

-- ============================================
-- 8. SHARES TABLE
-- ============================================

CREATE TABLE shares (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    file_id UUID REFERENCES files(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    token TEXT UNIQUE NOT NULL,
    permission share_permission DEFAULT 'view' NOT NULL,
    password_hash TEXT,
    expires_at TIMESTAMPTZ,
    max_downloads INTEGER,
    download_count INTEGER DEFAULT 0,
    status share_status DEFAULT 'active' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CHECK (file_id IS NOT NULL OR folder_id IS NOT NULL)
);

CREATE INDEX idx_shares_token ON shares(token);
CREATE INDEX idx_shares_file_id ON shares(file_id);
CREATE INDEX idx_shares_folder_id ON shares(folder_id);
CREATE INDEX idx_shares_created_by ON shares(created_by);
CREATE INDEX idx_shares_status ON shares(status);

-- ============================================
-- 9. FAVORITES TABLE
-- ============================================

CREATE TABLE favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_id UUID REFERENCES files(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, file_id),
    UNIQUE(user_id, folder_id),
    CHECK (file_id IS NOT NULL OR folder_id IS NOT NULL)
);

CREATE INDEX idx_favorites_user_id ON favorites(user_id);

-- ============================================
-- 10. TRASH TABLE
-- ============================================

CREATE TABLE trash (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_id UUID REFERENCES files(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    original_parent_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    deleted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    scheduled_permanent_delete_at TIMESTAMPTZ,
    CHECK (file_id IS NOT NULL OR folder_id IS NOT NULL)
);

CREATE INDEX idx_trash_user_id ON trash(user_id);
CREATE INDEX idx_trash_deleted_at ON trash(deleted_at);

-- ============================================
-- 11. STORAGE USAGE TABLE
-- ============================================

CREATE TABLE storage_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    files_count INTEGER DEFAULT 0,
    folders_count INTEGER DEFAULT 0,
    storage_used_bytes BIGINT DEFAULT 0,
    storage_limit_bytes BIGINT DEFAULT 10737418240, -- 10 GB
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id)
);

CREATE INDEX idx_storage_usage_user_id ON storage_usage(user_id);
CREATE INDEX idx_storage_usage_org_id ON storage_usage(organization_id);

-- ============================================
-- 12. STORAGE EVENTS TABLE
-- ============================================

CREATE TABLE storage_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    file_id UUID REFERENCES files(id) ON DELETE SET NULL,
    event_type storage_event_type NOT NULL,
    size_bytes BIGINT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_storage_events_user_id ON storage_events(user_id);
CREATE INDEX idx_storage_events_org_id ON storage_events(organization_id);
CREATE INDEX idx_storage_events_created_at ON storage_events(created_at DESC);
CREATE INDEX idx_storage_events_event_type ON storage_events(event_type);

-- ============================================
-- 13. ACTIVITIES TABLE
-- ============================================

CREATE TABLE activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    action activity_action NOT NULL,
    entity_type TEXT CHECK (entity_type IN ('file', 'folder', 'share', 'user', 'organization')),
    entity_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_org_id ON activities(organization_id);
CREATE INDEX idx_activities_action ON activities(action);
CREATE INDEX idx_activities_created_at ON activities(created_at DESC);
CREATE INDEX idx_activities_entity ON activities(entity_type, entity_id);

-- ============================================
-- 14. SECURITY EVENTS TABLE
-- ============================================

CREATE TABLE security_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    event_type security_event_type NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    location TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_security_events_user_id ON security_events(user_id);
CREATE INDEX idx_security_events_event_type ON security_events(event_type);
CREATE INDEX idx_security_events_created_at ON security_events(created_at DESC);

-- ============================================
-- 15. ADMIN LOGS TABLE
-- ============================================

CREATE TABLE admin_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    action TEXT NOT NULL,
    target_type TEXT,
    target_id UUID,
    metadata JSONB DEFAULT '{}',
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);
CREATE INDEX idx_admin_logs_created_at ON admin_logs(created_at DESC);

-- ============================================
-- 16. NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    action_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ============================================
-- 17. SYSTEM SETTINGS TABLE
-- ============================================

CREATE TABLE system_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    type TEXT CHECK (type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_system_settings_key ON system_settings(key);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON folders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_storage_usage_updated_at BEFORE UPDATE ON storage_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (user_id, full_name, display_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', 'User')
    );
    
    INSERT INTO user_settings (user_id)
    VALUES (NEW.id);
    
    INSERT INTO storage_usage (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update storage usage on file operations
CREATE OR REPLACE FUNCTION update_storage_usage_on_file_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'ready' THEN
        UPDATE storage_usage
        SET 
            storage_used_bytes = storage_used_bytes + NEW.size_bytes,
            files_count = files_count + 1,
            updated_at = NOW()
        WHERE user_id = NEW.owner_id;
        
        INSERT INTO storage_events (user_id, file_id, event_type, size_bytes)
        VALUES (NEW.owner_id, NEW.id, 'upload', NEW.size_bytes);
        
    ELSIF TG_OP = 'UPDATE' AND NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
        UPDATE storage_usage
        SET 
            storage_used_bytes = GREATEST(0, storage_used_bytes - NEW.size_bytes),
            files_count = GREATEST(0, files_count - 1),
            updated_at = NOW()
        WHERE user_id = NEW.owner_id;
        
        INSERT INTO storage_events (user_id, file_id, event_type, size_bytes)
        VALUES (NEW.owner_id, NEW.id, 'delete', NEW.size_bytes);
        
    ELSIF TG_OP = 'UPDATE' AND NEW.deleted_at IS NULL AND OLD.deleted_at IS NOT NULL THEN
        UPDATE storage_usage
        SET 
            storage_used_bytes = storage_used_bytes + NEW.size_bytes,
            files_count = files_count + 1,
            updated_at = NOW()
        WHERE user_id = NEW.owner_id;
        
        INSERT INTO storage_events (user_id, file_id, event_type, size_bytes)
        VALUES (NEW.owner_id, NEW.id, 'restore', NEW.size_bytes);
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_file_change
    AFTER INSERT OR UPDATE ON files
    FOR EACH ROW EXECUTE FUNCTION update_storage_usage_on_file_change();

-- Log activity
CREATE OR REPLACE FUNCTION log_activity()
RETURNS TRIGGER AS $$
BEGIN
    -- This would be called manually or via API
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE trash ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view/update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
);

-- User Settings: Users can view/update their own settings
CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);

-- Organizations: Members can view their organizations
CREATE POLICY "Members can view own organizations" ON organizations FOR SELECT USING (
    EXISTS (SELECT 1 FROM organization_members WHERE organization_id = organizations.id AND user_id = auth.uid())
    OR owner_id = auth.uid()
);

-- Organization Members: Members can view their org members
CREATE POLICY "Members can view org members" ON organization_members FOR SELECT USING (
    EXISTS (SELECT 1 FROM organization_members WHERE organization_id = organization_members.organization_id AND user_id = auth.uid())
);

-- Folders: Users can CRUD their own folders
CREATE POLICY "Users can view own folders" ON folders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own folders" ON folders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own folders" ON folders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own folders" ON folders FOR DELETE USING (auth.uid() = user_id);

-- Files: Users can CRUD their own files
CREATE POLICY "Users can view own files" ON files FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can create own files" ON files FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own files" ON files FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own files" ON files FOR DELETE USING (auth.uid() = owner_id);

-- File Versions: Users can view versions of their files
CREATE POLICY "Users can view own file versions" ON file_versions FOR SELECT USING (
    EXISTS (SELECT 1 FROM files WHERE id = file_versions.file_id AND owner_id = auth.uid())
);

-- Shares: Creators can manage, public can view active shares
CREATE POLICY "Creators can view own shares" ON shares FOR SELECT USING (auth.uid() = created_by);
CREATE POLICY "Creators can create shares" ON shares FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can update own shares" ON shares FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Creators can delete own shares" ON shares FOR DELETE USING (auth.uid() = created_by);
CREATE POLICY "Public can view active shares" ON shares FOR SELECT USING (status = 'active');

-- Favorites: Users can CRUD their own favorites
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- Trash: Users can view/manage their own trash
CREATE POLICY "Users can view own trash" ON trash FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own trash" ON trash FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own trash" ON trash FOR DELETE USING (auth.uid() = user_id);

-- Storage Usage: Users can view their own usage
CREATE POLICY "Users can view own storage usage" ON storage_usage FOR SELECT USING (auth.uid() = user_id);

-- Storage Events: Users can view their own events
CREATE POLICY "Users can view own storage events" ON storage_events FOR SELECT USING (auth.uid() = user_id);

-- Activities: Users can view their own activities
CREATE POLICY "Users can view own activities" ON activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own activities" ON activities FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Security Events: Users can view their own security events
CREATE POLICY "Users can view own security events" ON security_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own security events" ON security_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admin Logs: Only admins can view
CREATE POLICY "Admins can view admin logs" ON admin_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
);

-- Notifications: Users can view/manage their own notifications
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- System Settings: Only admins can view/update
CREATE POLICY "Admins can view system settings" ON system_settings FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
);
CREATE POLICY "Admins can update system settings" ON system_settings FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))
);

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default system settings
INSERT INTO system_settings (key, value, type, description) VALUES
    ('max_upload_size', '5368709120'::jsonb, 'number', 'Maximum upload size in bytes (5 GB)'),
    ('default_quota', '10737418240'::jsonb, 'number', 'Default storage quota in bytes (10 GB)'),
    ('share_link_duration', '604800'::jsonb, 'number', 'Default share link duration in seconds (7 days)'),
    ('trash_retention_days', '30'::jsonb, 'number', 'Days to keep files in trash before permanent delete'),
    ('maintenance_mode', 'false'::jsonb, 'boolean', 'Enable maintenance mode'),
    ('allow_registrations', 'true'::jsonb, 'boolean', 'Allow new user registrations');

-- ============================================
-- VIEWS FOR ANALYTICS
-- ============================================

-- Daily storage aggregation view
CREATE OR REPLACE VIEW daily_storage_stats AS
SELECT 
    DATE(created_at) as date,
    user_id,
    SUM(CASE WHEN event_type = 'upload' THEN size_bytes ELSE 0 END) as uploaded_bytes,
    SUM(CASE WHEN event_type = 'delete' THEN size_bytes ELSE 0 END) as deleted_bytes,
    COUNT(CASE WHEN event_type = 'upload' THEN 1 END) as upload_count,
    COUNT(CASE WHEN event_type = 'download' THEN 1 END) as download_count
FROM storage_events
GROUP BY DATE(created_at), user_id;

-- User activity summary view
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
    user_id,
    COUNT(*) as total_activities,
    COUNT(CASE WHEN action = 'upload' THEN 1 END) as upload_count,
    COUNT(CASE WHEN action = 'download' THEN 1 END) as download_count,
    COUNT(CASE WHEN action = 'share' THEN 1 END) as share_count,
    MAX(created_at) as last_activity
FROM activities
GROUP BY user_id;

-- File type distribution view
CREATE OR REPLACE VIEW file_type_distribution AS
SELECT 
    extension,
    COUNT(*) as file_count,
    SUM(size_bytes) as total_size
FROM files
WHERE deleted_at IS NULL
GROUP BY extension;
