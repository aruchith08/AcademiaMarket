
import React, { useState } from 'react';
import { UserProfile, Task } from '../types.ts';

interface WritersListProps {
  users: UserProfile[];
  assignerTasks: Task[];
  onAsk: (writer: UserProfile, taskId: string) => void;
}

const WritersList: React.FC<WritersListProps> = ({ users, assignerTasks, onAsk }) => {
  const [selectedWriter, setSelectedWriter] = useState<UserProfile | null>(null);
  const writers = users.filter(u => u.role === 'writer');

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-black text-slate-800 tracking-tight">Student Writers</h2>

      {writers.length === 0 ? (
        <div className="py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-8">
           <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-slate-200 border border-slate-100 shadow-sm">
              <i className="fas fa-users-slash text-4xl"></i>
           </div>
           <p className="text-slate-800 font-black text-xl tracking-tight mb-2">No writers found yet</p>
           <p className="text-slate-400 text-xs font-medium max-w-[250px] leading-relaxed">As more students join as writers, they will appear here ready to help.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {writers.map(writer => (
            <div key={writer.id} className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={writer.avatar} className="w-16 h-16 rounded-2xl object-cover" />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-4 border-white rounded-full ${writer.isBusy ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">@{writer.username}</h4>
                    <p className={`text-[9px] font-black uppercase tracking-tighter ${writer.isBusy ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {writer.isBusy ? 'Currently busy' : 'Ready to help'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Rate</p>
                  <p className="text-lg font-black text-indigo-600 leading-none">₹{writer.pricePerPage}<span className="text-[10px] text-slate-400 font-bold tracking-normal">/pg</span></p>
                </div>
              </div>

              <div className="mb-6">
                 <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                    {writer.bio}
                 </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <button 
                  onClick={() => setSelectedWriter(writer)}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-95"
                >
                  Ask for Help
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedWriter && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
           <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in duration-200">
              <h3 className="text-xl font-black text-slate-800 mb-2">Connect with @{selectedWriter.username}</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">Select a task you'd like to collaborate on.</p>
              
              <div className="space-y-3 max-h-60 overflow-y-auto mb-8 pr-2">
                {assignerTasks.filter(t => t.status === 'Pending').length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">You have no pending projects</p>
                  </div>
                ) : (
                  assignerTasks.filter(t => t.status === 'Pending').map(t => (
                    <button 
                      key={t.id}
                      onClick={() => { onAsk(selectedWriter, t.id); setSelectedWriter(null); }}
                      className="w-full p-4 rounded-2xl border border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
                    >
                      <p className="font-black text-slate-800 text-sm">{t.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold">₹{t.estimatedPrice} • {t.subject}</p>
                    </button>
                  ))
                )}
              </div>

              <button onClick={() => setSelectedWriter(null)} className="w-full py-3 font-black text-slate-400 text-xs tracking-widest uppercase">Cancel</button>
           </div>
        </div>
      )}
    </div>
  );
};

export default WritersList;
