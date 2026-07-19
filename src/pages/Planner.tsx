import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Calendar, Target, Sparkles, Map, ChevronRight, Save, Loader2, ArrowLeft } from 'lucide-react';
import { generateTravelAdvice } from '../lib/ai';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';

const VIBES = [
  { id: 'adventure', name: 'Adventure', icon: '🧗', desc: 'Off-road, hiking, and extremes.' },
  { id: 'luxury', name: 'Luxury', icon: '💎', desc: 'High-end dining and private transit.' },
  { id: 'culture', name: 'Local/Culture', icon: '⛩️', desc: 'Temples, markets, and history.' },
  { id: 'chill', name: 'Casual/Chill', icon: '🍹', desc: 'Beaches, coffee, and relaxation.' },
];

const DESTINATIONS = ["Bangkok", "Phuket", "Chiang Mai", "Koh Samui", "Pattaya", "Krabi"];

const INTEREST_TAGS = [
  { id: 'history', name: 'History', icon: '🏛️' },
  { id: 'nightlife', name: 'Nightlife', icon: '🌃' },
  { id: 'nature', name: 'Nature', icon: '🌿' },
  { id: 'adventure', name: 'Adventure', icon: '🧗' },
  { id: 'foodie', name: 'Foodie', icon: '🍜' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'wellness', name: 'Wellness', icon: '🧘' },
];

