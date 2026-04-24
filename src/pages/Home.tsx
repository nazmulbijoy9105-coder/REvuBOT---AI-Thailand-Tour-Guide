import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Plane, Globe, Compass, ShieldCheck, Users } from 'lucide-react';

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

      {/* Feature Grid Expansion */}
      <section className="py-24 px-8 bg-[#FDFCF9]">
        <div className="max-w-7xl mx-auto">
          <header className="mb-20 text-center">
            <h2 className="text-4xl font-serif mb-4">Intelligence Dashboard</h2>
            <div className="h-1 w-20 bg-brand mx-auto mb-4"></div>
            <p className="text-neutral-500 max-w-xl mx-auto">Unified travel logistics and safety intelligence powered by NB TECH.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardCard 
              title="Solo Discovery" 
              desc="Safety-indexed itineraries, social spots, and budget solo lodging." 
              badge="Solo"
              icon={<Compass className="w-5 h-5 text-brand" />}
            />
            <DashboardCard 
              title="Romantic Luxe" 
              desc="Curated private retreats, sunset dining, and luxury transport." 
              badge="Couple"
              icon={<Globe className="w-5 h-5 text-brand" />}
            />
            <DashboardCard 
              title="Group Logistics" 
              desc="Minivan coordination, kid-friendly spots, and large group dining." 
              badge="Family"
              icon={<Users className="w-5 h-5 text-brand" />}
            />
            <DashboardCard 
              title="Business Core" 
              desc="High-speed coworking, executive transport, and corporate networking." 
              badge="Business"
              icon={<ShieldCheck className="w-5 h-5 text-brand" />}
            />
          </div>
        </div>
      </section>

      {/* Safety & Logistics Intel */}
      <section className="py-24 px-8 bg-panel text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand mb-6">Safety Intel & Logistics</p>
              <h2 className="text-5xl font-serif mb-8 leading-tight">Zero-Compromise <br/>Mission Security.</h2>
              <div className="space-y-6">
                 <IntelItem title="Transportation Guard" desc="Real-time BTS/MRT status and verified 'Bolt' ride-sharing safety metrics." />
                 <IntelItem title="Legal & Scam Watch" desc="Global advisories on Vaping laws, Monarchy respect, and 'Closed Palace' scams." />
                 <IntelItem title="Hotel Reliability" desc="Only Agoda/Booking.com verified safety-rated properties recommended." />
                 <IntelItem title="Emergency Directs" desc="One-tap Tourist Police (1155) and embassy contact synchronization." />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                <div className="text-3xl font-serif text-brand mb-2">100%</div>
                <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Legal Verified</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm mt-8">
                <div className="text-3xl font-serif text-brand mb-2">GPS</div>
                <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Live Tracking</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
                <div className="text-3xl font-serif text-brand mb-2">24/7</div>
                <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Embassy Sync</div>
              </div>
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm mt-8">
                <div className="text-3xl font-serif text-brand mb-2">THB</div>
                <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Budget Logic</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Questions & User Guidelines */}
      <section className="py-24 px-8 bg-white border-y border-ink/5">
        <div className="max-w-4xl mx-auto">
          <header className="mb-16 text-center">
            <h2 className="text-4xl font-serif mb-4">User Guidelines</h2>
            <p className="text-ink/50 text-lg">Mastering the REvuBOT Neural Interface.</p>
          </header>
          <div className="space-y-12">
            <div className="flex gap-6">
              <div className="text-brand font-serif text-2xl">01</div>
              <div>
                <h4 className="text-xl font-medium mb-2">How to Plan?</h4>
                <p className="text-ink/60 leading-relaxed font-light">Simply type "Plan a 7-day trip for a couple in Krabi" and let the AI generate a THB-calibrated itinerary with partner booking links.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-brand font-serif text-2xl">02</div>
              <div>
                <h4 className="text-xl font-medium mb-2">Earn with RevuBot</h4>
                <p className="text-ink/60 leading-relaxed font-light">Our partnership model allows Thai businesses and local guides to register for 'Verified Spots'. Contact NB TECH for B2B portal access.</p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-brand font-serif text-2xl">03</div>
              <div>
                <h4 className="text-xl font-medium mb-2">Data Privacy</h4>
                <p className="text-ink/60 leading-relaxed font-light">Your chat history is encrypted. All financial transactions are handled by our secure global partners: Booking.com and Agoda.</p>
              </div>
            </div>
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

function DashboardCard({ title, desc, badge, icon }: { title: string, desc: string, badge: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-ink/5 hover:border-brand/30 transition-all group shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-brand/10 rounded-2xl text-brand">{icon}</div>
        <span className="text-[9px] font-black uppercase tracking-widest bg-brand/10 text-brand px-2 py-1 rounded-full">{badge}</span>
      </div>
      <h4 className="text-xl font-serif mb-3 group-hover:text-brand transition-colors text-ink">{title}</h4>
      <p className="text-sm text-ink/50 leading-relaxed font-light">{desc}</p>
    </div>
  );
}

function IntelItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-4 group">
      <div className="w-1 h-0 group-hover:h-12 bg-brand transition-all duration-500 rounded-full mt-2"></div>
      <div>
        <h5 className="font-serif text-xl text-white/90 mb-1">{title}</h5>
        <p className="text-sm text-white/40 font-light max-w-md">{desc}</p>
      </div>
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
