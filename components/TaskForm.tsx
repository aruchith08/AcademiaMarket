
import React, { useState, useEffect } from 'react';
import { calculateEstimation } from '../services/pricingUtils.ts';
import { Task, TaskStatus, TaskAttachment } from '../types.ts';

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
      attachments: [], // Currently disabled
      createdAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-stable shadow-2xl animate-in zoom-in duration-200">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
                <i className="fas fa-plus"></i>
             </div>
             <h2 className="text-2xl font-black text-slate-800 tracking-tight">Post New Project</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-medium" placeholder="e.g. Physics Record Completion" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                <input required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-medium" placeholder="Physics / Chemistry" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Requirements</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none min-h-[100px] font-medium" placeholder="Explain the task clearly..." />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pages</label>
                <input type="number" min="1" value={formData.pages} onChange={e => setFormData({...formData, pages: parseInt(e.target.value) || 1})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rate (₹/pg)</label>
                <input type="number" min="1" value={formData.basePricePerPage} onChange={e => setFormData({...formData, basePricePerPage: parseInt(e.target.value) || 0})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-black text-indigo-600" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Format</label>
                <select value={formData.format} onChange={e => setFormData({...formData, format: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none bg-white font-bold text-slate-700">
                  <option value="Handwritten">Handwritten</option>
                  <option value="Digital">Digital</option>
                  <option value="Mixed">Mixed</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deadline</label>
                <input required type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none font-medium" />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Documents & Attachments</label>
              
              <div className="p-6 bg-indigo-50/50 rounded-2xl border-2 border-dashed border-indigo-100 flex flex-col items-center justify-center text-center gap-3">
                 <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-indigo-500 shadow-sm">
                    <i className="fas fa-tools text-xl"></i>
                 </div>
                 <div>
                    <p className="text-xs font-black text-slate-700 uppercase tracking-tight">File Uploads Currently Unavailable</p>
                    <p className="text-[9px] text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">We are working on this feature! For now, please include links to documents (Google Drive/Dropbox) in the description above.</p>
                 </div>
              </div>
              
              <p className="text-[9px] text-slate-400 italic text-center">Restoration in progress... 🚀</p>
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <h4 className="font-black text-indigo-900 text-[10px] uppercase tracking-widest">Pricing Estimation</h4>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-xs">
                   <span className="text-slate-500 font-bold uppercase tracking-tighter">Base Cost:</span>
                   <span className="text-slate-700 font-black">₹{est.base}</span>
                </div>
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-indigo-200/50">
                   <span className="text-indigo-900 font-black uppercase tracking-widest text-[11px]">Total Estimated Price</span>
                   <span className="text-3xl font-black text-indigo-600">₹{est.total}</span>
                </div>
             </div>
          </div>

          <div className="flex gap-4 pt-4 border-t sticky bottom-0 bg-white">
            <button type="button" onClick={onClose} className="flex-1 py-4 font-black text-slate-400 text-[10px] tracking-widest uppercase">Discard</button>
            <button type="submit" className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl shadow-indigo-100 active:scale-95 transition-all">Post Project Now</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
