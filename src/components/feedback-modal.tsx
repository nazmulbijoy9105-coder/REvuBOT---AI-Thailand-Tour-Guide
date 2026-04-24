'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bug, Lightbulb, MessageCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  labels: {
    title: string;
    bug: string;
    suggestion: string;
    general: string;
    placeholder: string;
    submit: string;
    success: string;
  };
}

const CATEGORIES = [
  { value: 'bug', icon: Bug, color: 'text-red-500' },
  { value: 'suggestion', icon: Lightbulb, color: 'text-amber-500' },
  { value: 'general', icon: MessageCircle, color: 'text-slate-500' },
] as const;

export function FeedbackModal({ open, onClose, labels }: FeedbackModalProps) {
  const [category, setCategory] = useState<'bug' | 'suggestion' | 'general'>('general');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, message: message.trim() }),
      });
      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setMessage('');
          setCategory('general');
          onClose();
        }, 1500);
      }
    } catch {
      // Silently fail
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCatLabel = (val: string) => {
    if (val === 'bug') return labels.bug;
    if (val === 'suggestion') return labels.suggestion;
    return labels.general;
  };

  return (
    <AnimatePresence>
      {open && (
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

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[90vw] max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Amber Header */}
              <div className="bg-amber-500 px-5 py-4 flex items-center justify-between">
                <h2 className="text-white font-bold text-base">{labels.title}</h2>
                <button
                  onClick={onClose}
                  className="text-white/80 hover:text-white transition-colors"
                  aria-label="Close feedback modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex flex-col items-center justify-center py-12 px-5"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
                    >
                      <CheckCircle2 className="w-16 h-16 text-emerald-500" />
                    </motion.div>
                    <p className="mt-3 text-sm font-semibold text-slate-700">{labels.success}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-5 space-y-4"
                  >
                    {/* Category Selector */}
                    <div className="flex gap-2">
                      {CATEGORIES.map((cat) => {
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.value}
                            onClick={() => setCategory(cat.value)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                              category === cat.value
                                ? 'bg-amber-50 border-2 border-amber-400 text-amber-700 shadow-sm'
                                : 'bg-slate-50 border-2 border-slate-200 text-slate-500 hover:border-slate-300'
                            }`}
                          >
                            <Icon className={`w-3.5 h-3.5 ${category === cat.value ? 'text-amber-500' : cat.color}`} />
                            {getCatLabel(cat.value)}
                          </button>
                        );
                      })}
                    </div>

                    {/* Textarea */}
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={labels.placeholder}
                      rows={4}
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-300"
                    />

                    {/* Submit */}
                    <Button
                      onClick={handleSubmit}
                      disabled={!message.trim() || isSubmitting}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold h-10 rounded-xl"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      {labels.submit}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
