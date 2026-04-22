import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  serverTimestamp,
  getDocs,
  where
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { generateTravelAdvice } from '../lib/ai';
import { Send, Plus, History, Globe2, Bot, User, Trash2, Image as ImageIcon, X, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

const LOCALIZATION: Record<string, any> = {
  en: {
    newSession: "New Session",
    recentLogs: "Recent Logs",
    interfaceLang: "Interface Language",
    neuralEngine: "Neural Engine Online",
    opsBase: "Operations Base",
    placeholder: "Ask about hotels, transport, or Thai culture...",
    transmit: "Transmit",
    initContact: "Initialize Contact",
    welcomeDesc: "Ready for Thailand deployment. Signal your requirements regarding transport, culture, or government compliance.",
    contextualIntel: "Contextual Intelligence",
    safetyDirective: "Safety Directive",
    safetyDesc: "Monsoon season alert: Heavy precipitation expected in Central Thailand.",
    active: "Active",
    signal: "Initial signal..."
  },
  th: {
    newSession: "เริ่มการสนทนาใหม่",
    recentLogs: "ประวัติการสนทนา",
    interfaceLang: "ภาษาของอินเทอร์เฟซ",
    neuralEngine: "ระบบอัจฉริยะออนไลน์",
    opsBase: "คลังความรู้",
    placeholder: "สอบถามเกี่ยวกับโรงแรม การเดินทาง หรือวัฒนธรรมไทย...",
    transmit: "ส่งข้อความ",
    initContact: "เริ่มการเชื่อมต่อ",
    welcomeDesc: "พร้อมสำหรับการแนะนำข้อมูลท่องเที่ยวไทย โปรดระบุความต้องการของคุณเกี่ยวกับการเดินทาง วัฒนธรรม หรือกฎระเบียบต่างๆ",
    contextualIntel: "ข้อมูลเชิงลึก",
    safetyDirective: "คำสั่งด้านความปลอดภัย",
    safetyDesc: "คำเตือนฤดูมรสุม: คาดว่าจะมีฝนตกหนักในพื้นที่ภาคกลางของประเทศไทย",
    active: "ออนไลน์",
    signal: "กำลังรอสัญญาณ..."
  },
  hi: {
    newSession: "नया सत्र",
    recentLogs: "हाल के लॉग",
    interfaceLang: "इंटरफ़ेस भाषा",
    neuralEngine: "न्यूरल इंजन ऑनलाइन",
    opsBase: "संचालन आधार",
    placeholder: "होटल, परिवहन या थाई संस्कृति के बारे में पूछें...",
    transmit: "भेजें",
    initContact: "संपर्क प्रारंभ करें",
    welcomeDesc: "थाईलैंड तैनाती के लिए तैयार। परिवहन, संस्कृति या सरकारी अनुपालन के संबंध में अपनी आवश्यकताओं का संकेत दें।",
    contextualIntel: "प्रासंगिक बुद्धिमत्ता",
    safetyDirective: "सुरक्षा निर्देश",
    safetyDesc: "मानसून सीजन अलर्ट: मध्य थाईलैंड में भारी बारिश की उम्मीद है।",
    active: "सक्रिय",
    signal: "प्रारंभिक संकेत..."
  },
  si: {
    newSession: "නව සැසිය",
    recentLogs: "මෑත සටහන්",
    interfaceLang: "අතුරුමුහුණත් භාෂාව",
    neuralEngine: "පද්ධතිය සක්‍රීයයි",
    opsBase: "තොරතුරු මධ්‍යස්ථානය",
    placeholder: "හෝටල්, ප්‍රවාහනය හෝ තායි සංස්කෘතිය ගැන විමසන්න...",
    transmit: "යවන්න",
    initContact: "සම්බන්ධතාවය අරඹන්න",
    welcomeDesc: "තායිලන්ත සංචාරක තොරතුරු සඳහා සූදානම්. ප්‍රවාහනය, සංස්කෘතිය හෝ නීතිමය කරුණු පිළිබඳ ඔබේ ගැටලු යොමු කරන්න.",
    contextualIntel: "වැදගත් තොරතුරු",
    safetyDirective: "ආරක්ෂක උපදෙස්",
    safetyDesc: "මෝසම් වැසි අනතුරු ඇඟවීම: මධ්‍යම තායිලන්තයට තද වැසි අපේක්ෂා කෙරේ.",
    active: "සක්‍රීය",
    signal: "සම්බන්ධ වෙමින්..."
  }
};

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<any[]>([]);
  const [conversations, setConversations] = React.useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [language, setLanguage] = React.useState('en');
  const [isTyping, setIsTyping] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const recognitionRef = React.useRef<any>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const t = LOCALIZATION[language] || LOCALIZATION.en;

  // Initialize Speech Recognition
  React.useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev ? `${prev} ${transcript}` : transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (!recognitionRef.current) {
        alert("Speech recognition is not supported in this browser.");
        return;
      }
      try {
        recognitionRef.current.lang = language === 'th' ? 'th-TH' : language === 'hi' ? 'hi-IN' : 'en-US';
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start recognition:', err);
      }
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Load user conversations
  React.useEffect(() => {
    if (!auth.currentUser) return;
    const q = query(
      collection(db, 'conversations'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('updatedAt', 'desc')
    );
    return onSnapshot(q, (snap) => {
      setConversations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, []);

  // Load current conversation messages
  React.useEffect(() => {
    if (!id) {
      setMessages([]);
      return;
    }
    const q = query(
      collection(db, `conversations/${id}/messages`),
      orderBy('timestamp', 'asc')
    );
    return onSnapshot(q, (snap) => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, [id]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!input.trim() && !selectedImage) || !auth.currentUser) return;

    let convId = id;
    const userMsg = input.trim() || (selectedImage ? "[Awaiting Visual Analysis]" : "");
    const imageData = selectedImage ? selectedImage.split(',')[1] : undefined;
    const mimeType = selectedImage ? selectedImage.match(/data:([^;]+);/)?.[1] : undefined;
    
    setInput('');
    clearImage();

    // Create new conversation if none selected
    if (!convId) {
      const convDoc = await addDoc(collection(db, 'conversations'), {
        userId: auth.currentUser.uid,
        title: imageData ? "Visual Intercept" : (userMsg.slice(0, 30) + '...'),
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      });
      convId = convDoc.id;
      navigate(`/chat/${convId}`);
    }

    // Save user message (with image indicator for UI)
    await addDoc(collection(db, `conversations/${convId}/messages`), {
      sender: 'user',
      content: userMsg,
      hasImage: !!imageData,
      timestamp: serverTimestamp()
    });

    await updateDoc(doc(db, 'conversations', convId), {
      updatedAt: serverTimestamp(),
      lastMessage: imageData ? "[Visual Intelligence Captured]" : userMsg
    });

    // Get AI Response
    setIsTyping(true);
    try {
      const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));
      
      const stream = await generateTravelAdvice(userMsg, history, language, imageData, mimeType);
      let fullContent = '';
      
      // Store AI message body
      const aiMsgRef = await addDoc(collection(db, `conversations/${convId}/messages`), {
        sender: 'ai',
        content: '',
        timestamp: serverTimestamp()
      });

      for await (const chunk of stream) {
        fullContent += chunk.text;
        await updateDoc(aiMsgRef, { content: fullContent });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const createNewChat = () => {
    navigate('/chat');
  };

  return (
    <div className="h-[calc(100vh-64px)] flex bg-surface overflow-hidden text-slate-900">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0 }}
        className="bg-panel text-slate-200 flex flex-col border-r border-slate-800"
      >
        <div className="p-4 border-b border-slate-800">
          <button 
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand text-panel rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-hover transition-all shadow-lg shadow-brand/20"
          >
            <Plus className="w-4 h-4" />
            {t.newSession}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-3 ml-2">{t.recentLogs}</p>
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => navigate(`/chat/${conv.id}`)}
              className={`sidebar-item group ${id === conv.id ? 'active-sidebar-item shadow-sm' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`font-bold truncate ${id === conv.id ? 'text-white' : 'text-slate-400'}`}>{conv.title}</span>
                <span className="text-[10px] opacity-30 font-bold uppercase tracking-tighter shrink-0 ml-2">{t.active}</span>
              </div>
              <p className={`text-[11px] truncate ${id === conv.id ? 'text-slate-300' : 'text-slate-500'}`}>{conv.lastMessage || t.signal}</p>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-slate-800 bg-panel-muted/30">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">{t.interfaceLang}</p>
          <div className="flex flex-wrap gap-2 justify-between">
            {['AUTO', 'EN', 'TH', 'HI', 'SI'].map(lang => (
              <button 
                key={lang}
                onClick={() => setLanguage(lang.toLowerCase())}
                className={`px-2 py-1.5 rounded text-[10px] font-black tracking-widest transition-all ${language === lang.toLowerCase() ? 'bg-brand text-panel shadow-sm shadow-brand/10' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </motion.aside>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative shadow-2xl z-0">
        {/* Chat Header */}
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-8 shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-black tracking-widest border border-green-100 uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                {t.neuralEngine}
             </div>
             <span className="text-slate-200">|</span>
             <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Thailand Support Ops</h2>
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/50 scroll-smooth">
          {messages.length === 0 && !id && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-6">
                <div className="w-16 h-16 bg-brand rounded-2xl flex items-center justify-center text-panel font-black text-2xl shadow-xl shadow-brand/20">RB</div>
                <div>
                   <h3 className="text-xl font-black uppercase tracking-tighter mb-2">{t.initContact}</h3>
                   <p className="text-sm text-slate-500 leading-relaxed font-medium">{t.welcomeDesc}</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-4">
                  <div onClick={() => setInput("Bangkok transit guide")} className="cursor-pointer px-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-600 uppercase tracking-widest hover:border-brand transition-all shadow-sm">🥘 Local Food</div>
                  <div onClick={() => setInput("Visa requirements")} className="cursor-pointer px-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-600 uppercase tracking-widest hover:border-brand transition-all shadow-sm">🚆 BTS Guide</div>
                </div>
            </div>
          )}

          {messages.map((m, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              key={m.id || i} 
              className={`flex gap-4 ${m.sender === 'user' ? 'flex-row-reverse self-end max-w-2xl' : 'max-w-2xl'}`}
            >
              <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center font-black text-[10px] shadow-sm ${m.sender === 'user' ? 'bg-panel text-white' : 'bg-brand text-panel'}`}>
                {m.sender === 'user' ? 'ME' : 'RB'}
              </div>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed ${m.sender === 'user' ? 'bg-panel text-white shadow-md' : 'bg-white border border-slate-200 shadow-sm text-slate-800'}`}>
                 {m.hasImage && (
                   <div className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                     <ImageIcon className="w-3 h-3" />
                     Visual Intel Captured
                   </div>
                 )}
                 <div className="prose prose-slate prose-sm text-inherit max-w-none prose-p:leading-relaxed prose-li:my-1">
                   <ReactMarkdown>{m.content}</ReactMarkdown>
                 </div>
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4 max-w-2xl">
               <div className="w-8 h-8 rounded-lg bg-brand shrink-0 flex items-center justify-center font-black text-[10px]">RB</div>
               <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-brand/40 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-brand/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-brand/80 rounded-full animate-bounce [animation-delay:0.4s]" />
               </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-100">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
            <AnimatePresence>
              {selectedImage && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mb-4 relative inline-block group"
                >
                  <img 
                    src={selectedImage} 
                    alt="Intercept preview" 
                    className="h-32 rounded-2xl border-4 border-white shadow-xl ring-1 ring-slate-200" 
                    referrerPolicy="no-referrer"
                  />
                  <button 
                    type="button"
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 bg-panel text-white p-1 rounded-full shadow-lg hover:bg-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 items-center bg-slate-100 p-2 rounded-2xl border border-slate-200 shadow-inner">
               <input 
                 type="file"
                 ref={fileInputRef}
                 onChange={handleImageSelect}
                 accept="image/*"
                 className="hidden"
               />
               <button 
                 type="button"
                 onClick={() => fileInputRef.current?.click()}
                 className={`p-2 rounded-xl transition-all flex items-center gap-2 ${selectedImage ? 'text-brand bg-white' : 'text-slate-400 hover:text-brand hover:bg-white'}`}
               >
                 <ImageIcon className="w-6 h-6" />
                 {!selectedImage && <span className="hidden sm:inline text-[10px] uppercase font-black tracking-widest">Scan Intel</span>}
               </button>
               
               <div className="flex-1 bg-transparent px-4 py-2 text-sm outline-none font-medium placeholder:text-slate-400">
                  <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={selectedImage ? "Describe this image for analysis..." : t.placeholder}
                    className="w-full bg-transparent border-none focus:ring-0 outline-none font-bold"
                  />
               </div>
               
               <button 
                  type="button"
                  onClick={toggleListening}
                  className={`p-2 rounded-xl transition-all ${isListening ? 'text-red-500 bg-red-50 animate-pulse' : 'text-slate-400 hover:text-brand hover:bg-white'}`}
                  title={isListening ? "Stop Listening" : "Start Voice Input"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
               <button 
                  type="submit"
                  disabled={(!input.trim() && !selectedImage) || isTyping}
                  className="bg-brand hover:bg-brand-hover text-panel font-black py-2.5 px-8 rounded-xl text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-brand/20 disabled:opacity-50 disabled:shadow-none"
               >
                 {t.transmit}
               </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Sidebar - Info */}
      <aside className="hidden lg:flex w-80 bg-slate-50 border-l border-slate-200 p-6 flex-col gap-6">
          <section>
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">{t.contextualIntel}</h3>
             <div className="space-y-3">
                <InfoCard icon="✈️" title="Flight Status" status="On Time" desc="BKK arrivals monitored in real-time." />
                <InfoCard icon="🏨" title="Accommodation" status="Siam Kempinski" desc="Check-in automated protocols active." />
             </div>
          </section>

          <section className="flex-1 overflow-y-auto">
             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">{t.opsBase}</h3>
             <div className="space-y-2">
                <div onClick={() => setInput("Tourist Police Number")} className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 cursor-pointer hover:border-brand hover:shadow-sm transition-all uppercase tracking-tighter">Emergency Contacts</div>
                <div onClick={() => setInput("How to use Grab")} className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 cursor-pointer hover:border-brand hover:shadow-sm transition-all uppercase tracking-tighter">Taxi Signal Apps</div>
                <div onClick={() => setInput("VAT Refund")} className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] font-bold text-slate-700 cursor-pointer hover:border-brand hover:shadow-sm transition-all uppercase tracking-tighter">VAT Refund Protocols</div>
             </div>
          </section>

          <div className="bg-panel text-white rounded-2xl p-5 border border-slate-800 shadow-xl">
             <p className="text-[10px] font-black text-brand uppercase tracking-widest mb-2">{t.safetyDirective}</p>
             <p className="text-[11px] leading-relaxed opacity-70 font-medium">{t.safetyDesc}</p>
          </div>
      </aside>
    </div>
  );
}

function InfoCard({ icon, title, status, desc }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
       <div className="flex gap-3 mb-3">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-lg">{icon}</div>
          <div>
             <p className="text-xs font-black uppercase tracking-tight">{title}</p>
             <p className="text-[10px] font-bold text-brand">{status}</p>
          </div>
       </div>
       <p className="text-[10px] text-slate-500 font-medium leading-tight">{desc}</p>
    </div>
  );
}

function QuickAsk({ label, onClick }: { label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 border border-ink/5 rounded-full text-xs hover:border-gold hover:text-gold transition-all bg-white shadow-sm"
    >
      {label}
    </button>
  );
}

function Compass(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}
