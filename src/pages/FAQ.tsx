import React from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { HelpCircle, ChevronRight, MapPin, Landmark, Train, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { id: 'visa', name: 'Visa & Entry', icon: ShieldAlert, color: 'text-red-500' },
  { id: 'transport', name: 'Transportation', icon: Train, color: 'text-blue-500' },
  { id: 'safety', name: 'Laws & Scams', icon: ShieldAlert, color: 'text-red-600' },
  { id: 'hotels', name: 'Hotels & Stay', icon: MapPin, color: 'text-purple-500' },
  { id: 'culture', name: 'Culture & Etiquette', icon: Landmark, color: 'text-gold' },
  { id: 'food', name: 'Food & Dining', icon: MapPin, color: 'text-green-500' },
];

const TACTICAL_INTEL: Record<string, any[]> = {
  visa: [
    {
      id: 'visa-2025-1',
      question: '60-Day Visa Exemption (2026)',
      answer: 'Travelers from 93 countries (including India, USA, UK, Australia, Bangladesh) can enter for 60 days visa-free for tourism or short-term business. This can be extended by 30 days once per entry at any immigration office.',
      category: 'visa'
    },
    {
      id: 'visa-2025-2',
      question: 'Mandatory Digital Arrival Card (TDAC)',
      answer: 'Starting May 1, 2025, EVERY traveler arriving by air, land, or sea must complete the Thailand Digital Arrival Card (TDAC) online within 3 days BEFORE arrival. Failure to show the QR code will result in entry denial.',
      category: 'visa'
    },
    {
      id: 'visa-2025-3',
      question: 'DTV Visa for Digital Nomads',
      answer: 'The Destination Thailand Visa (DTV) allows a 5-year multiple-entry stay. Each entry is valid for 180 days (extendable by another 180). Perfect for remote workers, muay thai students, or medical patients.',
      category: 'visa'
    }
  ],
  hotels: [
    {
      id: 'hotel-1',
      question: 'Verified Safety Standards',
      answer: 'Always look for SHA+ or similar certifications on Booking.com and Agoda properties. Bangkok: Sukhumvit for nightlife, Riverside for luxury. Chonburi/Pattaya: Sea-view luxury resorts are best booked 3 months in advance for Moo Deng visits.',
      category: 'hotels'
    }
  ],
  safety: [
    {
      id: 'law-2026-1',
      question: 'Strict Scooter & Helmet Laws',
      answer: 'In 2026, police have intensified enforcement. You MUST wear a helmet AND a shirt while riding. Fines for riding shirtless or without a helmet are immediate (500-2,000 THB). Driving without a valid international license (IDP) can lead to vehicle seizure.',
      category: 'safety'
    },
    {
      id: 'law-2026-2',
      question: 'Alcohol Sales Bans',
      answer: 'Alcohol cannot be sold from 2:00 PM to 5:00 PM daily. This is strictly enforced in 7-Eleven and malls. Sales are also banned on religious holidays and election days.',
      category: 'safety'
    },
    {
      id: 'law-2026-3',
      question: 'Vaping & Monarchy Respect',
      answer: 'Vaping remains ILLEGAL with severe jail time risks. Respecting the Monarchy is mandatory; never deface money or insult royal imagery. Sunbathing topless is illegal and culturally offensive.',
      category: 'safety'
    }
  ],
  transport: [
    {
      id: 'trans-2026-1',
      question: 'Smart Transport: Grab & Bolt',
      answer: 'Avoid unmetered taxis. Use Grab (highest safety) or Bolt (cheapest) for all local commutes. For inter-city travel, Suvarnabhumi Airport Limousines are the standard for business travelers.',
      category: 'transport'
    }
  ],
  food: [
    {
      id: 'food-2026-1',
      question: 'Dining & Street Food Safety',
      answer: 'Look for the "Michelin Guide" or "Shell Shuan Shim" stickers for guaranteed quality. Street food is safe if high turnover is observed. Never drink tap water; only use bottled or filtered ice.',
      category: 'food'
    }
  ],
  culture: [
    {
      id: 'cult-2026-1',
      question: 'Temple Protocols (Dress Code)',
      answer: 'Shoulders and knees MUST be covered. Carry a sarong if wearing shorts. Socks are permitted, but shoes must be left outside. Do not point your feet toward Buddha images.',
      category: 'culture'
    }
  ]
};

export default function FAQ() {
  const [selectedCategory, setSelectedCategory] = React.useState('visa');
  const [faqs, setFaqs] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchFaqs = async () => {
      const q = query(collection(db, 'faqs'), where('category', '==', selectedCategory));
      const snap = await getDocs(q);
      const dbFaqs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      
      // Merge with tactical intelligence if available
      const hardcoded = TACTICAL_INTEL[selectedCategory] || [];
      setFaqs([...hardcoded, ...dbFaqs]);
    };
    fetchFaqs();
  }, [selectedCategory]);

  return (
    <div className="bg-surface min-h-screen py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-20">
           <div className="flex items-center gap-2 mb-4">
              <span className="w-12 h-1 bg-brand rounded-full"></span>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand">Thailand Operations Center</p>
           </div>
           <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">ESSENTIAL <br /> INTELLIGENCE.</h1>
           <p className="text-lg text-ink-muted font-medium max-w-xl">Comprehensive protocols for visas, transportation, and culture. Verified tourist data for international travelers.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Categories */}
          <div className="flex flex-col gap-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-2">Intelligence Category</p>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center justify-between p-4 rounded-xl transition-all font-bold border ${selectedCategory === cat.id ? 'bg-panel text-white border-panel shadow-xl' : 'bg-white border-border text-slate-500 hover:border-brand/40'}`}
              >
                <div className="flex items-center gap-3">
                  <cat.icon className={`w-4 h-4 ${selectedCategory === cat.id ? 'text-brand' : 'text-slate-400'}`} />
                  <span className="text-xs uppercase tracking-widest">{cat.name}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedCategory === cat.id ? 'rotate-90 opacity-100' : 'opacity-20'}`} />
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
             <AnimatePresence mode="wait">
               <motion.div
                 key={selectedCategory}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="grid grid-cols-1 md:grid-cols-2 gap-6"
               >
                 {faqs.length === 0 ? (
                   <div className="col-span-full luxury-card p-16 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                         <HelpCircle className="w-8 h-8 text-slate-200" />
                      </div>
                      <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Awaiting curation for this sector.</p>
                   </div>
                 ) : (
                   faqs.map(faq => (
                     <div key={faq.id} className="luxury-card p-8 group hover:border-brand/30 transition-all border-l-4 border-l-transparent hover:border-l-brand">
                        <div className="flex items-center gap-2 mb-4">
                           <span className="badge bg-slate-100 text-slate-500">{faq.category}</span>
                        </div>
                        <h3 className="text-xl font-black mb-4 leading-tight tracking-tight">
                           {faq.question}
                        </h3>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed opacity-80">
                           {faq.answer}
                        </p>
                     </div>
                   ))
                 )}
               </motion.div>
             </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
