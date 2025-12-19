
import React, { useState } from 'react';
import { Task, UserProfile, TaskStatus } from '../types.ts';
import { MOCK_USERS } from '../constants.ts';
import TaskCard from './TaskCard.tsx';
import Dashboard from './Dashboard.tsx';
import TaskForm from './TaskForm.tsx';
import WritersList from './WritersList.tsx';
import MessagesHub from './MessagesHub.tsx';
import RatingModal from './RatingModal.tsx';

interface AssignerPortalProps {
  user: UserProfile;
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
  onUpdateUser: (user: UserProfile) => void;
  onLogout: () => void;
}

const AssignerPortal: React.FC<AssignerPortalProps> = ({ user, tasks, onUpdateTasks, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'tasks' | 'writers' | 'messages' | 'profile'>('home');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [ratingTask, setRatingTask] = useState<Task | null>(null);

  const myTasks = tasks.filter(t => t.assignerId === user.id);

  const handlePostTask = (newTask: Partial<Task>) => {
    const task: Task = {
      ...newTask as Task,
      id: `t${Date.now()}`,
      assignerId: user.id,
      status: TaskStatus.PENDING,
      handshakeStatus: 'none',
      bargainEnabled: true,
      createdAt: new Date().toISOString(),
      format: (newTask as any).format || 'Digital'
    };
    onUpdateTasks([task, ...tasks]);
    setShowTaskForm(false);
    setActiveTab('tasks');
  };

  const handleUpdateStatus = (taskId: string, newStatus: TaskStatus) => {
    onUpdateTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    const updated = tasks.find(t => t.id === taskId);
    if (updated) setSelectedTask({ ...updated, status: newStatus });
  };

  const handleHandshake = (taskId: string, writerId: string, action: 'ask' | 'accept') => {
    onUpdateTasks(tasks.map(t => {
      if (t.id === taskId) {
        if (action === 'ask') return { ...t, writerId, handshakeStatus: 'assigner_invited', status: TaskStatus.REQUESTED };
        if (action === 'accept') return { ...t, writerId, handshakeStatus: 'accepted', status: TaskStatus.IN_PROGRESS };
      }
      return t;
    }));
  };

  const handleRatingSubmit = (rating: number, review: string) => {
    if (!ratingTask) return;
    onUpdateTasks(tasks.map(t => 
      t.id === ratingTask.id 
        ? { ...t, ratingFromAssigner: rating, reviewFromAssigner: review } 
        : t
    ));
    setRatingTask(null);
    alert("Thank you! Your feedback helps the community grow.");
  };

  return (
    <div className="pb-24 md:pb-0">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-none">AcademiaMarket</h1>
            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-1">Student Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowTaskForm(true)}
            className="md:hidden w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm active:scale-95 transition-all"
          >
            <i className="fas fa-plus"></i>
          </button>
          <button onClick={() => setActiveTab('profile')} className="w-10 h-10 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm ring-2 ring-indigo-50 transition-all hover:scale-110">
            <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
        <aside className="hidden md:flex flex-col gap-2 w-64 shrink-0">
          <button onClick={() => setActiveTab('home')} className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'home' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}><i className="fas fa-home"></i> Dashboard</button>
          <button onClick={() => setActiveTab('writers')} className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'writers' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}><i className="fas fa-user-edit"></i> Browse Writers</button>
          <button onClick={() => setActiveTab('tasks')} className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'tasks' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}><i className="fas fa-tasks"></i> My Projects</button>
          <button onClick={() => setActiveTab('messages')} className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'messages' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}><i className="fas fa-comment-dots"></i> Conversations</button>
          <div className="mt-8">
            <button onClick={() => setShowTaskForm(true)} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-lg shadow-emerald-100 hover:bg-emerald-600 active:scale-95 transition-all">New Project</button>
          </div>
        </aside>

        <section className="flex-1">
          {selectedTask ? (
            <div className="grid grid-cols-1 gap-8 animate-in slide-in-from-right-4 duration-300">
               <div className="space-y-6">
                  <button onClick={() => setSelectedTask(null)} className="px-4 py-2 bg-white rounded-xl text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-indigo-600 flex items-center gap-2 border border-slate-100 shadow-sm transition-all active:scale-95"><i className="fas fa-arrow-left"></i> Back to Dashboard</button>
                  <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                    <h2 className="text-3xl font-black text-slate-800 leading-tight mb-4 tracking-tight">{selectedTask.title}</h2>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 font-medium text-slate-600 text-sm leading-relaxed">
                       {selectedTask.description}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {selectedTask.status === TaskStatus.REQUESTED && selectedTask.handshakeStatus === 'writer_requested' && (
                         <button onClick={() => handleHandshake(selectedTask.id, selectedTask.writerId!, 'accept')} className="flex-1 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100">Accept Proposal</button>
                      )}
                      {selectedTask.status === TaskStatus.REVIEW && (
                         <button onClick={() => handleUpdateStatus(selectedTask.id, TaskStatus.COMPLETED)} className="flex-1 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100">Confirm Work & Mark Completed</button>
                      )}
                      {selectedTask.status === TaskStatus.COMPLETED && !selectedTask.ratingFromAssigner && (
                         <button onClick={() => setRatingTask(selectedTask)} className="flex-1 py-5 bg-yellow-400 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-yellow-100 active:scale-95 transition-all">Rate Writer Experience</button>
                      )}
                      {selectedTask.handshakeStatus === 'accepted' && (
                        <button onClick={() => setActiveTab('messages')} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-[2rem] font-black text-xs uppercase tracking-widest">Open Secure Chat</button>
                      )}
                    </div>
                  </div>
               </div>
            </div>
          ) : (
            <>
              {activeTab === 'home' && <Dashboard role="assigner" tasks={myTasks} />}
              {activeTab === 'writers' && <WritersList users={MOCK_USERS} assignerTasks={myTasks} onAsk={(w, tId) => handleHandshake(tId, w.id, 'ask')} />}
              {activeTab === 'tasks' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">My Active Projects</h2>
                    {myTasks.length > 0 && (
                      <button onClick={() => setShowTaskForm(true)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">+ New Task</button>
                    )}
                  </div>

                  {myTasks.length === 0 ? (
                    <div className="py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-10">
                       <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-8 text-slate-200 border border-slate-100 shadow-sm">
                          <i className="fas fa-clipboard-list text-5xl"></i>
                       </div>
                       <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-3">Your desk is clean!</h3>
                       <p className="text-slate-400 text-sm font-medium max-w-sm mx-auto leading-relaxed mb-10">You haven't posted any academic projects yet. Need help with records, assignments, or notes? Get started now.</p>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mb-10">
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 text-left">
                             <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center text-xs"><i className="fas fa-check"></i></div>
                             <div>
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Direct Connect</p>
                                <p className="text-[9px] text-slate-400 font-bold">Chat with writers directly</p>
                             </div>
                          </div>
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 text-left">
                             <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center text-xs"><i className="fas fa-users"></i></div>
                             <div>
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Verified Writers</p>
                                <p className="text-[9px] text-slate-400 font-bold">45+ Active Today</p>
                             </div>
                          </div>
                       </div>

                       <button 
                         onClick={() => setShowTaskForm(true)} 
                         className="px-12 py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all"
                       >
                         Post Your First Project
                       </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {myTasks.map(t => <TaskCard key={t.id} task={t} onClick={() => setSelectedTask(t)} role="assigner" />)}
                    </div>
                  )}
                </div>
              )}
              {activeTab === 'messages' && <MessagesHub tasks={tasks} user={user} onUpdateTasks={onUpdateTasks} />}
              {activeTab === 'profile' && (
                <div className="max-w-2xl mx-auto bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-in zoom-in-95 duration-200">
                   <div className="flex flex-col items-center text-center gap-6">
                      <img src={user.avatar} className="w-32 h-32 rounded-[2.5rem] object-cover ring-4 ring-slate-50 shadow-md" />
                      <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight">{user.name}</h2>
                        <p className="text-indigo-600 font-bold uppercase text-[10px] tracking-widest mt-1">Premium Assigner Account</p>
                      </div>
                      <div className="w-full grid grid-cols-2 gap-4 mt-4">
                         <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Projects Posted</p>
                            <p className="text-2xl font-black text-slate-800">{myTasks.length}</p>
                         </div>
                         <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Market Trust</p>
                            <p className="text-2xl font-black text-emerald-600">4.8 ★</p>
                         </div>
                      </div>
                      <div className="w-full space-y-3 pt-6">
                         <button className="w-full py-5 bg-slate-50 text-slate-600 rounded-[2rem] font-black uppercase text-[10px] tracking-widest border border-slate-100 hover:bg-slate-100 transition-all">Edit Account Details</button>
                         <button onClick={onLogout} className="w-full py-5 bg-rose-50 text-rose-500 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-rose-100 transition-all active:scale-95">Sign Out Session</button>
                      </div>
                   </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-4 flex items-center justify-between md:hidden z-40 shadow-[0_-8px_30px_rgb(0,0,0,0.06)]">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'home' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <i className="fas fa-home text-lg"></i><span className="text-[9px] font-black uppercase tracking-tighter">Stats</span>
        </button>
        <button onClick={() => setActiveTab('tasks')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'tasks' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <i className="fas fa-tasks text-lg"></i><span className="text-[9px] font-black uppercase tracking-tighter">Work</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('writers')} 
          className="w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-200 -mt-10 flex flex-col items-center justify-center border-4 border-slate-50 active:scale-90 transition-all"
        >
          <i className="fas fa-user-pen text-xl"></i>
          <span className="text-[7px] font-black uppercase mt-1">Ask Help</span>
        </button>

        <button onClick={() => setActiveTab('messages')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'messages' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <i className="fas fa-comment-dots text-lg"></i><span className="text-[9px] font-black uppercase tracking-tighter">Chat</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'profile' ? 'text-indigo-600' : 'text-slate-400'}`}>
          <i className="fas fa-user-cog text-lg"></i><span className="text-[9px] font-black uppercase tracking-tighter">Me</span>
        </button>
      </nav>

      {showTaskForm && <TaskForm onClose={() => setShowTaskForm(false)} onSubmit={handlePostTask} />}
      {ratingTask && (
        <RatingModal 
          task={ratingTask} 
          role="assigner" 
          onClose={() => setRatingTask(null)} 
          onSubmit={handleRatingSubmit} 
        />
      )}
    </div>
  );
};

export default AssignerPortal;
