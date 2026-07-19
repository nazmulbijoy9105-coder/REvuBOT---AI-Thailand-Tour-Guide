import React from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  signInAnonymously
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Landmark, Chrome, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await syncUser(result.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const syncUser = async (user: any) => {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        role: 'user',
        preferredLanguage: 'en',
        createdAt: new Date().toISOString()
      });
    }
  };

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="luxury-card max-w-md w-full p-12 text-center"
      >
        <div className="flex justify-center mb-6">
          <Landmark className="w-12 h-12 text-gold" />
        </div>
        <h1 className="text-4xl font-serif mb-2 tracking-tight text-ink">Welcome to REvuBOT</h1>
        <p className="text-ink/60 mb-10 font-light italic">Your gateway to authentic Thailand</p>
        
        {error && (
          <div className="bg-red-50 text-red-600 text-xs p-3 rounded-lg mb-6 text-left">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <button 
            onClick={handleGoogleLogin} 
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 border border-ink/10 rounded-full hover:bg-paper transition-all font-medium text-sm"
          >
            <Chrome className="w-4 h-4" />
            Continue with Google
          </button>
          
          <div className="flex items-center gap-4 my-2">
            <hr className="flex-1 border-ink/5" />
            <span className="text-[10px] uppercase tracking-widest text-ink/30">Or</span>
            <hr className="flex-1 border-ink/5" />
          </div>

          <p className="text-[10px] text-ink/40 uppercase tracking-widest leading-relaxed">
            By continuing, you agree to REvuBOT's <br />
            Terms of Service & Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  );
}
