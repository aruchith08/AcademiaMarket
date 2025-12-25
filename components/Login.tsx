
import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types.ts';
import { db, sanitizeForFirestore, auth } from '../lib/firebase.ts';
import { getRandomAvatar } from '../constants.ts';
import { TELANGANA_COLLEGES } from '../colleges.ts';
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { signInAnonymously } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import UserGuide from './UserGuide.tsx';

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [role, setRole] = useState<UserRole>('assigner');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [pincode, setPincode] = useState('');
  const [password, setPassword] = useState('');
  const [pricePerPage, setPricePerPage] = useState('10.00');
  const [isBargainable, setIsBargainable] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showUserGuide, setShowUserGuide] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const requiredSuffix = role === 'assigner' ? '@assign' : '@writ';

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const cleanUsername = username.toLowerCase().trim();

    if (!cleanUsername || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!cleanUsername.endsWith(requiredSuffix)) {
      setError(`For ${role}s, username must end with ${requiredSuffix}`);
      setLoading(false);
      return;
    }

    if (isRegistering) {
      if (!agreedToTerms) {
        setError('You must agree to the Academic Integrity Policy to continue.');
        setLoading(false);
        return;
      }
      if (!/^\d{6}$/.test(pincode)) {
        setError('Please enter a valid 6-digit pincode');
        setLoading(false);
        return;
      }
    }

    try {
      try {
        await signInAnonymously(auth);
      } catch (authErr: any) {
        console.log("Auth Status: Waiting for console activation. Proceeding to database login...");
      }

      const userRef = doc(db, 'users', cleanUsername);
      const userSnap = await getDoc(userRef);

      if (isRegistering) {
        if (userSnap.exists()) {
          setError(`Account "${cleanUsername}" already exists.`);
          setLoading(false);
          return;
        }

        if (!name || !collegeName || !pincode) {
          setError('Please fill in all registration fields');
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
          avatar: getRandomAvatar(),
          password,
          collegeName: collegeName.trim(),
          pincode: pincode.trim(),
          portfolio: [] 
        };

        if (role === 'writer') {
          newUser.pricePerPage = price;
          newUser.earnings = 0;
          newUser.specialties = ['General'];
          newUser.bio = 'Student writer ready to help.';
          newUser.isBusy = false;
          newUser.isBargainable = isBargainable;
        }

        await setDoc(userRef, sanitizeForFirestore(newUser));
        onLogin(newUser);
      } else {
        if (!userSnap.exists()) {
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

        if (userData.role !== role) {
          setError(`This account is registered as a ${userData.role}. Please select the correct role.`);
          setLoading(false);
          return;
        }

        onLogin(userData);
      }
    } catch (err: any) {
      console.error("General Login Error:", err);
      setError('Database connection error. Please check your internet or Firebase Firestore setup.');
    } finally {
      setLoading(false);
    }
  };

  const mailtoLink = "mailto:academiamarkethelp@gmail.com?subject=Login Support - AcademiaMarket";

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
            <>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">College</label>
                  <select 
                    required
                    value={collegeName} 
                    onChange={(e) => setCollegeName(e.target.value)} 
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-medium text-sm appearance-none"
                  >
                    <option value="">Select...</option>
                    {TELANGANA_COLLEGES.map(college => (
                      <option key={college} value={college}>{college}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pincode (Home)</label>
                  <input 
                    type="text" 
                    required
                    maxLength={6}
                    value={pincode} 
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))} 
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-black text-sm" 
                    placeholder="500001" 
                  />
                </div>
              </div>
              {collegeName === 'Other' && (
                <input 
                  type="text" 
                  required
                  placeholder="Enter college name"
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none transition-all font-medium text-sm animate-in slide-in-from-top-1"
                  onChange={(e) => setCollegeName(e.target.value)}
                />
              )}
            </>
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
            <div className="space-y-4">
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
              <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <div>
                  <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Open to Bargaining</p>
                  <p className="text-[8px] text-emerald-600 font-medium">Allows assigners to negotiate the price</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setIsBargainable(!isBargainable)}
                  className={`w-12 h-6 rounded-full p-1 transition-all ${isBargainable ? 'bg-emerald-500' : 'bg-slate-300'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-all transform ${isBargainable ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>
            </div>
          )}

          {isRegistering && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
              <div className="flex items-start gap-3">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="terms" className="text-[10px] font-medium text-slate-600 leading-relaxed text-left">
                  I agree to the <button type="button" onClick={() => setShowTermsModal(true)} className="text-indigo-600 font-black underline">Academic Integrity Policy</button>. I confirm I will use this platform only for <b>helping each other</b> with educational support.
                </label>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 animate-in fade-in slide-in-from-top-2 text-center">
              <p className="text-rose-500 text-[10px] font-bold leading-tight">
                <i className="fas fa-exclamation-circle mr-1"></i> {error}
              </p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading || (isRegistering && !agreedToTerms)}
            className={`w-full py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 disabled:grayscale disabled:transform-none ${role === 'assigner' ? 'bg-indigo-600 shadow-indigo-100 hover:bg-indigo-700' : 'bg-emerald-600 shadow-emerald-100 hover:bg-emerald-700'}`}
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin mr-2"></i>
            ) : null}
            {isRegistering ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-slate-400 font-medium">{isRegistering ? 'Already have an account?' : 'New to the platform?'}</p>
            <div className="flex justify-center gap-4">
              <button 
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }} 
                className="text-indigo-600 font-black text-sm hover:underline"
              >
                {isRegistering ? 'Sign In' : 'Create an Account'}
              </button>
              <div className="w-[1px] h-4 bg-slate-200"></div>
              <button 
                type="button"
                onClick={() => setShowUserGuide(true)}
                className="text-slate-600 font-black text-sm hover:underline"
              >
                Learn How it Works
              </button>
            </div>
          </div>
          
          <div className="pt-4 border-t border-slate-100">
             <a 
               href={mailtoLink}
               className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors inline-flex items-center gap-2"
             >
               <i className="fas fa-question-circle"></i> Need Help? Contact Support
             </a>
          </div>
        </div>
      </div>

      {/* Academic Integrity Policy Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg max-h-[80vh] overflow-y-auto p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-left border border-slate-100">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Academic Integrity Policy</h3>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Ethical Usage Guidelines</p>
              </div>
              <button onClick={() => setShowTermsModal(false)} className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-all">
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="space-y-6 text-sm font-medium text-slate-600 leading-relaxed">
              <section className="space-y-3">
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">1. Purpose of Use</h4>
                <p>This platform is designed strictly for students to <b>help each other</b> through educational support. It is a collaborative space for peer-to-peer assistance in organizing and presenting original academic thoughts clearly.</p>
              </section>

              <section className="space-y-3">
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">2. Academic Honesty</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Users must adhere to their respective institution's <b>Academic Integrity Policies</b>.</li>
                  <li>Helping each other should <b>not</b> result in plagiarism or unauthorized assistance on graded work.</li>
                  <li>Completing exams, graded quizzes, or final assessments for others is <b>strictly prohibited</b>.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">3. Chat & Communication</h4>
                <p>Chat rooms are provided for coordination and supportive learning dialogue. Misuse—including harassment, spamming, or sharing offensive content—is not tolerated.</p>
              </section>

              <section className="space-y-3">
                <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-widest">4. Content Sharing</h4>
                <p>Users are responsible for the resources they share. Always ensure links are safe and respect copyright laws.</p>
              </section>

              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                <p className="text-[10px] font-bold text-indigo-700 leading-normal">
                  By clicking "I Understand and Agree", you commit to a culture of peer support that respects academic honesty. Failure to comply will lead to account suspension.
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button 
                onClick={() => { setAgreedToTerms(true); setShowTermsModal(false); }}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-95 transition-all"
              >
                I Understand and Agree
              </button>
            </div>
          </div>
        </div>
      )}

      {showUserGuide && <UserGuide role={role} onClose={() => setShowUserGuide(false)} />}
    </div>
  );
};

export default Login;
