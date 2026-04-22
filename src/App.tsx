import React from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate,
  useLocation
} from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';

// Pages
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Admin from './pages/Admin';
import FAQ from './pages/FAQ';

export default function App() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(loading => false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F5F2ED]">
        <div className="animate-pulse text-[#1A1A1A] font-serif italic">Loading REvuBOT...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout user={user} />}>
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<FAQ />} />
          <Route 
            path="/chat" 
            element={user ? <Chat /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/chat/:id" 
            element={user ? <Chat /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/admin" 
            element={user ? <Admin /> : <Navigate to="/login" />} 
          />
        </Route>
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/chat" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}
