
import React from 'react';
import { UserProfile } from '../types.ts';

interface AssignerSettingsProps {
  user: UserProfile;
  onLogout: () => void;
  onShowAvatarSelector: () => void;
}

const AssignerSettings: React.FC<AssignerSettingsProps> = ({ user, onLogout, onShowAvatarSelector }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-in zoom-in-95 duration-200">
      <div className="flex flex-col items-center text-center gap-6">
        <div className="relative group">
          <img src={user.avatar} className="w-32 h-32 rounded-[2.5rem] object-cover ring-4 ring-slate-50 shadow-md bg-slate-50" />
          <button onClick={onShowAvatarSelector} className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 text-white rounded-xl border-4 border-white flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95">
            <i className="fas fa-pen text-[10px]"></i>
          </button>
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">{user.name}</h2>
          <div className="flex flex-col items-center gap-1 mt-2">
            <div className="flex items-center gap-2">
              <i className="fas fa-university text-indigo-400 text-xs"></i>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{user.collegeName || 'N/A'}</p>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-location-dot text-amber-400 text-xs"></i>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Pincode: {user.pincode || 'N/A'}</p>
            </div>
          </div>
          <p className="text-indigo-600 font-bold uppercase text-[10px] tracking-widest mt-2">ID: @{user.username}</p>
        </div>
        <div className="w-full space-y-3 pt-6">
          <button onClick={onLogout} className="w-full py-5 bg-rose-50 text-rose-500 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-rose-100 transition-all active:scale-95">Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default AssignerSettings;
