import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud, LayoutDashboard, Folder, Star, Clock, Share2, Trash2, Settings,
  Shield, Menu, X, Bell, Search, Sun, Moon, LogOut, User, Upload,
  Grid3X3, List, MoreVertical, Download, FolderPlus, ChevronRight,
  FileText, Image as ImageIcon, Video, Music, Archive, File, Edit3,
  Check, ArrowRight, Zap, Globe, HardDrive, RotateCcw, Mail, Lock,
  Eye, EyeOff, Users, Info, AlertCircle, CheckSquare, Square,
  SortAsc, SortDesc, Filter, Eye as EyeIcon, ExternalLink
} from "lucide-react";
import { ThemeProvider, ToastProvider, AuthProvider, StorageProvider, useTheme, useAuth, useStorage, useToast } from "./contexts";
import { Button, Card, CardContent, Input, Modal, ToastContainer, EmptyState, Badge } from "./components/ui";
import { formatBytes, formatDate, formatFullDate, getFileCategory, getInitials, calculateStoragePercent, downloadBlob } from "./lib/utils";
import { FileItem, FolderItem, QUOTA_ALERTS } from "./types";

// ============================================
// ICON HELPER
// ============================================

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: any }>> = {
  FileText, Image: ImageIcon, Video, Music, Archive, File,
  FileSpreadsheet: FileText, Presentation: FileText,
};

