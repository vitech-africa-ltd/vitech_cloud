# ☁️ VITECH CLOUD

**Secure cloud storage for individuals, teams and businesses.**

![VITECH Cloud](https://img.shields.io/badge/VITECH-Cloud-6366f1?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1-06b6d4?style=flat-square&logo=tailwindcss)
![Build](https://img.shields.io/badge/Build-Passing-success?style=flat-square)

---

## 🎯 Overview

VITECH Cloud is a professional-grade private cloud storage platform developed by VITECH Africa. It provides secure file storage, organization, sharing, and management capabilities with a focus on performance, security, and user experience.

### Key Features

- 🔐 **Secure Authentication** — Email/password with validation
- 📁 **Hierarchical File Management** — Folders, subfolders, breadcrumbs
- 📤 **Upload Center** — Real-time progress tracking
- 📥 **File Downloads** — Single and bulk downloads
- 🔍 **Advanced Search** — Real-time filtering across all files
- ⭐ **Favorites** — Quick access to important files
- 🗑️ **Trash System** — Safe deletion with restore capability
- 🌙 **Dark/Light Mode** — System-aware theme switching
- 📱 **Fully Responsive** — Mobile, tablet, desktop
- 🎨 **Premium UI/UX** — Professional design system
- ⚡ **Performance Optimized** — Fast load times, smooth animations
- ♿ **Accessible** — Keyboard navigation, screen reader support

---

## 🏗️ Architecture

```
src/
├── App.tsx                    # Main application with routing
├── main.tsx                   # Entry point
├── index.css                  # Design system tokens & global styles
│
├── types/
│   └── index.ts              # TypeScript type definitions
│
├── lib/
│   └── utils.ts              # Utility functions
│
├── contexts/
│   └── index.tsx             # React contexts (Theme, Auth, Storage, Toast)
│
└── components/
    └── ui/
        └── index.tsx         # Reusable UI components
```

### Design Principles

1. **Modularity** — Clear separation of concerns
2. **Type Safety** — Full TypeScript coverage
3. **Performance** — Optimized rendering and bundle size
4. **Accessibility** — WCAG 2.1 compliant
5. **Scalability** — Ready for backend integration

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/vitechafrica/vitech-cloud.git
cd vitech-cloud

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Demo Mode

The application runs in demo mode by default:
- **Login**: Any email + password (6+ characters)
- **Data**: Stored in localStorage
- **Features**: All functionality available

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🎨 Design System

### Colors

```css
/* Brand */
--color-brand-500: #6366f1;  /* Indigo */
--color-brand-600: #4f46e5;
--color-cyan-500: #06b6d4;   /* Cyan accent */

/* Surface */
--color-surface-50: #f8fafc;
--color-surface-900: #0f172a;
--color-surface-950: #020617;

/* Semantic */
--color-success-500: #10b981;
--color-warning-500: #f59e0b;
--color-danger-500: #ef4444;
--color-info-500: #3b82f6;
```

### Typography

- **Font**: Inter (Google Fonts)
- **Scale**: 12px → 30px (xs → 3xl)
- **Weights**: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### Components

- **Button** — Primary, secondary, ghost, danger, outline variants
- **Card** — Flexible container with hover states
- **Input** — With label, error, and icon support
- **Modal** — Accessible dialog with backdrop
- **Toast** — Notification system (success, error, info, warning)
- **Badge** — Status indicators
- **Skeleton** — Loading placeholders
- **EmptyState** — Empty content messaging

---

## 📱 Pages

### Public Pages

1. **Landing** (`/`) — Product overview and features
2. **Login** (`/login`) — User authentication
3. **Register** (`/register`) — Account creation

### Protected Pages

4. **Dashboard** (`/dashboard`) — Overview and statistics
5. **My Files** (`/files`) — File management interface
6. **Favorites** (`/favorites`) — Starred files
7. **Recent** (`/recent`) — Recently modified files
8. **Shared** (`/shared`) — Shared files (placeholder)
9. **Trash** (`/trash`) — Deleted files with restore
10. **Settings** (`/settings`) — User preferences
11. **Admin** (`/admin`) — Administration panel (ADMIN role only)

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase (for production)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Cloudflare R2 (for production)
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_NAME=vitech-cloud
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com

# Application
VITE_APP_DOMAIN=cloud.vitechafrica.com
```

**Note**: Without these variables, the app runs in demo mode using localStorage.

---

## 🛡️ Security

### Current Implementation (Demo Mode)

- Client-side validation
- localStorage for data persistence
- No real authentication backend

### Production Security (To Implement)

- **Supabase Auth** — JWT-based authentication
- **Row Level Security (RLS)** — Database-level access control
- **Signed URLs** — Secure file access
- **Rate Limiting** — API protection
- **Input Validation** — Server-side validation
- **CSRF Protection** — Cross-site request forgery prevention
- **XSS Protection** — Content Security Policy headers

### Security Best Practices

✅ **Implemented**
- Password strength validation
- Email format validation
- Secure token generation
- Type-safe data handling

⚠️ **To Implement**
- Two-factor authentication
- Session management
- Audit logging
- Encryption at rest
- Backup strategy

---

## 📊 Performance

### Bundle Size

```
CSS: 43.71 kB (gzip: 7.96 kB)
JS:  343.84 kB (gzip: 101.20 kB)
Total: 387.55 kB (gzip: 109.16 kB)
```

### Optimizations

- ✅ Code splitting (React.lazy ready)
- ✅ Tree shaking (Vite)
- ✅ CSS purging (Tailwind)
- ✅ Image optimization (ready)
- ✅ Font preloading
- ✅ Lazy loading (ready)

### Lighthouse Scores (Estimated)

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
- [ ] Upload files
- [ ] Create folders
- [ ] Navigate folders
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

#### UI/UX
- [ ] Dark mode toggle
- [ ] Light mode toggle
- [ ] System theme detection
- [ ] Mobile responsive
- [ ] Tablet responsive
- [ ] Desktop responsive
- [ ] Keyboard navigation
- [ ] Context menu
- [ ] Modals
- [ ] Toast notifications

#### Admin
- [ ] Admin dashboard access (ADMIN role)
- [ ] Admin dashboard denied (USER role)
- [ ] Statistics display

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

## 🔮 Roadmap

### Phase 1: Backend Integration (Q1 2025)
- [ ] Supabase Auth integration
- [ ] PostgreSQL database
- [ ] Cloudflare R2 storage
- [ ] Real-time file sync

### Phase 2: Advanced Features (Q2 2025)
- [ ] File sharing with links
- [ ] Password-protected shares
- [ ] Expiration dates
- [ ] Download limits
- [ ] File preview (PDF, images, videos)

### Phase 3: Collaboration (Q3 2025)
- [ ] Team workspaces
- [ ] Role-based access control
- [ ] Comments on files
- [ ] Activity feed
- [ ] Notifications

### Phase 4: Mobile & Desktop (Q4 2025)
- [ ] iOS app (React Native)
- [ ] Android app (React Native)
- [ ] Desktop sync client
- [ ] Offline mode
- [ ] Push notifications

### Phase 5: Enterprise (2026)
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
- **Lucide React** — Icons

---

## 📞 Support

For support and inquiries:

- **Email**: support@vitechafrica.com
- **Documentation**: [Coming Soon]
- **Status Page**: [Coming Soon]

---

**Built with ❤️ by VITECH Africa**

*Your files. Your cloud. Your control.*
