'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Plus,
  Search,
  Bot,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  AlertTriangle,
  Plane,
  Scale,
  CloudSun,
  Phone,
  Car,
  Receipt,
  Trash2,
  Globe,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Banknote,
  ArrowUpDown,
  Command,
  MessageSquare,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CommandPalette } from '@/components/command-palette';
import { FeedbackModal } from '@/components/feedback-modal';

// Types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface Session {
  id: string;
  title: string;
  travelMode: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
}

type TravelMode = 'solo' | 'couple' | 'family' | 'corporate' | 'business';
type Language = 'en' | 'th' | 'hi' | 'si' | 'bn';

const LEGACY_CHAT_ERROR = "I'm having trouble connecting right now. Please try again in a moment.";

function removeLegacyErrorMessages(messages: Message[]) {
  return messages.filter((message) => (
    message.role !== 'assistant' || !message.content.startsWith(LEGACY_CHAT_ERROR)
  ));
}

type AgentDebugPayload = {
  runId: string;
  hypothesisId: string;
  location: string;
  message: string;
  data: Record<string, unknown>;
};

function agentDebugLog(payload: AgentDebugPayload) {
  fetch('http://127.0.0.1:7692/ingest/546afc5a-ad75-410d-afea-f935f43c38f1', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '16a81d' }, body: JSON.stringify({ sessionId: '16a81d', ...payload, timestamp: Date.now() }) }).catch(() => {});
}

const TRAVEL_MODES: { value: TravelMode; label: string }[] = [
  { value: 'solo', label: 'SOLO' },
  { value: 'couple', label: 'COUPLE' },
  { value: 'family', label: 'FAMILY' },
  { value: 'corporate', label: 'CORPORATE' },
  { value: 'business', label: 'BUSINESS' },
];

const LANGUAGES: { value: Language; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'th', label: 'TH' },
  { value: 'hi', label: 'HI' },
  { value: 'si', label: 'SI' },
  { value: 'bn', label: 'BN' },
];

const QUICK_ACTIONS = [
  { emoji: '🥘', label: 'Local Food', prompt: 'Tell me about the best local street food in Thailand' },
  { emoji: '🚆', label: 'Transport Guide', prompt: 'How do I get around Thailand? Transportation guide' },
  { emoji: '🛕', label: 'Temples', prompt: 'What are the must-visit temples in Thailand?' },
  { emoji: '💱', label: 'Currency Calc', prompt: '/calc 100 USD to THB' },
];

const CURRENCIES = ['THB', 'USD', 'EUR', 'GBP', 'INR', 'BDT', 'LKR', 'SGD', 'AUD'];

