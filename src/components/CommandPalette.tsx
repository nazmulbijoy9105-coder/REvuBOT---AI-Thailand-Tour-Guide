import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Banknote, Send, Command, X } from 'lucide-react';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
  category: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (actionId: string) => void;
}

export default function CommandPalette({ isOpen, onClose, onAction }: CommandPaletteProps) {
  const [search, setSearch] = React.useState('');
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const commands: CommandItem[] = [
    {
      id: 'new-chat',
      label: 'Start New Session',
      icon: <Plus className="w-4 h-4" />,
      shortcut: 'N',
      category: 'Chat',
      action: () => onAction('new-chat')
    },
    {
      id: 'search-history',
      label: 'Search Travel History',
      icon: <Search className="w-4 h-4" />,
      shortcut: 'S',
      category: 'Chat',
      action: () => onAction('search-history')
    },
    {
      id: 'currency',
      label: 'Currency Intelligence',
      icon: <Banknote className="w-4 h-4" />,
      shortcut: 'C',
      category: 'Tools',
      action: () => onAction('currency')
    },
    {
      id: 'feedback',
      label: 'Broadcast Feedback',
      icon: <Send className="w-4 h-4" />,
      shortcut: 'F',
      category: 'Support',
      action: () => onAction('feedback')
    }
  ];

  const filteredCommands = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  );

  React.useEffect(() => {
    if (isOpen) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-panel/60 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-white rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.2)] border border-slate-100 z-[101] overflow-hidden"
          >
            <div className="flex items-center gap-4 px-6 py-4 border-b border-slate-100">
              <Command className="w-5 h-5 text-brand" />
              <input 
                ref={inputRef}
                type="text"
                placeholder="Intelligence Command..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-ink font-bold placeholder:text-slate-300"
              />
              <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-[10px] font-black text-slate-400">ESC</span>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto p-2">
              {filteredCommands.length > 0 ? (
                <div className="space-y-1">
                  {filteredCommands.map((cmd, idx) => (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                        idx === selectedIndex ? 'bg-brand text-panel' : 'hover:bg-slate-50 text-ink'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          idx === selectedIndex ? 'bg-panel/20' : 'bg-slate-100'
                        }`}>
                          {cmd.icon}
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black uppercase tracking-widest">{cmd.label}</p>
                          <p className={`text-[9px] font-bold uppercase opacity-60`}>{cmd.category}</p>
                        </div>
                      </div>
                      {cmd.shortcut && (
                        <div className={`px-2 py-1 rounded-md text-[10px] font-black border ${
                          idx === selectedIndex ? 'border-panel/30 bg-panel/10' : 'border-slate-100 bg-slate-50 text-slate-400'
                        }`}>
                          {cmd.shortcut}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-slate-400 text-xs font-bold italic">No intelligence matched your query.</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold shadow-sm">↑↓</kbd>
                  <span className="text-[9px] uppercase font-black text-slate-400">Navigate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold shadow-sm">Enter</kbd>
                  <span className="text-[9px] uppercase font-black text-slate-400">Select</span>
                </div>
              </div>
              <p className="text-[9px] uppercase font-black text-brand tracking-widest">Neural Link v3.0</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
