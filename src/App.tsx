import React from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate,
  useLocation
} from 'react-router-dom';
import { onAuthStateChanged, User, signInAnonymously } from 'firebase/auth';
import { auth } from './lib/firebase';
import { Shield, AlertCircle } from 'lucide-react';

// Pages
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Admin from './pages/Admin';
import FAQ from './pages/FAQ';
import Budget from './pages/Budget';
import Planner from './pages/Planner';
import Destinations from './pages/Destinations';

export default function App() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [authError, setAuthError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        try {
          await signInAnonymously(auth);
        } catch (err: any) {
          console.error("Anonymous auth failed:", err);
          if (err.code === 'auth/admin-restricted-operation') {
            setAuthError("CRITICAL: Anonymous Authentication is disabled in your Firebase Project. ACTION REQUIRED: Please go to the Firebase Console -> Authentication -> Sign-in method and click 'Enable' for the 'Anonymous' provider.");
          } else {
            setAuthError(err.message || "Authentication system offline.");
          }
          setLoading(false);
        }
      } else {
        setUser(u);
        setAuthError(null);
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F5F2ED]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
          <div className="animate-pulse text-[#1A1A1A] font-serif italic text-lg">Initializing REvuBOT Neural Link...</div>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-panel p-6">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-2xl border border-red-100">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-ink text-center mb-4">Neural link Failure</h2>
          <p className="text-slate-600 text-center mb-8 leading-relaxed">
            {authError}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-brand text-panel font-bold rounded-xl hover:bg-brand-dark transition-all shadow-lg"
          >
            Retry Neural Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout user={user} />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/admin" element={user && !user.isAnonymous && user.email === 'admin@revubot.com' ? <Admin /> : <Navigate to="/chat" />} />
        </Route>
        <Route 
          path="/login" 
          element={!user || user.isAnonymous ? <Login /> : <Navigate to="/chat" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}
