import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud, LayoutDashboard, Folder, Star, Clock, Share2, Trash2, Settings,
  Shield, Menu, X, Bell, Search, Sun, Moon, LogOut, User, Upload,
  Grid3X3, List, MoreVertical, Download, FolderPlus, ChevronRight,
  FileText, Image, Video, Music, Archive, File, Share, Edit3, Copy,
  Check, ArrowRight, Zap, Globe, HardDrive, TrendingUp, RotateCcw,
  Mail, Lock, Eye, EyeOff, Users
} from "lucide-react";

// ============================================
// CONTEXTS
// ============================================

interface ThemeContextType {
  theme: "light" | "dark" | "system";
  setTheme: (t: "light" | "dark" | "system") => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<"light" | "dark" | "system">(
    () => (localStorage.getItem("vitech-theme") as any) || "system"
  );
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = () => {
      const resolved = theme === "system" ? (mediaQuery.matches ? "dark" : "light") : theme;
      setResolvedTheme(resolved);
      root.classList.toggle("dark", resolved === "dark");
    };
    applyTheme();
    const handler = () => { if (theme === "system") applyTheme(); };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (t: "light" | "dark" | "system") => {
    setThemeState(t);
    localStorage.setItem("vitech-theme", t);
  };

  return <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>{children}</ThemeContext.Provider>;
}

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

// ============================================
// TYPES
// ============================================

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  extension: string;
  folderId: string | null;
  isFavorite: boolean;
  isTrashed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  storageUsed: number;
  storageQuota: number;
}

// ============================================
// DEMO DATA
// ============================================

const DEMO_USER: User = {
  id: "demo-user",
  name: "Vab Idriss",
  email: "vab@vitechafrica.com",
  role: "ADMIN",
  storageUsed: 7.2 * 1024 * 1024 * 1024,
  storageQuota: 10 * 1024 * 1024 * 1024,
};

const generateDemoFiles = (): FileItem[] => {
  const now = Date.now();
  return [
    { id: "f1", name: "Q4-Report.pdf", size: 2456789, type: "application/pdf", extension: "pdf", folderId: "folder1", isFavorite: true, isTrashed: false, createdAt: new Date(now - 86400000 * 2).toISOString(), updatedAt: new Date(now - 86400000).toISOString() },
    { id: "f2", name: "VITECH-Project.zip", size: 125829120, type: "application/zip", extension: "zip", folderId: "folder2", isFavorite: true, isTrashed: false, createdAt: new Date(now - 86400000 * 5).toISOString(), updatedAt: new Date(now - 86400000 * 2).toISOString() },
    { id: "f3", name: "Company-Logo.png", size: 456789, type: "image/png", extension: "png", folderId: "folder3", isFavorite: true, isTrashed: false, createdAt: new Date(now - 86400000 * 7).toISOString(), updatedAt: new Date(now - 86400000 * 3).toISOString() },
    { id: "f4", name: "Project-Proposal.docx", size: 1234567, type: "application/docx", extension: "docx", folderId: null, isFavorite: false, isTrashed: false, createdAt: new Date(now - 86400000).toISOString(), updatedAt: new Date(now - 3600000).toISOString() },
    { id: "f5", name: "Team-Photo.jpg", size: 3456789, type: "image/jpeg", extension: "jpg", folderId: "folder3", isFavorite: false, isTrashed: false, createdAt: new Date(now - 86400000 * 4).toISOString(), updatedAt: new Date(now - 86400000 * 4).toISOString() },
    { id: "f6", name: "Dashboard-Mockup.png", size: 890123, type: "image/png", extension: "png", folderId: "folder2", isFavorite: false, isTrashed: false, createdAt: new Date(now - 3600000 * 12).toISOString(), updatedAt: new Date(now - 3600000 * 12).toISOString() },
    { id: "f7", name: "Presentation.pptx", size: 5678901, type: "application/pptx", extension: "pptx", folderId: null, isFavorite: false, isTrashed: false, createdAt: new Date(now - 86400000 * 6).toISOString(), updatedAt: new Date(now - 86400000 * 6).toISOString() },
    { id: "f8", name: "Budget-2024.xlsx", size: 234567, type: "application/xlsx", extension: "xlsx", folderId: "folder1", isFavorite: false, isTrashed: false, createdAt: new Date(now - 86400000 * 9).toISOString(), updatedAt: new Date(now - 86400000 * 9).toISOString() },
    { id: "f9", name: "demo-video.mp4", size: 45678901, type: "video/mp4", extension: "mp4", folderId: null, isFavorite: false, isTrashed: true, createdAt: new Date(now - 86400000 * 10).toISOString(), updatedAt: new Date(now - 86400000 * 3).toISOString() },
    { id: "f10", name: "notes.txt", size: 12345, type: "text/plain", extension: "txt", folderId: "folder1", isFavorite: false, isTrashed: false, createdAt: new Date(now - 86400000).toISOString(), updatedAt: new Date(now - 86400000).toISOString() },
  ];
};

