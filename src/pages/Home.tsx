import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Plane, Globe, Compass, ShieldCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-surface min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-panel">
           <div className="absolute inset-0 bg-panel/60 z-10" />
           <img 
             src="https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=2000" 
             alt="Thailand Temple" 
             className="w-full h-full object-cover grayscale-[0.2]"
           />
        </div>
        
        <div className="max-w-7xl mx-auto px-8 w-full relative z-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 px-3 py-1 bg-brand/20 text-brand rounded-full text-[10px] font-black uppercase tracking-widest border border-brand/30 mb-6 inline-block">
               <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse"></div>
               Expert Tourist Intelligence
            </div>
            <h1 className="text-6xl md:text-8xl text-white font-black mb-6 leading-[0.85] tracking-tighter">
              NAVIGATE <br />
              <span className="text-brand">THAILAND</span> <br />
              WITH AI.
            </h1>
            <p className="text-lg text-white/70 mb-10 max-w-xl font-medium leading-relaxed">
              The elite AI Travel Agent for Thailand. Strategic mission planning, legal/visa intelligence, and digital concierge services in 5+ languages including Bangla.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/chat" className="btn-primary">
                Launch Assistant
              </Link>
              <Link to="/faq" className="btn-secondary !bg-transparent border-white/30 text-white hover:bg-white hover:text-panel">
                Knowledge Base
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-8 bg-white border-b border-border">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-ink-muted mb-12 text-center">Core Capabilities</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard 
               icon={<div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-brand font-black">AI</div>}
               title="Multilingual Neural Engine"
               description="High-precision translation and guidance in English, Thai, Hindi, Sinhala, and Bangla. Specialized for the South Asia corridor."
            />
            <FeatureCard 
               icon={<div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black">RT</div>}
               title="Smart Mission Planning"
               description="Autonomous 14-day itinerary synthesis with budget logic, weather awareness, and real-time transit optimization."
            />
             <FeatureCard 
               icon={<div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black">GOV</div>}
               title="Legal & Safety Intel"
               description="Verified visa rules, scam prevention alerts, and local law compliance. Mission safety is our highest priority."
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 border-t border-ink/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
           <div>
             <div className="text-4xl font-serif mb-2 text-ink">5+</div>
             <div className="text-xs uppercase tracking-widest text-ink/50">Languages</div>
           </div>
           <div>
             <div className="text-4xl font-serif mb-2 text-ink">1,200+</div>
             <div className="text-xs uppercase tracking-widest text-ink/50">Insider Spots</div>
           </div>
           <div>
             <div className="text-4xl font-serif mb-2 text-ink">24/7</div>
             <div className="text-xs uppercase tracking-widest text-ink/50">Support</div>
           </div>
           <div>
             <div className="text-4xl font-serif mb-2 text-ink">0</div>
             <div className="text-xs uppercase tracking-widest text-ink/50">Barriers</div>
           </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="mb-2">{icon}</div>
      <h3 className="text-2xl font-serif tracking-tight">{title}</h3>
      <p className="text-ink/60 leading-relaxed font-light">{description}</p>
    </div>
  );
}
