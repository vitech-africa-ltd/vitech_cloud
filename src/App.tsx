import React, { useState, useEffect, createContext, useContext, ReactNode, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cloud, LayoutDashboard, Folder, Star, Clock, Share2, Trash2, Settings,
  Shield, Menu, X, Bell, Search, Sun, Moon, LogOut, User, Upload,
  Grid3X3, List, MoreVertical, Download, FolderPlus, ChevronRight,
  FileText, Image, Video, Music, Archive, File, Share, Edit3, Copy,
  Check, ArrowRight, Zap, Globe, HardDrive, TrendingUp, RotateCcw,
  Mail, Lock, Eye, EyeOff, Users, CheckSquare, Square, Info, AlertCircle,
  ExternalLink, Eye as EyeIcon, Filter, SortAsc, SortDesc, Activity,
  BarChart3, PieChart, TrendingDown, Calendar, Tag, Link2, Unlock
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
  fileData?: string; // Base64 data for downloaded files
}

interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
}

interface UserData {
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

const DEMO_USER: UserData = {
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
    { id: "f4", name: "Project-Proposal.docx", size: 1234567, type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", extension: "docx", folderId: null, isFavorite: false, isTrashed: false, createdAt: new Date(now - 86400000).toISOString(), updatedAt: new Date(now - 3600000).toISOString() },
    { id: "f5", name: "Team-Photo.jpg", size: 3456789, type: "image/jpeg", extension: "jpg", folderId: "folder3", isFavorite: false, isTrashed: false, createdAt: new Date(now - 86400000 * 4).toISOString(), updatedAt: new Date(now - 86400000 * 4).toISOString() },
    { id: "f6", name: "Dashboard-Mockup.png", size: 890123, type: "image/png", extension: "png", folderId: "folder2", isFavorite: false, isTrashed: false, createdAt: new Date(now - 3600000 * 12).toISOString(), updatedAt: new Date(now - 3600000 * 12).toISOString() },
    { id: "f7", name: "Presentation.pptx", size: 5678901, type: "application/vnd.openxmlformats-officedocument.presentationml.presentation", extension: "pptx", folderId: null, isFavorite: false, isTrashed: false, createdAt: new Date(now - 86400000 * 6).toISOString(), updatedAt: new Date(now - 86400000 * 6).toISOString() },
    { id: "f8", name: "Budget-2024.xlsx", size: 234567, type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", extension: "xlsx", folderId: "folder1", isFavorite: false, isTrashed: false, createdAt: new Date(now - 86400000 * 9).toISOString(), updatedAt: new Date(now - 86400000 * 9).toISOString() },
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
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: days > 365 ? "numeric" : undefined });
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

const downloadFile = (file: FileItem) => {
  // Create a dummy file content for demo
  const content = file.fileData || `This is a demo file: ${file.name}\nSize: ${formatBytes(file.size)}\nType: ${file.type}\nCreated: ${file.createdAt}`;
  const blob = new Blob([content], { type: file.type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const downloadMultipleFiles = (files: FileItem[]) => {
  files.forEach((file, index) => {
    setTimeout(() => downloadFile(file), index * 500); // Stagger downloads
  });
};

// ============================================
// APP
// ============================================

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>(() => {
    return localStorage.getItem("vitech-page") || "/";
  });
  const [user, setUser] = useState<UserData | null>(() => {
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
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

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

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const selectAllFiles = (fileIds: string[]) => {
    if (selectedFiles.size === fileIds.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(fileIds));
    }
  };

  const downloadSelectedFiles = () => {
    const selectedFilesList = files.filter(f => selectedFiles.has(f.id) && !f.isTrashed);
    if (selectedFilesList.length === 0) {
      addToast("warning", "No files selected");
      return;
    }
    downloadMultipleFiles(selectedFilesList);
    addToast("success", `Downloading ${selectedFilesList.length} file(s)`);
  };

  // Filter and sort data
  const currentFolders = folders.filter(f => f.parentId === currentFolderId);
  const currentFiles = files.filter(f => f.folderId === currentFolderId && !f.isTrashed);
  
  const filteredFolders = searchQuery 
    ? folders.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())) 
    : currentFolders;
  
  const filteredFiles = searchQuery 
    ? files.filter(f => !f.isTrashed && f.name.toLowerCase().includes(searchQuery.toLowerCase())) 
    : currentFiles;

  // Sort files
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else if (sortBy === "date") {
      comparison = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    } else if (sortBy === "size") {
      comparison = b.size - a.size;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

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
                files={sortedFiles}
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
                onDownload={downloadFile}
                selectedFiles={selectedFiles}
                onToggleSelection={toggleFileSelection}
                onSelectAll={selectAllFiles}
                onDownloadSelected={downloadSelectedFiles}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                sortOrder={sortOrder}
                onSortOrderChange={setSortOrder}
              />
            )}
            {currentPage === "/favorites" && (
              <FavoritesPage files={files.filter(f => f.isFavorite && !f.isTrashed)} onToggleFavorite={toggleFavorite} onDownload={downloadFile} />
            )}
            {currentPage === "/recent" && (
              <RecentPage files={files.filter(f => !f.isTrashed).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 20)} onDownload={downloadFile} />
            )}
            {currentPage === "/shared" && <SharedPage />}
            {currentPage === "/trash" && (
              <TrashPage files={files.filter(f => f.isTrashed)} onRestore={restoreFile} onPermanentDelete={permanentDelete} onDownload={downloadFile} />
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
    info: <Info className="w-5 h-5 text-blue-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
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

function Sidebar({ currentPage, onNavigate, user, onLogout }: { currentPage: string; onNavigate: (page: string) => void; user: UserData; onLogout: () => void }) {
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

function Header({ user, searchQuery, onSearchChange, onNavigate, onLogout }: { user: UserData; searchQuery: string; onSearchChange: (q: string) => void; onNavigate: (page: string) => void; onLogout: () => void }) {
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

// ... (Le reste du code continue avec les pages Landing, Login, Register, Dashboard, Files, etc.)
// Je vais continuer dans le prochain message car c'est trop long pour un seul fichier
