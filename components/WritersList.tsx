
import React, { useState, useMemo } from 'react';
import { UserProfile, Task } from '../types.ts';

interface WritersListProps {
  users: UserProfile[];
  assignerTasks: Task[];
  currentUser: UserProfile;
  onAsk: (writer: UserProfile, taskId: string) => void;
}

const WritersList: React.FC<WritersListProps> = ({ users, assignerTasks, currentUser, onAsk }) => {
  const [selectedWriter, setSelectedWriter] = useState<UserProfile | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'college' | 'nearby'>('all');
  
  const writers = users.filter(u => u.role === 'writer');
  
  const filteredWriters = useMemo(() => {
    if (filterType === 'all') return writers;
    if (filterType === 'college') {
      return writers.filter(w => w.collegeName?.toLowerCase() === currentUser.collegeName?.toLowerCase());
    }
    if (filterType === 'nearby') {
      return writers.filter(w => w.pincode === currentUser.pincode);
    }
    return writers;
  }, [writers, filterType, currentUser]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Student Writers</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Found {filteredWriters.length} active scholars</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           <button 
             onClick={() => setFilterType('all')}
             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === 'all' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400'}`}
           >
             All
           </button>
           <button 
             onClick={() => setFilterType('college')}
             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === 'college' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400'}`}
           >
             My College
           </button>
           <button 
             onClick={() => setFilterType('nearby')}
             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterType === 'nearby' ? 'bg-amber-500 text-white shadow-lg shadow-amber-100' : 'text-slate-400'}`}
           >
             Near Me
           </button>
        </div>
      </div>

      {filteredWriters.length === 0 ? (
        <div className="py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-8">
           <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 border shadow-sm ${filterType === 'nearby' ? 'bg-amber-50 text-amber-200 border-amber-50' : 'bg-slate-50 text-slate-200 border-slate-100'}`}>
              <i className={`fas ${filterType === 'nearby' ? 'fa-location-dot' : 'fa-university'} text-4xl`}></i>
           </div>
           <p className="text-slate-800 font-black text-xl tracking-tight mb-2">No writers found here</p>
           <p className="text-slate-400 text-xs font-medium max-w-[250px] leading-relaxed">
             {filterType === 'college' && `No writers from ${currentUser.collegeName} yet.`}
             {filterType === 'nearby' && `No writers found in pincode area ${currentUser.pincode}.`}
             {filterType === 'all' && "As more students join as writers, they will appear here ready to help."}
           </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredWriters.map(writer => {
            const isSameCollege = writer.collegeName?.toLowerCase() === currentUser.collegeName?.toLowerCase();
            const isNearby = writer.pincode === currentUser.pincode;
            const isBargainable = writer.isBargainable !== false; // Default to true if undefined
            
            return (
              <div key={writer.id} className={`bg-white rounded-[2rem] p-6 shadow-sm border transition-all group ${isNearby ? 'border-amber-200 ring-2 ring-amber-50' : isSameCollege ? 'border-indigo-200 ring-2 ring-indigo-50' : 'border-slate-100 hover:shadow-md'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={writer.avatar} className="w-16 h-16 rounded-2xl object-cover" />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 border-4 border-white rounded-full ${writer.isBusy ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-sm">@{writer.username}</h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {isSameCollege && (
                          <span className="text-[7px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                            College Match
                          </span>
                        )}
                        {isNearby && (
                          <span className="text-[7px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md uppercase tracking-tighter">
                            <i className="fas fa-location-dot mr-1"></i> Nearby
                          </span>
                        )}
                        <span className={`text-[7px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter ${isBargainable ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400 bg-slate-50'}`}>
                           <i className={`fas ${isBargainable ? 'fa-handshake' : 'fa-lock'} mr-1`}></i>
                           {isBargainable ? 'Bargainable' : 'Fixed Price'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Rate</p>
                    <p className="text-lg font-black text-indigo-600 leading-none">₹{writer.pricePerPage}<span className="text-[10px] text-slate-400 font-bold tracking-normal">/pg</span></p>
                  </div>
                </div>

                <div className="mb-4 space-y-2">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <i className="fas fa-university text-indigo-300 w-4"></i>
                      <span className="truncate">{writer.collegeName || 'Unknown College'}</span>
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <i className="fas fa-location-dot text-amber-300 w-4 text-center"></i>
                      <span>Area: {writer.pincode || 'N/A'}</span>
                   </div>
                   <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                      {writer.bio}
                   </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <button 
                    onClick={() => setSelectedWriter(writer)}
                    className={`w-full py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-lg transition-all transform active:scale-95 ${isNearby ? 'bg-amber-500 text-white shadow-amber-100 hover:bg-amber-600' : 'bg-indigo-600 text-white shadow-indigo-100 hover:bg-indigo-700'}`}
                  >
                    Ask for Help
                  </button>
                </div>
              </div>
            );
          })}
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
                    <p className="text-[8px] text-slate-400 mt-1">Post a project first to hire writers.</p>
                  </div>
                ) : (
                  assignerTasks.filter(t => t.status === 'Pending').map(t => (
                    <button 
                      key={t.id}
                      onClick={() => { onAsk(selectedWriter, t.id); setSelectedWriter(null); }}
                      className="w-full p-4 rounded-2xl border border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left group"
                    >
                      <p className="font-black text-slate-800 text-sm group-hover:text-indigo-600">{t.title}</p>
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