// Localization
const LOCALIZATION: Record<string, Record<string, string>> = {
  en: {
    newSession: "New Session",
    recentLogs: "Recent Logs",
    language: "Interface Language",
    aiOnline: "AI Online",
    placeholder: "Ask anything or type /calc to convert currency...",
    welcomeTitle: "Ready for Thailand!",
    welcomeDesc: "Ask about destinations, food, hotels, visa rules, or type /calc for currency conversion.",
    quickTools: "Quick Tools",
    flightStatus: "Flight Status",
    scamAlert: "Scam Alert",
    legalIntel: "Legal Intel",
    weatherAlert: "Weather Alert",
    emergencyContacts: "Emergency Contacts",
    taxiApps: "Taxi / Grab Apps",
    vatRefund: "VAT Refund Info",
    feedback: "Feedback",
    commandPalette: "Command Palette",
    searchSessions: "Search sessions...",
    noSessions: "No sessions yet",
    searchTravelHistory: "Search Travel History",
    currencyIntelligence: "Currency Intelligence",
    switchLanguage: "Switch Language",
    feedbackTitle: "Send Feedback",
    feedbackBug: "Bug",
    feedbackSuggestion: "Suggestion",
    feedbackGeneral: "General",
    feedbackPlaceholder: "Tell us what you think...",
    feedbackSubmit: "Submit Feedback",
    feedbackSuccess: "Thank you for your feedback!",
    commandSearch: "Type a command...",
    currencyFrom: "From",
    currencyTo: "To",
    currencyConvert: "Convert",
    currencyDisclaimer: "Approximate rates. Check SuperRich for real-time.",
    listening: "Listening...",
  },
  th: {
    newSession: "เริ่มการสนทนาใหม่",
    recentLogs: "ประวัติการสนทนา",
    language: "ภาษาของอินเทอร์เฟซ",
    aiOnline: "AI ออนไลน์",
    placeholder: "สอบถามเกี่ยวกับโรงแรม การเดินทาง หรือวัฒนธรรมไทย...",
    welcomeTitle: "พร้อมสำหรับประเทศไทย!",
    welcomeDesc: "สอบถามเกี่ยวกับสถานที่ท่องเที่ยว อาหาร โรงแรม กฎวีซ่า หรือพิมพ์ /calc เพื่อแปลงสกุลเงิน",
    quickTools: "เครื่องมือด่วน",
    flightStatus: "สถานะเที่ยวบิน",
    scamAlert: "เตือนการหลอกลวง",
    legalIntel: "ข้อมูลกฎหมาย",
    weatherAlert: "เตือนสภาพอากาศ",
    emergencyContacts: "เบอร์ฉุกเฉิน",
    taxiApps: "แอปแท็กซี่",
    vatRefund: "ข้อมูลคืนภาษี",
    feedback: "ข้อเสนอแนะ",
    commandPalette: "แผงคำสั่ง",
    searchSessions: "ค้นหาการสนทนา...",
    noSessions: "ยังไม่มีการสนทนา",
    searchTravelHistory: "ค้นหาประวัติการเดินทาง",
    currencyIntelligence: "แปลงสกุลเงิน",
    switchLanguage: "เปลี่ยนภาษา",
    feedbackTitle: "ส่งข้อเสนอแนะ",
    feedbackBug: "ข้อผิดพลาด",
    feedbackSuggestion: "ข้อเสนอ",
    feedbackGeneral: "ทั่วไป",
    feedbackPlaceholder: "บอกเราว่าคุณคิดอย่างไร...",
    feedbackSubmit: "ส่งข้อเสนอแนะ",
    feedbackSuccess: "ขอบคุณสำหรับข้อเสนอแนะ!",
    commandSearch: "พิมพ์คำสั่ง...",
    currencyFrom: "จาก",
    currencyTo: "ไป",
    currencyConvert: "แปลง",
    currencyDisclaimer: "อัตราโดยประมาณ ตรวจสอบ SuperRich สำหรับอัตราจริง",
    listening: "กำลังฟัง...",
  },
  hi: {
    newSession: "नया सत्र",
    recentLogs: "हाल के लॉग",
    language: "इंटरफ़ेस भाषा",
    aiOnline: "AI ऑनलाइन",
    placeholder: "होटल, परिवहन या थाई संस्कृति के बारे में पूछें...",
    welcomeTitle: "थाईलैंड के लिए तैयार!",
    welcomeDesc: "गंतव्य, भोजन, होटल, वीज़ा नियमों के बारे में पूछें या /calc टाइप करें",
    quickTools: "त्वरित उपकरण",
    flightStatus: "उड़ान स्थिति",
    scamAlert: "घोटाला अलर्ट",
    legalIntel: "कानूनी जानकारी",
    weatherAlert: "मौसम अलर्ट",
    emergencyContacts: "आपातकालीन संपर्क",
    taxiApps: "टैक्सी ऐप्स",
    vatRefund: "वैट रिफंड",
    feedback: "प्रतिक्रिया",
    commandPalette: "कमांड पैलेट",
    searchSessions: "सत्र खोजें...",
    noSessions: "अभी तक कोई सत्र नहीं",
    searchTravelHistory: "यात्रा इतिहास खोजें",
    currencyIntelligence: "मुद्रा बुद्धिमत्ता",
    switchLanguage: "भाषा बदलें",
    feedbackTitle: "प्रतिक्रिया भेजें",
    feedbackBug: "बग",
    feedbackSuggestion: "सुझाव",
    feedbackGeneral: "सामान्य",
    feedbackPlaceholder: "बताएं आपका क्या विचार है...",
    feedbackSubmit: "प्रतिक्रिया भेजें",
    feedbackSuccess: "आपकी प्रतिक्रिया के लिए धन्यवाद!",
    commandSearch: "कमांड टाइप करें...",
    currencyFrom: "से",
    currencyTo: "को",
    currencyConvert: "बदलें",
    currencyDisclaimer: "अनुमानित दरें। वास्तविक दरों के लिए SuperRich जांचें।",
    listening: "सुन रहा है...",
  },
  si: {
    newSession: "නව සැසිය",
    recentLogs: "මෑත ලොග්",
    language: "අතුරු මුහුණත් භාෂාව",
    aiOnline: "AI මාර්ගගතයි",
    placeholder: "හෝටල්, ප්‍රවාහන හෝ තායි සංස්කෘතිය ගැන විමසන්න...",
    welcomeTitle: "තායිලන්තයට සූදානම්!",
    welcomeDesc: "ගමනාන්තර, ආහාර, හෝටල්, වීසා නීති ගැන විමසන්න",
    quickTools: "ඉක්මන් මෙවලම්",
    flightStatus: "ගුවන් තත්ත්වය",
    scamAlert: "වංචා අනතුරු ඇඟවීම",
    legalIntel: "නීතිමය බුද්ධිය",
    weatherAlert: "කාලගුණ අනතුරු ඇඟවීම",
    emergencyContacts: "හදිසි සබඳතා",
    taxiApps: "ටැක්සි යෙදුම්",
    vatRefund: "වැට් ආපසු",
    feedback: "ප්‍රතිචාර",
    commandPalette: "විධාන පුවරුව",
    searchSessions: "සැසි සොයන්න...",
    noSessions: "තවම සැසි නැත",
    searchTravelHistory: "සංචාරක ඉතිහාසය සොයන්න",
    currencyIntelligence: "මුදල් බුද්ධිය",
    switchLanguage: "භාෂාව මාරු කරන්න",
    feedbackTitle: "ප්‍රතිචාර යවන්න",
    feedbackBug: "දෝෂය",
    feedbackSuggestion: "යෝජනාව",
    feedbackGeneral: "සාමාන්‍ය",
    feedbackPlaceholder: "ඔබේ අදහස පවසන්න...",
    feedbackSubmit: "ප්‍රතිචාර යවන්න",
    feedbackSuccess: "ඔබේ ප්‍රතිචාරයට ස්තූතියි!",
    commandSearch: "විධානයක් ටයිප් කරන්න...",
    currencyFrom: "සිට",
    currencyTo: "වෙත",
    currencyConvert: "පරිවර්තනය",
    currencyDisclaimer: "ආසන්න අනුපාත. නැවුම් අනුපාත සඳහා SuperRich පරීක්ෂා කරන්න.",
    listening: "සවන් දෙමින්...",
  },
  bn: {
    newSession: "নতুন সেশন",
    recentLogs: "সাম্প্রতিক লগ",
    language: "ইন্টারফেস ভাষা",
    aiOnline: "AI অনলাইন",
    placeholder: "হোটেল, পরিবহন বা থাই সংস্কৃতি সম্পর্কে জিজ্ঞাসা করুন...",
    welcomeTitle: "থাইল্যান্ডের জন্য প্রস্তুত!",
    welcomeDesc: "গন্তব্য, খাবার, হোটেল, ভিসা নিয়ম সম্পর্কে জিজ্ঞাসা করুন বা /calc টাইপ করুন",
    quickTools: "দ্রুত সরঞ্জাম",
    flightStatus: "ফ্লাইট স্ট্যাটাস",
    scamAlert: "স্ক্যাম সতর্কতা",
    legalIntel: "আইনি তথ্য",
    weatherAlert: "আবহাওয়া সতর্কতা",
    emergencyContacts: "জরুরি যোগাযোগ",
    taxiApps: "ট্যাক্সি অ্যাপস",
    vatRefund: "ভ্যাট রিফান্ড",
    feedback: "প্রতিক্রিয়া",
    commandPalette: "কমান্ড প্যালেট",
    searchSessions: "সেশন খুঁজুন...",
    noSessions: "এখনও কোনো সেশন নেই",
    searchTravelHistory: "ভ্রমণ ইতিহাস খুঁজুন",
    currencyIntelligence: "মুদ্রা বুদ্ধিমত্তা",
    switchLanguage: "ভাষা পরিবর্তন",
    feedbackTitle: "প্রতিক্রিয়া পাঠান",
    feedbackBug: "বাগ",
    feedbackSuggestion: "প্রস্তাব",
    feedbackGeneral: "সাধারণ",
    feedbackPlaceholder: "আপনার মতামত জানান...",
    feedbackSubmit: "প্রতিক্রিয়া জমা দিন",
    feedbackSuccess: "আপনার প্রতিক্রিয়ার জন্য ধন্যবাদ!",
    commandSearch: "কমান্ড টাইপ করুন...",
    currencyFrom: "থেকে",
    currencyTo: "এ",
    currencyConvert: "রূপান্তর",
    currencyDisclaimer: "আনুমানিক হার। রিয়েল-টাইম হারের জন্য SuperRich চেক করুন।",
    listening: "শুনছে...",
  },
};

