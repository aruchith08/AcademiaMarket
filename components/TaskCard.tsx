
import React from 'react';
import { Task, TaskStatus } from '../types.ts';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  role: 'assigner' | 'writer';
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, role }) => {
  const statusColors: Record<TaskStatus, string> = {
    [TaskStatus.PENDING]: 'bg-slate-100 text-slate-600',
    [TaskStatus.REQUESTED]: 'bg-amber-100 text-amber-600',
    [TaskStatus.IN_PROGRESS]: 'bg-indigo-100 text-indigo-600',
    [TaskStatus.REVIEW]: 'bg-purple-100 text-purple-600',
    [TaskStatus.COMPLETED]: 'bg-emerald-100 text-emerald-600',
    [TaskStatus.CANCELLED]: 'bg-rose-100 text-rose-600',
  };

  const deadlineDate = new Date(task.deadline);
  const isUrgent = (deadlineDate.getTime() - Date.now()) < (1000 * 60 * 60 * 24 * 3); 

  return (
    <div 
      onClick={onClick}
      className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-100 transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${statusColors[task.status]}`}>
          {task.status}
        </span>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-black uppercase tracking-tighter">
          <i className="far fa-clock"></i>
          <span className={isUrgent ? 'text-rose-500' : ''}>
            {task.deadline}
          </span>
        </div>
      </div>

      <h3 className="font-black text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1 text-sm tracking-tight">
        {task.title}
      </h3>
      
      <p className="text-[11px] text-slate-500 mb-4 line-clamp-2 leading-relaxed font-medium">
        {task.description}
      </p>

      {task.status === TaskStatus.IN_PROGRESS && (
        <div className="mb-4 space-y-1.5">
           <div className="flex justify-between text-[8px] font-black text-indigo-400 uppercase tracking-widest">
              <span>Work Progress</span>
              <span>65%</span>
           </div>
           <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-[65%] rounded-full shadow-[0_0_8px_rgba(99,102,241,0.4)]"></div>
           </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-[9px] px-2 py-1 bg-slate-50 rounded-lg text-slate-500 font-black uppercase border border-slate-100">
          <i className="fas fa-book mr-1 text-indigo-300"></i> {task.subject}
        </span>
        <span className="text-[9px] px-2 py-1 bg-slate-50 rounded-lg text-slate-500 font-black uppercase border border-slate-100">
          <i className="fas fa-file-alt mr-1 text-indigo-300"></i> {task.pageCount} Pgs
        </span>
        {task.attachments && task.attachments.length > 0 && (
          <span className="text-[9px] px-2 py-1 bg-indigo-50 rounded-lg text-indigo-500 font-black uppercase border border-indigo-100">
            <i className="fas fa-paperclip mr-1"></i> {task.attachments.length} Files
          </span>
        )}
      </div>

      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
        <div>
          <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Expected Pay</p>
          <p className="text-lg font-black text-slate-800">
            ₹{task.agreedPrice || task.estimatedPrice}
          </p>
        </div>
        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:scale-110 shadow-sm">
          <i className="fas fa-arrow-right text-xs"></i>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
