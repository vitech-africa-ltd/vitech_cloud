// ============================================
// VITECH CLOUD — COMMAND PALETTE
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, File, Folder, Settings, Upload, LayoutDashboard, Star, Clock, X } from 'lucide-react';
import { useAuth } from '../contexts';
import { Card } from './ui';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  category: 'navigation' | 'action' | 'settings';
  keywords?: string[];
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const commands: Command[] = [
    // Navigation
    {
      id: 'dashboard',
      label: 'Go to Dashboard',
      description: 'View your overview',
      icon: LayoutDashboard,
      action: () => onNavigate('/dashboard'),
      category: 'navigation',
      keywords: ['home', 'overview', 'stats'],
    },
    {
      id: 'files',
      label: 'Go to My Files',
      description: 'Manage your files',
      icon: File,
      action: () => onNavigate('/files'),
      category: 'navigation',
      keywords: ['files', 'documents', 'manage'],
    },
    {
      id: 'favorites',
      label: 'Go to Favorites',
      description: 'View starred files',
      icon: Star,
      action: () => onNavigate('/favorites'),
      category: 'navigation',
      keywords: ['starred', 'important'],
    },
    {
      id: 'recent',
      label: 'Go to Recent',
      description: 'View recent files',
      icon: Clock,
      action: () => onNavigate('/recent'),
      category: 'navigation',
      keywords: ['history', 'latest'],
    },
    {
      id: 'settings',
      label: 'Open Settings',
      description: 'Manage preferences',
      icon: Settings,
      action: () => onNavigate('/settings'),
      category: 'settings',
      keywords: ['preferences', 'options', 'config'],
    },
    // Actions
    {
      id: 'upload',
      label: 'Upload Files',
      description: 'Upload new files',
      icon: Upload,
      action: () => {
        onNavigate('/files');
        // Trigger upload after navigation
        setTimeout(() => {
          const input = document.querySelector('input[type="file"]') as HTMLInputElement;
          if (input) input.click();
        }, 100);
      },
      category: 'action',
      keywords: ['add', 'new', 'import'],
    },
    {
      id: 'new-folder',
      label: 'Create New Folder',
      description: 'Organize your files',
      icon: Folder,
      action: () => {
        onNavigate('/files');
        // Trigger folder creation after navigation
        setTimeout(() => {
          const button = document.querySelector('[data-action="new-folder"]') as HTMLButtonElement;
          if (button) button.click();
        }, 100);
      },
      category: 'action',
      keywords: ['folder', 'directory', 'organize'],
    },
  ];

  // Filter commands based on query
  const filteredCommands = commands.filter(cmd => {
    const searchStr = `${cmd.label} ${cmd.description || ''} ${cmd.keywords?.join(' ') || ''}`.toLowerCase();
    return searchStr.includes(query.toLowerCase());
  });

  // Group by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        e.preventDefault();
        filteredCommands[selectedIndex].action();
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Global keyboard shortcut
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open command palette (handled by parent)
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [isOpen, onClose]);

  if (!user) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Command Palette */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            <Card className="overflow-hidden shadow-2xl">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-surface-200 dark:border-surface-800">
                <Search className="w-5 h-5 text-surface-400 flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent outline-none text-surface-900 dark:text-white placeholder:text-surface-400"
                />
                <button
                  onClick={onClose}
                  className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                >
                  <X className="w-4 h-4 text-surface-400" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-96 overflow-y-auto p-2">
                {filteredCommands.length === 0 ? (
                  <div className="py-12 text-center text-surface-500">
                    No results found
                  </div>
                ) : (
                  Object.entries(groupedCommands).map(([category, cmds]) => (
                    <div key={category} className="mb-4">
                      <div className="px-3 py-2 text-xs font-semibold text-surface-500 uppercase">
                        {category}
                      </div>
                      {cmds.map((cmd, idx) => {
                        const globalIndex = filteredCommands.indexOf(cmd);
                        return (
                          <button
                            key={cmd.id}
                            onClick={() => {
                              cmd.action();
                              onClose();
                            }}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                              globalIndex === selectedIndex
                                ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400'
                                : 'hover:bg-surface-100 dark:hover:bg-surface-800 text-surface-700 dark:text-surface-300'
                            }`}
                          >
                            <cmd.icon className="w-5 h-5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-medium">{cmd.label}</div>
                              {cmd.description && (
                                <div className="text-xs text-surface-500 truncate">
                                  {cmd.description}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900/50">
                <div className="flex items-center gap-4 text-xs text-surface-500">
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-surface-200 dark:bg-surface-800 font-mono">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-surface-200 dark:bg-surface-800 font-mono">↵</kbd>
                    Select
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="px-1.5 py-0.5 rounded bg-surface-200 dark:bg-surface-800 font-mono">esc</kbd>
                    Close
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
