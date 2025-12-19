
import React, { useState, useEffect, useRef } from 'react';
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
    format: 'Handwritten' as any, // Default to Handwritten
    bargainEnabled: true
  });

  const [attachments, setAttachments] = useState<TaskAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [est, setEst] = useState({ base: 0, urgency: 0, total: 10, details: '' });
  const [showUrgencyInfo, setShowUrgencyInfo] = useState(false);

  useEffect(() => {
    if (formData.deadline) {
      const result = calculateEstimation(
        formData.pages, 
        formData.format, 
        formData.deadline, 
        formData.basePricePerPage
      );
      setEst(result);
    } else {
      setEst({ 
        ...est, 
        base: formData.pages * formData.basePricePerPage,
        total: (formData.pages * formData.basePricePerPage) + est.urgency 
      });
    }
  }, [formData.pages, formData.format, formData.deadline, formData.basePricePerPage]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newAttachments: TaskAttachment[] = [...attachments];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Max 5MB.`);
        continue;
      }

      const reader = new FileReader();
      const filePromise = new Promise<TaskAttachment>((resolve) => {
        reader.onload = (event) => {
          resolve({
            name: file.name,
            type: file.type,
            size: file.size,
            data: event.target?.result as string
          });
        };
      });
      reader.readAsDataURL(file);
      const attachment = await filePromise;
      newAttachments.push(attachment);
    }

    setAttachments(newAttachments);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      pageCount: formData.pages,
      estimatedPrice: est.total,
      status: TaskStatus.PENDING,
      handshakeStatus: 'none',
      attachments,
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
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Requirements & Instructions</label>
              <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none min-h-[100px] font-medium" placeholder="Explain the task clearly. For handwritten work, specify ink color or paper type if needed..." />
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
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Source Files (Optional)</label>
              <div className="flex flex-wrap gap-3">
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl group animate-in slide-in-from-left-2">
                    <i className={`fas ${file.type.includes('image') ? 'fa-image' : 'fa-file-pdf'} text-indigo-400`}></i>
                    <span className="text-[10px] font-bold text-slate-600 max-w-[120px] truncate">{file.name}</span>
                    <button type="button" onClick={() => removeAttachment(idx)} className="text-slate-300 hover:text-rose-500 transition-colors">
                      <i className="fas fa-times-circle"></i>
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-all active:scale-95"
                >
                  <i className={`fas ${isUploading ? 'fa-spinner fa-spin' : 'fa-paperclip'}`}></i>
                  <span className="text-[10px] font-black uppercase tracking-widest">{isUploading ? 'Uploading...' : 'Attach File'}</span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                  multiple 
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>
              <p className="text-[9px] text-slate-400 italic">Upload the content for the writer to copy or use as reference.</p>
            </div>
          </div>

          <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 shadow-sm">
             <div className="flex justify-between items-center mb-4">
                <h4 className="font-black text-indigo-900 text-[10px] uppercase tracking-widest">Pricing Estimation</h4>
                <div className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">AI Estimated</div>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-xs">
                   <span className="text-slate-500 font-bold uppercase tracking-tighter">Base Cost ({formData.pages} pgs):</span>
                   <span className="text-slate-700 font-black">₹{est.base}</span>
                </div>
                <div className="flex justify-between text-xs group relative">
                   <div className="flex items-center gap-1 cursor-help" onClick={() => setShowUrgencyInfo(!showUrgencyInfo)}>
                      <span className="text-slate-500 font-bold uppercase tracking-tighter">Urgency Adjustment:</span>
                      <i className="fas fa-bolt text-amber-400 text-[10px]"></i>
                   </div>
                   <span className={`font-black ${est.urgency > 0 ? 'text-amber-600' : 'text-slate-400'}`}>+ ₹{est.urgency}</span>
                   
                   {showUrgencyInfo && (
                     <div className="absolute left-0 bottom-full mb-2 w-64 p-4 bg-slate-800 text-white text-[10px] rounded-2xl shadow-2xl z-20 animate-in fade-in slide-in-from-bottom-2 border border-slate-700">
                       <p className="font-black mb-2 uppercase tracking-widest text-amber-400 border-b border-white/10 pb-1">Urgency Pricing</p>
                       <p className="leading-relaxed text-slate-300 font-medium text-[9px]">Flat urgency fee based on deadline proximity. 
                       <br/>• Within 24h: <b className="text-white">₹100</b>
                       <br/>• Within 72h: <b className="text-white">₹50</b></p>
                       <button onClick={(e) => { e.stopPropagation(); setShowUrgencyInfo(false); }} className="mt-3 text-indigo-400 font-black uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-lg">Dismiss</button>
                     </div>
                   )}
                </div>
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-indigo-200/50">
                   <span className="text-indigo-900 font-black uppercase tracking-widest text-[11px]">Total Estimated Price</span>
                   <span className="text-3xl font-black text-indigo-600">₹{est.total}</span>
                </div>
                <p className="text-[9px] text-indigo-400 font-medium mt-2 leading-tight">{est.details}</p>
             </div>
          </div>

          <div className="flex gap-4 pt-4 border-t sticky bottom-0 bg-white">
            <button type="button" onClick={onClose} className="flex-1 py-4 font-black text-slate-400 text-[10px] tracking-widest uppercase hover:text-slate-600 transition-colors">Discard</button>
            <button type="submit" className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-xl shadow-indigo-100 active:scale-95 transition-all">Post Project Now</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