function FileIcon({ extension, className = "" }: { extension: string; className?: string }) {
  const category = getFileCategory(extension);
  const Icon = iconMap[category.icon] || File;
  return (
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center ${className}`}
      style={{ backgroundColor: `${category.color}15` }}
    >
      <Icon className="w-5 h-5" style={{ color: category.color }} />
    </div>
  );
}

// ============================================
// DOWNLOAD HELPER
// ============================================

function downloadFile(file: FileItem) {
  const content = file.fileData || `VITECH Cloud Demo File\n\nName: ${file.name}\nSize: ${formatBytes(file.size)}\nType: ${file.type}\nCreated: ${formatFullDate(file.createdAt)}\n\nThis is a demonstration file from VITECH Cloud.`;
  const blob = new Blob([content], { type: file.type || "text/plain" });
  downloadBlob(blob, file.name);
}

// ============================================
// LANDING PAGE
// ============================================

function LandingPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950">
      <header className="sticky top-0 z-50 glass border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
                <Cloud className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-surface-900 dark:text-white">VITECH Cloud</span>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => onNavigate("/login")} className="text-sm font-medium text-surface-700 dark:text-surface-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                Sign in
              </button>
              <Button size="sm" onClick={() => onNavigate("/register")}>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-cyan-50 dark:from-brand-950/20 dark:via-surface-950 dark:to-cyan-950/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 text-brand-700 dark:text-brand-400 text-sm font-medium mb-8">
              <Zap className="w-4 h-4" />
              <span>Secure cloud storage by VITECH Africa</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-surface-900 dark:text-white mb-6 leading-tight">
              Your files.<br />
              <span className="gradient-text">Your cloud.</span><br />
              Your control.
            </h1>
            <p className="text-xl text-surface-600 dark:text-surface-400 mb-10 max-w-2xl mx-auto">
              Store, organize and access your files securely from anywhere. Built for individuals and teams who value privacy and performance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" onClick={() => onNavigate("/register")}>
                Get Started Free <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => onNavigate("/login")}>
                Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-surface-50 dark:bg-surface-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-surface-900 dark:text-white mb-4">Everything you need</h2>
            <p className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl mx-auto">Powerful features designed to keep your files safe, organized, and accessible</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Secure Storage", desc: "Enterprise-grade encryption and security" },
              { icon: Zap, title: "Lightning Fast", desc: "Optimized infrastructure for speed" },
              { icon: Globe, title: "Access Anywhere", desc: "From any device, anywhere in the world" },
              { icon: Cloud, title: "Private Cloud", desc: "Your data stays under your control" },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-surface-600 dark:text-surface-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-surface-200 dark:border-surface-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-surface-900 dark:text-white">VITECH Cloud</span>
          </div>
          <p className="text-sm text-surface-600 dark:text-surface-400">© 2024 VITECH Africa. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// LOGIN PAGE
// ============================================

function LoginPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [email, setEmail] = useState("vab@vitechafrica.com");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await login(email, password);
    if (error) {
      addToast({ type: "error", title: "Sign in failed", message: error });
    } else {
      addToast({ type: "success", title: "Welcome back!" });
      onNavigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 via-white to-brand-50 dark:from-surface-950 dark:via-surface-900 dark:to-brand-950/20 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <button onClick={() => onNavigate("/")} className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
              <Cloud className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-surface-900 dark:text-white">VITECH Cloud</span>
          </button>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">Welcome back</h1>
          <p className="text-surface-600 dark:text-surface-400">Sign in to access your cloud</p>
        </div>
        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} icon={<Mail className="w-5 h-5" />} placeholder="you@example.com" required />
              <div>
                <Input label="Password" type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} icon={<Lock className="w-5 h-5" />} placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-11 top-[52px] text-surface-400 hover:text-surface-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <Button type="submit" className="w-full" size="lg" loading={loading}>Sign in</Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-surface-600 dark:text-surface-400">
                Don't have an account?{" "}
                <button onClick={() => onNavigate("/register")} className="text-brand-600 dark:text-brand-400 hover:underline font-medium">Create account</button>
              </p>
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-surface-500 mt-6">Demo: any email + password (6+ chars)</p>
      </motion.div>
    </div>
  );
}

// ============================================
// REGISTER PAGE
// ============================================

function RegisterPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { register, loading } = useAuth();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast({ type: "error", title: "Passwords don't match" });
      return;
    }
    const { error } = await register(name, email, password);
    if (error) {
      addToast({ type: "error", title: "Sign up failed", message: error });
    } else {
      addToast({ type: "success", title: "Account created!" });
      onNavigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-50 via-white to-brand-50 dark:from-surface-950 dark:via-surface-900 dark:to-brand-950/20 p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <button onClick={() => onNavigate("/")} className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
              <Cloud className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-surface-900 dark:text-white">VITECH Cloud</span>
          </button>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">Create account</h1>
          <p className="text-surface-600 dark:text-surface-400">Start your cloud journey</p>
        </div>
        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full name" value={name} onChange={e => setName(e.target.value)} icon={<User className="w-5 h-5" />} placeholder="John Doe" required />
              <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} icon={<Mail className="w-5 h-5" />} placeholder="you@example.com" required />
              <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} icon={<Lock className="w-5 h-5" />} placeholder="••••••••" required />
              <Input label="Confirm password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} icon={<Lock className="w-5 h-5" />} placeholder="••••••••" required />
              <Button type="submit" className="w-full" size="lg" loading={loading}>Create account</Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-surface-600 dark:text-surface-400">
                Already have an account?{" "}
                <button onClick={() => onNavigate("/login")} className="text-brand-600 dark:text-brand-400 hover:underline font-medium">Sign in</button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// ============================================
// SIDEBAR
// ============================================

function Sidebar({ currentPage, onNavigate }: { currentPage: string; onNavigate: (page: string) => void }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  
  if (!user) return null;
  
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/files", icon: Folder, label: "My Files" },
    { to: "/favorites", icon: Star, label: "Favorites" },
    { to: "/recent", icon: Clock, label: "Recent" },
    { to: "/shared", icon: Share2, label: "Shared" },
    { to: "/trash", icon: Trash2, label: "Trash" },
  ];

  const storagePercent = calculateStoragePercent(user.storageUsed, user.storageQuota);

  const navContent = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-surface-200 dark:border-surface-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
            <Cloud className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-surface-900 dark:text-white">VITECH</h1>
            <p className="text-xs text-surface-500 -mt-0.5">Cloud Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(item => (
          <button
            key={item.to}
            onClick={() => { onNavigate(item.to); setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentPage === item.to
                ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400"
                : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="px-3 pb-4 space-y-1 border-t border-surface-200 dark:border-surface-800 pt-4">
        {user.role === "ADMIN" && (
          <button onClick={() => { onNavigate("/admin"); setMobileOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${currentPage === "/admin" ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400" : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"}`}>
            <Shield className="w-5 h-5" />
            <span>Admin</span>
          </button>
        )}
        <button onClick={() => { onNavigate("/settings"); setMobileOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${currentPage === "/settings" ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400" : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"}`}>
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <button onClick={() => { logout(); onNavigate("/"); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-danger-500 hover:bg-danger-500/10 transition-all">
          <LogOut className="w-5 h-5" />
          <span>Sign out</span>
        </button>
      </div>

      <div className="px-4 pb-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-brand-500/10 to-cyan-500/10 border border-brand-200/50 dark:border-brand-800/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-surface-500 truncate">{user.email}</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-surface-600 dark:text-surface-400">Storage</span>
              <span className="text-surface-900 dark:text-white font-medium">{formatBytes(user.storageUsed)} / {formatBytes(user.storageQuota)}</span>
            </div>
            <div className="h-1.5 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${storagePercent >= QUOTA_ALERTS.DANGER ? "bg-danger-500" : storagePercent >= QUOTA_ALERTS.WARNING ? "bg-warning-500" : "bg-gradient-to-r from-brand-500 to-cyan-500"}`} style={{ width: `${storagePercent}%` }} />
            </div>
            {storagePercent >= QUOTA_ALERTS.WARNING && (
              <p className="text-xs text-warning-600 dark:text-warning-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Storage almost full
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button onClick={() => setMobileOpen(true)} className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 shadow-md">
        <Menu className="w-5 h-5" />
      </button>
      <aside className="hidden lg:flex lg:flex-col lg:w-64 xl:w-72 h-screen border-r border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-950 sticky top-0">
        {navContent}
      </aside>
      <AnimatePresence>
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-surface-950 border-r border-surface-200 dark:border-surface-800">
              <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800">
                <X className="w-5 h-5" />
              </button>
              {navContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

// ============================================
// HEADER
// ============================================

function Header({ searchQuery, onSearchChange }: { searchQuery: string; onSearchChange: (q: string) => void }) {
  const { user } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 glass border-b border-surface-200 dark:border-surface-800">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input type="text" placeholder="Search files... (Ctrl+K)" value={searchQuery} onChange={e => onSearchChange(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-100 dark:bg-surface-800 border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-surface-900 text-sm text-surface-900 dark:text-white placeholder:text-surface-400 outline-none transition-all" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            {resolvedTheme === "dark" ? <Sun className="w-5 h-5 text-surface-400" /> : <Moon className="w-5 h-5 text-surface-600" />}
          </button>
          <button className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors relative">
            <Bell className="w-5 h-5 text-surface-600 dark:text-surface-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
          </button>
          <div className="relative">
            <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                {getInitials(user.name)}
              </div>
              <span className="hidden sm:block text-sm font-medium text-surface-700 dark:text-surface-300">{user.name.split(" ")[0]}</span>
            </button>
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-surface-200 dark:border-surface-800 py-2 z-50">
                <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-800">
                  <p className="text-sm font-medium text-surface-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-surface-500 truncate">{user.email}</p>
                </div>
                <button onClick={() => setShowProfile(false)} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
                  <User className="w-4 h-4" /> Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

// ============================================
// UPLOAD CENTER
// ============================================

function UploadCenter() {
  const { uploads } = useStorage();
  const [expanded, setExpanded] = useState(false);

  if (uploads.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 z-40 w-80">
      <Card className="overflow-hidden">
        <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-4 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500/10 flex items-center justify-center">
              <Upload className="w-4 h-4 text-brand-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-surface-900 dark:text-white">{uploads.length} uploading</p>
              <p className="text-xs text-surface-500">{uploads.filter(u => u.status === "complete").length} complete</p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 text-surface-400 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </button>
        {expanded && (
          <div className="border-t border-surface-200 dark:border-surface-800 p-4 space-y-3 max-h-60 overflow-y-auto">
            {uploads.map(upload => (
              <div key={upload.id}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-medium text-surface-700 dark:text-surface-300 truncate flex-1">{upload.file.name}</p>
                  <span className="text-xs text-surface-500 ml-2">{Math.round(upload.progress)}%</span>
                </div>
                <div className="h-1.5 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${upload.status === "complete" ? "bg-success-500" : upload.status === "error" ? "bg-danger-500" : "bg-gradient-to-r from-brand-500 to-cyan-500"}`} style={{ width: `${upload.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ============================================
// DASHBOARD PAGE
// ============================================

function DashboardPage() {
  const { user } = useAuth();
  const { files, folders, activities } = useStorage();
  
  if (!user) return null;

  const recentFiles = files.filter(f => !f.isTrashed).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5);
  const storagePercent = calculateStoragePercent(user.storageUsed, user.storageQuota);

  const stats = [
    { label: "Total Files", value: files.filter(f => !f.isTrashed).length.toString(), icon: FileText, color: "from-blue-500 to-cyan-500" },
    { label: "Folders", value: folders.length.toString(), icon: Folder, color: "from-purple-500 to-pink-500" },
    { label: "Storage Used", value: formatBytes(user.storageUsed), icon: HardDrive, color: "from-orange-500 to-red-500" },
    { label: "Favorites", value: files.filter(f => f.isFavorite && !f.isTrashed).length.toString(), icon: Star, color: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white mb-2">Hello, {user.name.split(" ")[0]} 👋</h1>
          <p className="text-surface-600 dark:text-surface-400">Welcome back to your cloud</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card hover>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-surface-900 dark:text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-surface-600 dark:text-surface-400">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Storage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-surface-600 dark:text-surface-400">Used</span>
                    <span className="font-medium text-surface-900 dark:text-white">{formatBytes(user.storageUsed)} / {formatBytes(user.storageQuota)}</span>
                  </div>
                  <div className="h-3 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${storagePercent}%` }} transition={{ duration: 1 }} className={`h-full rounded-full ${storagePercent >= QUOTA_ALERTS.DANGER ? "bg-danger-500" : "bg-gradient-to-r from-brand-500 to-cyan-500"}`} />
                  </div>
                  <p className="text-xs text-surface-500 mt-2">{storagePercent.toFixed(1)}% used</p>
                </div>
                <div className="pt-4 border-t border-surface-200 dark:border-surface-800 space-y-3">
                  {[
                    { label: "Documents", value: "2.4 GB" },
                    { label: "Images", value: "3.1 GB" },
                    { label: "Videos", value: "1.2 GB" },
                    { label: "Other", value: "0.5 GB" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <span className="text-surface-600 dark:text-surface-400">{item.label}</span>
                      <span className="font-medium text-surface-900 dark:text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Recent Files</h3>
              <div className="space-y-2">
                {recentFiles.map(file => (
                  <div key={file.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors cursor-pointer">
                    <FileIcon extension={file.extension} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{file.name}</p>
                      <p className="text-xs text-surface-500">{formatBytes(file.size)}</p>
                    </div>
                    <div className="text-xs text-surface-500">{formatDate(file.updatedAt)}</div>
                    <button onClick={() => downloadFile(file)} className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors" title="Download">
                      <Download className="w-4 h-4 text-surface-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {activities.length > 0 && (
          <Card className="mt-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {activities.slice(0, 5).map(activity => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {activity.userName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-surface-900 dark:text-white">
                        <span className="font-medium">{activity.userName}</span>{" "}
                        <span className="text-surface-600 dark:text-surface-400">{activity.action.toLowerCase().replace("_", " ")}</span>{" "}
                        {activity.fileName && <span className="font-medium">{activity.fileName}</span>}
                      </p>
                      <p className="text-xs text-surface-500">{formatDate(activity.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}

// ============================================
// FILES PAGE
// ============================================

function FilesPage() {
  const {
    files, folders, currentFolderId, selectedFiles, searchQuery, sortBy, sortOrder,
    setCurrentFolderId, setSearchQuery, setSortBy, setSortOrder,
    createFolder, uploadFiles, deleteFile, toggleFavorite, renameFile,
    toggleFileSelection, selectAllFiles, clearSelection,
  } = useStorage();
  const { addToast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; item: FileItem | FolderItem; type: "file" | "folder" } | null>(null);
  const [renameModal, setRenameModal] = useState<{ item: FileItem | FolderItem; type: "file" | "folder" } | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Breadcrumbs
  const getBreadcrumbs = () => {
    const crumbs: Array<{ id: string | null; name: string }> = [{ id: null, name: "My Files" }];
    let currentId = currentFolderId;
    const trail: Array<{ id: string; name: string }> = [];
    while (currentId) {
      const folder = folders.find(f => f.id === currentId);
      if (!folder) break;
      trail.unshift({ id: folder.id, name: folder.name });
      currentId = folder.parentId;
    }
    return [...crumbs, ...trail];
  };

  const currentFolders = folders.filter(f => f.parentId === currentFolderId);
  const currentFiles = files.filter(f => f.folderId === currentFolderId && !f.isTrashed);
  
  const filteredFolders = searchQuery ? folders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())) : currentFolders;
  const filteredFiles = searchQuery ? files.filter(f => !f.isTrashed && f.name.toLowerCase().includes(searchQuery.toLowerCase())) : currentFiles;

  // Sort
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "name") comparison = a.name.localeCompare(b.name);
    else if (sortBy === "date") comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    else if (sortBy === "size") comparison = b.size - a.size;
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName("");
      setShowNewFolder(false);
      addToast({ type: "success", title: "Folder created" });
    }
  };

  const handleContextAction = (action: string) => {
    if (!contextMenu) return;
    const { item, type } = contextMenu;
    setContextMenu(null);

    switch (action) {
      case "open":
        if (type === "folder") setCurrentFolderId(item.id);
        else setPreviewFile(item as FileItem);
        break;
      case "download":
        if (type === "file") downloadFile(item as FileItem);
        break;
      case "delete":
        if (type === "file") deleteFile(item.id);
        break;
      case "favorite":
        if (type === "file") toggleFavorite(item.id);
        break;
      case "rename":
        setRenameModal({ item, type });
        setRenameValue(item.name);
        break;
    }
  };

  const handleRename = () => {
    if (!renameModal || !renameValue.trim()) return;
    if (renameModal.type === "file") renameFile(renameModal.item.id, renameValue.trim());
    setRenameModal(null);
    addToast({ type: "success", title: "Renamed successfully" });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-1 text-sm text-surface-500 mb-1 flex-wrap">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.id ?? "root"} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="w-3 h-3" />}
                <button onClick={() => setCurrentFolderId(crumb.id)} className={`hover:text-brand-600 dark:hover:text-brand-400 transition-colors ${i === breadcrumbs.length - 1 ? "text-surface-900 dark:text-white font-medium" : ""}`}>
                  {crumb.name}
                </button>
              </span>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">My Files</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-surface-200 dark:border-surface-800 overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600" : "text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600" : "text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="px-3 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-sm text-surface-700 dark:text-surface-300 outline-none">
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
          </select>
          <button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} className="p-2 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800">
            {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
          </button>
          <Button variant="outline" size="sm" onClick={() => setShowNewFolder(true)}>
            <FolderPlus className="w-4 h-4" /> New Folder
          </Button>
          <Button size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4" /> Upload
          </Button>
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e => { if (e.target.files) uploadFiles(Array.from(e.target.files)); }} />
        </div>
      </div>

      {selectedFiles.size > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 flex items-center justify-between">
          <span className="text-sm font-medium text-brand-700 dark:text-brand-400">{selectedFiles.size} file(s) selected</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => {
              selectedFiles.forEach(id => {
                const file = files.find(f => f.id === id);
                if (file) downloadFile(file);
              });
            }}>
              <Download className="w-4 h-4" /> Download
            </Button>
            <Button size="sm" variant="ghost" onClick={() => {
              selectedFiles.forEach(id => deleteFile(id));
              clearSelection();
            }}>
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
            <Button size="sm" variant="ghost" onClick={clearSelection}>
              <X className="w-4 h-4" /> Clear
            </Button>
          </div>
        </div>
      )}

      {filteredFolders.length === 0 && sortedFiles.length === 0 ? (
        <EmptyState icon={<Folder className="w-10 h-10 text-surface-400" />} title="This folder is empty" description="Upload files or create a folder to get started" action={<Button onClick={() => fileInputRef.current?.click()}><Upload className="w-4 h-4" /> Upload files</Button>} />
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredFolders.map(folder => (
            <Card key={folder.id} hover onDoubleClick={() => setCurrentFolderId(folder.id)} className="group" >
              <CardContent className="p-4" onContextMenu={e => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, item: folder, type: "folder" }); }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Folder className="w-6 h-6 text-white" />
                  </div>
                  <button onClick={e => { e.stopPropagation(); setContextMenu({ x: e.clientX, y: e.clientY, item: folder, type: "folder" }); }} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
                    <MoreVertical className="w-4 h-4 text-surface-400" />
                  </button>
                </div>
                <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{folder.name}</p>
                <p className="text-xs text-surface-500 mt-0.5">{formatDate(folder.updatedAt)}</p>
              </CardContent>
            </Card>
          ))}
          {sortedFiles.map(file => (
            <Card key={file.id} hover className="group" >
              <CardContent className="p-4" onClick={() => setPreviewFile(file)} onContextMenu={e => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, item: file, type: "file" }); }}>
                <div className="flex items-center justify-between mb-3">
                  <FileIcon extension={file.extension} className="w-12 h-12" />
                  <div className="flex items-center gap-1">
                    {file.isFavorite && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                    <button onClick={e => { e.stopPropagation(); setContextMenu({ x: e.clientX, y: e.clientY, item: file, type: "file" }); }} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-all">
                      <MoreVertical className="w-4 h-4 text-surface-400" />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{file.name}</p>
                <p className="text-xs text-surface-500 mt-0.5">{formatBytes(file.size)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-800">
                  <th className="text-left px-4 py-3 text-xs font-medium text-surface-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-surface-500 uppercase hidden sm:table-cell">Size</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-surface-500 uppercase hidden md:table-cell">Modified</th>
                  <th className="px-4 py-3 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {filteredFolders.map(folder => (
                  <tr key={folder.id} className="border-b border-surface-100 dark:border-surface-800/50 hover:bg-surface-50 dark:hover:bg-surface-800/50 cursor-pointer" onDoubleClick={() => setCurrentFolderId(folder.id)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                          <Folder className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-surface-900 dark:text-white">{folder.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-surface-500 hidden sm:table-cell">—</td>
                    <td className="px-4 py-3 text-sm text-surface-500 hidden md:table-cell">{formatDate(folder.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={e => { e.stopPropagation(); setContextMenu({ x: e.clientX, y: e.clientY, item: folder, type: "folder" }); }} className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800">
                        <MoreVertical className="w-4 h-4 text-surface-400" />
                      </button>
                    </td>
                  </tr>
                ))}
                {sortedFiles.map(file => (
                  <tr key={file.id} className="border-b border-surface-100 dark:border-surface-800/50 hover:bg-surface-50 dark:hover:bg-surface-800/50 cursor-pointer" onClick={() => setPreviewFile(file)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <FileIcon extension={file.extension} className="w-8 h-8" />
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-surface-900 dark:text-white">{file.name}</span>
                          {file.isFavorite && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-surface-500 hidden sm:table-cell">{formatBytes(file.size)}</td>
                    <td className="px-4 py-3 text-sm text-surface-500 hidden md:table-cell">{formatDate(file.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={(e) => { e.stopPropagation(); downloadFile(file); }} className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800" title="Download">
                          <Download className="w-4 h-4 text-surface-400" />
                        </button>
                        <button onClick={e => { e.stopPropagation(); setContextMenu({ x: e.clientX, y: e.clientY, item: file, type: "file" }); }} className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800">
                          <MoreVertical className="w-4 h-4 text-surface-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Context Menu */}
      <AnimatePresence>
        {contextMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed z-50 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-surface-200 dark:border-surface-800 py-2 w-48" style={{ top: Math.min(contextMenu.y, window.innerHeight - 300), left: Math.min(contextMenu.x, window.innerWidth - 200) }}>
              <button onClick={() => handleContextAction("open")} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
                <EyeIcon className="w-4 h-4" /> Open
              </button>
              {contextMenu.type === "file" && (
                <>
                  <button onClick={() => handleContextAction("download")} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
                    <Download className="w-4 h-4" /> Download
                  </button>
                  <button onClick={() => handleContextAction("favorite")} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
                    <Star className="w-4 h-4" /> {(contextMenu.item as FileItem).isFavorite ? "Unfavorite" : "Favorite"}
                  </button>
                </>
              )}
              <div className="border-t border-surface-200 dark:border-surface-800 my-1" />
              <button onClick={() => handleContextAction("rename")} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
                <Edit3 className="w-4 h-4" /> Rename
              </button>
              <button onClick={() => handleContextAction("delete")} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger-500 hover:bg-danger-500/10">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* New Folder Modal */}
      <Modal isOpen={showNewFolder} onClose={() => setShowNewFolder(false)} title="New Folder" size="sm">
        <div className="p-6">
          <Input value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="Folder name" autoFocus onKeyDown={e => e.key === "Enter" && handleCreateFolder()} />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setShowNewFolder(false)}>Cancel</Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </div>
        </div>
      </Modal>

      {/* Rename Modal */}
      <Modal isOpen={!!renameModal} onClose={() => setRenameModal(null)} title="Rename" size="sm">
        <div className="p-6">
          <Input value={renameValue} onChange={e => setRenameValue(e.target.value)} autoFocus onKeyDown={e => e.key === "Enter" && handleRename()} />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setRenameModal(null)}>Cancel</Button>
            <Button onClick={handleRename}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal isOpen={!!previewFile} onClose={() => setPreviewFile(null)} title={previewFile?.name || ""} size="xl">
        {previewFile && (
          <div className="p-6">
            <div className="flex items-center justify-center min-h-[300px] bg-surface-100 dark:bg-surface-800 rounded-lg mb-4">
              <div className="text-center">
                <FileIcon extension={previewFile.extension} className="w-20 h-20 mx-auto mb-4" />
                <p className="text-lg font-medium text-surface-900 dark:text-white">{previewFile.name}</p>
                <p className="text-sm text-surface-500 mt-1">{formatBytes(previewFile.size)} • {previewFile.extension.toUpperCase()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="text-surface-500">Type</p>
                <p className="font-medium text-surface-900 dark:text-white">{previewFile.type || "Unknown"}</p>
              </div>
              <div>
                <p className="text-surface-500">Size</p>
                <p className="font-medium text-surface-900 dark:text-white">{formatBytes(previewFile.size)}</p>
              </div>
              <div>
                <p className="text-surface-500">Created</p>
                <p className="font-medium text-surface-900 dark:text-white">{formatFullDate(previewFile.createdAt)}</p>
              </div>
              <div>
                <p className="text-surface-500">Modified</p>
                <p className="font-medium text-surface-900 dark:text-white">{formatFullDate(previewFile.updatedAt)}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => toggleFavorite(previewFile.id)}>
                <Star className={`w-4 h-4 ${previewFile.isFavorite ? "fill-amber-500 text-amber-500" : ""}`} /> {previewFile.isFavorite ? "Unfavorite" : "Favorite"}
              </Button>
              <Button onClick={() => downloadFile(previewFile)}>
                <Download className="w-4 h-4" /> Download
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ============================================
// OTHER PAGES (Favorites, Recent, Shared, Trash, Settings, Admin)
// ============================================

function FavoritesPage() {
  const { files, toggleFavorite } = useStorage();
  const favorites = files.filter(f => f.isFavorite && !f.isTrashed);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">⭐ Favorites</h1>
          <p className="text-surface-600 dark:text-surface-400">Your starred files</p>
        </div>
        {favorites.length === 0 ? (
          <EmptyState icon={<Star className="w-10 h-10 text-surface-400" />} title="No favorites yet" description="Star files to quickly access them here" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {favorites.map(file => (
              <Card key={file.id} hover>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <FileIcon extension={file.extension} className="w-12 h-12" />
                    <button onClick={() => toggleFavorite(file.id)} className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    </button>
                  </div>
                  <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{file.name}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{formatBytes(file.size)}</p>
                  <button onClick={() => downloadFile(file)} className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 text-xs font-medium text-surface-700 dark:text-surface-300 transition-colors">
                    <Download className="w-3 h-3" /> Download
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function RecentPage() {
  const { files } = useStorage();
  const recent = files.filter(f => !f.isTrashed).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 20);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">🕘 Recent Files</h1>
          <p className="text-surface-600 dark:text-surface-400">Files you've recently modified</p>
        </div>
        <Card>
          <div className="divide-y divide-surface-200 dark:divide-surface-800">
            {recent.map(file => (
              <div key={file.id} className="flex items-center gap-4 p-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors cursor-pointer">
                <FileIcon extension={file.extension} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{file.name}</p>
                  <p className="text-xs text-surface-500">{formatBytes(file.size)}</p>
                </div>
                <div className="text-xs text-surface-500 flex-shrink-0">{formatDate(file.updatedAt)}</div>
                <button onClick={() => downloadFile(file)} className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors" title="Download">
                  <Download className="w-4 h-4 text-surface-500" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

function SharedPage() {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">🔗 Shared Files</h1>
          <p className="text-surface-600 dark:text-surface-400">Files you've shared with others</p>
        </div>
        <EmptyState icon={<Share2 className="w-10 h-10 text-surface-400" />} title="No shared files" description="Share files to see them here" />
      </motion.div>
    </div>
  );
}

function TrashPage() {
  const { files, restoreFile, permanentDelete } = useStorage();
  const { addToast } = useToast();
  const trashedFiles = files.filter(f => f.isTrashed);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">🗑 Trash</h1>
          <p className="text-surface-600 dark:text-surface-400">{trashedFiles.length} {trashedFiles.length === 1 ? "item" : "items"} in trash</p>
        </div>
        {trashedFiles.length === 0 ? (
          <EmptyState icon={<Trash2 className="w-10 h-10 text-surface-400" />} title="Trash is empty" description="Deleted files will appear here" />
        ) : (
          <div className="space-y-3">
            {trashedFiles.map(file => (
              <Card key={file.id} hover>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <FileIcon extension={file.extension} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{file.name}</p>
                      <p className="text-xs text-surface-500">{formatBytes(file.size)} • Deleted {file.trashedAt ? formatDate(file.trashedAt) : ""}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => { restoreFile(file.id); addToast({ type: "success", title: "File restored" }); }}>
                        <RotateCcw className="w-4 h-4" /> Restore
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => { if (confirm("Permanently delete?")) { permanentDelete(file.id); addToast({ type: "info", title: "Permanently deleted" }); } }}>
                        <X className="w-4 h-4 text-danger-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function SettingsPage() {
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();
  const [name, setName] = useState(user?.name || "");

  if (!user) return null;

  const storagePercent = calculateStoragePercent(user.storageUsed, user.storageQuota);

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">⚙ Settings</h1>
          <p className="text-surface-600 dark:text-surface-400">Manage your account and preferences</p>
        </div>
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Account</h3>
              <div className="space-y-4">
                <Input label="Full name" value={name} onChange={e => setName(e.target.value)} />
                <Input label="Email" value={user.email} disabled />
                <Button onClick={() => { updateUser({ name }); addToast({ type: "success", title: "Profile updated" }); }}>Save changes</Button>
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Appearance</h3>
              <div className="grid grid-cols-3 gap-3">
                {(["light", "dark", "system"] as const).map(t => (
                  <button key={t} onClick={() => setTheme(t)} className={`p-4 rounded-xl border-2 transition-all ${theme === t ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600"}`}>
                    <div className={`w-full h-16 rounded-lg mb-2 ${t === "light" ? "bg-white border border-surface-200" : t === "dark" ? "bg-surface-900 border border-surface-700" : "bg-gradient-to-br from-white to-surface-900"}`} />
                    <p className="text-sm font-medium text-surface-900 dark:text-white capitalize">{t}</p>
                  </button>
                ))}
              </div>
            </div>
          </Card>
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Storage</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-surface-600 dark:text-surface-400">Storage used</span>
                    <span className="font-medium text-surface-900 dark:text-white">{formatBytes(user.storageUsed)} / {formatBytes(user.storageQuota)}</span>
                  </div>
                  <div className="h-3 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${storagePercent >= QUOTA_ALERTS.DANGER ? "bg-danger-500" : "bg-gradient-to-r from-brand-500 to-cyan-500"}`} style={{ width: `${storagePercent}%` }} />
                  </div>
                  <p className="text-xs text-surface-500 mt-2">{storagePercent.toFixed(1)}% used</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}

function AdminPage() {
  const { user } = useAuth();
  const { files, folders } = useStorage();

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="p-8 text-center">
        <Shield className="w-16 h-16 text-danger-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-surface-500">You don't have permission to access this page.</p>
      </div>
    );
  }

  const stats = [
    { label: "Total Users", value: "127", icon: Users, color: "from-blue-500 to-cyan-500" },
    { label: "Total Files", value: files.length.toLocaleString(), icon: FileText, color: "from-purple-500 to-pink-500" },
    { label: "Storage Used", value: formatBytes(user.storageUsed), icon: HardDrive, color: "from-orange-500 to-red-500" },
    { label: "Uploads Today", value: "284", icon: Upload, color: "from-green-500 to-emerald-500" },
  ];

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-brand-600" />
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Admin Dashboard</h1>
          </div>
          <p className="text-surface-600 dark:text-surface-400">Manage your VITECH Cloud platform</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card hover>
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-surface-900 dark:text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-surface-600 dark:text-surface-400">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// MAIN APP
// ============================================

function AppContent() {
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem("vitech-page") || "/");
  const { user } = useAuth();
  const { searchQuery, setSearchQuery } = useStorage();

  useEffect(() => {
    localStorage.setItem("vitech-page", currentPage);
  }, [currentPage]);

  const navigate = (page: string) => setCurrentPage(page);

  // Public pages
  if (!user) {
    if (currentPage === "/register") return <RegisterPage onNavigate={navigate} />;
    if (currentPage === "/") return <LandingPage onNavigate={navigate} />;
    return <LoginPage onNavigate={navigate} />;
  }

  // Protected pages
  return (
    <div className="flex min-h-screen bg-surface-50 dark:bg-surface-950">
      <Sidebar currentPage={currentPage} onNavigate={navigate} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="flex-1 overflow-y-auto">
          <motion.div key={currentPage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {currentPage === "/dashboard" && <DashboardPage />}
            {currentPage === "/files" && <FilesPage />}
            {currentPage === "/favorites" && <FavoritesPage />}
            {currentPage === "/recent" && <RecentPage />}
            {currentPage === "/shared" && <SharedPage />}
            {currentPage === "/trash" && <TrashPage />}
            {currentPage === "/settings" && <SettingsPage />}
            {currentPage === "/admin" && <AdminPage />}
          </motion.div>
        </main>
      </div>
      <UploadCenter />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <StorageProvider>
            <AppContent />
            <ToastContainer />
          </StorageProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
