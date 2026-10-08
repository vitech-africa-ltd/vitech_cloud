// ============================================
// VITECH CLOUD — UI COMPONENTS
// ============================================

import React, { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, HTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Info, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "../../contexts";
import { Toast } from "../../types";

// ============================================
// BUTTON
// ============================================

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow-md",
    secondary: "bg-surface-100 hover:bg-surface-200 text-surface-900 dark:bg-surface-800 dark:hover:bg-surface-700 dark:text-white",
    ghost: "hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300",
    danger: "bg-danger-500 hover:bg-danger-600 text-white",
    outline: "border border-surface-300 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

// ============================================
// CARD
// ============================================

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover, ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 shadow-sm ${
        hover ? "transition-all duration-200 hover:shadow-md hover:border-surface-300 dark:hover:border-surface-700 cursor-pointer" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "", ...props }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-6 py-4 border-b border-surface-200 dark:border-surface-800 ${className}`} {...props}>{children}</div>;
}

export function CardContent({ children, className = "", ...props }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`px-6 py-4 ${className}`} {...props}>{children}</div>;
}

// ============================================
// INPUT
// ============================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
}

export function Input({ label, error, icon, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400">
            {icon}
          </div>
        )}
        <input
          className={`w-full ${icon ? "pl-10" : "pl-4"} pr-4 py-2.5 rounded-lg bg-surface-50 dark:bg-surface-800 border ${
            error ? "border-danger-500" : "border-surface-200 dark:border-surface-700"
          } text-surface-900 dark:text-white placeholder:text-surface-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-danger-500">{error}</p>}
    </div>
  );
}

// ============================================
// MODAL
// ============================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full bg-white dark:bg-surface-900 rounded-xl shadow-2xl border border-surface-200 dark:border-surface-800 max-h-[90vh] overflow-hidden flex flex-col ${sizes[size]}`}
          >
            {title && (
              <div className="flex items-center justify-between px-6 py-4 border-b border-surface-200 dark:border-surface-800">
                <h3 className="text-lg font-semibold text-surface-900 dark:text-white">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <X className="w-5 h-5 text-surface-500" />
                </button>
              </div>
            )}
            <div className="overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ============================================
// TOAST CONTAINER
// ============================================

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  const icons = {
    success: <Check className="w-5 h-5 text-success-500" />,
    error: <X className="w-5 h-5 text-danger-500" />,
    info: <Info className="w-5 h-5 text-info-500" />,
    warning: <AlertCircle className="w-5 h-5 text-warning-500" />,
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
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
              {toast.message && (
                <p className="text-sm text-surface-600 dark:text-surface-400 mt-0.5">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800"
            >
              <X className="w-4 h-4 text-surface-400" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// SKELETON LOADER
// ============================================

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded ${className}`} />;
}

export function CardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-12 w-12 rounded-xl mb-4" />
        <Skeleton className="h-6 w-20 mb-2" />
        <Skeleton className="h-4 w-32" />
      </CardContent>
    </Card>
  );
}

// ============================================
// EMPTY STATE
// ============================================

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-surface-500 mb-4">{description}</p>
      {action}
    </div>
  );
}

// ============================================
// BADGE
// ============================================

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variants = {
    default: "bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300",
    success: "bg-success-500/10 text-success-600 dark:text-success-500",
    warning: "bg-warning-500/10 text-warning-600 dark:text-warning-500",
    danger: "bg-danger-500/10 text-danger-600 dark:text-danger-500",
    info: "bg-info-500/10 text-info-600 dark:text-info-500",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
