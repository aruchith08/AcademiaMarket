
import React, { useState } from 'react';
import { UserProfile, PortfolioItem } from '../types.ts';
import { TELANGANA_COLLEGES } from '../colleges.ts';

interface WriterSettingsProps {
  user: UserProfile;
  onUpdateUser: (user: UserProfile) => void;
  onLogout: () => void;
  onShowAvatarSelector: () => void;
}

const WriterSettings: React.FC<WriterSettingsProps> = ({ user, onUpdateUser, onLogout, onShowAvatarSelector }) => {
  const [editPrice, setEditPrice] = useState(user.pricePerPage || 10);
  const [editBio, setEditBio] = useState(user.bio || '');
  const [editCollege, setEditCollege] = useState(user.collegeName || '');
  const [editPincode, setEditPincode] = useState(user.pincode || '');
  const [isBargainable, setIsBargainable] = useState(user.isBargainable !== false);
  const [isBusy, setIsBusy] = useState(user.isBusy || false);
  
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(user.portfolio || []);
  const [newSampleTitle, setNewSampleTitle] = useState('');
  const [newSampleUrl, setNewSampleUrl] = useState('');
  const [linkError, setLinkError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  const addPortfolioItem = async () => {
    setLinkError('');
    if (!newSampleTitle.trim() || !newSampleUrl.trim()) {
      if (!newSampleUrl.trim()) setLinkError('Link is required');
      return;
    }
    
    try {
      new URL(newSampleUrl);
    } catch (_) {
      setLinkError('Invalid link. Must start with http:// or https://');
      return;
    }

    setIsAdding(true);
    const updatedPortfolio = [...portfolio, { title: newSampleTitle, url: newSampleUrl }];
    
    try {
      await onUpdateUser({ 
        ...user, 
        portfolio: updatedPortfolio 
      });
      
      setPortfolio(updatedPortfolio);
      setNewSampleTitle('');
      setNewSampleUrl('');
      setShowAddedFeedback(true);
      setTimeout(() => setShowAddedFeedback(false), 2000);
    } catch (err) {
      setLinkError('Failed to save. Try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const removePortfolioItem = async (index: number) => {
    const updatedPortfolio = portfolio.filter((_, i) => i !== index);
    try {
      await onUpdateUser({ 
        ...user, 
        portfolio: updatedPortfolio 
      });
      setPortfolio(updatedPortfolio);
    } catch (err) {
      alert("Failed to remove sample.");
    }
  };

  const saveProfile = () => {
    if (editPincode && !/^\d{6}$/.test(editPincode)) {
      alert("Please enter a valid 6-digit pincode.");
      return;
    }
    onUpdateUser({ 
      ...user, 
      pricePerPage: editPrice, 
      bio: editBio, 
      collegeName: editCollege,
      pincode: editPincode,
      isBargainable: isBargainable,
      isBusy: isBusy,
      portfolio: portfolio
    });
    alert("Helper profile updated!");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-4 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-sm border border-slate-100 animate-in zoom-in-95 duration-200 mb-20 overflow-hidden">
      <div className="flex items-center gap-4 sm:gap-6 mb-8 sm:mb-10 p-2 sm:p-0">
        <div className="relative shrink-0">
          <img src={user.avatar} className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] sm:rounded-[2rem] object-cover ring-4 ring-slate-50 shadow-md bg-slate-50" />
          <button onClick={onShowAvatarSelector} className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 bg-indigo-600 text-white rounded-lg border-4 border-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95">
            <i className="fas fa-pen text-[8px]"></i>
          </button>
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tighter text-left">Helper Identity</h2>
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1 text-left">Manage your student profile</p>
        </div>
      </div>
      
      <div className="space-y-5 sm:space-y-6">
        <div className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all ${isBusy ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
          <div className="flex items-center justify-between">
            <div className="text-left pr-4">
              <p className={`text-[10px] font-black uppercase tracking-widest ${isBusy ? 'text-amber-700' : 'text-emerald-700'}`}>
                Study Status: {isBusy ? 'Busy Studying' : 'Ready to Help'}
              </p>
              <p className={`text-[9px] font-medium leading-tight mt-1 ${isBusy ? 'text-amber-600' : 'text-emerald-600'}`}>
                {isBusy ? "You're taking a break." : "Students can reach out to you."}
              </p>
            </div>
            <button 
              type="button" 
              onClick={() => setIsBusy(!isBusy)}
              className={`w-12 h-6 sm:w-14 sm:h-7 rounded-full p-1 transition-all flex items-center shrink-0 ${isBusy ? 'bg-amber-400 justify-start' : 'bg-emerald-500 justify-end'}`}
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-md"></div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">College</label>
            <select value={editCollege} onChange={(e) => setEditCollege(e.target.value)} className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-slate-700 text-sm shadow-inner appearance-none transition-all">
              {TELANGANA_COLLEGES.map(college => (<option key={college} value={college}>{college}</option>))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Area Pincode</label>
            <input type="text" maxLength={6} value={editPincode} onChange={(e) => setEditPincode(e.target.value.replace(/\D/g, ''))} className="w-full px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl sm:rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none font-black text-slate-700 text-sm shadow-inner transition-all" />
          </div>
        </div>

        <div className="space-y-2 text-left">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Suggested Support (₹ / Page)</label>
          <input type="number" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} className="w-full px-6 py-4 sm:px-8 rounded-xl sm:rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none font-black text-indigo-600 text-2xl shadow-inner transition-all" />
        </div>

        <div className="p-5 sm:p-8 bg-slate-50 rounded-2xl sm:rounded-[2.5rem] border border-slate-100 text-left overflow-hidden">
          <div className="flex items-center justify-between mb-4">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Showcase Samples</h4>
             <span className="text-[8px] font-black text-indigo-500 bg-white px-2 py-1 rounded-lg border border-slate-100 uppercase tracking-widest">Verified</span>
          </div>
          
          <div className="space-y-3 mb-6 max-h-[200px] overflow-y-auto pr-1">
            {portfolio.length === 0 ? (
              <p className="text-[10px] text-slate-400 italic font-medium px-2">No samples shared yet.</p>
            ) : (
              portfolio.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 shadow-sm animate-in slide-in-from-left-2 duration-300">
                  <div className="min-w-0 flex-1 pr-2">
                    <p className="text-[10px] font-black text-slate-700 truncate">{item.title}</p>
                    <p className="text-[8px] text-indigo-500 font-bold truncate">{item.url}</p>
                  </div>
                  <button onClick={() => removePortfolioItem(idx)} className="shrink-0 w-6 h-6 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all">
                    <i className="fas fa-times text-[10px]"></i>
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="space-y-3">
            <input 
              type="text" 
              value={newSampleTitle}
              onChange={(e) => setNewSampleTitle(e.target.value)}
              placeholder="Sample Title"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 focus:border-indigo-500 outline-none text-xs font-medium transition-all bg-white"
            />
            <div className="flex flex-col gap-2">
              <div className="flex flex-col xs:flex-row sm:flex-row gap-2">
                <input 
                  type="text" 
                  value={newSampleUrl}
                  onChange={(e) => {
                    setNewSampleUrl(e.target.value);
                    if (linkError) setLinkError('');
                  }}
                  placeholder="Paste G-Drive/Link"
                  className={`flex-1 px-4 py-3 rounded-xl border-2 outline-none text-xs font-medium transition-all bg-white ${
                    linkError ? 'border-rose-300' : 'border-slate-100 focus:border-indigo-500'
                  }`}
                />
                <button 
                  onClick={addPortfolioItem}
                  disabled={isAdding}
                  className={`min-h-[44px] sm:min-w-[80px] px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center shrink-0 ${
                    showAddedFeedback 
                      ? 'bg-emerald-500 text-white shadow-emerald-100' 
                      : 'bg-indigo-600 text-white active:scale-95 shadow-lg shadow-indigo-100'
                  }`}
                >
                  {isAdding ? <i className="fas fa-spinner fa-spin"></i> : showAddedFeedback ? 'Done!' : 'Add'}
                </button>
              </div>
              {linkError && (
                <p className="text-[9px] text-rose-500 font-black uppercase tracking-tighter ml-1 animate-in fade-in slide-in-from-top-1">
                  <i className="fas fa-exclamation-triangle mr-1"></i> {linkError}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Open to Discuss Toggle Card */}
        <div className="flex items-center justify-between p-5 sm:p-6 bg-indigo-50/50 rounded-2xl sm:rounded-3xl border border-indigo-100 text-left">
          <div className="pr-4">
            <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Open to Discuss</p>
            <p className="text-[9px] text-indigo-500 font-medium leading-tight mt-1">Allows peers to suggest amount.</p>
          </div>
          <button 
            type="button" 
            onClick={() => setIsBargainable(!isBargainable)}
            className={`w-10 h-5 sm:w-12 sm:h-6 rounded-full p-1 transition-all shrink-0 flex items-center ${isBargainable ? 'bg-indigo-600' : 'bg-slate-300'}`}
          >
            <div className={`w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-sm transition-all transform ${isBargainable ? 'translate-x-5 sm:translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <button onClick={saveProfile} className="w-full py-4 sm:py-5 bg-indigo-600 text-white rounded-[1.5rem] sm:rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 active:scale-95 transition-all">Update My Profile</button>
          <button onClick={onLogout} className="w-full py-4 sm:py-5 bg-rose-50 text-rose-500 rounded-[1.5rem] sm:rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-rose-100 transition-all active:scale-95">Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default WriterSettings;
