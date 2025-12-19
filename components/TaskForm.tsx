
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

  const [showGuide, setShowGuide] = useState(false);
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
              <div className="flex justify-between items-end mb-1 px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Description & Links</label>
                <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase">Paste Document Links Here</span>
              </div>
              <textarea 
                required 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none min-h-[120px] font-medium text-sm leading-relaxed" 
                placeholder="Explain the task clearly and paste your Google Drive/Dropbox links here..." 
              />
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

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Attachment Guide</label>
                <button 
                  type="button" 
                  onClick={() => setShowGuide(!showGuide)}
                  className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-all"
                >
                  {showGuide ? 'Hide Instructions' : 'How to Share Files?'}
                </button>
              </div>
              
              {!showGuide ? (
                <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center gap-4 cursor-pointer hover:border-indigo-200 hover:bg-indigo-50/30 transition-all" onClick={() => setShowGuide(true)}>
                   <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100">
                      <i className="fas fa-link"></i>
                   </div>
                   <div className="text-left">
                      <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">Direct Uploads Resuming Soon</p>
                      <p className="text-[9px] text-slate-500 font-medium">Click to see how to paste Google Drive links instead.</p>
                   </div>
                </div>
              ) : (
                <div className="bg-indigo-50/50 p-6 rounded-[2rem] border border-indigo-100 animate-in slide-in-from-top-4 duration-300">
                  <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <i className="fas fa-info-circle"></i> 4 Simple Steps to Share Files
                  </h4>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-white text-indigo-600 flex items-center justify-center text-[10px] font-black shadow-sm shrink-0">1</div>
                      <div>
                         <p className="text-xs font-black text-slate-800">Upload to Drive / Dropbox</p>
                         <p className="text-[10px] text-slate-500 font-medium">Open your cloud storage and upload your PDFs or Images.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-white text-indigo-600 flex items-center justify-center text-[10px] font-black shadow-sm shrink-0">2</div>
                      <div>
                         <p className="text-xs font-black text-slate-800">Enable Sharing</p>
                         <p className="text-[10px] text-slate-500 font-medium">Right-click the file → <span className="text-indigo-600 font-bold">Share</span>. Change restricted to <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-bold text-[9px]">Anyone with the link</span>.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-white text-indigo-600 flex items-center justify-center text-[10px] font-black shadow-sm shrink-0">3</div>
                      <div>
                         <p className="text-xs font-black text-slate-800">Copy the Link</p>
                         <p className="text-[10px] text-slate-500 font-medium">Click the "Copy link" button in the share window.</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-white text-indigo-600 flex items-center justify-center text-[10px] font-black shadow-sm shrink-0">4</div>
                      <div>
                         <p className="text-xs font-black text-slate-800">Paste in Description</p>
                         <p className="text-[10px] text-slate-500 font-medium">Come back here and paste the link into the <span className="text-indigo-600 font-bold">Requirements</span> field above.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-indigo-100/50 flex items-center gap-4">
                     <div className="flex -space-x-2">
                        <div className="w-7 h-7 bg-white rounded-lg shadow-sm flex items-center justify-center border border-indigo-50"><i className="fab fa-google-drive text-blue-500 text-[10px]"></i></div>
                        <div className="w-7 h-7 bg-white rounded-lg shadow-sm flex items-center justify-center border border-indigo-50"><i className="fab fa-dropbox text-blue-400 text-[10px]"></i></div>
                     </div>
                     <p className="text-[9px] text-indigo-400 font-bold italic">Supports Google Drive, Dropbox, & OneDrive</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
             <div className="flex justify-between items-center mb-4">
                <h4 className="font-black text-slate-400 text-[10px] uppercase tracking-widest">Pricing Estimation</h4>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-xs">
                   <span className="text-slate-500 font-bold uppercase tracking-tighter">Project Cost:</span>
                   <span className="text-slate-700 font-black">₹{est.base}</span>
                </div>
                {est.urgency > 0 && (
                  <div className="flex justify-between text-[9px] text-rose-500 font-black uppercase">
                    <span>Urgency Fee:</span>
                    <span>+ ₹{est.urgency}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-slate-200">
                   <span className="text-slate-800 font-black uppercase tracking-widest text-[11px]">Total Estimated Price</span>
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
