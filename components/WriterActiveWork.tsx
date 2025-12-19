
import React from 'react';
import { Task, UserProfile, TaskStatus } from '../types.ts';
import TaskCard from './TaskCard.tsx';

interface WriterActiveWorkProps {
  tasks: Task[];
  allUsers: UserProfile[];
  onSelectTask: (taskId: string) => void;
}

const WriterActiveWork: React.FC<WriterActiveWorkProps> = ({ tasks, allUsers, onSelectTask }) => {
  const requestedTasks = tasks.filter(t => t.status === TaskStatus.REQUESTED);
  const inProgressTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS);
  const reviewTasks = tasks.filter(t => t.status === TaskStatus.REVIEW);

  const SectionHeader = ({ title, count, color }: { title: string; count: number; color: string }) => (
    <div className="flex items-center justify-between mb-4 px-2">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h4>
      </div>
      <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-lg">{count}</span>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Active Work</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Managing your commitments</p>
      </div>

      {tasks.length === 0 ? (
        <div className="py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-8">
           <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-slate-200 border border-slate-100 shadow-sm">
              <i className="fas fa-tasks text-4xl"></i>
           </div>
           <p className="text-slate-800 font-black text-xl tracking-tight mb-2">Workspace Empty</p>
           <p className="text-slate-400 text-xs font-medium max-w-[250px] mx-auto leading-relaxed">
             You haven't picked up any tasks yet. Head to the task board to find work.
           </p>
        </div>
      ) : (
        <div className="space-y-12">
          {requestedTasks.length > 0 && (
            <div>
              <SectionHeader title="Awaiting Approval" count={requestedTasks.length} color="bg-amber-400" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {requestedTasks.map(t => (
                  <TaskCard 
                    key={t.id} 
                    task={t} 
                    onClick={() => onSelectTask(t.id)} 
                    role="writer" 
                    collegeName={allUsers.find(u => u.id === t.assignerId)?.collegeName} 
                  />
                ))}
              </div>
            </div>
          )}
          
          {inProgressTasks.length > 0 && (
            <div>
              <SectionHeader title="In Progress" count={inProgressTasks.length} color="bg-indigo-500" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inProgressTasks.map(t => (
                  <TaskCard 
                    key={t.id} 
                    task={t} 
                    onClick={() => onSelectTask(t.id)} 
                    role="writer" 
                    collegeName={allUsers.find(u => u.id === t.assignerId)?.collegeName} 
                  />
                ))}
              </div>
            </div>
          )}

          {reviewTasks.length > 0 && (
            <div>
              <SectionHeader title="Under Review" count={reviewTasks.length} color="bg-purple-500" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviewTasks.map(t => (
                  <TaskCard 
                    key={t.id} 
                    task={t} 
                    onClick={() => onSelectTask(t.id)} 
                    role="writer" 
                    collegeName={allUsers.find(u => u.id === t.assignerId)?.collegeName} 
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WriterActiveWork;
