import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageCircle, AlertCircle, Sparkles } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [message, setMessage] = React.useState('');
  const [category, setCategory] = React.useState<'bug' | 'suggestion' | 'other'>('suggestion');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !auth.currentUser) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        userId: auth.currentUser.uid,
        email: auth.currentUser.email,
        message: message.trim(),
        category,
        timestamp: serverTimestamp()
      });
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setMessage('');
        setCategory('suggestion');
      }, 2000);
    } catch (error) {
      console.error('Feedback submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-panel/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl relative w-full max-w-lg overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="bg-brand p-8 text-panel relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <MessageCircle className="w-32 h-32" />
               </div>
               <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 bg-panel/10 rounded-xl hover:bg-panel/20 transition-colors text-panel"
               >
                 <X className="w-5 h-5" />
               </button>
               <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Transmission</h2>
               <p className="text-panel/60 text-xs font-bold uppercase tracking-widest">Global Intelligence Feedback</p>
            </div>

            {/* Content */}
            <div className="p-8">
              {isSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center"
                >
                  <div className="w-20 h-20 bg-green-50 rounded-3xl flex items-center justify-center text-green-500 mb-6 shadow-xl shadow-green-500/10">
                    <Send className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-2">Received</h3>
                  <p className="text-sm text-slate-500 font-medium">Your intelligence has been uploaded to the Operations Hub.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Sector Category</label>
                    <div className="grid grid-cols-3 gap-3">
                       {[
                         { id: 'bug', label: 'Anomaly', icon: AlertCircle },
                         { id: 'suggestion', label: 'Proposal', icon: Sparkles },
                         { id: 'other', label: 'General', icon: MessageCircle }
                       ].map(cat => (
                         <button
                           key={cat.id}
                           type="button"
                           onClick={() => setCategory(cat.id as any)}
                           className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-tighter ${category === cat.id ? 'bg-brand border-brand text-panel shadow-lg shadow-brand/20' : 'bg-white border-slate-100 text-slate-400 hover:border-brand/40'}`}
                         >
                           <cat.icon className="w-4 h-4" />
                           {cat.label}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block">Mission Report</label>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Detail your findings, anomalies, or enhancement requests..."
                      className="w-full h-32 px-5 py-4 rounded-3xl bg-slate-50 border-2 border-slate-100 text-sm font-medium focus:border-brand focus:ring-0 transition-all resize-none"
                    />
                  </div>

                  <button
                    disabled={isSubmitting || !message.trim()}
                    className="w-full h-14 bg-panel text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Execute Broadcast
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
