'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Clock, DollarSign, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { destinations } from '@/data/thailand-data';
import type { Destination } from '@/data/thailand-data';

export function DestinationsSection() {
  const [selected, setSelected] = useState<Destination | null>(null);

  return (
    <section id="destinations" className="py-16 px-4 bg-slate-50">
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
            Discover Thailand
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
            TOP DESTINATIONS
          </h2>
          <p className="text-slate-500 mt-2 max-w-lg mx-auto text-sm">
            From ancient temples to tropical islands — explore the best of Thailand
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {destinations.map((dest, i) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card
                className="overflow-hidden cursor-pointer group hover:shadow-lg transition-all duration-300 border-slate-200/60 h-full flex flex-col"
                onClick={() => setSelected(dest)}
              >
                <div className="relative h-36 sm:h-40 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold border-0">
                    <MapPin className="w-2.5 h-2.5 mr-0.5" />
                    {dest.region}
                  </Badge>
                </div>
                <CardContent className="p-3 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                    {dest.name}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed flex-1">
                    {dest.description}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-xs font-semibold text-slate-700">{dest.rating}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{dest.budget}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  {selected.name}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <img
                    src={selected.image}
                    alt={selected.name}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold border-0">
                    {selected.region}
                  </Badge>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{selected.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Rating</div>
                      <div className="text-sm font-bold text-slate-700">{selected.rating}/5</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Budget</div>
                      <div className="text-sm font-bold text-slate-700">{selected.budget}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg col-span-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Best Time</div>
                      <div className="text-sm font-bold text-slate-700">{selected.bestTime}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">Highlights</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.highlights.map((h) => (
                      <Badge key={h} variant="secondary" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                        {h}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
