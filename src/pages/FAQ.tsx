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
      id: 'visa-1',
      question: 'Visa on Arrival (VOA) Requirements',
      answer: 'Available for 19 countries (including India, Bhutan). Requirements: Passport valid for 30+ days, 15-day exit proof, 1,000 THB/person (2,000 THB if not waived). Bangladesh citizens usually require a pre-approved E-Visa from the Royal Thai Embassy.',
      category: 'visa'
    },
    {
      id: 'visa-2',
      question: 'Visa Overstay Penalties',
      answer: 'Fine of 500 THB per day (max 20,000 THB). Long overstays (>90 days) lead to blacklist entry bans (5-10 years). Always use REvuBOT for renewal alerts!',
      category: 'visa'
    }
  ],
  hotels: [
    {
      id: 'hotel-1',
      question: 'Average Accommodation Prices',
      answer: 'Bangkok: Low-range (Hostels/Guesthouses) 300-800 THB/night. Mid-range 1,200-2,500 THB. Luxury 5,000+ THB. Chiang Mai is typically 20-30% cheaper than Phuket/Bangkok.',
      category: 'hotels'
    },
    {
      id: 'hotel-2',
      question: 'Booking Best Practices',
      answer: 'Use Agoda or Booking.com for international rates. For "Single to Team" variations, large groups should check Airbnb Global for "Pool Villas" in Sukhumvit or Phuket, which are cheaper per head than multiple hotel rooms.',
      category: 'hotels'
    }
  ],
  safety: [
    {
      id: 'scam-1',
      question: 'The "Closed Palace" Scam',
      answer: 'Tuk-tuk drivers may tell you the Grand Palace is "closed for a ceremony." They will then offer a cheap tour to "exclusive" shops. IGNORE THEM. The palace is almost never closed. This is a commission-based trap.',
      category: 'safety'
    },
    {
      id: 'scam-2',
      question: 'Taxi Meter Scams',
      answer: 'Always insist on "Meter, please." If they refuse or say "flat rate 300 baht," get out and find another. In Bangkok, the meter starts at 35 THB. Report unmetered taxis via the 1584 hotline.',
      category: 'safety'
    },
    {
      id: 'law-1',
      question: 'Lèse-majesté Laws (Article 112)',
      answer: 'Defaming, insulting, or threatening the Royal Family is a severe crime. Penalties range from 3 to 15 years in prison. Exercise extreme respect when discussing the monarchy.',
      category: 'safety'
    },
    {
      id: 'law-2',
      question: 'Vaping & E-Cigarettes',
      answer: 'Possession and use of e-cigarettes or vapes are illegal in Thailand. Penalties include heavy fines (up to 30,000 THB) and potential prison time. Do not bring them into the country.',
      category: 'safety'
    },
    {
      id: 'scam-3',
      question: 'Jet Ski Damage Scam',
      answer: 'Common in Pattaya and Phuket. After returning a jet ski, the operator claims you caused damage and demands 50,000+ THB. They often use fake paint to hide old cracks. TACTIC: Always take HD photos/videos of the entire jet ski BEFORE renting. If intimidated, call the Tourist Police (1155) immediately.',
      category: 'safety'
    },
    {
      id: 'scam-4',
      question: 'Gem & Jewelry Scams',
      answer: 'Friendly locals or drivers may claim there is a "Government Special Sale" for gems that can be resold for profit abroad. This is 100% false. You will buy low-quality stones at 10x their value. INTELLIGENCE: The Thai government does NOT run sales or endorse private gem shops. Buy only from reputable established jewelers with certifications.',
      category: 'safety'
    },
    {
      id: 'law-3',
      question: 'Alcohol Sales & Misconceptions',
      answer: 'Sales are STRICTLY restricted to 11:00-14:00 and 17:00-24:00. Buying alcohol on religious holidays or election days is prohibited. Public drinking near schools, hospitals, or temples is an arrestable offense. Pro-tip: Do not drink on trains or in parks.',
      category: 'safety'
    },
    {
      id: 'law-4',
      question: 'Public Etiquette & Decorum',
      answer: 'Never touch a Thai person\'s head (the most sacred part of the body). Do not point your feet at people, monks, or Buddha images (the lowest/dirtiest part). Shirts MUST be worn in public (outside beaches/pools); walking shirtless in cities or shops can attract fines and is considered highly offensive.',
      category: 'safety'
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
