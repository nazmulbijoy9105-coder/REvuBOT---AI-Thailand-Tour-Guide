import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { MapPin, MessageSquare, Shield, HelpCircle, LogOut, Menu, X, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout({ user }: { user: User | null }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-surface text-ink">
      <header className="h-16 border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
             <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-panel font-bold shadow-lg shadow-brand/20">RB</div>
             <div>
               <h1 className="font-bold text-lg leading-tight text-ink">REvuBOT</h1>
               <p className="text-[10px] text-ink-muted uppercase tracking-widest font-semibold">AI Travel Assistant</p>
             </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/destinations" className="text-xs font-bold uppercase tracking-widest text-ink-muted hover:text-brand transition-colors">Destinations</Link>
            <Link to="/faq" className="text-xs font-bold uppercase tracking-widest text-ink-muted hover:text-brand transition-colors">Help Center</Link>
            <Link to="/budget" className="text-xs font-bold uppercase tracking-widest text-ink-muted hover:text-brand transition-colors">Budget Ops</Link>
            {user && (
              <>
                <Link to="/planner" className="text-xs font-bold uppercase tracking-widest text-ink-muted hover:text-brand transition-colors">Mission Builder</Link>
                <Link to="/chat" className="text-xs font-bold uppercase tracking-widest text-ink-muted hover:text-brand transition-colors">Guide Chat</Link>
                <Link to="/admin" className="px-4 py-2 bg-panel text-white rounded-lg text-xs font-bold shadow-sm hover:bg-slate-800 transition-all">Curator Dashboard</Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
               <div className="flex items-center gap-3 p-1.5 bg-slate-50 rounded-xl border border-border">
                 <div className="hidden lg:block px-2">
                   <p className="text-xs font-bold text-ink leading-none">{user.email?.split('@')[0]}</p>
                   <p className="text-[10px] text-ink-muted uppercase tracking-tighter">Traveler</p>
                 </div>
                 <button onClick={handleLogout} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                   <LogOut className="w-5 h-5 text-ink-muted" />
                 </button>
               </div>
            ) : (
               <Link to="/login" className="btn-primary">
                 Join now
               </Link>
            )}
            
            <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-panel text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
          <div>
            <div className="flex items-center gap-2 text-white mb-4">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-panel font-bold text-xs">RB</div>
              <span className="text-lg font-bold tracking-tight">REvuBOT</span>
            </div>
            <p className="leading-relaxed max-w-xs opacity-70">
              The professional choice for international travelers in Thailand. Expert intelligence, real-time safety, local culture.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
             <div className="flex flex-col gap-2">
               <span className="text-white text-[10px] uppercase tracking-widest font-black mb-2 opacity-50">Intelligence</span>
               <Link to="/destinations" className="hover:text-brand transition-colors">Sector Intel</Link>
               <Link to="/planner" className="hover:text-brand transition-colors">Mission Strategy</Link>
               <Link to="/budget" className="hover:text-brand transition-colors">Currency Intel</Link>
             </div>
             <div className="flex flex-col gap-2">
               <span className="text-white text-[10px] uppercase tracking-widest font-black mb-2 opacity-50">Support</span>
               <span className="hover:text-brand cursor-pointer">Safety Alerts</span>
               <span className="hover:text-brand cursor-pointer">Thai Etiquette</span>
             </div>
          </div>
          <div className="md:text-right flex flex-col justify-end">
             <p className="text-[10px] uppercase tracking-widest opacity-30 font-bold mb-1">Thailand Innovation Hub</p>
            <span className="text-[10px] uppercase tracking-widest opacity-20">© 2026 REvuBOT Corporation</span>
          </div>
        </div>
      </footer>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-0 top-16 bg-white z-40 p-6 flex flex-col gap-6"
          >
            <Link to="/destinations" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold">Destinations</Link>
            <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold">Help Center</Link>
            <Link to="/budget" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold">Budget Ops</Link>
            {user && (
              <>
                <Link to="/planner" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold">Mission Builder</Link>
                <Link to="/chat" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold">Guide Chat</Link>
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-brand">Admin</Link>
              </>
            )}
            <div className="mt-auto">
              {!user && <Link to="/login" onClick={() => setIsMenuOpen(false)} className="btn-primary w-full text-center block">Login</Link>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
