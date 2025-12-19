
import React, { useState } from 'react';
import { MOCK_USERS } from '../constants.ts';
import { UserProfile, UserRole } from '../types.ts';

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

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (!username || !name || !password) {
        setError('Please fill in all fields');
        return;
      }
      
      const price = parseFloat(pricePerPage);
      if (role === 'writer' && (isNaN(price) || price < 10)) {
        setError('Minimum price per page is ₹10');
        return;
      }

      const newUser: UserProfile = {
        id: `u${Date.now()}`,
        username: username.toLowerCase(),
        name,
        role,
        rating: 5.0,
        completedTasks: 0,
        avatar: `https://picsum.photos/seed/${username}/100`,
        password,
        pricePerPage: role === 'writer' ? price : undefined,
        earnings: role === 'writer' ? 0 : undefined,
        specialties: role === 'writer' ? ['General'] : undefined,
        bio: role === 'writer' ? 'New writer on the platform.' : undefined
      };
      
      onLogin(newUser);
    } else {
      const user = MOCK_USERS.find(u => u.username === username && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid username or password. Try alex_j or sarah_pro');
      }
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
          <p className="text-slate-500 mt-1 font-medium">
            {isRegistering ? 'Join the student community' : 'Welcome back, Scholar'}
          </p>
        </div>

        {isRegistering && (
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
            <button onClick={() => setRole('assigner')} className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${role === 'assigner' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>I NEED HELP</button>
            <button onClick={() => setRole('writer')} className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${role === 'writer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>I AM A WRITER</button>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {isRegistering && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-medium text-sm" placeholder="John Doe" />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-medium text-sm" placeholder="username" />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-medium text-sm" placeholder="••••••••" />
          </div>

          {isRegistering && role === 'writer' && (
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Base Price (₹ / Page)</label>
              <input type="number" min="10" step="1" value={pricePerPage} onChange={(e) => setPricePerPage(e.target.value)} className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-black text-indigo-600 text-sm" />
            </div>
          )}

          {error && <p className="text-rose-500 text-[10px] font-bold text-center bg-rose-50 p-2 rounded-lg">{error}</p>}

          <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all transform hover:-translate-y-1 active:translate-y-0">
            {isRegistering ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-400 font-medium">{isRegistering ? 'Already have an account?' : 'New to the platform?'}</p>
          <button onClick={() => setIsRegistering(!isRegistering)} className="text-indigo-600 font-black text-sm hover:underline mt-1">{isRegistering ? 'Sign In' : 'Create an Account'}</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
