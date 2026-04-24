'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { hotels } from '@/data/thailand-data';

const FILTERS = ['All', 'Luxury', 'Boutique', 'Mid-Range', 'Hostel'] as const;
type FilterType = typeof FILTERS[number];

export function HotelsSection() {
  const [filter, setFilter] = useState<FilterType>('All');

  const filtered = filter === 'All'
    ? hotels
    : hotels.filter((h) => {
        if (filter === 'Mid-Range') return h.type === 'Mid-Range' || h.type === 'Premium';
        return h.type === filter;
      });

  return (
    <section id="hotels" className="py-16 px-4 bg-white">
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
            Where to Stay
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2 tracking-tight">
            HOTELS & STAYS
          </h2>
          <p className="text-slate-500 mt-2 max-w-lg mx-auto text-sm">
            From luxury villas to budget hostels — find your perfect stay in Thailand
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {FILTERS.map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className={
                filter === f
                  ? 'bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs'
                  : 'text-slate-500 hover:text-slate-900 text-xs font-medium'
              }
            >
              {f}
            </Button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((hotel, i) => (
            <motion.div
              key={hotel.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Card className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-slate-200/60 h-full flex flex-col">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <Badge className="absolute top-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold border-0">
                    {hotel.priceRange}
                  </Badge>
                  <Badge className="absolute top-2 left-2 bg-amber-500/90 text-white text-[10px] font-bold border-0">
                    {hotel.type}
                  </Badge>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">
                    {hotel.name}
                  </h3>
                  <p className="text-slate-400 text-xs mt-0.5">{hotel.location}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-slate-700">{hotel.rating}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {hotel.amenities.slice(0, 4).map((a) => (
                      <Badge
                        key={a}
                        variant="secondary"
                        className="text-[10px] bg-slate-100 text-slate-600 border-0 px-1.5 py-0"
                      >
                        {a}
                      </Badge>
                    ))}
                    {hotel.amenities.length > 4 && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-slate-100 text-slate-400 border-0 px-1.5 py-0"
                      >
                        +{hotel.amenities.length - 4}
                      </Badge>
                    )}
                  </div>
                  <div className="mt-auto pt-3">
                    <Button
                      size="sm"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs"
                      onClick={() => window.open(hotel.bookingUrl, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1.5" />
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
