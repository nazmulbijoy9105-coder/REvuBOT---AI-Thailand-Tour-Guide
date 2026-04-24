'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Banknote,
  Globe,
  MessageSquare,
  Command,
} from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onNewSession: () => void;
  onSearchHistory: () => void;
  onCurrency: () => void;
  onSwitchLanguage: () => void;
  onFeedback: () => void;
  labels: {
    newSession: string;
    searchTravelHistory: string;
    currencyIntelligence: string;
    switchLanguage: string;
    feedback: string;
    searchPlaceholder: string;
  };
}

const COMMAND_DEFS = [
  { id: 'new-session', shortcut: 'N', Icon: Plus },
  { id: 'search-history', shortcut: 'S', Icon: Search },
  { id: 'currency', shortcut: 'C', Icon: Banknote },
  { id: 'switch-language', shortcut: 'L', Icon: Globe },
  { id: 'feedback', shortcut: 'F', Icon: MessageSquare },
] as const;

function CommandPaletteInner({
  onClose,
  onNewSession,
  onSearchHistory,
  onCurrency,
  onSwitchLanguage,
  onFeedback,
  labels,
}: Omit<CommandPaletteProps, 'open'>) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const labelMap: Record<string, string> = {
    'new-session': labels.newSession,
    'search-history': labels.searchTravelHistory,
    'currency': labels.currencyIntelligence,
    'switch-language': labels.switchLanguage,
    'feedback': labels.feedback,
  };

  const actionMap: Record<string, () => void> = {
    'new-session': () => { onNewSession(); onClose(); },
    'search-history': () => { onSearchHistory(); onClose(); },
    'currency': () => { onCurrency(); onClose(); },
    'switch-language': () => { onSwitchLanguage(); onClose(); },
    'feedback': () => { onFeedback(); onClose(); },
  };

  const filtered = COMMAND_DEFS.filter((cmd) =>
    (labelMap[cmd.id] || '').toLowerCase().includes(query.toLowerCase())
  );

  const safeIndex = Math.min(selectedIndex, Math.max(0, filtered.length - 1));

  // Auto-focus on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setSelectedIndex(0);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const cmd = filtered[safeIndex];
        if (cmd) {
          actionMap[cmd.id]();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    },
    [filtered, safeIndex, onClose, actionMap]
  );

  // Single-key shortcuts
  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (document.activeElement === inputRef.current && query.length > 0) return;
      const key = e.key.toUpperCase();
      const match = COMMAND_DEFS.find((cmd) => cmd.shortcut === key);
      if (match) {
        actionMap[match.id]();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [query, actionMap]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Palette */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-lg"
        onKeyDown={handleKeyDown}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
            <Command className="w-5 h-5 text-amber-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder={labels.searchPlaceholder}
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-100 rounded border border-slate-200">
              ESC
            </kbd>
          </div>

          {/* Command List */}
          <div className="max-h-72 overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-slate-400">
                No commands found
              </div>
            ) : (
              filtered.map((cmd, index) => {
                const Icon = cmd.Icon;
                const isSelected = index === safeIndex;
                return (
                  <motion.button
                    key={cmd.id}
                    whileHover={{ x: 4 }}
                    onClick={() => actionMap[cmd.id]()}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      isSelected
                        ? 'bg-amber-50 text-amber-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                        isSelected
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="flex-1 text-sm font-medium">{labelMap[cmd.id]}</span>
                    <kbd
                      className={`inline-flex items-center justify-center w-6 h-6 text-xs font-bold rounded-md ${
                        isSelected
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {cmd.shortcut}
                    </kbd>
                  </motion.button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 px-4 py-2 border-t border-slate-100 bg-slate-50/50">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-slate-200 rounded text-[9px]">↑↓</kbd>
              navigate
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-slate-200 rounded text-[9px]">↵</kbd>
              select
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-slate-200 rounded text-[9px]">esc</kbd>
              close
            </span>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export function CommandPalette(props: CommandPaletteProps) {
  return (
    <AnimatePresence>
      {props.open && <CommandPaletteInner key="cmd-palette" {...props} />}
    </AnimatePresence>
  );
}
