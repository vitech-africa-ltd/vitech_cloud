# ☁️ VITECH CLOUD — Enterprise Cloud Storage Platform

![VITECH Cloud](https://img.shields.io/badge/VITECH-Cloud-6366f1?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-2.0.0-blue?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react)
![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)

**Secure cloud storage for individuals, teams and businesses.**

---

## 🎯 Overview

VITECH Cloud is a professional-grade private cloud storage platform developed by VITECH Africa. It provides enterprise-level file storage, organization, sharing, and management capabilities with a focus on security, performance, and scalability.

### Key Features

- 🔐 **Enterprise Security** — Row Level Security, JWT auth, encrypted storage
- 📊 **Real-time Analytics** — Storage, activity, and usage charts
- 🗄️ **Professional Database** — 17 tables with optimized indexes
- 🎨 **Premium UI/UX** — Modern design system with dark mode
- 📱 **Fully Responsive** — Mobile, tablet, desktop optimized
- ⚡ **Performance First** — Optimized queries, lazy loading, caching
- 🔄 **Scalable Architecture** — Multi-tenant ready, API-first design
- 📤 **Upload Center** — Real-time progress, pause/resume, bulk uploads
- 🔍 **Command Palette** — Ctrl+K for quick actions
- 📈 **Admin Dashboard** — Complete system monitoring

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VITECH CLOUD                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (React + TypeScript + Tailwind)                   │
│  ├── UI Components (Reusable, Accessible)                   │
│  ├── Charts (Recharts - Analytics)                          │
│  ├── Command Palette (Ctrl+K)                               │
│  └── Responsive Design System                               │
│                                                              │
│  API Layer (Abstracted)                                     │
│  ├── Files API                                              │
│  ├── Folders API                                            │
│  ├── Storage API                                            │
│  ├── Activities API                                         │
│  ├── Shares API                                             │
│  └── Notifications API                                      │
│                                                              │
│  Database (PostgreSQL via Supabase)                         │
│  ├── 17 Tables with RLS                                     │
│  ├── Optimized Indexes                                      │
│  ├── Triggers for Counters                                  │
│  └── Analytics Views                                        │
│                                                              │
│  Storage (Cloudflare R2)                                    │
│  ├── Signed URLs                                            │
│  ├── Multipart Upload                                       │
│  └── Storage Provider Abstraction                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Schema

### Core Tables (17)

1. **profiles** — User profiles with roles and status
2. **user_settings** — User preferences (theme, notifications)
3. **organizations** — Multi-tenant support
4. **organization_members** — Team members with roles
5. **folders** — Hierarchical folder structure
6. **files** — File metadata and storage references
7. **file_versions** — Version control for files
8. **shares** — Secure file sharing with permissions
9. **favorites** — User starred items
10. **trash** — Soft-deleted items with retention
11. **storage_usage** — Real-time storage counters
12. **storage_events** — Storage activity log
13. **activities** — User activity feed
14. **security_events** — Security audit log
15. **admin_logs** — Administrative actions
16. **notifications** — User notifications
17. **system_settings** — Global configuration

### Features

- ✅ **Row Level Security (RLS)** — User isolation guaranteed
- ✅ **Optimized Indexes** — Fast queries on all tables
- ✅ **Triggers** — Automatic counter updates
- ✅ **Views** — Analytics aggregations
- ✅ **Functions** — Business logic in database
- ✅ **Constraints** — Data integrity enforced

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (for production)
- Cloudflare R2 (for production storage)

### Installation

```bash
# Clone repository
git clone https://github.com/vitechafrica/vitech-cloud.git
cd vitech-cloud

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

Visit `http://localhost:5173`

### Demo Mode

Without Supabase credentials, the app runs in **demo mode**:
- ✅ All features functional
- ✅ Data stored in localStorage
- ✅ Perfect for testing and development

---

## 🔧 Configuration

### Environment Variables

```env
# Supabase (Production)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Cloudflare R2 (Production)
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=vitech-cloud
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com

# Application
VITE_APP_URL=https://cloud.vitechafrica.com
```

### Database Setup

1. Create Supabase project
2. Run migrations:
   ```bash
   # In Supabase SQL Editor
   # Run: supabase/migrations/002_enterprise_schema.sql
   ```
3. Verify RLS policies are active
4. Test user isolation

---

## 📱 Pages & Features

### Public Pages

| Page | Route | Description |
|------|-------|-------------|
| Landing | `/` | Product overview |
| Login | `/login` | User authentication |
| Register | `/register` | Account creation |

### Protected Pages

| Page | Route | Features |
|------|-------|----------|
| Dashboard | `/dashboard` | Stats, charts, recent files |
| My Files | `/files` | File management, upload, download |
| Favorites | `/favorites` | Starred files |
| Recent | `/recent` | Recently modified |
| Shared | `/shared` | Shared files |
| Trash | `/trash` | Deleted files with restore |
| Settings | `/settings` | User preferences |
| Admin | `/admin` | System administration |

### Keyboard Shortcuts

- `Ctrl+K` — Open Command Palette
- `Ctrl+U` — Upload files (in Files page)
- `N` — New folder (in Files page)
- `Delete` — Delete selected files

---

## 📊 Analytics & Charts

### User Dashboard

- **Storage Usage Chart** — 7-day storage evolution
- **Activity Chart** — Uploads, downloads, deletes
- **File Types Distribution** — Pie chart of file categories
- **Storage Breakdown** — By file type with real data

### Admin Dashboard

- **System Health** — Database, storage, API status
- **User Growth** — Registration trends
- **Storage Growth** — Usage over time
- **Top Users** — Most active users
- **Error Center** — Failed operations log

### Data Sources

All charts use **real data** from:
- `storage_events` table
- `activities` table
- `files` table
- `storage_usage` table

No fake analytics. If no data exists, charts show "No data available yet".

---

## 🎨 Design System

### Colors

```css
/* Brand */
--color-brand-500: #6366f1;  /* Indigo */
--color-cyan-500: #06b6d4;   /* Cyan accent */

/* Surface */
--color-surface-50: #f8fafc;
--color-surface-950: #020617;

/* Semantic */
--color-success-500: #10b981;
--color-warning-500: #f59e0b;
--color-danger-500: #ef4444;
```

### Components

- **Button** — 5 variants (primary, secondary, ghost, danger, outline)
- **Card** — Flexible container with hover states
- **Input** — With label, error, icon support
- **Modal** — Accessible dialog
- **Toast** — Notification system
- **Badge** — Status indicators
- **Skeleton** — Loading placeholders
- **Charts** — Storage, Activity, File Types

---

## 🔒 Security

### Implemented

- ✅ **Row Level Security** — User isolation at database level
- ✅ **JWT Authentication** — Secure session management
- ✅ **Input Validation** — Server-side validation with Zod
- ✅ **Type Safety** — Full TypeScript coverage
- ✅ **Signed URLs** — Secure file access
- ✅ **Password Hashing** — bcrypt for credentials
- ✅ **CSRF Protection** — Token-based
- ✅ **Rate Limiting** — API protection ready

### RLS Policies

```sql
-- Example: Users can only access their own files
CREATE POLICY "Users can view own files" 
ON files FOR SELECT 
USING (auth.uid() = owner_id);
```

### Security Headers

```http
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
```

---

## 📦 Performance

### Bundle Size

```
CSS: 43.97 kB (gzip: 7.99 kB)
JS:  343.84 kB (gzip: 101.20 kB)
Total: 387.81 kB (gzip: 109.19 kB)
```

### Optimizations

- ✅ **Tree Shaking** — Dead code elimination
- ✅ **Code Splitting** — Lazy loading routes
- ✅ **Image Optimization** — WebP, lazy loading
- ✅ **Database Indexes** — Fast queries
- ✅ **Caching** — Analytics data cached
- ✅ **Compression** — Gzip/Brotli ready

### Lighthouse Scores (Target)

- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 100

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Register new account
- [ ] Logout
- [ ] Session persistence

#### File Management
- [ ] Upload files (single & multiple)
- [ ] Create folders
- [ ] Navigate folder hierarchy
- [ ] Rename files/folders
- [ ] Delete files (move to trash)
- [ ] Restore from trash
- [ ] Permanent delete
- [ ] Download files
- [ ] Bulk download
- [ ] Toggle favorites

#### Search & Filter
- [ ] Search by filename
- [ ] Sort by name/date/size
- [ ] Sort ascending/descending
- [ ] Filter in current folder

#### Analytics
- [ ] Dashboard charts display
- [ ] Charts use real data
- [ ] Empty state when no data
- [ ] Responsive charts

#### Admin
- [ ] Admin dashboard access (ADMIN role)
- [ ] Admin dashboard denied (USER role)
- [ ] System health checks
- [ ] User management
- [ ] Activity logs

#### Security
- [ ] User A cannot access User B's files
- [ ] RLS policies enforced
- [ ] Signed URLs work
- [ ] Rate limiting active

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📈 Roadmap

### Phase 1: Core Platform ✅
- [x] Authentication
- [x] File management
- [x] Folder hierarchy
- [x] Search & filter
- [x] Upload center
- [x] Download system

### Phase 2: Analytics & Admin ✅
- [x] User dashboard with charts
- [x] Admin dashboard
- [x] Activity logs
- [x] Storage analytics
- [x] System health

### Phase 3: Collaboration (Q1 2025)
- [ ] File sharing with links
- [ ] Password-protected shares
- [ ] Expiration dates
- [ ] Team workspaces
- [ ] Comments on files

### Phase 4: Advanced Features (Q2 2025)
- [ ] File versioning
- [ ] File preview (PDF, images, videos)
- [ ] Drag & drop upload
- [ ] Bulk operations
- [ ] Advanced search (full-text)

### Phase 5: Mobile & Desktop (Q3 2025)
- [ ] iOS app (React Native)
- [ ] Android app (React Native)
- [ ] Desktop sync client
- [ ] Offline mode
- [ ] Push notifications

### Phase 6: Enterprise (Q4 2025)
- [ ] SSO integration
- [ ] Advanced analytics
- [ ] Audit logs
- [ ] Compliance (GDPR, SOC 2)
- [ ] Custom branding
- [ ] API access

---

## 🤝 Contributing

This is a private project by VITECH Africa. For inquiries:

- **Email**: contact@vitechafrica.com
- **Website**: https://vitechafrica.com

---

## 📄 License

Proprietary — VITECH Africa © 2024

All rights reserved. Unauthorized copying, distribution, or modification is prohibited.

---

## 🙏 Acknowledgments

Built with modern web technologies:

- **React 18** — UI framework
- **TypeScript 5.7** — Type safety
- **Vite 6** — Build tool
- **Tailwind CSS 4.1** — Styling
- **Framer Motion 11** — Animations
- **Recharts** — Data visualization
- **Lucide React** — Icons
- **Zod** — Validation
- **date-fns** — Date manipulation
- **Supabase** — Backend platform
- **Cloudflare R2** — Object storage

---

## 📞 Support

For support and inquiries:

- **Email**: support@vitechafrica.com
- **Documentation**: [Coming Soon]
- **Status Page**: [Coming Soon]

---

**Built with ❤️ by VITECH Africa**

*Your files. Your cloud. Your control.*
