import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowUpRight, Compass, Users, Cloud, Plane } from 'lucide-react';
import { Link } from 'react-router-dom';

const DESTINATIONS_DATA = [
  {
    id: 'bangkok',
    name: 'Bangkok',
    subTitle: 'The Kinetic Capital',
    image: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=1000',
    description: 'A vibrant metropolis known for ornate shrines and ultra-modern skyscrapers.',
    keyInfo: ['Grand Palace', 'BTS Skytrain', 'Michelin Street Food', 'Sukhumvit Nightlife'],
    mood: 'High Energy / Urban',
    hotels: [
      { name: 'Mandarin Oriental', type: 'Luxury' },
      { name: 'The Siam', type: 'Art/Boutique' },
      { name: 'Prince Palace', type: 'Budget/Large' },
      { name: 'Lub d Siam', type: 'Social/Budget' }
    ],
    beaches: [
      { name: 'Bang Saen', type: 'Family/Local' },
      { name: 'Pattaya Beach', type: 'Activity/City' }
    ]
  },
  {
    id: 'phuket',
    name: 'Phuket',
    subTitle: 'Andaman Jewel',
    image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&q=80&w=1000',
    description: 'Breathtaking beaches, crystal clear waters, and world-class island resorts.',
    keyInfo: ['Patong Beach', 'Island Hopping', 'Big Buddha', 'Luxury Spas'],
    mood: 'Relaxed / Tropical',
    hotels: [
      { name: 'Amanpuri', type: 'Ultra-Luxury' },
      { name: 'Keemala', type: 'Experiential/Unique' },
      { name: 'Holiday Inn Express', type: 'Reliable/Budget' },
      { name: 'The Slate', type: 'Design-Forward' }
    ],
    beaches: [
      { name: 'Patong', type: 'Party/Mainstream' },
      { name: 'Kata Noi', type: 'Family/Quiet' },
      { name: 'Nai Harn', type: 'Pristine/Scenic' }
    ]
  },
  {
    id: 'chiang-mai',
    name: 'Chiang Mai',
    subTitle: 'Rose of the North',
    image: 'https://images.unsplash.com/photo-1590732488836-8152599720b0?auto=format&fit=crop&q=80&w=1000',
    description: 'Lush mountains and hundreds of elaborate Buddhist temples in the ancient city walls.',
    keyInfo: ['Doi Suthep', 'Digital Nomad Hub', 'Old City Walls', 'Sunday Walking Street'],
    mood: 'Cultural / Scenic',
    hotels: [
      { name: 'Anantara CM', type: 'Riverside Luxury' },
      { name: 'Raya Heritage', type: 'Culture/Quiet' },
      { name: 'Hostel Lullaby', type: 'Elite Budget' },
      { name: 'The Dhara Dhevi', type: 'Palatial Luxury' }
    ],
    beaches: [
      { name: 'Huay Tung Tao', type: 'Lake/Local Park' }
    ]
  },
  {
    id: 'pattaya',
    name: 'Pattaya',
    subTitle: 'Gulf of Thailand',
    image: 'https://images.unsplash.com/photo-1623910307612-4c28f3a38891?auto=format&fit=crop&q=80&w=1000',
    description: 'A coastal resort city famous for its entertainment, shopping, and proximity to Bangkok.',
    keyInfo: ['Walking Street', 'Sanctuary of Truth', 'Water Parks', 'Coral Island'],
    mood: 'Entertainment / Vibrant',
    hotels: [
      { name: 'Royal Cliff', type: 'Luxury/Corporate' },
      { name: 'Hilton Pattaya', type: 'City-Beach Luxury' },
      { name: 'Ambassador City', type: 'Value/Events' },
      { name: 'Hard Rock Hotel', type: 'Fun/Family' }
    ],
    beaches: [
      { name: 'Jomtien', type: 'Quiet/Residential' },
      { name: 'Wong Amat', type: 'Upscale/Secluded' },
      { name: 'Koh Larn', type: 'Island/DayTrip' }
    ]
  },
  {
    id: 'krabi',
    name: 'Krabi',
    subTitle: 'Limestone Paradise',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=1000',
    description: 'Stunning limestone cliffs, turquoise waters, and world-famous rock climbing.',
    keyInfo: ['Railay Beach', 'Phi Phi Islands', 'Tiger Cave Temple', 'Phulay Bay'],
    mood: 'Adventure / Tropical',
    hotels: [
      { name: 'Rayavadee', type: 'Exclusive/Iconic' },
      { name: 'Phulay Bay', type: 'Ultra-Luxury (Ritz)' },
      { name: 'Railay Village', type: 'Mid-Range/Scenic' },
      { name: 'Pimalai (Lanta)', type: 'Remote/Luxury' }
    ],
    beaches: [
      { name: 'Railay West', type: 'Scenic/Sunsets' },
      { name: 'Phra Nang', type: 'Iconic/Caves' },
      { name: 'Ao Nang', type: 'Central Hub' }
    ]
  }
];

