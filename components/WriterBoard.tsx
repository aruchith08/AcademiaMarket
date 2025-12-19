
import React, { useState, useMemo } from 'react';
import { Task, UserProfile, TaskStatus } from '../types.ts';
import TaskCard from './TaskCard.tsx';

interface WriterBoardProps {
  tasks: Task[];
  user: UserProfile;
  allUsers: UserProfile[];
  onSelectTask: (taskId: string) => void;
}

const WriterBoard: React.FC<WriterBoardProps> = ({ tasks, user, allUsers, onSelectTask }) => {
  const [filter, setFilter] = useState<'all' | 'college' | 'nearby'>('all');

  const availableTasks = useMemo(() => {
    let filtered = tasks.filter(t => t.status === TaskStatus.PENDING);
    if (filter === 'all') return filtered;
    return filtered.filter(t => {
      const assigner = allUsers.find(u => u.id === t.assignerId);
      if (!assigner) return false;
      if (filter === 'college') return assigner.collegeName?.toLowerCase() === user.collegeName?.toLowerCase();
      if (filter === 'nearby') return assigner.pincode === user.pincode;
      return true;
    });
  }, [tasks, filter, allUsers, user]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Available Tasks</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Find your next project</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>All</button>
          <button onClick={() => setFilter('college')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'college' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>My College</button>
          <button onClick={() => setFilter('nearby')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'nearby' ? 'bg-amber-500 text-white' : 'text-slate-400'}`}>Near Me</button>
        </div>
      </div>
      
      {availableTasks.length === 0 ? (
        <div className="py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-8">
           <i className="fas fa-search-minus text-4xl text-slate-100 mb-4"></i>
           <p className="text-slate-800 font-black text-lg">No tasks found</p>
           <p className="text-slate-400 text-xs font-medium">Try changing your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableTasks.map(t => {
            const assigner = allUsers.find(u => u.id === t.assignerId);
            return (
              <TaskCard 
                key={t.id} 
                task={t} 
                onClick={() => onSelectTask(t.id)} 
                role="writer" 
                collegeName={assigner?.collegeName} 
                isCollegeMatch={assigner?.collegeName === user.collegeName} 
                isNearby={assigner?.pincode === user.pincode} 
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WriterBoard;
