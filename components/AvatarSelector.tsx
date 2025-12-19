
import React from 'react';
import { PREDEFINED_AVATARS } from '../constants.ts';

interface AvatarSelectorProps {
  currentAvatar: string;
  onSelect: (url: string) => void;
  onClose: () => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ currentAvatar, onSelect, onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-[3rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in duration-200 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Choose Your Avatar</h3>
            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Select your student identity</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto p-2 scrollbar-hide">
          {PREDEFINED_AVATARS.map((url, idx) => (
            <button
              key={idx}
              onClick={() => {
                onSelect(url);
                onClose();
              }}
              className={`relative aspect-square rounded-2xl overflow-hidden border-4 transition-all hover:scale-105 active:scale-95 ${
                currentAvatar === url ? 'border-indigo-500 shadow-lg shadow-indigo-100' : 'border-slate-50'
              }`}
            >
              <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover bg-slate-50" />
              {currentAvatar === url && (
                <div className="absolute inset-0 bg-indigo-500/10 flex items-center justify-center">
                  <div className="bg-indigo-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px]">
                    <i className="fas fa-check"></i>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8">
          <button 
            onClick={onClose}
            className="w-full py-4 font-black text-slate-400 text-xs tracking-widest uppercase hover:text-slate-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarSelector;
