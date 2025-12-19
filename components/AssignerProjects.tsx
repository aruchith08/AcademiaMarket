
import React from 'react';
import { Task, UserProfile, TaskStatus } from '../types.ts';
import TaskCard from './TaskCard.tsx';

interface AssignerProjectsProps {
  tasks: Task[];
  user: UserProfile;
  onSelectTask: (taskId: string) => void;
  onPostNew: () => void;
}

const AssignerProjects: React.FC<AssignerProjectsProps> = ({ tasks, user, onSelectTask, onPostNew }) => {
  const pendingTasks = tasks.filter(t => t.status === TaskStatus.PENDING || t.status === TaskStatus.REQUESTED);
  const activeTasks = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS || t.status === TaskStatus.REVIEW);
  const completedTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED);

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">My Desk</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking your academic needs</p>
        </div>
        {tasks.length > 0 && (
          <button onClick={onPostNew} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 hover:bg-indigo-100 transition-all">+ New Task</button>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-10">
          <i className="fas fa-clipboard-list text-5xl text-slate-100 mb-6"></i>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-3">Your desk is clean!</h3>
          <p className="text-slate-400 text-sm font-medium max-w-sm mx-auto leading-relaxed mb-10">You haven't posted any academic projects yet. Need help with records or assignments?</p>
          <button onClick={onPostNew} className="px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all">Post Your First Project</button>
        </div>
      ) : (
        <div className="space-y-12">
          {pendingTasks.length > 0 && (
            <div>
              <SectionHeader title="Open Market / Pending" count={pendingTasks.length} color="bg-amber-400" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingTasks.map(t => <TaskCard key={t.id} task={t} onClick={() => onSelectTask(t.id)} role="assigner" collegeName={user.collegeName} />)}
              </div>
            </div>
          )}

          {activeTasks.length > 0 && (
            <div>
              <SectionHeader title="In Progress & Review" count={activeTasks.length} color="bg-indigo-500" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeTasks.map(t => <TaskCard key={t.id} task={t} onClick={() => onSelectTask(t.id)} role="assigner" collegeName={user.collegeName} />)}
              </div>
            </div>
          )}

          {completedTasks.length > 0 && (
            <div>
              <SectionHeader title="Completed History" count={completedTasks.length} color="bg-emerald-500" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedTasks.map(t => <TaskCard key={t.id} task={t} onClick={() => onSelectTask(t.id)} role="assigner" collegeName={user.collegeName} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignerProjects;
