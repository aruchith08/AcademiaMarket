
import React, { useState, useEffect } from 'react';
import { calculateEstimation } from '../services/pricingUtils.ts';
import { Task, TaskStatus } from '../types.ts';

interface TaskFormProps {
  onClose: () => void;
  onSubmit: (task: Partial<Task>) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    pages: 1,
    basePricePerPage: 10,
    deadline: '',
    format: 'Handwritten' as any,
    bargainEnabled: true
  });

  const [est, setEst] = useState({ base: 0, urgency: 0, total: 10, details: '' });

  useEffect(() => {
    if (formData.deadline) {
      const result = calculateEstimation(
        formData.pages, 
        formData.format, 
        formData.deadline, 
        formData.basePricePerPage
      );
      setEst(result);
    }
  }, [formData.pages, formData.format, formData.deadline, formData.basePricePerPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      pageCount: formData.pages,
      estimatedPrice: est.total,
      status: TaskStatus.PENDING,
      handshakeStatus: 'none',
      attachments: [], 
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-stable shadow-2xl animate-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-hand-holding-heart"></i>
             </div>
             <h2 className="text-2xl font-black text-slate-800 tracking-tight">Ask for Help</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl flex items-start gap-4">
             <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <i className="fas fa-link"></i>
             </div>
             <div className="text-left">
                <h4 className="text-[10px] font-black text-indigo-700 uppercase tracking-widest mb-1">Resource Sharing</h4>
                <p className="text-[10px] text-indigo-600 font-medium leading-relaxed">
                   Please share your task materials via <b>Google Drive or Dropbox</b> and paste the link in the description. Peer helpers need access to your materials to support you better!
                </p>
             </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Task Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-medium text-sm" placeholder="e.g. Help with Physics Record" />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                <input required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-medium text-sm" placeholder="Physics / Math" />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <div className="flex justify-between items-end mb-1 px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description & Resource Links</label>
                <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase">Add Drive/Dropbox Links Here</span>
              </div>
              <textarea 
                required 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none min-h-[120px] font-medium text-sm leading-relaxed" 
                placeholder="Briefly explain what you need help with and paste any resource links..." 
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pages</label>
                <input type="number" min="1" value={formData.pages} onChange={e => setFormData({...formData, pages: parseInt(e.target.value) || 1})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-bold text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Support (₹/pg)</label>
                <input type="number" min="1" value={formData.basePricePerPage} onChange={e => setFormData({...formData, basePricePerPage: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-black text-indigo-600 text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Style</label>
                <select value={formData.format} onChange={e => setFormData({...formData, format: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white font-bold text-slate-700 text-sm appearance-none">
                  <option value="Handwritten">Handwritten</option>
                  <option value="Digital">Typed</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Needed By</label>
                <input required type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-medium text-sm" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
               <div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Open to Chat</p>
                  <p className="text-[8px] text-slate-400 font-medium">Allow peers to discuss the contribution amount.</p>
               </div>
               <button 
                 type="button" 
                 onClick={() => setFormData({...formData, bargainEnabled: !formData.bargainEnabled})}
                 className={`w-10 h-5 rounded-full p-0.5 transition-all ${formData.bargainEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
               >
                 <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-all transform ${formData.bargainEnabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
               </button>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-left">
             <div className="flex justify-between items-center mb-4">
                <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Estimated Support</h4>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-xs">
                   <span className="text-slate-500 font-bold uppercase tracking-tighter">Base Support:</span>
                   <span className="text-slate-700 font-black">₹{est.base}</span>
                </div>
                {est.urgency > 0 && (
                  <div className="flex justify-between text-[9px] text-rose-500 font-black uppercase">
                    <span>Priority Fee:</span>
                    <span>+ ₹{est.urgency}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-slate-200">
                   <span className="text-slate-800 font-black uppercase tracking-widest text-[11px]">Suggested Total</span>
                   <span className="text-3xl font-black text-indigo-600">₹{est.total}</span>
                </div>
             </div>
          </div>

          <div className="flex gap-4 pt-4 border-t sticky bottom-0 bg-white">
            <button type="button" onClick={onClose} className="flex-1 py-4 font-black text-slate-400 text-[10px] tracking-widest uppercase">Go Back</button>
            <button type="submit" className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl shadow-indigo-100 active:scale-95 transition-all">Send Request</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
