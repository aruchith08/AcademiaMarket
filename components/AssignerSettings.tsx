
import React from 'react';
import { UserProfile } from '../types.ts';

interface AssignerSettingsProps {
  user: UserProfile;
  onLogout: () => void;
  onShowAvatarSelector: () => void;
}

const AssignerSettings: React.FC<AssignerSettingsProps> = ({ user, onLogout, onShowAvatarSelector }) => {
  const supportEmail = "academiamarkethelp@gmail.com";
  const mailtoLink = `mailto:${supportEmail}?subject=Support Request - ${user.name} (@${user.username})`;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-sm border border-slate-100 animate-in zoom-in-95 duration-200 mb-20">
      <div className="flex flex-col items-center text-center gap-6">
        <div className="relative group">
          <img src={user.avatar} className="w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] sm:rounded-[2.5rem] object-cover ring-4 ring-slate-50 shadow-md bg-slate-50" />
          <button onClick={onShowAvatarSelector} className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-9 h-9 sm:w-10 sm:h-10 bg-indigo-600 text-white rounded-xl border-4 border-white flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95">
            <i className="fas fa-pen text-[10px]"></i>
          </button>
        </div>
        <div className="w-full">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">{user.name}</h2>
          <div className="flex flex-col items-center gap-1.5 mt-3">
            <div className="flex items-center gap-2 max-w-full">
              <i className="fas fa-university text-indigo-400 text-xs shrink-0"></i>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest truncate">{user.collegeName || 'N/A'}</p>
            </div>
            <div className="flex items-center gap-2">
              <i className="fas fa-location-dot text-amber-400 text-xs"></i>
              <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Pincode: {user.pincode || 'N/A'}</p>
            </div>
          </div>
          <p className="text-indigo-600 font-bold uppercase text-[10px] tracking-widest mt-3">ID: @{user.username}</p>
        </div>

        <div className="w-full mt-4 space-y-3">
          <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-left">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Support & Help</h4>
            <div className="flex flex-col gap-3">
              <a 
                href={mailtoLink}
                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-500 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <i className="fas fa-headset"></i>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-black text-slate-800">Contact Help Desk</p>
                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">Response in 24 hours</p>
                  </div>
                </div>
                <i className="fas fa-chevron-right text-[10px] text-slate-300 group-hover:text-indigo-600 transition-all"></i>
              </a>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(supportEmail);
                  alert("Email copied to clipboard!");
                }}
                className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline text-center"
              >
                Copy support email: {supportEmail}
              </button>
            </div>
          </div>

          <div className="w-full pt-4">
            <button onClick={onLogout} className="w-full py-4 sm:py-5 bg-rose-50 text-rose-500 rounded-[1.5rem] sm:rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-rose-100 transition-all active:scale-95">Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignerSettings;
