import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { User, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { MapPin, MessageSquare, Shield, HelpCircle, LogOut, Menu, X, Landmark, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import FeedbackModal from './FeedbackModal';

export default function Layout({ user }: { user: User | null }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleOpenFeedback = () => setIsFeedbackOpen(true);
    window.addEventListener('open-feedback', handleOpenFeedback);
    return () => window.removeEventListener('open-feedback', handleOpenFeedback);
  }, []);

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
            <Link to="/chat" className="text-xs font-bold uppercase tracking-widest text-ink-muted hover:text-brand transition-colors">AI Guide Chat</Link>
            <Link to="/faq" className="text-xs font-bold uppercase tracking-widest text-ink-muted hover:text-brand transition-colors">Safety Intel</Link>
            {user && !user.isAnonymous && user.email === 'admin@revubot.com' && (
              <>
                <Link to="/admin" className="px-4 py-2 bg-panel text-white rounded-lg text-xs font-bold shadow-sm hover:bg-slate-800 transition-all">Curator Dashboard</Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {user && !user.isAnonymous && (
               <div className="flex items-center gap-3 p-1.5 bg-slate-50 rounded-xl border border-border">
                 <div className="hidden lg:block px-2">
                   <p className="text-xs font-bold text-ink leading-none">{user.email?.split('@')[0]}</p>
                   <p className="text-[10px] text-ink-muted uppercase tracking-tighter">Traveler</p>
                 </div>
                 <button onClick={handleLogout} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                   <LogOut className="w-5 h-5 text-ink-muted" />
                 </button>
               </div>
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
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 text-sm">
          <div>
            <div className="flex items-center gap-2 text-white mb-4">
              <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center text-panel font-bold text-xs">RB</div>
              <span className="text-lg font-bold tracking-tight">REvuBOT AI</span>
            </div>
            <p className="leading-relaxed max-w-xs opacity-70">
              The specialized AI Neural Engine for travelers in Thailand. Expert local intelligence, instant visual analysis, and real-time safety protocols.
            </p>
          </div>
          <div className="md:text-right flex flex-col justify-center items-end">
             <button 
               onClick={() => setIsFeedbackOpen(true)}
               className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-brand hover:text-panel transition-all mb-4"
             >
               <Send className="w-3.5 h-3.5" />
               Broadcast Feedback
             </button>
             <p className="text-[10px] uppercase tracking-widest opacity-30 font-bold mb-1 font-mono">Operations Console v3.1.0</p>
             <p className="text-[10px] uppercase tracking-widest opacity-30 font-bold mb-1">Thailand Innovation Hub</p>
             <span className="text-[10px] uppercase tracking-widest opacity-20">© 2026 REvuBOT Neural Network</span>
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
            <Link to="/chat" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold">AI Guide Chat</Link>
            <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold">Safety Intel</Link>
            {user && !user.isAnonymous && user.email === 'admin@revubot.com' && (
              <>
                <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-xl font-bold text-brand">Curator Dashboard</Link>
              </>
            )}
            <div className="mt-auto">
              {/* Login option removed for direct access experience */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />
    </div>
  );
}
