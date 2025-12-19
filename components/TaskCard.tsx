
import React from 'react';
import { Task, TaskStatus } from '../types.ts';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  role: 'assigner' | 'writer';
  collegeName?: string;
  isCollegeMatch?: boolean;
  isNearby?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  onClick, 
  role, 
  collegeName, 
  isCollegeMatch, 
  isNearby 
}) => {
  const statusColors: Record<TaskStatus, string> = {
    [TaskStatus.PENDING]: 'bg-slate-50 text-slate-500 border-slate-100',
    [TaskStatus.REQUESTED]: 'bg-amber-50 text-amber-600 border-amber-100',
    [TaskStatus.IN_PROGRESS]: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    [TaskStatus.REVIEW]: 'bg-purple-50 text-purple-600 border-purple-100',
    [TaskStatus.COMPLETED]: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    [TaskStatus.CANCELLED]: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all cursor-pointer group relative overflow-hidden"
    >
      {/* Top Badges Area */}
      <div className="flex flex-wrap gap-2 mb-4">
        {isCollegeMatch && (
          <span className="bg-indigo-600 text-white text-[8px] font-black uppercase px-3 py-1.5 rounded-xl shadow-lg shadow-indigo-200 animate-in fade-in slide-in-from-top-2">
            College Match
          </span>
        )}
        {isNearby && (
          <span className="bg-amber-500 text-white text-[8px] font-black uppercase px-3 py-1.5 rounded-xl shadow-lg shadow-amber-200 animate-in fade-in slide-in-from-top-2">
            Nearby
          </span>
        )}
      </div>

      {/* Status and Deadline */}
      <div className="flex justify-between items-center mb-5">
        <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-2xl border ${statusColors[task.status]}`}>
          {task.status}
        </span>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
          <i className="far fa-clock"></i>
          <span>{task.deadline}</span>
        </div>
      </div>

      {/* Content */}
      <h3 className="font-black text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors text-base tracking-tight leading-tight">
        {task.title}
      </h3>
      
      <p className="text-[12px] text-slate-500 mb-6 line-clamp-2 leading-relaxed font-medium">
        {task.description}
      </p>

      {/* Pill Indicators */}
      <div className="flex flex-wrap gap-3 mb-6">
        <span className="flex items-center gap-2 text-[10px] px-4 py-2 bg-slate-50 rounded-2xl text-slate-500 font-black uppercase border border-slate-100/50">
          <i className="fas fa-book text-indigo-400"></i> {task.subject}
        </span>
        <span className="flex items-center gap-2 text-[10px] px-4 py-2 bg-slate-50 rounded-2xl text-slate-500 font-black uppercase border border-slate-100/50">
          <i className="fas fa-file-alt text-indigo-400"></i> {task.pageCount} Pgs
        </span>
      </div>

      {/* Bottom Section */}
      <div className="pt-6 border-t border-slate-50">
        <div className="flex items-end justify-between mb-4">
          <div>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.1em] mb-1">Expected Pay</p>
            <p className="text-2xl font-black text-slate-800 leading-none">
              ₹{task.agreedPrice || task.estimatedPrice}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all transform group-hover:scale-110 shadow-sm border border-slate-100">
            <i className="fas fa-arrow-right text-xs"></i>
          </div>
        </div>
        
        {/* College Name Footer */}
        {collegeName && (
          <div className="text-center mt-2 opacity-50">
            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest leading-relaxed line-clamp-1">
              {collegeName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
