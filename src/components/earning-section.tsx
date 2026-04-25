'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Hotel,
  Crown,
  Star,
  Code,
  Megaphone,
  BarChart3,
  Tag,
  Shield,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { earningWays } from '@/data/thailand-data';

const iconMap: Record<string, React.ElementType> = {
  Hotel,
  Crown,
  Star,
  Code,
  Megaphone,
  BarChart3,
  Tag,
  Shield,
};

const typeColor: Record<string, string> = {
  'Passive Income': 'bg-emerald-100 text-emerald-700',
  'Recurring Revenue': 'bg-blue-100 text-blue-700',
  'Advertising Revenue': 'bg-purple-100 text-purple-700',
  'B2B Revenue': 'bg-orange-100 text-orange-700',
  'Ad Revenue': 'bg-pink-100 text-pink-700',
  'Data Monetization': 'bg-cyan-100 text-cyan-700',
  'Commission + Listing Fee': 'bg-amber-100 text-amber-700',
  'Insurance Commission': 'bg-red-100 text-red-700',
};

export function EarningSection() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="earning" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
            Monetization
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
            EARNING WAYS
          </h2>
          <p className="text-slate-500 mt-2 max-w-lg mx-auto text-sm">
            How REvuBOT Generates Revenue
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {earningWays.map((way, i) => {
            const Icon = iconMap[way.icon] || Star;
            const isExpanded = expanded === way.id;

            return (
              <motion.div
                key={way.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card
                  className={`overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 border-slate-200/60 h-full flex flex-col ${
                    isExpanded ? 'ring-2 ring-amber-500/50' : ''
                  }`}
                  onClick={() => setExpanded(isExpanded ? null : way.id)}
                >
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-amber-600" />
                      </div>
                      <Badge
                        className={`text-[9px] font-bold border-0 px-1.5 py-0.5 ${
                          typeColor[way.type] || 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {way.type}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm leading-tight mb-1">
                      {way.title}
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed flex-1 line-clamp-3">
                      {way.description}
                    </p>

                    <Badge className="mt-3 bg-amber-500/10 text-amber-700 border-amber-200 text-[10px] font-bold w-fit">
                      {way.potential}
                    </Badge>

                    {/* Expand indicator */}
                    <div className="flex items-center justify-center mt-2 text-slate-400">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <ul className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                            {way.details.map((d, idx) => (
                              <li key={idx} className="text-[11px] text-slate-600 leading-relaxed flex gap-1.5">
                                <span className="text-amber-500 mt-0.5">•</span>
                                {d}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