const generateDemoFolders = (): FolderItem[] => [
  { id: "folder1", name: "Documents", parentId: null, createdAt: new Date(Date.now() - 86400000 * 20).toISOString() },
  { id: "folder2", name: "Projects", parentId: null, createdAt: new Date(Date.now() - 86400000 * 15).toISOString() },
  { id: "folder3", name: "Images", parentId: null, createdAt: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: "folder4", name: "Work", parentId: "folder1", createdAt: new Date(Date.now() - 86400000 * 8).toISOString() },
  { id: "folder5", name: "VITECH", parentId: "folder2", createdAt: new Date(Date.now() - 86400000 * 5).toISOString() },
];

// ============================================
// UTILS
// ============================================

const formatBytes = (bytes: number, decimals = 1): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

const formatDate = (dateStr: string): string => {
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
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getFileIcon = (extension: string) => {
  const icons: Record<string, any> = {
    pdf: FileText, doc: FileText, docx: FileText, txt: FileText,
    xls: FileText, xlsx: FileText, csv: FileText,
    ppt: FileText, pptx: FileText,
    jpg: Image, jpeg: Image, png: Image, gif: Image, webp: Image, svg: Image,
    mp4: Video, webm: Video, mov: Video,
    mp3: Music, wav: Music, ogg: Music,
    zip: Archive, rar: Archive, "7z": Archive, tar: Archive, gz: Archive,
  };
  return icons[extension.toLowerCase()] || File;
};

const getFileColor = (extension: string): string => {
  const colors: Record<string, string> = {
    pdf: "#ef4444", doc: "#2563eb", docx: "#2563eb", txt: "#64748b",
    xls: "#16a34a", xlsx: "#16a34a", csv: "#16a34a",
    ppt: "#ea580c", pptx: "#ea580c",
    jpg: "#ec4899", jpeg: "#ec4899", png: "#ec4899", gif: "#ec4899", webp: "#ec4899",
    mp4: "#8b5cf6", webm: "#8b5cf6", mov: "#8b5cf6",
    mp3: "#f59e0b", wav: "#f59e0b", ogg: "#f59e0b",
    zip: "#ca8a04", rar: "#ca8a04", "7z": "#ca8a04",
  };
  return colors[extension.toLowerCase()] || "#64748b";
};

// ============================================
// APP
// ============================================

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>(() => {
    return localStorage.getItem("vitech-page") || "/";
  });
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("vitech-user");
    return saved ? JSON.parse(saved) : null;
  });
  const [files, setFiles] = useState<FileItem[]>(() => {
    const saved = localStorage.getItem("vitech-files");
    return saved ? JSON.parse(saved) : generateDemoFiles();
  });
  const [folders, setFolders] = useState<FolderItem[]>(() => {
    const saved = localStorage.getItem("vitech-folders");
    return saved ? JSON.parse(saved) : generateDemoFolders();
  });
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [toasts, setToasts] = useState<Array<{ id: string; type: string; title: string; message?: string }>>([]);

  // Persist state
  useEffect(() => { localStorage.setItem("vitech-page", currentPage); }, [currentPage]);
  useEffect(() => { localStorage.setItem("vitech-user", JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem("vitech-files", JSON.stringify(files)); }, [files]);
  useEffect(() => { localStorage.setItem("vitech-folders", JSON.stringify(folders)); }, [folders]);

  const addToast = (type: string, title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const navigate = (page: string) => setCurrentPage(page);

  // Auth
  const handleLogin = (email: string, password: string) => {
    if (email && password.length >= 6) {
      setUser(DEMO_USER);
      navigate("/dashboard");
      addToast("success", "Welcome back!");
    } else {
      addToast("error", "Invalid credentials");
    }
  };

  const handleRegister = (name: string, email: string, password: string) => {
    if (name && email && password.length >= 6) {
      setUser({ ...DEMO_USER, name, email });
      navigate("/dashboard");
      addToast("success", "Account created!");
    } else {
      addToast("error", "Invalid input");
    }
  };

  const handleLogout = () => {
    setUser(null);
    navigate("/");
    addToast("info", "Signed out");
  };

  // File operations
  const createFolder = (name: string) => {
    const newFolder: FolderItem = {
      id: Date.now().toString(),
      name,
      parentId: currentFolderId,
      createdAt: new Date().toISOString(),
    };
    setFolders(prev => [...prev, newFolder]);
    addToast("success", "Folder created", name);
  };

  const uploadFiles = (fileList: File[]) => {
    const newFiles: FileItem[] = fileList.map((file, i) => ({
      id: Date.now().toString() + i,
      name: file.name,
      size: file.size,
      type: file.type,
      extension: file.name.split(".").pop() || "",
      folderId: currentFolderId,
      isFavorite: false,
      isTrashed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    setFiles(prev => [...newFiles, ...prev]);
    addToast("success", `${fileList.length} file(s) uploaded`);
  };

  const deleteFile = (fileId: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, isTrashed: true } : f));
    addToast("info", "Moved to trash");
  };

  const restoreFile = (fileId: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, isTrashed: false } : f));
    addToast("success", "File restored");
  };

  const permanentDelete = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    addToast("info", "Permanently deleted");
  };

  const toggleFavorite = (fileId: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, isFavorite: !f.isFavorite } : f));
  };

  const renameFile = (fileId: string, newName: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, name: newName, extension: newName.split(".").pop() || "" } : f));
    addToast("success", "Renamed");
  };

  // Filter data
  const currentFolders = folders.filter(f => f.parentId === currentFolderId);
  const currentFiles = files.filter(f => f.folderId === currentFolderId && !f.isTrashed);
  const filteredFolders = searchQuery ? folders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())) : currentFolders;
  const filteredFiles = searchQuery ? files.filter(f => !f.isTrashed && f.name.toLowerCase().includes(searchQuery.toLowerCase())) : currentFiles;

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

  // Render
  if (!user) {
    if (currentPage === "/register") {
      return (
        <ThemeProvider>
          <RegisterPage onRegister={handleRegister} onNavigate={navigate} />
          <ToastContainer toasts={toasts} />
        </ThemeProvider>
      );
    }
    if (currentPage === "/") {
      return (
        <ThemeProvider>
          <LandingPage onNavigate={navigate} />
          <ToastContainer toasts={toasts} />
        </ThemeProvider>
      );
    }
    return (
      <ThemeProvider>
        <LoginPage onLogin={handleLogin} onNavigate={navigate} />
        <ToastContainer toasts={toasts} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-surface-50 dark:bg-surface-950">
        <Sidebar currentPage={currentPage} onNavigate={navigate} user={user} onLogout={handleLogout} />
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            user={user}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onNavigate={navigate}
            onLogout={handleLogout}
          />
          <main className="flex-1 overflow-y-auto">
            {currentPage === "/dashboard" && (
              <DashboardPage user={user} files={files} folders={folders} />
            )}
            {currentPage === "/files" && (
              <FilesPage
                folders={filteredFolders}
                files={filteredFiles}
                currentFolderId={currentFolderId}
                viewMode={viewMode}
                breadcrumbs={getBreadcrumbs()}
                onViewModeChange={setViewMode}
                onFolderNavigate={setCurrentFolderId}
                onCreateFolder={createFolder}
                onUpload={uploadFiles}
                onDelete={deleteFile}
                onToggleFavorite={toggleFavorite}
                onRename={renameFile}
              />
            )}
            {currentPage === "/favorites" && (
              <FavoritesPage files={files.filter(f => f.isFavorite && !f.isTrashed)} onToggleFavorite={toggleFavorite} />
            )}
            {currentPage === "/recent" && (
              <RecentPage files={files.filter(f => !f.isTrashed).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 20)} />
            )}
            {currentPage === "/shared" && <SharedPage />}
            {currentPage === "/trash" && (
              <TrashPage files={files.filter(f => f.isTrashed)} onRestore={restoreFile} onPermanentDelete={permanentDelete} />
            )}
            {currentPage === "/settings" && <SettingsPage user={user} />}
            {currentPage === "/admin" && user.role === "ADMIN" && (
              <AdminPage user={user} files={files} folders={folders} />
            )}
          </main>
        </div>
        <ToastContainer toasts={toasts} />
      </div>
    </ThemeProvider>
  );
}

