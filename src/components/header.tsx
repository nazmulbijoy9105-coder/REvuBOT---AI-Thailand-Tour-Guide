'use client';

import { useState } from 'react';
import { Menu, X, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet';

interface HeaderProps {
  currentView: 'landing' | 'chat';
  onNavigate: (view: 'landing' | 'chat') => void;
  onScrollTo: (id: string) => void;
}

const navItems = [
  { label: 'Home', action: 'landing' as const, scroll: false },
  { label: 'Destinations', action: 'landing' as const, scroll: true, target: 'destinations' },
  { label: 'Hotels', action: 'landing' as const, scroll: true, target: 'hotels' },
  { label: 'Beaches', action: 'landing' as const, scroll: true, target: 'beaches' },
  { label: 'Planner', action: 'landing' as const, scroll: true, target: 'planner' },
  { label: 'Moo Deng', action: 'landing' as const, scroll: true, target: 'moodeng' },
  { label: 'Budget', action: 'landing' as const, scroll: true, target: 'budget' },
  { label: 'FAQ', action: 'landing' as const, scroll: true, target: 'faq' },
  { label: 'Earning', action: 'landing' as const, scroll: true, target: 'earning' },
];

export function Header({ currentView, onNavigate, onScrollTo }: HeaderProps) {
  const [open, setOpen] = useState(false);

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.scroll && item.target) {
      if (currentView === 'chat') {
        onNavigate('landing');
        setTimeout(() => onScrollTo(item.target!), 100);
      } else {
        onScrollTo(item.target);
      }
    } else {
      onNavigate(item.action);
    }
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-xl">🤖</span>
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-slate-900 text-sm tracking-tight">REvuBOT</span>
            <span className="text-[10px] text-slate-500 tracking-wider uppercase">AI Thailand Guide</span>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant="ghost"
              size="sm"
              onClick={() => handleNavClick(item)}
              className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-medium"
            >
              {item.label}
            </Button>
          ))}
          <Button
            size="sm"
            onClick={() => onNavigate('chat')}
            className="ml-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs px-4"
          >
            AI Chat
          </Button>
        </nav>

        {/* Mobile Nav */}
        <div className="flex lg:hidden items-center gap-2">
          <Button
            size="sm"
            onClick={() => onNavigate('chat')}
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs"
          >
            <Bot className="w-3.5 h-3.5 mr-1" />
            Chat
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-4">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🤖</span>
                  <span className="font-bold text-slate-900 text-sm">REvuBOT</span>
                </div>
              </div>
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Button
                    key={item.label}
                    variant="ghost"
                    onClick={() => handleNavClick(item)}
                    className="justify-start text-slate-600 hover:text-slate-900 text-sm font-medium"
                  >
                    {item.label}
                  </Button>
                ))}
                <Button
                  onClick={() => { onNavigate('chat'); setOpen(false); }}
                  className="mt-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  AI Chat
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
