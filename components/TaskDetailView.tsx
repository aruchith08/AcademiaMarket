
import React, { useState, useMemo } from 'react';
import { Task, TaskStatus, UserRole } from '../types.ts';

interface TaskDetailViewProps {
  task: Task;
  role: UserRole;
  onBack: () => void;
  onUpdateStatus?: (taskId: string, status: TaskStatus) => Promise<void>;
  onHandshake?: (taskId: string, action: any) => Promise<void>;
  onOpenChat: (taskId: string) => void;
  onBargain?: (taskId: string, newPrice: number) => Promise<void>;
}

const TaskDetailView: React.FC<TaskDetailViewProps> = ({ 
  task, 
  role, 
  onBack, 
  onUpdateStatus, 
  onHandshake, 
  onOpenChat,
  onBargain
}) => {
  const [showBargainInput, setShowBargainInput] = useState(false);
  const [bargainPrice, setBargainPrice] = useState(task.agreedPrice || task.estimatedPrice);

  const handleBargainSubmit = async () => {
    if (onBargain && bargainPrice > 0) {
      await onBargain(task.id, bargainPrice);
      setShowBargainInput(false);
    }
  };

  const isBargained = task.agreedPrice && task.agreedPrice !== task.estimatedPrice;

  const links = useMemo(() => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return task.description.match(urlRegex) || [];
  }, [task.description]);

  return (
    <div className="grid grid-cols-1 gap-8 animate-in slide-in-from-right-8 duration-300">
      <div className="space-y-6">
        <button 
          onClick={onBack} 
          className="px-4 py-2 bg-white rounded-xl text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-indigo-600 flex items-center gap-2 border border-slate-100 shadow-sm transition-all active:scale-95"
        >
          <i className="fas fa-arrow-left"></i> Back to Hub
        </button>
        
        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <i className="fas fa-hand-holding-heart text-9xl"></i>
          </div>
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-tight max-w-[70%]">{task.title}</h2>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {isBargained ? 'Agreed Support' : 'Est. Contribution'}
              </p>
              <div className="flex items-center justify-end gap-2">
                {isBargained && (
                  <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">CHAT READY</span>
                )}
                <p className="text-2xl font-black text-indigo-600">₹{task.agreedPrice || task.estimatedPrice}</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100">
              <i className="fas fa-book mr-2"></i>{task.subject}
            </span>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
              <i className="fas fa-file-alt mr-2"></i>{task.pageCount} Pages
            </span>
            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl ${task.format === 'Handwritten' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'}`}>
              <i className={`fas ${task.format === 'Handwritten' ? 'fa-pen-fancy' : 'fa-keyboard'} mr-2`}></i>{task.format}
            </span>
          </div>
          
          <div className="space-y-4 mb-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 text-left">Help Required & Resource Links</p>
            <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 font-medium text-slate-600 text-sm leading-relaxed whitespace-pre-wrap shadow-inner text-left">
              {task.description.split(/(https?:\/\/[^\s]+)/g).map((part, i) => (
                part.match(/https?:\/\/[^\s]+/) ? (
                  <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-black underline hover:text-indigo-800 break-all">{part}</a>
                ) : part
              ))}
            </div>
          </div>

          {links.length > 0 && (
             <div className="mb-10 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest ml-1 mb-3 text-left">Resource Quick Links</p>
                <div className="flex flex-wrap gap-3">
                   {links.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-5 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-200 hover:shadow-md transition-all group"
                      >
                         <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <i className="fas fa-link text-xs"></i>
                         </div>
                         <div className="text-left">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Shared Asset #{idx + 1}</p>
                            <p className="text-[10px] font-bold text-slate-700 max-w-[150px] truncate">{new URL(link).hostname}</p>
                         </div>
                      </a>
                   ))}
                </div>
             </div>
          )}

          {showBargainInput && (
            <div className="mb-6 p-6 bg-indigo-50 rounded-3xl border border-indigo-100 animate-in slide-in-from-top-2 text-left">
               <label className="text-[10px] font-black text-indigo-900 uppercase tracking-widest block mb-2">Discuss Support Amount (₹)</label>
               <div className="flex gap-3">
                  <input 
                    type="number" 
                    value={bargainPrice} 
                    onChange={(e) => setBargainPrice(Number(e.target.value))} 
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-indigo-200 focus:border-indigo-500 outline-none font-black text-indigo-600" 
                  />
                  <button onClick={handleBargainSubmit} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">Suggest This</button>
                  <button onClick={() => setShowBargainInput(false)} className="px-6 py-3 bg-white text-slate-400 rounded-xl font-black text-[10px] uppercase tracking-widest border border-slate-200">Cancel</button>
               </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            {role === 'writer' && (
              <>
                {(task.status === TaskStatus.PENDING || task.status === TaskStatus.REQUESTED) && onHandshake && (
                  <button 
                    onClick={() => onHandshake(task.id, 'request')} 
                    className="flex-1 py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-indigo-100 active:scale-95 transition-all"
                  >
                    {task.status === TaskStatus.PENDING ? 'Offer to Help' : 'Update Offer'}
                  </button>
                )}
                {(task.status === TaskStatus.PENDING || task.status === TaskStatus.REQUESTED) && task.bargainEnabled && onBargain && !showBargainInput && (
                   <button 
                     onClick={() => setShowBargainInput(true)} 
                     className="flex-1 py-5 bg-white text-indigo-600 border-2 border-indigo-100 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-indigo-50 active:scale-95 transition-all"
                   >
                     Discuss Contribution
                   </button>
                )}
                {task.status === TaskStatus.REQUESTED && task.handshakeStatus === 'assigner_invited' && onHandshake && (
                   <button 
                     onClick={() => onHandshake(task.id, 'accept')} 
                     className="flex-1 py-5 bg-emerald-500 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-100 active:scale-95 transition-all"
                   >
                     Confirm & Start
                   </button>
                )}
                {task.status === TaskStatus.IN_PROGRESS && onUpdateStatus && (
                  <button 
                    onClick={() => onUpdateStatus(task.id, TaskStatus.REVIEW)} 
                    className="flex-1 py-5 bg-white text-indigo-600 border-2 border-indigo-100 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 active:scale-95 transition-all"
                  >
                    Ready for Review
                  </button>
                )}
              </>
            )}

            {role === 'assigner' && (
              <>
                {task.status === TaskStatus.REQUESTED && task.handshakeStatus === 'writer_requested' && onHandshake && (
                  <button 
                    onClick={() => onHandshake(task.id, 'accept')} 
                    className="flex-1 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-95"
                  >
                    Partner Up {isBargained ? `@ ₹${task.agreedPrice}` : ''}
                  </button>
                )}
                {task.status === TaskStatus.REVIEW && onUpdateStatus && (
                  <button 
                    onClick={() => onUpdateStatus(task.id, TaskStatus.COMPLETED)} 
                    className="flex-1 py-5 bg-emerald-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 active:scale-95"
                  >
                    Confirm & Complete
                  </button>
                )}
              </>
            )}

            {task.handshakeStatus === 'accepted' && (
              <button 
                onClick={() => onOpenChat(task.id)} 
                className="flex-1 py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-200 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                <i className="fas fa-comment-dots"></i>
                Open Peer Chat
              </button>
            )}
            
            {task.status === TaskStatus.COMPLETED && (
              <div className="flex-1 py-5 bg-emerald-50 text-emerald-600 rounded-[2rem] font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 border border-emerald-100">
                <i className="fas fa-check-double"></i>
                Support Successfully Finished
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailView;