// ============================================
// COMPONENTS
// ============================================

function ToastContainer({ toasts }: { toasts: Array<{ id: string; type: string; title: string; message?: string }> }) {
  const icons: Record<string, any> = {
    success: <Check className="w-5 h-5 text-green-500" />,
    error: <X className="w-5 h-5 text-red-500" />,
    info: <Bell className="w-5 h-5 text-blue-500" />,
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            className="flex items-start gap-3 p-4 rounded-lg shadow-lg border bg-white dark:bg-surface-900 border-surface-200 dark:border-surface-800"
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-surface-900 dark:text-white">{toast.title}</p>
              {toast.message && <p className="text-sm text-surface-600 dark:text-surface-400 mt-0.5">{toast.message}</p>}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function Sidebar({ currentPage, onNavigate, user, onLogout }: { currentPage: string; onNavigate: (page: string) => void; user: User; onLogout: () => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/files", icon: Folder, label: "My Files" },
    { to: "/favorites", icon: Star, label: "Favorites" },
    { to: "/recent", icon: Clock, label: "Recent" },
    { to: "/shared", icon: Share2, label: "Shared" },
    { to: "/trash", icon: Trash2, label: "Trash" },
  ];

  const storagePercent = (user.storageUsed / user.storageQuota) * 100;

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
          <button
            onClick={() => { onNavigate("/admin"); setMobileOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              currentPage === "/admin" ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400" : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
            }`}
          >
            <Shield className="w-5 h-5" />
            <span>Admin</span>
          </button>
        )}
        <button
          onClick={() => { onNavigate("/settings"); setMobileOpen(false); }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
            currentPage === "/settings" ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400" : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign out</span>
        </button>
      </div>

      <div className="px-4 pb-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-brand-500/10 to-cyan-500/10 border border-brand-200/50 dark:border-brand-800/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
              {user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-surface-500 truncate">{user.email}</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-surface-600 dark:text-surface-400">Storage</span>
              <span className="text-surface-900 dark:text-white font-medium">
                {formatBytes(user.storageUsed)} / {formatBytes(user.storageQuota)}
              </span>
            </div>
            <div className="h-1.5 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full" style={{ width: `${storagePercent}%` }} />
            </div>
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
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-surface-950 border-r border-surface-200 dark:border-surface-800">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800">
              <X className="w-5 h-5" />
            </button>
            {navContent}
          </motion.aside>
        </div>
      )}
    </>
  );
}

function Header({ user, searchQuery, onSearchChange, onNavigate, onLogout }: { user: User; searchQuery: string; onSearchChange: (q: string) => void; onNavigate: (page: string) => void; onLogout: () => void }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800">
      <div className="flex items-center justify-between px-4 lg:px-8 h-16">
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={e => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-surface-100 dark:bg-surface-800 border border-transparent focus:border-brand-500 focus:bg-white dark:focus:bg-surface-900 text-sm text-surface-900 dark:text-white placeholder:text-surface-400 outline-none transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            {resolvedTheme === "dark" ? <Sun className="w-5 h-5 text-surface-400" /> : <Moon className="w-5 h-5 text-surface-600" />}
          </button>
          <button className="p-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors relative">
            <Bell className="w-5 h-5 text-surface-600 dark:text-surface-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="relative">
            <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
                {user.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm font-medium text-surface-700 dark:text-surface-300">{user.name.split(" ")[0]}</span>
            </button>
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-surface-200 dark:border-surface-800 py-2">
                <div className="px-4 py-3 border-b border-surface-200 dark:border-surface-800">
                  <p className="text-sm font-medium text-surface-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-surface-500 truncate">{user.email}</p>
                </div>
                <button onClick={() => { setShowProfile(false); onNavigate("/settings"); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
                  <User className="w-4 h-4" /> Profile & Settings
                </button>
                <button onClick={() => { setShowProfile(false); onLogout(); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function LandingPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const features = [
    { icon: Shield, title: "Secure Storage", desc: "Enterprise-grade encryption and security for all your files" },
    { icon: Zap, title: "Lightning Fast", desc: "Upload and download at maximum speed with optimized infrastructure" },
    { icon: Globe, title: "Access Anywhere", desc: "Access your files from any device, anywhere in the world" },
    { icon: Cloud, title: "Private Cloud", desc: "Your data stays private and under your complete control" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800">
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
              <button onClick={() => onNavigate("/register")} className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium shadow-sm">
                Get Started
              </button>
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
              <span>Private cloud storage by VITECH Africa</span>
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
              <button onClick={() => onNavigate("/register")} className="px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm flex items-center gap-2">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => onNavigate("/login")} className="px-6 py-3 rounded-lg border border-surface-300 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300 font-medium">
                Sign In
              </button>
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
            {features.map((feature, i) => (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:shadow-lg transition-shadow">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-surface-900 dark:text-white">VITECH Cloud</span>
            </div>
            <p className="text-sm text-surface-600 dark:text-surface-400">© 2024 VITECH Africa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LoginPage({ onLogin, onNavigate }: { onLogin: (email: string, password: string) => void; onNavigate: (page: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
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
        <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full pl-11 pr-4 py-3 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="w-full pl-11 pr-11 py-3 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <button type="submit" className="w-full px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm">
              Sign in
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Don't have an account?{" "}
              <button onClick={() => onNavigate("/register")} className="text-brand-600 dark:text-brand-400 hover:underline font-medium">Create account</button>
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-surface-500 mt-6">Demo mode: Use any email and password (6+ chars) to test</p>
      </motion.div>
    </div>
  );
}

function RegisterPage({ onRegister, onNavigate }: { onRegister: (name: string, email: string, password: string) => void; onNavigate: (page: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    onRegister(name, email, password);
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
        <div className="bg-white dark:bg-surface-900 rounded-2xl shadow-xl border border-surface-200 dark:border-surface-800 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Full name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required className="w-full pl-11 pr-4 py-3 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full pl-11 pr-4 py-3 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required className="w-full pl-11 pr-4 py-3 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Confirm password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" required className="w-full pl-11 pr-4 py-3 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all" />
              </div>
            </div>
            <button type="submit" className="w-full px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium shadow-sm">
              Create account
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-surface-600 dark:text-surface-400">
              Already have an account?{" "}
              <button onClick={() => onNavigate("/login")} className="text-brand-600 dark:text-brand-400 hover:underline font-medium">Sign in</button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DashboardPage({ user, files, folders }: { user: User; files: FileItem[]; folders: FolderItem[] }) {
  const recentFiles = files.filter(f => !f.isTrashed).slice(0, 5);
  const storagePercent = (user.storageUsed / user.storageQuota) * 100;

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
              <div className="p-6 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-surface-900 dark:text-white mb-1">{stat.value}</p>
                <p className="text-sm text-surface-600 dark:text-surface-400">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 p-6 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Storage</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-surface-600 dark:text-surface-400">Used</span>
                  <span className="font-medium text-surface-900 dark:text-white">{formatBytes(user.storageUsed)} / {formatBytes(user.storageQuota)}</span>
                </div>
                <div className="h-3 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${storagePercent}%` }} transition={{ duration: 1 }} className="h-full bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full" />
                </div>
                <p className="text-xs text-surface-500 mt-2">{storagePercent.toFixed(1)}% used</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 p-6 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Recent Files</h3>
            <div className="space-y-2">
              {recentFiles.map(file => {
                const Icon = getFileIcon(file.extension);
                return (
                  <div key={file.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors cursor-pointer">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${getFileColor(file.extension)}20` }}>
                      <Icon className="w-5 h-5" style={{ color: getFileColor(file.extension) }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{file.name}</p>
                      <p className="text-xs text-surface-500">{formatBytes(file.size)}</p>
                    </div>
                    <div className="text-xs text-surface-500">{formatDate(file.updatedAt)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FilesPage({ folders, files, currentFolderId, viewMode, breadcrumbs, onViewModeChange, onFolderNavigate, onCreateFolder, onUpload, onDelete, onToggleFavorite, onRename }: any) {
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [contextMenu, setContextMenu] = useState<any>(null);
  const [renameModal, setRenameModal] = useState<any>(null);
  const [renameValue, setRenameValue] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName("");
      setShowNewFolder(false);
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-1 text-sm text-surface-500 mb-1 flex-wrap">
            {breadcrumbs.map((crumb: any, i: number) => (
              <span key={crumb.id ?? "root"} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="w-3 h-3" />}
                <button onClick={() => onFolderNavigate(crumb.id)} className={`hover:text-brand-600 dark:hover:text-brand-400 transition-colors ${i === breadcrumbs.length - 1 ? "text-surface-900 dark:text-white font-medium" : ""}`}>
                  {crumb.name}
                </button>
              </span>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">My Files</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-surface-200 dark:border-surface-800 overflow-hidden">
            <button onClick={() => onViewModeChange("grid")} className={`p-2 ${viewMode === "grid" ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600" : "text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"}`}>
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button onClick={() => onViewModeChange("list")} className={`p-2 ${viewMode === "list" ? "bg-brand-50 dark:bg-brand-500/10 text-brand-600" : "text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800"}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
          <button onClick={() => setShowNewFolder(true)} className="px-3 py-2 rounded-lg border border-surface-300 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 text-sm font-medium flex items-center gap-2">
            <FolderPlus className="w-4 h-4" /> New Folder
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload
          </button>
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e => { if (e.target.files) onUpload(Array.from(e.target.files)); }} />
        </div>
      </div>

      {folders.length === 0 && files.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
            <Folder className="w-10 h-10 text-surface-400" />
          </div>
          <p className="text-lg font-medium text-surface-900 dark:text-white mb-1">This folder is empty</p>
          <p className="text-sm text-surface-500">Upload files or create a folder to get started</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {folders.map((folder: FolderItem) => (
            <div key={folder.id} className="p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm hover:shadow-md transition-all cursor-pointer" onDoubleClick={() => onFolderNavigate(folder.id)} onContextMenu={e => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, item: folder, type: "folder" }); }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <Folder className="w-6 h-6 text-white" />
                </div>
                <button onClick={e => { e.stopPropagation(); setContextMenu({ x: e.clientX, y: e.clientY, item: folder, type: "folder" }); }} className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800">
                  <MoreVertical className="w-4 h-4 text-surface-400" />
                </button>
              </div>
              <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{folder.name}</p>
              <p className="text-xs text-surface-500 mt-0.5">{formatDate(folder.createdAt)}</p>
            </div>
          ))}
          {files.map((file: FileItem) => {
            const Icon = getFileIcon(file.extension);
            return (
              <div key={file.id} className="p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm hover:shadow-md transition-all cursor-pointer" onContextMenu={e => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, item: file, type: "file" }); }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${getFileColor(file.extension)}20` }}>
                    <Icon className="w-6 h-6" style={{ color: getFileColor(file.extension) }} />
                  </div>
                  <div className="flex items-center gap-1">
                    {file.isFavorite && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                    <button onClick={e => { e.stopPropagation(); setContextMenu({ x: e.clientX, y: e.clientY, item: file, type: "file" }); }} className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800">
                      <MoreVertical className="w-4 h-4 text-surface-400" />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{file.name}</p>
                <p className="text-xs text-surface-500 mt-0.5">{formatBytes(file.size)}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm overflow-hidden">
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
              {folders.map((folder: FolderItem) => (
                <tr key={folder.id} className="border-b border-surface-100 dark:border-surface-800/50 hover:bg-surface-50 dark:hover:bg-surface-800/50 cursor-pointer" onDoubleClick={() => onFolderNavigate(folder.id)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                        <Folder className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-surface-900 dark:text-white">{folder.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-surface-500 hidden sm:table-cell">—</td>
                  <td className="px-4 py-3 text-sm text-surface-500 hidden md:table-cell">{formatDate(folder.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button onClick={e => { e.stopPropagation(); setContextMenu({ x: e.clientX, y: e.clientY, item: folder, type: "folder" }); }} className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800">
                      <MoreVertical className="w-4 h-4 text-surface-400" />
                    </button>
                  </td>
                </tr>
              ))}
              {files.map((file: FileItem) => {
                const Icon = getFileIcon(file.extension);
                return (
                  <tr key={file.id} className="border-b border-surface-100 dark:border-surface-800/50 hover:bg-surface-50 dark:hover:bg-surface-800/50 cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${getFileColor(file.extension)}20` }}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-surface-900 dark:text-white">{file.name}</span>
                          {file.isFavorite && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-surface-500 hidden sm:table-cell">{formatBytes(file.size)}</td>
                    <td className="px-4 py-3 text-sm text-surface-500 hidden md:table-cell">{formatDate(file.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <button onClick={e => { e.stopPropagation(); setContextMenu({ x: e.clientX, y: e.clientY, item: file, type: "file" }); }} className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800">
                        <MoreVertical className="w-4 h-4 text-surface-400" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {contextMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)} />
          <div className="fixed z-50 bg-white dark:bg-surface-900 rounded-xl shadow-xl border border-surface-200 dark:border-surface-800 py-2 w-48" style={{ top: contextMenu.y, left: contextMenu.x }}>
            {contextMenu.type === "file" && (
              <>
                <button onClick={() => { onToggleFavorite(contextMenu.item.id); setContextMenu(null); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
                  <Star className="w-4 h-4" /> {contextMenu.item.isFavorite ? "Unfavorite" : "Favorite"}
                </button>
                <button onClick={() => { setRenameModal(contextMenu.item); setRenameValue(contextMenu.item.name); setContextMenu(null); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800">
                  <Edit3 className="w-4 h-4" /> Rename
                </button>
                <button onClick={() => { onDelete(contextMenu.item.id); setContextMenu(null); }} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </>
            )}
          </div>
        </>
      )}

      {showNewFolder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowNewFolder(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-surface-900 rounded-xl shadow-2xl border border-surface-200 dark:border-surface-800 p-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">New Folder</h3>
            <input type="text" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="Folder name" autoFocus onKeyDown={e => e.key === "Enter" && handleCreateFolder()} className="w-full px-4 py-3 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white outline-none focus:border-brand-500" />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowNewFolder(false)} className="px-4 py-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-sm font-medium">Cancel</button>
              <button onClick={handleCreateFolder} className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium">Create</button>
            </div>
          </div>
        </div>
      )}

      {renameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setRenameModal(null)} />
          <div className="relative w-full max-w-md bg-white dark:bg-surface-900 rounded-xl shadow-2xl border border-surface-200 dark:border-surface-800 p-6">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Rename</h3>
            <input type="text" value={renameValue} onChange={e => setRenameValue(e.target.value)} autoFocus onKeyDown={e => { if (e.key === "Enter") { onRename(renameModal.id, renameValue); setRenameModal(null); } }} className="w-full px-4 py-3 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white outline-none focus:border-brand-500" />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setRenameModal(null)} className="px-4 py-2 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 text-sm font-medium">Cancel</button>
              <button onClick={() => { onRename(renameModal.id, renameValue); setRenameModal(null); }} className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FavoritesPage({ files, onToggleFavorite }: any) {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">⭐ Favorites</h1>
          <p className="text-surface-600 dark:text-surface-400">Your starred files</p>
        </div>
        {files.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
              <Star className="w-10 h-10 text-surface-400" />
            </div>
            <p className="text-lg font-medium text-surface-900 dark:text-white mb-1">No favorites yet</p>
            <p className="text-sm text-surface-500">Star files to quickly access them here</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {files.map((file: FileItem) => {
              const Icon = getFileIcon(file.extension);
              return (
                <div key={file.id} className="p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${getFileColor(file.extension)}20` }}>
                      <Icon className="w-6 h-6" style={{ color: getFileColor(file.extension) }} />
                    </div>
                    <button onClick={() => onToggleFavorite(file.id)} className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    </button>
                  </div>
                  <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{file.name}</p>
                  <p className="text-xs text-surface-500 mt-0.5">{formatBytes(file.size)}</p>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function RecentPage({ files }: { files: FileItem[] }) {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">🕘 Recent Files</h1>
          <p className="text-surface-600 dark:text-surface-400">Files you've recently modified</p>
        </div>
        <div className="rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm">
          <div className="divide-y divide-surface-200 dark:divide-surface-800">
            {files.map(file => {
              const Icon = getFileIcon(file.extension);
              return (
                <div key={file.id} className="flex items-center gap-4 p-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${getFileColor(file.extension)}20` }}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{file.name}</p>
                    <p className="text-xs text-surface-500">{formatBytes(file.size)}</p>
                  </div>
                  <div className="text-xs text-surface-500 flex-shrink-0">{formatDate(file.updatedAt)}</div>
                </div>
              );
            })}
          </div>
        </div>
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
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-10 h-10 text-surface-400" />
          </div>
          <p className="text-lg font-medium text-surface-900 dark:text-white mb-1">No shared files</p>
          <p className="text-sm text-surface-500">Share files to see them here</p>
        </div>
      </motion.div>
    </div>
  );
}

function TrashPage({ files, onRestore, onPermanentDelete }: any) {
  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">🗑 Trash</h1>
          <p className="text-surface-600 dark:text-surface-400">{files.length} {files.length === 1 ? "item" : "items"} in trash</p>
        </div>
        {files.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-10 h-10 text-surface-400" />
            </div>
            <p className="text-lg font-medium text-surface-900 dark:text-white mb-1">Trash is empty</p>
            <p className="text-sm text-surface-500">Deleted files will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file: FileItem) => {
              const Icon = getFileIcon(file.extension);
              return (
                <div key={file.id} className="p-4 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${getFileColor(file.extension)}20` }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-900 dark:text-white truncate">{file.name}</p>
                      <p className="text-xs text-surface-500">{formatBytes(file.size)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => onRestore(file.id)} className="px-3 py-1.5 rounded-lg border border-surface-300 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 text-sm font-medium flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" /> Restore
                      </button>
                      <button onClick={() => { if (confirm("Permanently delete?")) onPermanentDelete(file.id); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10">
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function SettingsPage({ user }: { user: User }) {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("account");

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Sun },
    { id: "storage", label: "Storage", icon: HardDrive },
  ];

  const storagePercent = (user.storageUsed / user.storageQuota) * 100;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">⚙ Settings</h1>
          <p className="text-surface-600 dark:text-surface-400">Manage your account and preferences</p>
        </div>
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="p-2 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? "bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400" : "text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800"}`}>
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-3">
            {activeTab === "account" && (
              <div className="p-6 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Account</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Full name</label>
                    <input type="text" defaultValue={user.name} className="w-full px-4 py-2.5 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-900 dark:text-white outline-none focus:border-brand-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">Email</label>
                    <input type="email" defaultValue={user.email} disabled className="w-full px-4 py-2.5 rounded-lg bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-500 cursor-not-allowed" />
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium">Save changes</button>
                </div>
              </div>
            )}
            {activeTab === "appearance" && (
              <div className="p-6 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Appearance</h3>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-3">Theme</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["light", "dark", "system"] as const).map(t => (
                      <button key={t} onClick={() => setTheme(t)} className={`p-4 rounded-xl border-2 transition-all ${theme === t ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600"}`}>
                        <div className={`w-full h-16 rounded-lg mb-2 ${t === "light" ? "bg-white border border-surface-200" : t === "dark" ? "bg-surface-900 border border-surface-700" : "bg-gradient-to-br from-white to-surface-900"}`} />
                        <p className="text-sm font-medium text-surface-900 dark:text-white capitalize">{t}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === "storage" && (
              <div className="p-6 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Storage</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-surface-600 dark:text-surface-400">Storage used</span>
                      <span className="font-medium text-surface-900 dark:text-white">{formatBytes(user.storageUsed)} / {formatBytes(user.storageQuota)}</span>
                    </div>
                    <div className="h-3 bg-surface-200 dark:bg-surface-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-brand-500 to-cyan-500 rounded-full" style={{ width: `${storagePercent}%` }} />
                    </div>
                    <p className="text-xs text-surface-500 mt-2">{storagePercent.toFixed(1)}% used</p>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "security" && (
              <div className="p-6 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-4">Security</h3>
                <p className="text-sm text-surface-500">Security settings will be available soon.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AdminPage({ user, files, folders }: { user: User; files: FileItem[]; folders: FolderItem[] }) {
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className="p-6 rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-surface-900 dark:text-white mb-1">{stat.value}</p>
                <p className="text-sm text-surface-600 dark:text-surface-400">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
