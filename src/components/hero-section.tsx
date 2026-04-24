'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onLaunchChat: () => void;
  onExplore: () => void;
}

export function HeroSection({ onLaunchChat, onExplore }: HeroSectionProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1920&q=80)',
        }}
      />
      <div className="absolute inset-0 bg-slate-900/75" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <span className="inline-block px-4 py-1.5 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
            Expert Tourist Intelligence
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tight mb-6"
        >
          Navigate Thailand
          <br />
          <span className="text-amber-400">With AI.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Your AI-powered travel companion for Thailand. Get instant answers on destinations,
          hotels, street food, visa rules, safety alerts, and budget planning — all in real-time.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            onClick={onLaunchChat}
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-base px-8 h-12 shadow-lg shadow-amber-500/25"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            Launch AI Chat
          </Button>
          <Button
            onClick={onExplore}
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 font-semibold text-base px-8 h-12 bg-transparent"
          >
            <Compass className="w-4 h-4 mr-2" />
            Explore Thailand
          </Button>
        </motion.div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent dark:from-background" />
    </section>
  );
}
