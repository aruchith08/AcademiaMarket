
import React, { useState } from 'react';
import { UserProfile } from '../types.ts';
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
      isBusy: isBusy 
    });
    alert("Profile updated successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-in zoom-in-95 duration-200">
      <div className="flex items-center gap-6 mb-10">
        <div className="relative">
          <img src={user.avatar} className="w-24 h-24 rounded-[2rem] object-cover ring-4 ring-slate-50 shadow-md bg-slate-50" />
          <button onClick={onShowAvatarSelector} className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-lg border-4 border-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95">
            <i className="fas fa-pen text-[8px]"></i>
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter">Writer Settings</h2>
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1 text-left">Configure your identity</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Availability Toggle */}
        <div className={`p-6 rounded-3xl border transition-all ${isBusy ? 'bg-amber-50 border-amber-100' : 'bg-emerald-50 border-emerald-100'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-[10px] font-black uppercase tracking-widest ${isBusy ? 'text-amber-700' : 'text-emerald-700'}`}>
                Work Status: {isBusy ? 'Currently Busy' : 'Available for Work'}
              </p>
              <p className={`text-[9px] font-medium ${isBusy ? 'text-amber-600' : 'text-emerald-600'}`}>
                {isBusy ? "You won't appear in the active writers list." : "Assigners can find you and invite you to tasks."}
              </p>
            </div>
            <button 
              type="button" 
              onClick={() => setIsBusy(!isBusy)}
              className={`w-14 h-7 rounded-full p-1 transition-all flex items-center ${isBusy ? 'bg-amber-400 justify-start' : 'bg-emerald-500 justify-end'}`}
            >
              <div className="w-5 h-5 bg-white rounded-full shadow-md"></div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">College</label>
            <select value={editCollege} onChange={(e) => setEditCollege(e.target.value)} className="w-full px-6 py-4 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none font-bold text-slate-700 text-sm shadow-inner appearance-none transition-all">
              {TELANGANA_COLLEGES.map(college => (<option key={college} value={college}>{college}</option>))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Home Pincode</label>
            <input type="text" maxLength={6} value={editPincode} onChange={(e) => setEditPincode(e.target.value.replace(/\D/g, ''))} className="w-full px-6 py-4 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none font-black text-slate-700 text-sm shadow-inner transition-all" />
          </div>
        </div>

        <div className="space-y-2 text-left">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Writing Rate (₹ / Page)</label>
          <input type="number" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} className="w-full px-8 py-4 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none font-black text-indigo-600 text-2xl shadow-inner transition-all" />
        </div>

        <div className="flex items-center justify-between p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 text-left">
          <div>
            <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest">Open to Bargaining</p>
            <p className="text-[9px] text-indigo-500 font-medium">Allows assigners to negotiate the price on a per-task basis.</p>
          </div>
          <button 
            type="button" 
            onClick={() => setIsBargainable(!isBargainable)}
            className={`w-12 h-6 rounded-full p-1 transition-all ${isBargainable ? 'bg-indigo-600' : 'bg-slate-300'}`}
          >
            <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all transform ${isBargainable ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

        <button onClick={saveProfile} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-indigo-100 active:scale-95 transition-all">Update Profile</button>
        <button onClick={onLogout} className="w-full py-5 bg-rose-50 text-rose-500 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-rose-100 transition-all active:scale-95">Sign Out</button>
      </div>
    </div>
  );
};

export default WriterSettings;
