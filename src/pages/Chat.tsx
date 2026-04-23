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
  deleteDoc,
  serverTimestamp,
  getDocs,
  where
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { generateTravelAdvice } from '../lib/ai';
import { Send, Plus, History, Globe2, Bot, User, Trash2, Image as ImageIcon, X, Mic, MicOff, Search, Volume2, VolumeX, Banknote, ArrowRightLeft, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import CommandPalette from '../components/CommandPalette';

const LOCALIZATION: Record<string, any> = {
  en: {
    newSession: "New Session",
    recentLogs: "Recent Logs",
    interfaceLang: "Interface Language",
    neuralEngine: "Neural Engine Online",
    opsBase: "Operations Base",
    placeholder: "Ask anything or type /calc to convert currency...",
    transmit: "Transmit",
    initContact: "Initialize Contact",
    welcomeDesc: "Ready for Thailand deployment. Signal your requirements regarding transport, culture, or government compliance. Type /calc to trigger FX Intel.",
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
    // ... logic exists
  },
  bn: {
    newSession: "নতুন সেশন",
    recentLogs: "সাম্প্রতিক লগ",
    interfaceLang: "ইন্টারফেস ভাষা",
    neuralEngine: "নিউরাল ইঞ্জিন অনলাইন",
    opsBase: "অপারেশন বেস",
    placeholder: "হোটেল, পরিবহন বা থাই সংস্কৃতি সম্পর্কে জিজ্ঞাসা করুন...",
    transmit: "প্রেরণ করুন",
    initContact: "যোগাযোগ শুরু করুন",
    welcomeDesc: "থাইল্যান্ডে আপনার সফরের জন্য আমি প্রস্তুত। পরিবহন, সংস্কৃতি বা সরকারি আইন বিষয়ে আপনার যা প্রয়োজন জানান।",
    contextualIntel: "প্রাসঙ্গিক তথ্য",
    safetyDirective: "নিরাপদ নির্দেশনা",
    safetyDesc: "মৌসুমী সতর্কবার্তা: মধ্য থাইল্যান্ডে ভারী বৃষ্টির সম্ভাবনা রয়েছে।",
    active: "সক্রিয়",
    signal: "প্রাথমিক সংকেত..."
  }
};

function QuickPill({ icon, label, onClick }: { icon: string, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-600 uppercase tracking-widest hover:border-brand hover:text-brand transition-all shadow-sm active:scale-95"
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<any[]>([]);
  const [conversations, setConversations] = React.useState<any[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [language, setLanguage] = React.useState('en');
  const [engine, setEngine] = React.useState<'gemini' | 'grok'>('gemini');
  const [isTyping, setIsTyping] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [userScrolledUp, setUserScrolledUp] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [streamingMessage, setStreamingMessage] = React.useState<{ id: string, content: string } | null>(null);
  const [showCurrency, setShowCurrency] = React.useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = React.useState(false);
  const [voiceStatus, setVoiceStatus] = React.useState<'idle' | 'listening' | 'success'>('idle');
  const [conversion, setConversion] = React.useState({
    amount: '1000',
    from: 'BDT',
    to: 'THB'
  });
  
  const EXCHANGE_RATES: Record<string, number> = {
    'THB': 1,
    'BDT': 0.30,
    'USD': 36.50,
    'INR': 0.44,
    'LKR': 0.12,
    'EUR': 39.20
  };

  const calculateConversion = () => {
    const fromRate = EXCHANGE_RATES[conversion.from] || 1;
    const toRate = EXCHANGE_RATES[conversion.to] || 1;
    const amountNum = parseFloat(conversion.amount) || 0;
    
    // Convert to THB first (base), then to target
    const inThb = amountNum * fromRate;
    const result = inThb / toRate;
    
    return result.toFixed(2);
  };

  const [speakingMessageId, setSpeakingMessageId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const recognitionRef = React.useRef<any>(null);
  
  React.useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const t = LOCALIZATION[language] || LOCALIZATION.en;

  // Scroll logic
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const sidebarSearchRef = React.useRef<HTMLInputElement>(null);
  
  const scrollToBottom = (instant = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: instant ? 'auto' : 'smooth',
        block: 'nearest'
      });
    }
  };

  // Scroll visibility detector
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      // If user is more than 100px from bottom, they have "scrolled up"
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setUserScrolledUp(!isNearBottom);
    }
  };

  // Keyboard Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommandAction = (actionId: string) => {
    switch (actionId) {
      case 'new-chat':
        createNewChat();
        break;
      case 'search-history':
        setIsSidebarOpen(true);
        setTimeout(() => sidebarSearchRef.current?.focus(), 100);
        break;
      case 'currency':
        setShowCurrency(true);
        break;
      case 'feedback':
        window.dispatchEvent(new CustomEvent('open-feedback'));
        break;
    }
  };

  React.useEffect(() => {
    // Only auto-scroll if user hasn't manually scrolled up to read history
    // OR if the system is typing (AI is responding) and they were already at the bottom
    if (!userScrolledUp) {
      scrollToBottom();
    }
  }, [messages, streamingMessage]);

  // Force scroll when typing starts or send happens
  React.useEffect(() => {
    if (isTyping && !userScrolledUp) {
      scrollToBottom();
    }
  }, [isTyping]);

  // Initial scroll on load
  React.useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom(true);
    }
  }, [id]);

  // Initialize Speech Recognition
  React.useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setInput(prev => prev ? `${prev} ${finalTranscript}` : finalTranscript);
          setVoiceStatus('success');
          setTimeout(() => setVoiceStatus('idle'), 2000);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setVoiceStatus('idle');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (voiceStatus !== 'success') setVoiceStatus('idle');
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        console.warn("Speech recognition is not supported in this browser.");
        return;
      }
      try {
        recognitionRef.current.lang = language === 'th' ? 'th-TH' : language === 'hi' ? 'hi-IN' : 'en-US';
        recognitionRef.current.start();
        setIsListening(true);
        setVoiceStatus('listening');
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

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeakingMessageId(null);
  };

  const speakMessage = (messageId: string, text: string) => {
    if (speakingMessageId === messageId) {
      stopSpeaking();
      return;
    }

    stopSpeaking();
    
    // Remove markdown symbols for better speech synthesis
    const cleanText = text.replace(/[#*`_~]/g, '');
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Attempt to map app language to voice language code
    const langMap: Record<string, string> = {
      en: 'en-US',
      th: 'th-TH',
      hi: 'hi-IN',
      si: 'si-LK',
      bn: 'bn-BD'
    };
    
    utterance.lang = langMap[language] || 'en-US';
    utterance.rate = 0.9; // Slightly slower for clarity
    
    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);
    
    setSpeakingMessageId(messageId);
    window.speechSynthesis.speak(utterance);
  };

  // Load user conversations
  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) return;
      
      const q = query(
        collection(db, 'conversations'),
        where('userId', '==', user.uid),
        orderBy('updatedAt', 'desc')
      );
      
      const snapUnsub = onSnapshot(q, (snap) => {
        setConversations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      });

      return snapUnsub;
    });

    return unsub;
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

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!auth.currentUser) return;
    if (!input.trim() && !selectedImage) return;

    let convId = id;
    const userMsg = input.trim() || (selectedImage ? "[Awaiting Visual Analysis]" : "");
    
    // Command Intercept: Currency
    if (userMsg.toLowerCase().startsWith('/calc') || userMsg.toLowerCase().startsWith('/rate')) {
      const parts = userMsg.split(' ');
      if (parts.length >= 2) {
        const amount = parts[1];
        if (!isNaN(parseFloat(amount))) {
          setConversion(prev => ({ ...prev, amount }));
        }
      }
      setShowCurrency(true);
      setInput('');
      return;
    }

    const imageData = selectedImage ? selectedImage.split(',')[1] : undefined;
    const mimeType = selectedImage ? selectedImage.match(/data:([^;]+);/)?.[1] : undefined;
    
    stopSpeaking();
    setInput('');
    clearImage();
    setUserScrolledUp(false); // Reset scroll state to force auto-scroll on send
    setTimeout(() => scrollToBottom(true), 10); // Force immediate snap to bottom

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

    setIsTyping(true);
    try {
      const historyThreshold = 10;
      const recentMessages = messages.slice(-historyThreshold);
      const history = recentMessages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));
      
      const stream = await generateTravelAdvice(userMsg, history, language, imageData, mimeType, engine);
      let fullContent = '';
      
      const aiMsgRef = await addDoc(collection(db, `conversations/${convId}/messages`), {
        sender: 'ai',
        content: '',
        timestamp: serverTimestamp()
      });

      setStreamingMessage({ id: aiMsgRef.id, content: '' });

      let firstChunk = true;
      for await (const chunk of stream) {
        if (firstChunk) {
          setIsTyping(false);
          firstChunk = false;
        }
        fullContent += chunk.text;
        setStreamingMessage({ id: aiMsgRef.id, content: fullContent });
      }
      
      // Final persistence to Firestore
      await updateDoc(aiMsgRef, { content: fullContent });
    } catch (err: any) {
      console.error("Neural Error:", err);
      let errorMessage = "⚠️ **SIGNAL INTERRUPT**: Neural Engine offline.";
      
      const errorStr = err.message || "";
      if (errorStr.includes("API KEY")) {
        errorMessage = "⚠️ **ACCESS DENIED**: Your API Key is invalid or missing. Please check your **Settings** menu and ensure the Gemini API key is correctly configured.";
      } else if (errorStr.includes("Quota") || errorStr.includes("Rate limit")) {
        errorMessage = "⚠️ **BANDS SATURATED**: Neural quota exceeded. Please wait a few minutes for the signal to clear or try switching to a different engine.";
      } else if (errorStr.includes("Safety")) {
        errorMessage = "⚠️ **PROTOCOL VIOLATION**: The request was blocked by safety filters. Please refine your query parameters.";
      } else if (errorStr.includes("Failed to fetch")) {
        errorMessage = "⚠️ **LINK SEVERED**: Network connection lost. Please check your upstream link.";
      }

      await addDoc(collection(db, `conversations/${convId}/messages`), {
        sender: 'ai',
        content: errorMessage,
        timestamp: serverTimestamp()
      });
    } finally {
      setIsTyping(false);
      setStreamingMessage(null);
    }
  };

  const createNewChat = () => navigate('/chat');

  const handleDeleteConversation = async (convId: string) => {
    try {
      const messagesSnap = await getDocs(collection(db, `conversations/${convId}/messages`));
      await Promise.all(messagesSnap.docs.map(d => deleteDoc(d.ref)));
      await deleteDoc(doc(db, 'conversations', convId));
      setDeletingId(null);
      if (id === convId) navigate('/chat');
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex bg-[#FDFCFB] overflow-hidden text-slate-900">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0 }}
        className="bg-panel text-slate-200 flex flex-col border-r border-slate-800 shrink-0"
      >
        <div className="p-4 border-b border-slate-800">
          <button 
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand text-panel rounded-xl text-xs font-black uppercase tracking-widest hover:bg-brand-hover transition-all shadow-lg shadow-brand/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            {t.newSession}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
          <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input 
              ref={sidebarSearchRef}
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-[11px] font-medium text-white placeholder:text-slate-500 focus:outline-none focus:border-brand/50 transition-all"
            />
          </div>

          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-black mb-3 ml-2">{t.recentLogs}</p>
          {(() => {
            const searchQueryLower = searchQuery.toLowerCase();
            const filtered = conversations.filter(conv => 
              conv.title?.toLowerCase().includes(searchQueryLower) || 
              conv.lastMessage?.toLowerCase().includes(searchQueryLower)
            );

            if (filtered.length === 0 && searchQuery) {
              return (
                <div className="py-12 px-4 text-center">
                   <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
                      <Search className="w-6 h-6 text-slate-500" />
                   </div>
                   <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-black mb-1">Signal Mismatch</p>
                   <p className="text-[11px] text-slate-500 font-bold italic leading-relaxed">No missions matched your query parameters.</p>
                </div>
              );
            }

            return filtered.map(conv => (
              <div key={conv.id} className="relative group">
                <button
                  onClick={() => navigate(`/chat/${conv.id}`)}
                  className={`sidebar-item w-full text-left pr-10 ${id === conv.id ? 'active-sidebar-item shadow-sm' : ''}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`font-bold truncate text-[13px] ${id === conv.id ? 'text-white' : 'text-slate-400'}`}>{conv.title}</span>
                    <span className="text-[10px] opacity-30 font-bold uppercase tracking-tighter shrink-0 ml-2">{t.active}</span>
                  </div>
                  <p className={`text-[11px] truncate ${id === conv.id ? 'text-slate-300' : 'text-slate-500'}`}>{conv.lastMessage || t.signal}</p>
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingId(conv.id);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-slate-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ));
          })()}
        </div>

        <div className="p-4 border-t border-slate-800 bg-panel-muted/30">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">Neural Core Selection</p>
          <div className="grid grid-cols-2 gap-2 mb-6 px-1">
             <button 
                onClick={() => setEngine('gemini')}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all border ${engine === 'gemini' ? 'bg-brand/10 border-brand text-white shadow-lg' : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-500'}`}
             >
                <span className="text-[10px] font-black uppercase tracking-widest">Gemini</span>
                <div className={`w-1.5 h-1.5 rounded-full ${engine === 'gemini' ? 'bg-brand' : 'bg-slate-600'}`}></div>
             </button>
             <button 
                onClick={() => setEngine('grok')}
                className={`flex flex-col items-center gap-1 py-3 rounded-xl transition-all border ${engine === 'grok' ? 'bg-white/10 border-white text-white shadow-lg' : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:border-slate-500'}`}
             >
                <span className="text-[10px] font-black uppercase tracking-widest">Grok</span>
                <div className={`w-1.5 h-1.5 rounded-full ${engine === 'grok' ? 'bg-white' : 'bg-slate-600'}`}></div>
             </button>
          </div>

          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">{t.interfaceLang}</p>
          <div className="grid grid-cols-5 gap-1 px-1">
            {['EN', 'TH', 'HI', 'SI', 'BN'].map(lang => (
              <button 
                key={lang}
                onClick={() => setLanguage(lang.toLowerCase())}
                className={`py-2 rounded-lg text-[10px] font-black tracking-widest transition-all ${language === lang.toLowerCase() ? 'bg-brand text-panel font-bold' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'}`}
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
             <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-[10px] font-black tracking-widest border border-green-100 uppercase">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                {engine === 'gemini' ? 'Gemini 3.0 Pro' : 'Grok Beta xAI'}
             </div>
             <span className="text-slate-200">|</span>
             <h2 className="text-xs font-black uppercase tracking-widest text-slate-500">Operation: Tourist Support</h2>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsPaletteOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-400 hover:text-brand hover:border-brand transition-all"
              title="Command Palette (Ctrl+K)"
            >
              <Command className="w-3.5 h-3.5" />
              <span>⌘K</span>
            </button>
            <button 
              onClick={() => setShowCurrency(!showCurrency)}
              className={`p-2 rounded-xl transition-all ${showCurrency ? 'bg-brand text-panel shadow-lg' : 'hover:bg-slate-50 text-slate-400'}`}
              title="Currency Intelligence"
            >
              <Banknote className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
            >
              <History className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-[#FDFCFB] selection:bg-brand/30 relative"
        >
          <AnimatePresence>
            {showCurrency && (
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="absolute top-4 right-4 z-50 w-72 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-6 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-brand">FX Intelligence</h3>
                  <button onClick={() => setShowCurrency(false)} className="text-slate-300 hover:text-slate-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <label className="text-[9px] font-black uppercase text-slate-400 mb-2 block">Source Value</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number"
                        value={conversion.amount}
                        onChange={(e) => setConversion({...conversion, amount: e.target.value})}
                        className="w-full bg-transparent font-black text-xl outline-none text-panel"
                      />
                      <select 
                        value={conversion.from}
                        onChange={(e) => setConversion({...conversion, from: e.target.value})}
                        className="bg-panel text-white rounded-lg px-2 py-1 text-[10px] font-black outline-none"
                      >
                        {Object.keys(EXCHANGE_RATES).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-center -my-2 relative z-10">
                    <button 
                      onClick={() => setConversion({ ...conversion, from: conversion.to, to: conversion.from })}
                      className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-panel shadow-lg hover:rotate-180 transition-all duration-500"
                    >
                      <ArrowRightLeft className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="bg-brand/5 rounded-2xl p-4 border border-brand/10">
                    <label className="text-[9px] font-black uppercase text-brand mb-2 block">Target Result</label>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-2xl text-brand">{calculateConversion()}</span>
                      <select 
                        value={conversion.to}
                        onChange={(e) => setConversion({...conversion, to: e.target.value})}
                        className="bg-brand text-panel rounded-lg px-2 py-1 text-[10px] font-black outline-none"
                      >
                        {Object.keys(EXCHANGE_RATES).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <p className="text-[9px] text-slate-400 font-bold text-center italic">Institutional Live Spreads. Powered by RB Neural.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {messages.length === 0 && !id && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-8 py-12">
                <motion.div 
                  initial={{ rotate: -10, scale: 0.9, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="w-20 h-20 bg-brand rounded-3xl flex items-center justify-center text-panel font-black text-3xl shadow-2xl shadow-brand/30 border-4 border-white relative"
                >
                  RB
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white animate-pulse" />
                </motion.div>
                <div className="space-y-3">
                   <h3 className="text-2xl font-black uppercase tracking-tighter text-panel">{t.initContact}</h3>
                   <p className="text-sm text-slate-500 leading-relaxed font-medium px-4">{t.welcomeDesc}</p>
                </div>
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap justify-center gap-3 pt-4"
                >
                  <QuickPill icon="🥘" label="Local Food" onClick={() => setInput("What are the best street food spots in Bangkok?")} />
                  <QuickPill icon="🚆" label="BTS Guide" onClick={() => setInput("How do I use the BTS Skytrain?")} />
                  <QuickPill icon="🛕" label="Temples" onClick={() => setInput("Dress code for the Grand Palace?")} />
                </motion.div>
            </div>
          )}

          <div className="space-y-10 max-w-5xl mx-auto">
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  key={m.id || i} 
                  className={`flex gap-5 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center font-black text-xs shadow-lg transition-transform hover:scale-110 active:scale-90 cursor-default ${m.sender === 'user' ? 'bg-panel text-brand' : 'bg-brand text-panel ring-4 ring-brand/10'}`}>
                    {m.sender === 'user' ? 'ME' : 'RB'}
                  </div>
                  <div className={`relative group max-w-[85%] md:max-w-[70%]`}>
                     <div className={`p-5 rounded-[2rem] text-[15px] leading-relaxed shadow-xl border-b-4 transition-all hover:shadow-2xl ${
                       m.sender === 'user' 
                       ? 'bg-panel text-white rounded-tr-none border-brand/20' 
                       : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none border-slate-200'
                     }`}>
                        {m.hasImage && (
                          <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand bg-brand/5 w-fit px-3 py-1.5 rounded-full border border-brand/10">
                            <ImageIcon className="w-3.5 h-3.5" />
                            Visual Intelligence Intercepted
                          </div>
                        )}
                        <div className="prose prose-slate prose-sm text-inherit max-w-none prose-p:leading-relaxed prose-li:my-1 prose-headings:text-inherit prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-strong:text-inherit prose-code:text-brand prose-pre:bg-panel prose-pre:text-white prose-img:rounded-2xl relative group/msg">
                          <ReactMarkdown>
                            {streamingMessage?.id === m.id ? streamingMessage.content : m.content}
                          </ReactMarkdown>
                          
                          {(streamingMessage?.id === m.id ? streamingMessage.content : m.content) && m.sender === 'ai' && (
                            <button 
                              onClick={() => speakMessage(m.id || i.toString(), (streamingMessage?.id === m.id ? streamingMessage.content : m.content))}
                              className={`absolute -right-12 top-0 p-2 rounded-xl transition-all shadow-lg border ${
                                speakingMessageId === (m.id || i.toString()) 
                                ? 'bg-brand text-panel border-brand animate-pulse' 
                                : 'bg-white text-slate-400 hover:text-brand border-slate-100 opacity-0 group-hover/msg:opacity-100'
                              }`}
                              title="Listen to Intelligence"
                            >
                              {speakingMessageId === (m.id || i.toString()) ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                     </div>
                     <div className={`absolute top-full mt-2 text-[9px] font-bold uppercase tracking-widest text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${m.sender === 'user' ? 'right-4' : 'left-4'}`}>
                        {m.timestamp ? new Date(m.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Transmitting...'}
                     </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-5"
              >
                 <div className="w-10 h-10 rounded-2xl bg-brand shrink-0 flex items-center justify-center font-black text-xs shadow-lg ring-4 ring-brand/10 text-panel">RB</div>
                 <div className="bg-white border border-slate-100 p-5 rounded-[2rem] rounded-tl-none flex items-center gap-2 shadow-xl border-b-4 border-slate-200 min-w-[80px] justify-center">
                    <span className="w-2 h-2 bg-brand rounded-full animate-bounce [animation-duration:0.6s]" />
                    <span className="w-2 h-2 bg-brand/60 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.1s]" />
                    <span className="w-2 h-2 bg-brand/30 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]" />
                 </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 md:p-10 bg-slate-50/50 border-t border-slate-100 relative mt-auto">
          <AnimatePresence>
            {isListening && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute -top-14 left-1/2 -translate-x-1/2 z-30"
              >
                <div className="flex items-center gap-3 px-6 py-2.5 bg-red-500 text-white rounded-full shadow-2xl border border-red-400 font-bold text-[11px] uppercase tracking-[0.2em]">
                   <div className="flex gap-1">
                      <motion.div animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-white rounded-full" />
                      <motion.div animate={{ height: [8, 4, 8] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1 bg-white rounded-full" />
                      <motion.div animate={{ height: [4, 10, 4] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1 bg-white rounded-full" />
                   </div>
                   Voice Link Active
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute inset-x-0 -top-12 h-12 bg-gradient-to-t from-slate-50/50 to-transparent pointer-events-none" />
          
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto relative z-10">
            <AnimatePresence>
              {selectedImage && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="absolute bottom-full mb-8 left-0 group"
                >
                  <div className="relative p-2 bg-white rounded-2xl shadow-2xl border border-slate-100">
                    <img 
                      src={selectedImage} 
                      alt="Intercept preview" 
                      className="h-40 w-auto rounded-xl object-contain grayscale-[0.2] hover:grayscale-0 transition-all duration-500" 
                      referrerPolicy="no-referrer"
                    />
                    <button 
                      type="button"
                      onClick={clearImage}
                      className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-2xl hover:bg-red-600 transition-colors transform hover:scale-110"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 text-[10px] font-black uppercase tracking-widest text-brand text-center animate-pulse">Image Analysis Queued</div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center bg-white p-4 rounded-[2.5rem] border-2 border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.1)] hover:border-brand/40 transition-all duration-500 group focus-within:border-brand focus-within:ring-[12px] focus-within:ring-brand/5 backdrop-blur-sm">
               <div className="flex items-center gap-2 pl-2">
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
                   className={`w-12 h-12 rounded-full transition-all flex items-center justify-center relative overflow-hidden group ${selectedImage ? 'bg-brand text-panel ring-4 ring-brand/20' : 'bg-slate-50 text-slate-400 hover:text-brand hover:bg-white border border-slate-100'}`}
                 >
                   <ImageIcon className="w-6 h-6 relative z-10" />
                   {selectedImage && <motion.div layoutId="img-badge" className="absolute inset-0 bg-brand/20 animate-pulse" />}
                 </button>
                 
                 <button 
                   type="button"
                   onClick={toggleListening}
                   className={`w-12 h-12 rounded-full transition-all flex items-center justify-center ${isListening ? 'bg-red-500 text-white ring-4 ring-red-100' : 'bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white border border-slate-100'}`}
                   title={isListening ? "Stop Listening" : "Start Voice Input"}
                 >
                   {isListening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
                 </button>
               </div>
               
               <div className="flex-1 px-4 py-2 relative">
                  <input 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={selectedImage ? "Describe this image for neural analysis..." : t.placeholder}
                    className="w-full bg-transparent border-none focus:ring-0 outline-none font-bold text-slate-700 placeholder:text-slate-300 transition-all text-base"
                  />
                  <AnimatePresence>
                    {voiceStatus !== 'idle' && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className={`absolute -top-6 left-4 text-[10px] font-black uppercase tracking-widest ${voiceStatus === 'listening' ? 'text-red-500' : 'text-green-500'}`}
                      >
                        {voiceStatus === 'listening' ? 'Neural Mic Active' : 'Intelligence Transcribed'}
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>
               
               <button 
                  type="submit"
                  disabled={(!input.trim() && !selectedImage) || isTyping || !auth.currentUser}
                  className="bg-panel hover:bg-slate-800 text-brand font-black py-4 px-10 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl disabled:opacity-30 disabled:grayscale transform active:scale-95 flex items-center gap-3 group/btn border border-brand/20"
               >
                 <span>{!auth.currentUser ? "LOCKED" : t.transmit}</span>
                 <Send className={`w-3.5 h-3.5 transition-transform ${isTyping ? 'animate-ping text-brand' : 'group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1'}`} />
               </button>
            </div>
            
            <div className="mt-4 flex items-center justify-between px-6 opacity-40">
               <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                     <div className="w-1 h-1 bg-brand rounded-full animate-pulse" />
                     <div className="w-1 h-1 bg-brand rounded-full animate-pulse [animation-delay:0.2s]" />
                     <div className="w-1 h-1 bg-brand rounded-full animate-pulse [animation-delay:0.4s]" />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em]">Neural Link Stable</span>
               </div>
               <span className="text-[9px] font-mono tracking-tighter">SECURE CHANNEL v3.11</span>
            </div>
          </form>
        </div>
      </div>

      {/* Right Sidebar - Info */}
      <aside className="hidden lg:flex w-80 bg-slate-50 border-l border-slate-200 p-6 flex-col gap-6 overflow-y-auto">
          <section>
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Agent Quick Tools</h3>
               <button onClick={() => setShowCurrency(!showCurrency)} className="p-1.5 bg-white border border-slate-200 rounded-lg text-brand hover:bg-brand hover:text-panel transition-all">
                  <Globe2 className="w-4 h-4" />
               </button>
             </div>
             
             <AnimatePresence>
               {showCurrency && (
                 <motion.div 
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: 'auto', opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                   className="mb-4 overflow-hidden"
                 >
                   <div className="p-4 bg-panel text-white rounded-2xl shadow-lg border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-black uppercase tracking-widest text-brand">Operations FX</label>
                        <div className="flex items-center gap-1">
                          <span className="text-[8px] font-bold px-1.5 py-0.5 bg-slate-800 rounded">{conversion.from}</span>
                          <ArrowRightLeft className="w-2 h-2 text-slate-500" />
                          <span className="text-[8px] font-bold px-1.5 py-0.5 bg-brand text-panel rounded">{conversion.to}</span>
                        </div>
                      </div>
                      <div>
                         <input 
                           type="number"
                           value={conversion.amount}
                           onChange={(e) => setConversion({...conversion, amount: e.target.value})}
                           className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-brand"
                         />
                      </div>
                      <div className="flex items-center justify-between border-t border-white/5 pt-3">
                         <div className="flex-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Result</p>
                            <p className="text-xl font-black text-brand">{calculateConversion()} {conversion.to}</p>
                         </div>
                      </div>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>

             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">{t.contextualIntel}</h3>
             <div className="space-y-3">
                <InfoCard icon="✈️" title="Flight Status" status="On Time" desc="BKK arrivals monitored in real-time." />
                <InfoCard icon="🚔" title="Scam Alert" status="High Risk" desc="Watch for 'closed palace' scams in BKK." />
                <InfoCard icon="⚖️" title="Legal Intel" status="Required" desc="Carry passport copy at all times." />
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

      <AnimatePresence>
        {deletingId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-panel/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-100"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-serif text-center mb-2">Initialize Purge?</h3>
              <p className="text-slate-500 text-sm text-center mb-8 pr-2">
                This will permanently erase the neural history and all associated visual intelligence. This action is irreversible.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeletingId(null)}
                  className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
                >
                  Abort
                </button>
                <button 
                  onClick={() => deletingId && handleDeleteConversation(deletingId)}
                  className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                >
                  Confirm Purge
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <CommandPalette 
        isOpen={isPaletteOpen} 
        onClose={() => setIsPaletteOpen(false)}
        onAction={handleCommandAction}
      />
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