// Language-to-Speech lang code mapping
const SPEECH_LANG_MAP: Record<string, string> = {
  en: 'en-US',
  th: 'th-TH',
  hi: 'hi-IN',
  si: 'si-LK',
  bn: 'bn-BD',
};

// Language-to-SpeechRecognition lang code mapping
const RECOGNITION_LANG_MAP: Record<string, string> = {
  en: 'en-US',
  th: 'th-TH',
  hi: 'hi-IN',
  si: 'si-LK',
  bn: 'bn-BD',
};

export function ChatInterface() {
  // State
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [travelMode, setTravelMode] = useState<TravelMode>('solo');
  const [language, setLanguage] = useState<Language>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  // New feature state
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [currencyFrom, setCurrencyFrom] = useState('USD');
  const [currencyTo, setCurrencyTo] = useState('THB');
  const [currencyAmount, setCurrencyAmount] = useState('100');
  const [currencyResult, setCurrencyResult] = useState<string | null>(null);
  const [currencyLoading, setCurrencyLoading] = useState(false);
  const [hoveredMsgId, setHoveredMsgId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Localization helper
  const t = LOCALIZATION[language] || LOCALIZATION.en;
  const visibleMessages = removeLegacyErrorMessages(messages);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Load sessions
  useEffect(() => {
    loadSessions();
  }, []);

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const loadSessions = async () => {
    try {
      const res = await fetch('/api/sessions');
      const data = await res.json();
      // Safety: ensure data is always an array
      setSessions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load sessions:', err);
      setSessions([]);
    }
  };

  const createSession = async () => {
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Chat', travelMode, language }),
      });
      const session = await res.json();
      setSessions((prev) => [session, ...prev]);
      setCurrentSession(session);
      setMessages([]);
      setStreamingContent('');
      return session;
    } catch (err) {
      console.error('Failed to create session:', err);
      return null;
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      await fetch('/api/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      if (currentSession?.id === sessionId) {
        setCurrentSession(null);
        setMessages([]);
        setStreamingContent('');
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  const loadSessionMessages = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/sessions/${sessionId}`);
      const session = await res.json();
      if (session && !session.error) {
        setCurrentSession(session);
        setMessages(Array.isArray(session.messages) ? removeLegacyErrorMessages(session.messages) : []);
      }
      setStreamingContent('');
    } catch (err) {
      console.error('Failed to load session:', err);
    }
  };

  // Auto-resize textarea - grows with content, no scrolling needed
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const target = e.target;
    target.style.height = 'auto';
    const newHeight = Math.min(target.scrollHeight, 200);
    target.style.height = newHeight + 'px';
    target.style.overflowY = target.scrollHeight > 200 ? 'auto' : 'hidden';
  };

  // Reset textarea height after sending
  const resetTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.overflowY = 'hidden';
    }
  };

  // Send message with streaming
  const sendMessage = useCallback(async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    let session = currentSession;
    if (!session) {
      session = await createSession();
      if (!session) return;
    }

    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsStreaming(true);
    setStreamingContent('');
    resetTextarea();

    try {
      // #region agent log
      agentDebugLog({
        runId: 'initial',
        hypothesisId: 'A',
        location: 'src/components/chat-interface.tsx:sendMessage:before-fetch',
        message: 'Client sending chat request',
        data: {
          messageLength: text.length,
          hasSession: Boolean(session?.id),
          travelMode,
        },
      });
      // #endregion

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          sessionId: session!.id,
          travelMode,
        }),
      });

      // #region agent log
      agentDebugLog({
        runId: 'initial',
        hypothesisId: 'A,E',
        location: 'src/components/chat-interface.tsx:sendMessage:after-fetch',
        message: 'Client received chat response headers',
        data: {
          ok: res.ok,
          status: res.status,
          hasBody: Boolean(res.body),
          contentType: res.headers.get('content-type'),
        },
      });
      // #endregion

      if (!res.ok) throw new Error('Chat request failed');

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let fullText = '';
      let chunkCount = 0;
      let parseErrorCount = 0;
      let streamBuffer = '';
      let assistantMessageAdded = false;

      const processStreamLine = (line: string) => {
        if (!line.startsWith('data: ')) return;

        try {
          const data = JSON.parse(line.slice(6));

          if (data.done) {
            const assistantMessage: Message = {
              id: `msg-${Date.now()}`,
              role: 'assistant',
              content: data.fullResponse || fullText,
              createdAt: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, assistantMessage]);
            assistantMessageAdded = true;
            setStreamingContent('');
            setIsStreaming(false);
          } else if (data.content) {
            fullText += (data.isFirst ? '' : ' ') + data.content;
            setStreamingContent(fullText);
          }
        } catch {
          parseErrorCount += 1;
          // Ignore malformed SSE lines but keep the stream alive.
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        streamBuffer += decoder.decode(value, { stream: true });
        chunkCount += 1;
        const lines = streamBuffer.split('\n');
        streamBuffer = lines.pop() || '';
        lines.forEach(processStreamLine);
      }

      const remaining = streamBuffer + decoder.decode();
      if (remaining.trim()) {
        remaining.split('\n').forEach(processStreamLine);
      }

      if (!assistantMessageAdded && fullText.trim()) {
        const assistantMessage: Message = {
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: fullText,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setStreamingContent('');
        setIsStreaming(false);
      }

      // #region agent log
      agentDebugLog({
        runId: 'initial',
        hypothesisId: 'E',
        location: 'src/components/chat-interface.tsx:sendMessage:stream-complete',
        message: 'Client stream consumed',
        data: {
          chunkCount,
          parseErrorCount,
          fullTextLength: fullText.length,
        },
      });
      // #endregion

      loadSessions();
    } catch (err) {
      console.error('Send message error:', err);
      // #region agent log
      agentDebugLog({
        runId: 'initial',
        hypothesisId: 'A,E',
        location: 'src/components/chat-interface.tsx:sendMessage:error',
        message: 'Client chat request failed',
        data: {
          errorMessage: err instanceof Error ? err.message : String(err),
        },
      });
      // #endregion
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again in a moment. 🙏",
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setStreamingContent('');
      setIsStreaming(false);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, currentSession, travelMode, language]);

  // Handle keyboard
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ==================== VOICE INPUT ====================
  const toggleVoiceInput = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported');
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = RECOGNITION_LANG_MAP[language] || 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? prev + ' ' + transcript : transcript));
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [isListening, language]);

  // ==================== TEXT-TO-SPEECH ====================
  const cleanMarkdown = (text: string): string => {
    return text
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/#+\s/g, '')
      .replace(/[-*]\s/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[~>]/g, '')
      .replace(/\n{2,}/g, '. ')
      .replace(/\n/g, ' ')
      .trim();
  };

  const toggleTTS = useCallback((msgId: string, content: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // If currently speaking this message, stop
    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanMarkdown(content));
    utterance.lang = SPEECH_LANG_MAP[language] || 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onend = () => {
      setSpeakingMessageId(null);
    };
    utterance.onerror = () => {
      setSpeakingMessageId(null);
    };

    synthRef.current = utterance;
    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  }, [speakingMessageId, language]);

  // ==================== CURRENCY CONVERSION ====================
  const convertCurrency = async () => {
    if (!currencyAmount) return;
    setCurrencyLoading(true);
    try {
      const res = await fetch(`/api/currency?amount=${currencyAmount}&from=${currencyFrom}&to=${currencyTo}`);
      const data = await res.json();
      if (data.result !== undefined) {
        setCurrencyResult(`${data.amount} ${data.from} = ${data.result.toLocaleString()} ${data.to} (Rate: ${data.rate})`);
      }
    } catch {
      setCurrencyResult('Conversion failed. Please try again.');
    } finally {
      setCurrencyLoading(false);
    }
  };

  const swapCurrencies = () => {
    const temp = currencyFrom;
    setCurrencyFrom(currencyTo);
    setCurrencyTo(temp);
    setCurrencyResult(null);
  };

  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Command palette action handlers
  const handleSearchHistory = () => {
    setShowLeft(true);
    setTimeout(() => {
      const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
      searchInput?.focus();
    }, 300);
  };

  const handleSwitchLanguage = () => {
    const currentIndex = LANGUAGES.findIndex((l) => l.value === language);
    const nextIndex = (currentIndex + 1) % LANGUAGES.length;
    setLanguage(LANGUAGES[nextIndex].value);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-[radial-gradient(circle_at_top_left,#fef3c7_0,#f8fafc_28%,#e2e8f0_100%)] relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.75),rgba(15,23,42,0.04))]" />
      {/* Left Sidebar */}
      <div
        className={`${
          showLeft ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 absolute md:relative z-30 h-full w-72 bg-white/88 backdrop-blur-xl border-r border-white/70 shadow-2xl shadow-slate-900/5 flex flex-col transition-transform duration-200`}
      >
        {/* Sidebar Header */}
        <div className="p-3 border-b border-slate-100">
          <Button
            onClick={createSession}
            className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-amber-700 hover:from-slate-900 hover:to-amber-600 text-white font-semibold text-xs h-9 shadow-lg shadow-amber-900/15"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            {t.newSession}
          </Button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <Input
              data-search-input
              placeholder={t.searchSessions}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs bg-slate-50 border-slate-200"
            />
          </div>
        </div>

        {/* Language Selector */}
        <div className="p-3 border-b border-slate-100">
          <div className="flex items-center gap-1 mb-1.5">
            <Globe className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] text-slate-400 font-medium uppercase">{t.language}</span>
          </div>
          <div className="flex gap-1">
            {LANGUAGES.map((lang) => (
              <Button
                key={lang.value}
                variant={language === lang.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLanguage(lang.value)}
                className={`h-7 text-[10px] font-bold px-2 ${
                  language === lang.value
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'text-slate-500'
                }`}
              >
                {lang.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredSessions.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-8">{t.noSessions}</p>
          )}
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                currentSession?.id === session.id
                  ? 'bg-amber-50 border border-amber-200'
                  : 'hover:bg-slate-50'
              }`}
              onClick={() => loadSessionMessages(session.id)}
            >
              <Bot className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-700 truncate">{session.title}</p>
                <p className="text-[10px] text-slate-400">{session.travelMode}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
                aria-label={`Delete session: ${session.title}`}
              >
                <Trash2 className="w-3 h-3 text-slate-400" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Center Chat Area */}
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-white/78 backdrop-blur-xl border-b border-white/70 shadow-sm">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 md:hidden"
              onClick={() => setShowLeft(!showLeft)}
              aria-label="Toggle left sidebar"
            >
              {showLeft ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </Button>
            <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-700">{t.aiOnline}</span>
              <span className="hidden sm:inline text-[10px] font-semibold text-emerald-600/80">Tourist ops ready</span>
            </div>
          </div>

          {/* Travel Mode */}
          <div className="hidden sm:flex items-center gap-1">
            {TRAVEL_MODES.map((mode) => (
              <Button
                key={mode.value}
                variant={travelMode === mode.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTravelMode(mode.value)}
                className={`h-7 text-[10px] font-bold px-2 ${
                  travelMode === mode.value
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : 'text-slate-500 border-slate-200'
                }`}
              >
                {mode.label}
              </Button>
            ))}
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-1">
            <Button
              onClick={createSession}
              size="sm"
              className="hidden sm:flex h-8 rounded-full bg-slate-950 px-3 text-[11px] font-bold text-white hover:bg-slate-800"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New Chat
            </Button>
            {/* Currency Widget Toggle */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setShowCurrency(!showCurrency)}
                aria-label={t.currencyIntelligence}
              >
                <Banknote className="w-4 h-4 text-amber-500" />
              </Button>

              {/* Currency Floating Panel */}
              <AnimatePresence>
                {showCurrency && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-9 z-40 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-4"
                  >
                    <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                      <Banknote className="w-3.5 h-3.5 text-amber-500" />
                      {t.currencyIntelligence}
                    </h4>

                    <div className="space-y-3">
                      {/* Amount + From */}
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={currencyAmount}
                          onChange={(e) => { setCurrencyAmount(e.target.value); setCurrencyResult(null); }}
                          className="h-8 text-xs flex-1"
                          placeholder="Amount"
                        />
                        <select
                          value={currencyFrom}
                          onChange={(e) => { setCurrencyFrom(e.target.value); setCurrencyResult(null); }}
                          className="h-8 px-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        >
                          {CURRENCIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      {/* Swap Button */}
                      <div className="flex justify-center">
                        <button
                          onClick={swapCurrencies}
                          className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-colors"
                          aria-label="Swap currencies"
                        >
                          <ArrowUpDown className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Result + To */}
                      <div className="flex gap-2">
                        <div className="flex-1 h-8 px-3 flex items-center text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 font-medium overflow-hidden">
                          {currencyResult ? currencyResult.split('=')[1]?.split('(')[0]?.trim() || '—' : '—'}
                        </div>
                        <select
                          value={currencyTo}
                          onChange={(e) => { setCurrencyTo(e.target.value); setCurrencyResult(null); }}
                          className="h-8 px-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                        >
                          {CURRENCIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      {/* Convert Button */}
                      <Button
                        onClick={convertCurrency}
                        disabled={currencyLoading || !currencyAmount}
                        className="w-full h-8 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold"
                      >
                        {currencyLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : t.currencyConvert}
                      </Button>

                      {currencyResult && (
                        <p className="text-[10px] text-slate-400 text-center">{t.currencyDisclaimer}</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Command Palette Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setShowCommandPalette(true)}
              aria-label={t.commandPalette}
            >
              <Command className="w-4 h-4 text-slate-500" />
            </Button>

            {/* Feedback Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setShowFeedback(true)}
              aria-label={t.feedback}
            >
              <MessageSquare className="w-4 h-4 text-slate-500" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 lg:hidden"
              onClick={() => setShowRight(!showRight)}
              aria-label="Toggle right sidebar"
            >
              {showRight ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {visibleMessages.length === 0 && !isStreaming && (
            <div className="flex h-full items-center justify-center text-center">
              <div className="w-full max-w-2xl rounded-[2rem] border border-white/80 bg-white/82 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-600 shadow-xl shadow-amber-900/20">
                  <Bot className="h-10 w-10 text-amber-200" />
                </div>
                <div className="mb-3 inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-amber-700">
                  Premium Thailand Intelligence
                </div>
                <h3 className="mb-2 text-2xl font-black tracking-tight text-slate-950">{t.welcomeTitle}</h3>
                <p className="mx-auto mb-7 max-w-md text-sm leading-relaxed text-slate-500">
                  {t.welcomeDesc}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {QUICK_ACTIONS.map((action) => (
                    <Button
                      key={action.label}
                      variant="outline"
                      size="sm"
                      onClick={() => sendMessage(action.prompt)}
                      className="rounded-full border-slate-200 bg-white/80 px-4 text-xs font-bold shadow-sm hover:border-amber-300 hover:bg-amber-50"
                    >
                      {action.emoji} {action.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {visibleMessages.map((msg) => (
            <div
              key={msg.id}
              onMouseEnter={() => setHoveredMsgId(msg.id)}
              onMouseLeave={() => setHoveredMsgId(null)}
              className={`flex items-start gap-3 group ${
                msg.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-amber-400" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 relative ${
                  msg.role === 'user'
                    ? 'bg-amber-500 text-white'
                    : 'bg-slate-900 text-slate-100'
                }`}
              >
                <div className="text-sm leading-relaxed prose-sm">
                  {msg.role === 'assistant' ? (
                    <div className="prose-invert prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-h3:text-base prose-h4:text-sm max-w-none [&_p]:text-slate-100 [&_li]:text-slate-100 [&_strong]:text-amber-400">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>

                {/* TTS Button - show on hover for assistant messages */}
                {msg.role === 'assistant' && (
                  <AnimatePresence>
                    {hoveredMsgId === msg.id && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.15 }}
                        onClick={() => toggleTTS(msg.id, msg.content)}
                        className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-lg transition-colors z-10"
                        aria-label={speakingMessageId === msg.id ? 'Stop speech' : 'Play speech'}
                      >
                        {speakingMessageId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </motion.button>
                    )}
                  </AnimatePresence>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-amber-700" />
                </div>
              )}
            </div>
          ))}

          {/* Streaming message */}
          {isStreaming && streamingContent && (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-amber-400" />
              </div>
              <div className="max-w-[80%] rounded-2xl px-4 py-2.5 bg-slate-900 text-slate-100">
                <div className="text-sm leading-relaxed prose-invert prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 max-w-none">
                  <ReactMarkdown>{streamingContent}</ReactMarkdown>
                  <span className="inline-block w-2 h-4 bg-amber-400 ml-0.5 animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && !isStreaming && (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-amber-400" />
              </div>
              <div className="bg-slate-900 rounded-2xl px-4 py-3">
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions (when messages exist) */}
        {visibleMessages.length > 0 && !isLoading && (
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {QUICK_ACTIONS.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage(action.prompt)}
                  className="text-[10px] font-medium border-slate-200 hover:border-amber-300 hover:bg-amber-50 flex-shrink-0 h-7 px-2"
                >
                  {action.emoji} {action.label}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-white/70 bg-white/72 p-3 shadow-[0_-12px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-4xl items-end gap-2 rounded-2xl border border-white/80 bg-white/90 p-2 shadow-xl shadow-slate-900/8">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder={t.placeholder}
                rows={1}
                aria-label="Chat message input"
                className="w-full resize-none rounded-xl border border-transparent bg-slate-50/90 px-4 py-3 pr-10 text-sm shadow-inner shadow-slate-900/5 focus:border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 placeholder:text-slate-400 overflow-hidden"
                style={{ maxHeight: '200px' }}
              />

              {/* Voice Input Button */}
              <button
                onClick={toggleVoiceInput}
                className={`absolute right-2 bottom-2.5 w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-red-500 text-white animate-pulse'
                    : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
                }`}
                aria-label={isListening ? t.listening : 'Voice input'}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
            </div>
            <Button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="h-11 w-11 flex-shrink-0 rounded-xl bg-gradient-to-br from-slate-950 to-amber-600 text-white shadow-lg shadow-amber-900/20 hover:from-slate-900 hover:to-amber-500"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          {/* Voice listening indicator */}
          <AnimatePresence>
            {isListening && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-center gap-2 mt-2"
              >
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs text-red-500 font-medium">{t.listening}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Sidebar */}
      <div
        className={`${
          showRight ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 absolute lg:relative z-30 h-full w-72 bg-white/88 backdrop-blur-xl border-l border-white/70 shadow-2xl shadow-slate-900/5 flex flex-col transition-transform duration-200 right-0`}
      >
        <div className="p-3 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">{t.quickTools}</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {/* Flight Status */}
          <Card className="border-slate-200/60">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Plane className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-slate-700">{t.flightStatus}</span>
              </div>
              <p className="text-xs text-slate-500">BKK - On Time</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Suvarnabhumi Airport</p>
            </CardContent>
          </Card>

          {/* Scam Alert */}
          <Card className="border-red-200/60 bg-red-50/50">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span className="text-xs font-bold text-red-700">{t.scamAlert}</span>
              </div>
              <p className="text-xs text-red-600 font-medium">High Risk</p>
              <p className="text-[10px] text-red-500 mt-0.5">Watch for &apos;closed palace&apos; scams near Grand Palace</p>
            </CardContent>
          </Card>

          {/* Legal Intel */}
          <Card className="border-slate-200/60">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <Scale className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-bold text-slate-700">{t.legalIntel}</span>
              </div>
              <p className="text-xs text-slate-500">Carry passport copy at all times</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Vaping is illegal - 27,000+ THB fine</p>
            </CardContent>
          </Card>

          {/* Weather */}
          <Card className="border-slate-200/60">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <CloudSun className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold text-slate-700">{t.weatherAlert}</span>
              </div>
              <p className="text-xs text-slate-500">Hot Season: 35-40°C</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Stay hydrated, use sunscreen SPF50+</p>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="space-y-1.5">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Links</h4>
            <button className="flex items-center gap-2 w-full text-xs text-slate-600 hover:text-amber-600 transition-colors py-1">
              <Phone className="w-3.5 h-3.5" />
              {t.emergencyContacts}
            </button>
            <button className="flex items-center gap-2 w-full text-xs text-slate-600 hover:text-amber-600 transition-colors py-1">
              <Car className="w-3.5 h-3.5" />
              {t.taxiApps}
            </button>
            <button className="flex items-center gap-2 w-full text-xs text-slate-600 hover:text-amber-600 transition-colors py-1">
              <Receipt className="w-3.5 h-3.5" />
              {t.vatRefund}
            </button>
          </div>
        </div>
      </div>

      {/* Click away overlay for mobile sidebars */}
      {(showLeft || showRight) && (
        <div
          className="fixed inset-0 bg-black/20 z-20 md:hidden lg:hidden"
          onClick={() => {
            setShowLeft(false);
            setShowRight(false);
          }}
        />
      )}

      {/* Click away overlay for currency panel */}
      {showCurrency && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowCurrency(false)}
        />
      )}

      {/* Command Palette */}
      <CommandPalette
        open={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onNewSession={createSession}
        onSearchHistory={handleSearchHistory}
        onCurrency={() => setShowCurrency(true)}
        onSwitchLanguage={handleSwitchLanguage}
        onFeedback={() => setShowFeedback(true)}
        labels={{
          newSession: t.newSession,
          searchTravelHistory: t.searchTravelHistory,
          currencyIntelligence: t.currencyIntelligence,
          switchLanguage: t.switchLanguage,
          feedback: t.feedback,
          searchPlaceholder: t.commandSearch,
        }}
      />

      {/* Feedback Modal */}
      <FeedbackModal
        open={showFeedback}
        onClose={() => setShowFeedback(false)}
        labels={{
          title: t.feedbackTitle,
          bug: t.feedbackBug,
          suggestion: t.feedbackSuggestion,
          general: t.feedbackGeneral,
          placeholder: t.feedbackPlaceholder,
          submit: t.feedbackSubmit,
          success: t.feedbackSuccess,
        }}
      />
    </div>
  );
}