export default function Planner() {
  const [step, setStep] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [mission, setMission] = React.useState({
    destination: 'Bangkok',
    days: '3',
    vibe: 'culture',
    budget: '500',
    groupSize: 'solo',
    interests: '',
    tags: [] as string[]
  });
  const [result, setResult] = React.useState<string | null>(null);
  const [savedMissions, setSavedMissions] = React.useState<any[]>([]);

  const toggleTag = (tagId: string) => {
    setMission(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId) 
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }));
  };

  React.useEffect(() => {
    if (auth.currentUser) fetchSaved();
  }, []);

  const fetchSaved = async () => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, 'itineraries'), 
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    setSavedMissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const combinedInterests = [...mission.tags, mission.interests].filter(Boolean).join(', ');
      const prompt = `Generate a STRATEGIC ${mission.days}-day travel mission for ${mission.destination}. 
      - Traveler Profile: ${mission.groupSize} execution.
      - Budget Constraint: $${mission.budget} TOTAL for the entire group.
      - Strategic Vibe: ${mission.vibe}. 
      - Objectives: ${combinedInterests}. 
      
      CRITICAL: Logic must account for CURRENT season in Thailand.
      - If ${mission.groupSize} is "team/large group", focus on bulk transit (minivan), large villas, and group-optimized dining.
      - If solo, focus on hostel culture, safety, and solo-friendly street food sectors. 

      Include: 
      1. Morning/Afternoon/Evening Tactical Ops formatted for ${mission.groupSize}.
      2. Budget breakdown per Day (Total Group vs Per Person).
      3. Weather survival tips.
      4. Scam alerts for ${mission.destination}.`;
      
      const stream = await generateTravelAdvice(prompt, [], 'en');
      let text = '';
      for await (const chunk of stream) {
        text += chunk.text;
        setResult(text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveMission = async () => {
    if (!auth.currentUser || !result) return;
    await addDoc(collection(db, 'itineraries'), {
      userId: auth.currentUser.uid,
      title: `${mission.destination} - ${mission.days} Days`,
      content: result,
      meta: mission,
      createdAt: serverTimestamp()
    });
    alert("Mission saved to your profile.");
    fetchSaved();
  };

  return (
    <div className="bg-surface min-h-screen py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-20">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-12 h-1 bg-brand rounded-full"></span>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-brand">Strategic Planning Ops</p>
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">MISSION <br /> BUILDER.</h1>
          <p className="text-lg text-ink-muted font-medium max-w-xl">Synthesize your Thailand objective into a tactical itinerary. Local intelligence applied to your timeline.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
               <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center text-brand">
                    <Target className="w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Mission Parameters</h2>
               </div>

               <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Destination Sector</label>
                    <select 
                      value={mission.destination}
                      onChange={(e) => setMission({...mission, destination: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-brand"
                    >
                      {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Duration (Days)</label>
                        <input 
                          type="number"
                          value={mission.days}
                          onChange={(e) => setMission({...mission, days: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-brand"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Group Alignment</label>
                        <select 
                          value={mission.groupSize}
                          onChange={(e) => setMission({...mission, groupSize: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-brand"
                        >
                          <option value="solo">Solo Operative</option>
                          <option value="couple">Duo (Couple)</option>
                          <option value="small-group">Squad (3-5)</option>
                          <option value="team">Team (6+)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Budget ($ Total Group)</label>
                      <input 
                        type="number"
                        value={mission.budget}
                        onChange={(e) => setMission({...mission, budget: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-brand"
                      />
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Operational Vibe</label>
                        <select 
                          value={mission.vibe}
                          onChange={(e) => setMission({...mission, vibe: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-brand"
                        >
                          {VIBES.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                        </select>
                    </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 block ml-1">Mission Interests</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {INTEREST_TAGS.map(tag => (
                        <button
                          key={tag.id}
                          onClick={() => toggleTag(tag.id)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                            mission.tags.includes(tag.id)
                              ? 'bg-brand border-brand text-panel shadow-md'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-brand/30'
                          }`}
                        >
                          <span>{tag.icon}</span>
                          {tag.name}
                        </button>
                      ))}
                    </div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block ml-1">Additional Objectives</label>
                    <textarea 
                      placeholder="e.g. Michelin street food, night markets, Scuba diving..."
                      value={mission.interests}
                      onChange={(e) => setMission({...mission, interests: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-sm outline-none focus:border-brand h-24 resize-none"
                    />
                  </div>

                  <button 
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full btn-primary !py-4 flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                    INITIATE SYNTHESIS
                  </button>
               </div>
            </div>

            {savedMissions.length > 0 && (
              <div className="bg-panel text-white rounded-3xl p-8 shadow-xl">
                 <h3 className="text-[10px] font-black uppercase tracking-widest text-brand mb-6 border-b border-slate-800 pb-4">Stored Missions</h3>
                 <div className="space-y-3">
                   {savedMissions.map((m) => (
                     <button 
                       key={m.id}
                       onClick={() => setResult(m.content)}
                       className="w-full flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-all border border-transparent hover:border-brand/30"
                     >
                       <div className="text-left">
                         <p className="text-xs font-bold">{m.title}</p>
                         <p className="text-[10px] opacity-40 uppercase tracking-tighter">Verified on {new Date(m.createdAt?.toDate()).toLocaleDateString()}</p>
                       </div>
                       <ChevronRight className="w-4 h-4 opacity-30" />
                     </button>
                   ))}
                 </div>
              </div>
            )}
          </div>

          {/* Results Output */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl relative"
                >
                  <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                         <Map className="w-5 h-5" />
                       </div>
                       <div>
                          <h3 className="text-lg font-black uppercase tracking-tight">Mission Strategy</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">AI Generated Logistics</p>
                       </div>
                    </div>
                    <button 
                      onClick={saveMission}
                      className="p-3 bg-slate-50 hover:bg-brand hover:text-panel rounded-xl transition-all text-slate-400 shadow-inner"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="prose prose-slate prose-sm max-w-none prose-h1:text-2xl prose-h1:font-black prose-h2:text-xl prose-h2:font-black prose-h2:border-l-4 prose-h2:border-brand prose-h2:pl-4 prose-p:leading-relaxed">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full luxury-card p-12 flex flex-col items-center justify-center text-center space-y-6">
                   <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                      <Plane className="w-10 h-10 text-slate-200 animate-pulse" />
                   </div>
                   <div className="max-w-xs">
                     <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Awaiting Parameters</h3>
                     <p className="text-sm text-slate-400 font-medium leading-relaxed italic">Select your destination sector and vibe to synthesize a custom travel mission.</p>
                   </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
