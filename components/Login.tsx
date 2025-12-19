
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types.ts';
import { db, sanitizeForFirestore } from '../lib/firebase.ts';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<UserRole>('assigner');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [pricePerPage, setPricePerPage] = useState('10.00');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const requiredSuffix = role === 'assigner' ? '@assign' : '@writ';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanUsername = username.toLowerCase().trim();

    // 1. Basic validation
    if (!cleanUsername || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    // 2. Suffix enforcement
    if (!cleanUsername.endsWith(requiredSuffix)) {
      setError(`For ${role}s, username must end with ${requiredSuffix}`);
      setLoading(false);
      return;
    }

    try {
      const userRef = doc(db, 'users', cleanUsername);
      const userSnap = await getDoc(userRef);

      if (isRegistering) {
        // REGISTRATION FLOW
        if (userSnap.exists()) {
          setError(`Account "${cleanUsername}" already exists.`);
          setLoading(false);
          return;
        }

        if (!name) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        
        const price = parseFloat(pricePerPage);
        if (role === 'writer' && (isNaN(price) || price < 10)) {
          setError('Minimum price per page is ₹10');
          setLoading(false);
          return;
        }

        const newUser: UserProfile = {
          id: cleanUsername, 
          username: cleanUsername,
          name,
          role,
          rating: 5,
          completedTasks: 0,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUsername.split('@')[0]}`,
          password,
        };

        if (role === 'writer') {
          newUser.pricePerPage = price;
          newUser.earnings = 0;
          newUser.specialties = ['General'];
          newUser.bio = 'Student writer ready to help.';
          newUser.isBusy = false;
        }

        await setDoc(userRef, sanitizeForFirestore(newUser));
        onLogin(newUser);
      } else {
        // LOGIN FLOW
        if (!userSnap.exists()) {
          // Check if they used the wrong suffix for their role
          const otherSuffix = role === 'assigner' ? '@writ' : '@assign';
          if (cleanUsername.endsWith(otherSuffix)) {
             setError(`This is a ${role === 'assigner' ? 'Writer' : 'Assigner'} account. Please switch roles above.`);
          } else {
             setError('Account not found. Did you use the correct @suffix?');
          }
          setLoading(false);
          return;
        }

        const userData = userSnap.data() as UserProfile;
        
        if (userData.password !== password) {
          setError('Incorrect password. Please try again.');
          setLoading(false);
          return;
        }

        // Double check role mismatch (safety layer)
        if (userData.role !== role) {
          setError(`This account is registered as a ${userData.role}. Please select the correct role.`);
          setLoading(false);
          return;
        }

        onLogin(userData);
      }
    } catch (err) {
      console.error("Auth error:", err);
      setError('Connection error. Please check your internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-indigo-600 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white/95 backdrop-blur-xl w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 md:p-10 relative z-10 border border-white/20 my-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-200 mb-4">
            <i className="fas fa-graduation-cap text-3xl"></i>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">AcademiaMarket</h2>
          <p className="text-slate-500 mt-1 font-medium text-sm">
            {isRegistering ? 'Join the student community' : 'Welcome back, Scholar'}
          </p>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
          <button 
            type="button"
            onClick={() => { setRole('assigner'); setError(''); }} 
            className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${role === 'assigner' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
          >
            I NEED HELP
          </button>
          <button 
            type="button"
            onClick={() => { setRole('writer'); setError(''); }} 
            className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${role === 'writer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
          >
            I AM A WRITER
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isRegistering && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                type="text" 
                required
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
                placeholder="e.g. Rahul Sharma" 
              />
            </div>
          )}
          
          <div className="space-y-1">
            <div className="flex justify-between items-end mb-1 px-1">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Username</label>
               <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter ${role === 'assigner' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`}>
                 Must end with {requiredSuffix}
               </span>
            </div>
            <div className="relative">
              <input 
                type="text" 
                required
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-black text-sm pr-20" 
                placeholder={`student${requiredSuffix}`} 
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                 <i className={`fas ${username.toLowerCase().endsWith(requiredSuffix) ? 'fa-check-circle text-emerald-500' : 'fa-at text-slate-300'}`}></i>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              type="password" 
              required
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-medium text-sm" 
              placeholder="••••••••" 
            />
          </div>

          {isRegistering && role === 'writer' && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Base Price (₹ / Page)</label>
              <input 
                type="number" 
                min="10" 
                step="1" 
                value={pricePerPage} 
                onChange={(e) => setPricePerPage(e.target.value)} 
                className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none font-black text-indigo-600 text-sm" 
              />
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 animate-in fade-in slide-in-from-top-2">
              <p className="text-rose-500 text-[10px] font-bold text-center leading-tight">
                <i className="fas fa-exclamation-circle mr-1"></i> {error}
              </p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:transform-none ${role === 'assigner' ? 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700' : 'bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700'}`}
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin mr-2"></i>
            ) : null}
            {isRegistering ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400 font-medium">{isRegistering ? 'Already have an account?' : 'New to the platform?'}</p>
          <button 
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }} 
            className="text-indigo-600 font-black text-sm hover:underline mt-1"
          >
            {isRegistering ? 'Sign In' : 'Create an Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
