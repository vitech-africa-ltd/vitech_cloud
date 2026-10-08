// ============================================
// VITECH CLOUD — CONTEXTS
// ============================================

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, FileItem, FolderItem, UploadTask, ActivityLog, Toast } from "../types";
import { generateId } from "../lib/utils";

// ============================================
// THEME CONTEXT
// ============================================

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem("vitech-theme") as Theme) || "system";
  });
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
    const handler = () => {
      if (theme === "system") applyTheme();
    };
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme]);

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("vitech-theme", t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

// ============================================
// TOAST CONTEXT
// ============================================

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = generateId();
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    const duration = toast.duration || 4000;
    setTimeout(() => removeToast(id), duration);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// ============================================
// AUTH CONTEXT
// ============================================

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: "demo-user",
  name: "Vab Idriss",
  email: "vab@vitechafrica.com",
  role: "ADMIN",
  storageUsed: 7.2 * 1024 * 1024 * 1024,
  storageQuota: 10 * 1024 * 1024 * 1024,
  createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("vitech-user");
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem("vitech-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("vitech-user");
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Demo mode: accept any credentials
    if (email && password.length >= 6) {
      setUser(DEMO_USER);
      setLoading(false);
      return {};
    }
    setLoading(false);
    return { error: "Invalid credentials" };
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    if (name && email && password.length >= 6) {
      setUser({ ...DEMO_USER, name, email });
      setLoading(false);
      return {};
    }
    setLoading(false);
    return { error: "Invalid input" };
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// ============================================
// STORAGE CONTEXT
// ============================================

interface StorageContextType {
  files: FileItem[];
  folders: FolderItem[];
  uploads: UploadTask[];
  activities: ActivityLog[];
  currentFolderId: string | null;
  selectedFiles: Set<string>;
  searchQuery: string;
  sortBy: "name" | "date" | "size";
  sortOrder: "asc" | "desc";
  setCurrentFolderId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: "name" | "date" | "size") => void;
  setSortOrder: (order: "asc" | "desc") => void;
  createFolder: (name: string, parentId?: string | null) => void;
  uploadFiles: (fileList: File[], folderId?: string | null) => void;
  deleteFile: (fileId: string) => void;
  restoreFile: (fileId: string) => void;
  permanentDelete: (fileId: string) => void;
  toggleFavorite: (fileId: string) => void;
  renameFile: (fileId: string, newName: string) => void;
  toggleFileSelection: (fileId: string) => void;
  selectAllFiles: (fileIds: string[]) => void;
  clearSelection: () => void;
  addActivity: (action: ActivityLog["action"], fileName?: string) => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

// Demo data
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
    { id: "f9", name: "demo-video.mp4", size: 45678901, type: "video/mp4", extension: "mp4", folderId: null, isFavorite: false, isTrashed: true, trashedAt: new Date(now - 86400000 * 3).toISOString(), createdAt: new Date(now - 86400000 * 10).toISOString(), updatedAt: new Date(now - 86400000 * 3).toISOString() },
    { id: "f10", name: "notes.txt", size: 12345, type: "text/plain", extension: "txt", folderId: "folder1", isFavorite: false, isTrashed: false, createdAt: new Date(now - 86400000).toISOString(), updatedAt: new Date(now - 86400000).toISOString() },
  ];
};

const generateDemoFolders = (): FolderItem[] => [
  { id: "folder1", name: "Documents", parentId: null, createdAt: new Date(Date.now() - 86400000 * 20).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "folder2", name: "Projects", parentId: null, createdAt: new Date(Date.now() - 86400000 * 15).toISOString(), updatedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "folder3", name: "Images", parentId: null, createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), updatedAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: "folder4", name: "Work", parentId: "folder1", createdAt: new Date(Date.now() - 86400000 * 8).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "folder5", name: "VITECH", parentId: "folder2", createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), updatedAt: new Date(Date.now() - 86400000).toISOString() },
];