export default function Destinations() {
  const [insiderMode, setInsiderMode] = React.useState(false);

  const filteredData = insiderMode 
    ? DESTINATIONS_DATA.map(d => ({
        ...d,
        name: `HIDDEN ${d.name}`,
        keyInfo: [...d.keyInfo, 'Insider Spot', 'Local Secret'],
        description: `EXCLUSIVELY FOR AGENTS: ${d.description} Secret entry via back alley recommended.`
      }))
    : DESTINATIONS_DATA;

  return (
    <div className="bg-[#FAF9F6] min-h-screen pt-24">
      <div className="max-w-7xl mx-auto px-8">
        {/* Header */}
        <header className="mb-20 text-center md:text-left">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex flex-col md:flex-row md:items-end justify-between gap-8"
           >
             <div className="max-w-2xl">
               <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                  <div className="w-10 h-0.5 bg-brand rounded-full"></div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand">Sector Intelligence</p>
               </div>
               <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-panel">DESTINATION <br /> DEBRIEF.</h1>
             </div>
             <div className="flex flex-col md:flex-row gap-8 items-center">
                <button 
                  onClick={() => setInsiderMode(!insiderMode)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl border-2 transition-all font-black text-xs uppercase tracking-widest ${insiderMode ? 'bg-brand border-brand text-panel shadow-xl shadow-brand/20' : 'bg-white border-slate-200 text-slate-400 hover:border-brand/40'}`}
                >
                  <Compass className={`w-5 h-5 ${insiderMode ? 'animate-spin' : ''}`} />
                  {insiderMode ? 'Insider Mode Active' : 'Enable Insider Mode'}
                </button>
              <div className="flex gap-12 pb-2">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Active Zones</p>
                   <p className="text-2xl font-serif text-panel italic">12+ Cities</p>
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Intel Accuracy</p>
                   <p className="text-2xl font-serif text-panel italic">99.8%</p>
                </div>
              </div>
            </div>
           </motion.div>
        </header>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 px-1 bg-slate-200 border border-slate-200 shadow-2xl rounded-3xl overflow-hidden mb-24">
          {filteredData.map((dest, i) => (
            <DestinationCard key={dest.id} destination={dest} index={i} />
          ))}
        </div>

        {/* Stats / CTA */}
        <section className="mb-24 luxury-card p-12 bg-panel overflow-hidden relative border-none">
           <div className="absolute top-0 right-0 w-64 h-64 bg-brand opacity-5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
           <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
              <div className="md:col-span-2">
                 <h2 className="text-white text-3xl md:text-5xl font-serif italic mb-6 leading-tight">Ready for your specialized <br /> mission in Thailand?</h2>
                 <p className="text-white/50 text-base max-w-xl font-light leading-relaxed">Let REvuBOT help you navigate the nuances of each city. From temple dress codes to transit shortcuts, your intelligence is always current.</p>
              </div>
              <div className="flex justify-center md:justify-end">
                 <Link to="/chat" className="btn-primary !px-12 !py-6 text-base group">
                   Launch Asst. 
                   <MapPin className="w-5 h-5 ml-2 group-hover:animate-bounce" />
                 </Link>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}

function DestinationCard({ destination, index }: { destination: any, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group bg-white relative h-[500px] overflow-hidden flex flex-col justify-end p-8"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/20 to-transparent z-10 transition-opacity duration-700 group-hover:opacity-60" />
        <img 
           src={destination.image} 
           alt={destination.name} 
           className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
        />
      </div>

      <div className="relative z-20 transition-transform duration-500 group-hover:-translate-y-4">
        <div className="flex items-center gap-2 mb-2">
           <span className="text-[10px] font-black uppercase tracking-widest text-brand bg-brand/10 px-2 py-0.5 rounded border border-brand/20">{destination.mood}</span>
           <span className="w-4 h-px bg-white/30"></span>
           <span className="text-[10px] font-black uppercase tracking-widest text-white/50">{destination.subTitle}</span>
        </div>
        <h3 className="text-5xl font-black text-white uppercase tracking-tighter leading-none mb-4">{destination.name}</h3>
        <p className="text-white/70 text-sm font-medium max-w-xs mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{destination.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150">
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest text-brand mb-1">Stay Strategy</p>
            <ul className="text-[10px] text-white/60 space-y-1.5">
              {destination.hotels.slice(0, 3).map((h: any) => (
                <li key={h.name} className="flex flex-col">
                  <span className="text-white truncate font-bold">{h.name}</span>
                  <span className="text-[8px] uppercase tracking-tighter opacity-50">{h.type}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-[8px] font-black uppercase tracking-widest text-cyan-400 mb-1">Sector Beaches</p>
            <ul className="text-[10px] text-white/60 space-y-1.5">
              {destination.beaches.slice(0, 3).map((b: any) => (
                <li key={b.name} className="flex flex-col">
                  <span className="text-white truncate font-bold">{b.name}</span>
                  <span className="text-[8px] uppercase tracking-tighter opacity-50">{b.type}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
           {destination.keyInfo.map((info: string) => (
             <span key={info} className="text-[9px] font-black uppercase tracking-widest text-white border border-white/20 px-3 py-1.5 rounded-full hover:bg-white hover:text-panel transition-colors">{info}</span>
           ))}
        </div>
      </div>

      <div className="absolute top-8 right-8 z-20">
         <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white backdrop-blur-sm group-hover:bg-brand group-hover:border-brand group-hover:text-panel transition-all duration-300">
            <ArrowUpRight className="w-6 h-6" />
         </div>
      </div>
    </motion.div>
  );
}
