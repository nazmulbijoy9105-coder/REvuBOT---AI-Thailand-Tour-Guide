'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Users, ArrowLeft, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { beaches } from '@/data/thailand-data';

export function BeachesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    });
  };

  const waterColor = (quality: string) => {
    if (quality === 'Excellent') return 'bg-emerald-400';
    return 'bg-yellow-400';
  };

  return (
    <section id="beaches" className="py-16 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
            Sun, Sand & Sea
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
            BEST BEACHES
          </h2>
          <p className="text-slate-500 mt-2 max-w-lg mx-auto text-sm">
            Crystal waters, white sand, and unforgettable sunsets
          </p>
        </motion.div>

        {/* Scroll Controls */}
        <div className="flex items-center justify-end gap-2 mb-4">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => scroll('left')} aria-label="Scroll beaches left">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => scroll('right')} aria-label="Scroll beaches right">
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {beaches.map((beach, i) => (
            <motion.div
              key={beach.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex-shrink-0 w-72 sm:w-80 snap-start"
            >
              <div className="relative h-56 rounded-xl overflow-hidden group cursor-pointer">
                <img
                  src={beach.image}
                  alt={beach.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

                {/* Beach name */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-bold text-white text-lg leading-tight">{beach.name}</h3>
                  <p className="text-amber-400 text-xs font-semibold mt-0.5">{beach.island}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${waterColor(beach.waterQuality)}`} />
                      <span className="text-white/80 text-[10px]">{beach.waterQuality}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-white/70" />
                      <span className="text-white/80 text-[10px]">{beach.crowdLevel}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {beach.activities.slice(0, 3).map((a) => (
                      <Badge
                        key={a}
                        className="text-[9px] bg-white/20 text-white border-0 px-1.5 py-0 font-medium"
                      >
                        {a}
                      </Badge>
                    ))}
                    {beach.activities.length > 3 && (
                      <Badge className="text-[9px] bg-white/10 text-white/60 border-0 px-1.5 py-0 font-medium">
                        +{beach.activities.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
