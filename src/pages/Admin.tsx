import React from 'react';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Shield, Plus, Trash2, Edit, Save, X, Users, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Admin() {
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [users, setUsers] = React.useState<any[]>([]);
  const [faqs, setFaqs] = React.useState<any[]>([]);
  const [isAddingFaq, setIsAddingFaq] = React.useState(false);
  const [newFaq, setNewFaq] = React.useState({ question: '', answer: '', category: 'visa', language: 'en' });

  // Check role
  React.useEffect(() => {
    const checkRole = async () => {
      if (!auth.currentUser) return;
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const snap = await getDocs(collection(db, 'users')); 
      // For demo/simplicity in this turn, we'll fetch all and check. 
      // In prod, you'd check a specific path.
      const current = snap.docs.find(d => d.id === auth.currentUser?.uid);
      if (current?.data().role === 'admin') {
        setIsAdmin(true);
        fetchData();
      }
    };
    checkRole();
  }, []);

  const fetchData = async () => {
    const [uSnap, fSnap] = await Promise.all([
      getDocs(collection(db, 'users')),
      getDocs(collection(db, 'faqs'))
    ]);
    setUsers(uSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    setFaqs(fSnap.docs.map(d => ({ id: d.id, ...d.data() })));
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    await setDoc(doc(collection(db, 'faqs')), newFaq);
    setIsAddingFaq(false);
    setNewFaq({ question: '', answer: '', category: 'visa', language: 'en' });
    fetchData();
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      // 1. Update user document
      await updateDoc(doc(db, 'users', userId), { role: newRole });
      
      // 2. Sync admins collection
      if (newRole === 'admin') {
        await setDoc(doc(db, 'admins', userId), { 
          uid: userId, 
          addedAt: new Date().toISOString(),
          addedBy: auth.currentUser?.uid
        });
      } else {
        await deleteDoc(doc(db, 'admins', userId));
      }
      
      fetchData();
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Permission denied. You cannot modify roles.");
    }
  };

  const handleDeleteFaq = async (id: string) => {
    await deleteDoc(doc(db, 'faqs', id));
    fetchData();
  };

  if (!isAdmin) {
    return (
      <div className="h-screen flex items-center justify-center p-4 bg-paper text-center">
        <div className="max-w-md">
           <Shield className="w-12 h-12 text-red-400 mx-auto mb-6" />
           <h1 className="text-3xl font-serif mb-4">Restricted Access</h1>
           <p className="text-ink/60 font-light mb-8">This portal is reserved for REvuBOT curators. If you believe this is an error, please contact your supervisor.</p>
           <button className="btn-secondary" onClick={() => window.history.back()}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-12">
           <div>
             <h1 className="text-4xl font-serif tracking-tight">Curator Dashboard</h1>
             <p className="text-xs uppercase tracking-widest text-ink/40 mt-1">Manage global travel intelligence</p>
           </div>
           <div className="flex gap-4">
              <div className="luxury-card px-4 py-2 flex items-center gap-2">
                 <Users className="w-4 h-4 text-gold" />
                 <span className="text-sm font-medium">{users.length} Users</span>
              </div>
              <div className="luxury-card px-4 py-2 flex items-center gap-2">
                 <MessageSquare className="w-4 h-4 text-gold" />
                 <span className="text-sm font-medium">{faqs.length} FAQs</span>
              </div>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* User Management */}
          <section>
            <h2 className="text-2xl font-serif mb-6 flex items-center gap-2">
               <Users className="w-6 h-6 opacity-30" />
               Registered Tourists
            </h2>
            <div className="luxury-card overflow-hidden">
               <table className="w-full text-sm text-left">
                  <thead className="bg-ink/[0.02] text-[10px] uppercase tracking-widest font-bold border-b border-ink/5">
                     <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Joined</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/5">
                     {users.map(u => (
                        <tr key={u.id} className="hover:bg-ink/[0.01] group">
                           <td className="px-6 py-4 font-medium">{u.email}</td>
                           <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                 <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${u.role === 'admin' ? 'bg-gold/10 text-gold' : 'bg-ink/5 text-ink/50'}`}>
                                    {u.role}
                                 </span>
                                 {u.id !== auth.currentUser?.uid && (
                                    <button 
                                       onClick={() => handleToggleRole(u.id, u.role)}
                                       className="text-[9px] uppercase tracking-tighter font-black text-ink/20 hover:text-gold opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-gold/20 px-2 py-1 rounded"
                                    >
                                       Promote/Demote
                                    </button>
                                 )}
                              </div>
                           </td>
                           <td className="px-6 py-4 text-ink/40">{new Date(u.createdAt).toLocaleDateString()}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
          </section>

          {/* FAQ Management */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif flex items-center gap-2">
                 <Shield className="w-6 h-6 opacity-30" />
                 Knowledge Base
              </h2>
              <button 
                onClick={() => setIsAddingFaq(true)}
                className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold hover:text-ink transition-colors"
              >
                <Plus className="w-4 h-4" /> Add FAQ
              </button>
            </div>

            <div className="space-y-4">
               {isAddingFaq && (
                 <motion.form 
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   onSubmit={handleAddFaq} 
                   className="luxury-card p-6 border-gold/30 bg-gold/[0.02]"
                 >
                    <div className="grid grid-cols-2 gap-4 mb-4">
                       <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Category</label>
                          <select 
                            value={newFaq.category} 
                            onChange={e => setNewFaq({...newFaq, category: e.target.value})}
                            className="bg-white border border-ink/10 rounded-lg px-3 py-2 text-sm outline-none"
                          >
                             <option value="visa">Visa</option>
                             <option value="transport">Transport</option>
                             <option value="culture">Culture</option>
                             <option value="emergency">Emergency</option>
                          </select>
                       </div>
                       <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Language</label>
                          <select 
                            value={newFaq.language}
                            onChange={e => setNewFaq({...newFaq, language: e.target.value})}
                            className="bg-white border border-ink/10 rounded-lg px-3 py-2 text-sm outline-none"
                          >
                             <option value="en">English</option>
                             <option value="th">ไทย</option>
                             <option value="hi">हिन्दी</option>
                             <option value="si">සිංහල</option>
                          </select>
                       </div>
                    </div>
                    <input 
                      placeholder="Question" 
                      value={newFaq.question}
                      onChange={e => setNewFaq({...newFaq, question: e.target.value})}
                      className="w-full mb-4 bg-white border border-ink/10 rounded-lg px-4 py-2 text-sm outline-none"
                    />
                    <textarea 
                      placeholder="Answer" 
                      value={newFaq.answer}
                      onChange={e => setNewFaq({...newFaq, answer: e.target.value})}
                      rows={3}
                      className="w-full mb-6 bg-white border border-ink/10 rounded-lg px-4 py-2 text-sm outline-none resize-none"
                    />
                    <div className="flex justify-end gap-3">
                       <button type="button" onClick={() => setIsAddingFaq(false)} className="text-xs uppercase tracking-widest font-bold px-4">Cancel</button>
                       <button type="submit" className="btn-primary flex items-center gap-2">
                          <Save className="w-4 h-4" /> Save FAQ
                       </button>
                    </div>
                 </motion.form>
               )}

               {faqs.map(faq => (
                 <div key={faq.id} className="luxury-card p-6 flex justify-between items-start group">
                    <div>
                       <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] uppercase tracking-widest font-bold bg-ink/5 px-2 py-0.5 rounded">{faq.category}</span>
                          <span className="text-[10px] uppercase tracking-widest font-bold text-gold">{faq.language}</span>
                       </div>
                       <h4 className="font-serif text-lg mb-1">{faq.question}</h4>
                       <p className="text-xs text-ink/50 font-light line-clamp-2">{faq.answer}</p>
                    </div>
                    <button 
                       onClick={() => handleDeleteFaq(faq.id)}
                       className="p-2 text-ink/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                       <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
               ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
