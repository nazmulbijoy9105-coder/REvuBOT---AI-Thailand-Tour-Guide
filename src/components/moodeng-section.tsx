'use client';

import { motion } from 'framer-motion';
import { Plane, Car, Zap, Globe, MapPin, Clock, Headphones, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const ROUTES = [
  {
    title: '2 Days, 1 Night',
    icon: Plane,
    emoji: '✈️',
    from: 'Chiang Mai',
    to: 'Chonburi',
    description: 'Aerial deployment to Suvarnabhumi, followed by private transport to Khao Kheow Open Zoo.',
    color: 'from-amber-500/20 to-orange-500/20',
    borderColor: 'border-amber-500/30',
  },
  {
    title: '3 Days, 2 Nights',
    icon: Car,
    emoji: '🚗',
    from: 'Nakhon Sawan',
    to: 'Chonburi',
    description: 'Land-based logistics via Bangkok. Includes overnight stay at verified Chonburi resorts.',
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/30',
  },
  {
    title: 'Day Trip (Rapid Ops)',
    icon: Zap,
    emoji: '⚡',
    from: 'Samut Prakan',
    to: 'Chonburi',
    description: 'Direct intercept. 1.5-hour logistics from Samut Prakan to meet the viral icon.',
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/30',
  },
];

const STATS = [
  { label: 'Languages', value: '5+', icon: Globe },
  { label: 'Insider Spots', value: '1,200+', icon: MapPin },
  { label: 'Support', value: '24/7', icon: Headphones },
  { label: 'Barriers', value: '0', icon: ShieldCheck },
];

export function MoodengSection() {
  return (
    <section id="moodeng" className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 mb-3 text-xs font-bold uppercase tracking-widest">
            🦛 Special Mission
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            MOO DENG <span className="text-amber-500">INTELLIGENCE</span>
          </h2>
          <p className="text-slate-500 mt-2 text-sm uppercase tracking-wider">
            Seasonal High-Priority Missions
          </p>
          <p className="text-slate-600 mt-3 max-w-2xl mx-auto text-sm leading-relaxed">
            Recommended routes to meet the viral pygmy hippo at <strong className="text-amber-600">Khao Kheow Open Zoo</strong> in Chonburi.
            Plan your mission to witness Thailand&apos;s most famous resident.
          </p>
        </motion.div>

        {/* Route Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {ROUTES.map((route, idx) => {
            const Icon = route.icon;
            return (
              <motion.div
                key={route.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                <Card className={`bg-slate-900 ${route.borderColor} hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 group overflow-hidden`}>
                  <div className={`h-1.5 bg-gradient-to-r ${route.color}`} />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{route.title} {route.emoji}</h3>
                        <p className="text-xs text-slate-400 uppercase tracking-wider">
                          <Clock className="w-3 h-3 inline mr-1" />
                          Operational Route
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-slate-700 text-slate-300 border-slate-600 text-xs">
                        {route.from}
                      </Badge>
                      <span className="text-amber-400 text-sm">→</span>
                      <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-xs">
                        {route.to}
                      </Badge>
                    </div>

                    <p className="text-slate-400 text-sm leading-relaxed">
                      {route.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="bg-slate-900 rounded-2xl p-6 sm:p-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-2">
                      <Icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-amber-400">{stat.value}</p>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