export function StorageProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileItem[]>(() => {
    const saved = localStorage.getItem("vitech-files");
    return saved ? JSON.parse(saved) : generateDemoFiles();
  });
  const [folders, setFolders] = useState<FolderItem[]>(() => {
    const saved = localStorage.getItem("vitech-folders");
    return saved ? JSON.parse(saved) : generateDemoFolders();
  });
  const [uploads, setUploads] = useState<UploadTask[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "date" | "size">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    localStorage.setItem("vitech-files", JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem("vitech-folders", JSON.stringify(folders));
  }, [folders]);

  const addActivity = (action: ActivityLog["action"], fileName?: string) => {
    const activity: ActivityLog = {
      id: generateId(),
      userId: "demo-user",
      userName: "Vab Idriss",
      action,
      fileName,
      createdAt: new Date().toISOString(),
    };
    setActivities((prev) => [activity, ...prev].slice(0, 50));
  };

  const createFolder = (name: string, parentId: string | null = currentFolderId) => {
    const newFolder: FolderItem = {
      id: generateId(),
      name,
      parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFolders((prev) => [...prev, newFolder]);
    addActivity("CREATE_FOLDER", name);
  };

  const uploadFiles = (fileList: File[], folderId: string | null = currentFolderId) => {
    const newUploads: UploadTask[] = fileList.map((file) => ({
      id: generateId(),
      file,
      progress: 0,
      status: "uploading" as const,
      folderId,
    }));
    setUploads((prev) => [...prev, ...newUploads]);

    // Simulate upload progress
    newUploads.forEach((upload) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          
          // Add file to list
          const newFile: FileItem = {
            id: upload.id,
            name: upload.file.name,
            size: upload.file.size,
            type: upload.file.type,
            extension: upload.file.name.split(".").pop() || "",
            folderId: upload.folderId,
            isFavorite: false,
            isTrashed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          setFiles((prev) => [newFile, ...prev]);
          addActivity("UPLOAD", upload.file.name);
          
          // Update upload status
          setUploads((prev) =>
            prev.map((u) => (u.id === upload.id ? { ...u, progress: 100, status: "complete" } : u))
          );
          
          // Remove from uploads after 3 seconds
          setTimeout(() => {
            setUploads((prev) => prev.filter((u) => u.id !== upload.id));
          }, 3000);
        } else {
          setUploads((prev) =>
            prev.map((u) => (u.id === upload.id ? { ...u, progress } : u))
          );
        }
      }, 200);
    });
  };

  const deleteFile = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, isTrashed: true, trashedAt: new Date().toISOString() } : f
      )
    );
    const file = files.find((f) => f.id === fileId);
    if (file) addActivity("DELETE", file.name);
  };

  const restoreFile = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, isTrashed: false, trashedAt: undefined } : f))
    );
    const file = files.find((f) => f.id === fileId);
    if (file) addActivity("RESTORE", file.name);
  };

  const permanentDelete = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
    if (file) addActivity("DELETE", file.name);
  };

  const toggleFavorite = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, isFavorite: !f.isFavorite } : f))
    );
  };

  const renameFile = (fileId: string, newName: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId
          ? { ...f, name: newName, extension: newName.split(".").pop() || "", updatedAt: new Date().toISOString() }
          : f
      )
    );
    addActivity("RENAME", newName);
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) => {
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

  const clearSelection = () => {
    setSelectedFiles(new Set());
  };

  return (
    <StorageContext.Provider
      value={{
        files,
        folders,
        uploads,
        activities,
        currentFolderId,
        selectedFiles,
        searchQuery,
        sortBy,
        sortOrder,
        setCurrentFolderId,
        setSearchQuery,
        setSortBy,
        setSortOrder,
        createFolder,
        uploadFiles,
        deleteFile,
        restoreFile,
        permanentDelete,
        toggleFavorite,
        renameFile,
        toggleFileSelection,
        selectAllFiles,
        clearSelection,
        addActivity,
      }}
    >
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  const ctx = useContext(StorageContext);
  if (!ctx) throw new Error("useStorage must be used within StorageProvider");
  return ctx;
}
