
import React, { useState } from 'react';
import { Task, UserProfile, TaskStatus } from '../types.ts';
import TaskCard from './TaskCard.tsx';
import Dashboard from './Dashboard.tsx';
import MessagesHub from './MessagesHub.tsx';

interface WriterPortalProps {
  user: UserProfile;
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
  onUpdateUser: (user: UserProfile) => void;
  onLogout: () => void;
  onFirestoreUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
}

const WriterPortal: React.FC<WriterPortalProps> = ({ 
  user, 
  tasks, 
  onUpdateUser, 
  onLogout, 
  onFirestoreUpdate 
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'board' | 'my-projects' | 'messages' | 'profile'>('home');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  
  const [editPrice, setEditPrice] = useState(user.pricePerPage || 10);
  const [editBio, setEditBio] = useState(user.bio || '');
  const [isReady, setIsReady] = useState(!user.isBusy);

  const selectedTask = tasks.find(t => t.id === selectedTaskId) || null;
  const availableTasks = tasks.filter(t => t.status === TaskStatus.PENDING);
  const myActiveTasks = tasks.filter(t => t.writerId === user.id);

  const inProgressTasks = myActiveTasks.filter(t => t.status === TaskStatus.IN_PROGRESS || t.status === TaskStatus.REQUESTED);
  const reviewTasks = myActiveTasks.filter(t => t.status === TaskStatus.REVIEW);
  const completedTasks = myActiveTasks.filter(t => t.status === TaskStatus.COMPLETED);

  const handleHandshake = async (taskId: string, action: 'request' | 'accept') => {
    if (action === 'request') {
      await onFirestoreUpdate(taskId, { 
        writerId: user.id, 
        handshakeStatus: 'writer_requested', 
        status: TaskStatus.REQUESTED 
      });
    } else if (action === 'accept') {
      await onFirestoreUpdate(taskId, { 
        handshakeStatus: 'accepted', 
        status: TaskStatus.IN_PROGRESS 
      });
    }
    setSelectedTaskId(null);
  };

  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    await onFirestoreUpdate(taskId, { status: newStatus });
  };

  const saveProfile = () => {
    onUpdateUser({ ...user, pricePerPage: editPrice, bio: editBio, isBusy: !isReady });
    alert("Profile updated successfully!");
  };

  return (
    <div className="pb-24 md:pb-0">
      <header className="bg-white/80 backdrop-blur-lg border-b sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <i className="fas fa-pen-nib"></i>
          </div>
          <div className="leading-tight">
            <h1 className="text-xl font-black text-slate-800 tracking-tighter">AcademiaMarket</h1>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Writer Mode</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveTab('profile')} className="w-10 h-10 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-indigo-100 transition-all">
            <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
        <aside className="hidden md:flex flex-col gap-2 w-72 shrink-0">
          <button onClick={() => setActiveTab('home')} className={`flex items-center justify-between px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'home' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}>
            <span><i className="fas fa-chart-pie mr-3"></i> Statistics</span>
          </button>
          <button onClick={() => setActiveTab('board')} className={`flex items-center justify-between px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'board' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}>
            <span><i className="fas fa-rocket mr-3"></i> Find Tasks</span>
            {availableTasks.length > 0 && <span className={`px-2 py-0.5 rounded-lg text-[9px] ${activeTab === 'board' ? 'bg-white/20' : 'bg-indigo-100 text-indigo-600'}`}>{availableTasks.length}</span>}
          </button>
          <button onClick={() => setActiveTab('my-projects')} className={`flex items-center justify-between px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'my-projects' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}>
            <span><i className="fas fa-tasks mr-3"></i> Active Work</span>
            {myActiveTasks.length > 0 && <span className={`px-2 py-0.5 rounded-lg text-[9px] ${activeTab === 'my-projects' ? 'bg-white/20' : 'bg-indigo-100 text-indigo-600'}`}>{myActiveTasks.length}</span>}
          </button>
          <button onClick={() => setActiveTab('messages')} className={`flex items-center justify-between px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'messages' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}>
            <span><i className="fas fa-comment-dots mr-3"></i> Messages</span>
          </button>
          <button onClick={() => setActiveTab('profile')} className={`flex items-center justify-between px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}>
            <span><i className="fas fa-user-cog mr-3"></i> Settings</span>
          </button>
        </aside>

        <section className="flex-1 min-h-[70vh]">
          {selectedTask ? (
            <div className="grid grid-cols-1 gap-8 animate-in slide-in-from-right-8 duration-300">
               <div className="space-y-6">
                  <button onClick={() => setSelectedTaskId(null)} className="px-4 py-2 bg-white rounded-xl text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-indigo-600 flex items-center gap-2 border border-slate-100 shadow-sm transition-all active:scale-95"><i className="fas fa-arrow-left"></i> Back to Workflow</button>
                  <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><i className="fas fa-file-contract text-9xl"></i></div>
                    <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">{selectedTask.title}</h2>
                    <div className="flex items-center gap-4 mb-6">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{selectedTask.subject}</span>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">{selectedTask.pageCount} Pages</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${selectedTask.format === 'Handwritten' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>{selectedTask.format}</span>
                    </div>
                    
                    <div className="space-y-4 mb-8">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Instructions</p>
                       <div className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 font-medium text-slate-600 text-sm leading-relaxed">
                          {selectedTask.description}
                       </div>
                    </div>

                    {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                       <div className="space-y-3 mb-8">
                          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">Source Materials ({selectedTask.attachments.length})</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                             {selectedTask.attachments.map((file, idx) => (
                                <a key={idx} href={file.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-indigo-300 transition-all shadow-sm group">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                         <i className={`fas ${file.type.includes('image') ? 'fa-image' : 'fa-file-pdf'} text-lg`}></i>
                                      </div>
                                      <div className="min-w-0">
                                         <p className="text-[11px] font-black text-slate-800 truncate pr-2">{file.name}</p>
                                      </div>
                                   </div>
                                   <div className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                      <i className="fas fa-external-link-alt"></i>
                                   </div>
                                </a>
                             ))}
                          </div>
                       </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4">
                      {selectedTask.status === TaskStatus.PENDING && (
                        <button onClick={() => handleHandshake(selectedTask.id, 'request')} className="flex-1 py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-indigo-200 active:scale-95 transition-all">Submit Proposal</button>
                      )}
                      {selectedTask.status === TaskStatus.IN_PROGRESS && (
                        <>
                          <button onClick={() => updateTaskStatus(selectedTask.id, TaskStatus.REVIEW)} className="flex-1 py-5 bg-white text-indigo-600 border-2 border-indigo-100 rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-indigo-50 active:scale-95 transition-all">Send Draft for Review</button>
                          <button onClick={() => updateTaskStatus(selectedTask.id, TaskStatus.COMPLETED)} className="flex-1 py-5 bg-emerald-500 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-100 active:scale-95 transition-all">Final Submission</button>
                        </>
                      )}
                      {selectedTask.handshakeStatus === 'accepted' && (
                        <button onClick={() => setActiveTab('messages')} className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-[2rem] font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">Open Chat</button>
                      )}
                    </div>
                  </div>
               </div>
            </div>
          ) : (
            <>
              {activeTab === 'home' && <Dashboard role="writer" tasks={myActiveTasks} />}
              
              {activeTab === 'board' && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Available Tasks</h2>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">{availableTasks.length} items</span>
                  </div>
                  
                  {availableTasks.length === 0 ? (
                    <div className="py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-8">
                       <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-slate-200 border border-slate-100 shadow-sm">
                          <i className="fas fa-search-minus text-4xl"></i>
                       </div>
                       <p className="text-slate-800 font-black text-xl tracking-tight mb-2">Marketplace is quiet</p>
                       <p className="text-slate-400 text-xs font-medium max-w-[250px] leading-relaxed">There are currently no new academic tasks available. Check back soon for new opportunities!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {availableTasks.map(t => <TaskCard key={t.id} task={t} onClick={() => setSelectedTaskId(t.id)} role="writer" />)}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'my-projects' && (
                <div className="space-y-12 animate-in fade-in duration-500">
                  {myActiveTasks.length === 0 ? (
                    <div className="py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-8">
                       <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center mb-6 text-indigo-200 border border-indigo-50 shadow-sm">
                          <i className="fas fa-briefcase text-4xl"></i>
                       </div>
                       <p className="text-slate-800 font-black text-xl tracking-tight mb-2">No Active Projects</p>
                       <p className="text-slate-400 text-xs font-medium mb-6">Head over to the task board to find work.</p>
                       <button onClick={() => setActiveTab('board')} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100">Browse Board</button>
                    </div>
                  ) : (
                    <>
                      {inProgressTasks.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] ml-2">Currently Working On</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {inProgressTasks.map(t => <TaskCard key={t.id} task={t} onClick={() => setSelectedTaskId(t.id)} role="writer" />)}
                          </div>
                        </div>
                      )}

                      {reviewTasks.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] ml-2">Waiting for Review</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-90">
                            {reviewTasks.map(t => <TaskCard key={t.id} task={t} onClick={() => setSelectedTaskId(t.id)} role="writer" />)}
                          </div>
                        </div>
                      )}

                      {completedTasks.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Recently Completed</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-75 grayscale-[0.5]">
                            {completedTasks.map(t => <TaskCard key={t.id} task={t} onClick={() => setSelectedTaskId(t.id)} role="writer" />)}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {activeTab === 'messages' && <MessagesHub tasks={tasks} user={user} onFirestoreUpdate={onFirestoreUpdate} />}
              
              {activeTab === 'profile' && (
                <div className="max-w-2xl mx-auto bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100 animate-in zoom-in-95 duration-200">
                   <h2 className="text-3xl font-black text-slate-800 mb-8 tracking-tighter">Writer Settings</h2>
                   
                   <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 mb-10 flex items-center justify-between">
                      <div>
                         <h4 className="text-lg font-black text-indigo-900 tracking-tight">Accepting New Work</h4>
                         <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Show yourself on the writer board</p>
                      </div>
                      <button onClick={() => setIsReady(!isReady)} className={`w-14 h-8 rounded-full p-1 transition-all ${isReady ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                         <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all transform ${isReady ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </button>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Writing Rate (₹ / Page)</label>
                         <div className="relative">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-indigo-400 font-black">₹</span>
                            <input type="number" value={editPrice} onChange={(e) => setEditPrice(Number(e.target.value))} className="w-full pl-12 pr-6 py-5 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none font-black text-indigo-600 text-2xl shadow-inner transition-all" />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Professional Bio</label>
                         <textarea value={editBio} onChange={(e) => setEditBio(e.target.value)} className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 border-2 border-transparent focus:border-indigo-500 outline-none min-h-[150px] text-sm font-medium shadow-inner resize-none transition-all" />
                      </div>
                      <div className="flex flex-col gap-3 pt-6">
                         <button onClick={saveProfile} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-indigo-100 active:scale-95 transition-all">Update My Rates</button>
                         <button onClick={onLogout} className="w-full py-5 bg-rose-50 text-rose-500 rounded-[2rem] font-black uppercase text-xs tracking-widest hover:bg-rose-100 transition-all active:scale-95">Sign Out</button>
                      </div>
                   </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-4 flex items-center justify-between md:hidden z-40 shadow-[0_-8px_30px_rgb(0,0,0,0.06)]">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'home' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <i className="fas fa-chart-line text-lg"></i><span className="text-[9px] font-black uppercase tracking-tighter">Stats</span>
        </button>
        <button onClick={() => setActiveTab('board')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'board' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <i className="fas fa-search text-lg"></i><span className="text-[9px] font-black uppercase tracking-tighter">Tasks</span>
        </button>
        <button onClick={() => setActiveTab('my-projects')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'my-projects' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <i className="fas fa-pen-fancy text-lg"></i><span className="text-[9px] font-black uppercase tracking-tighter">Work</span>
        </button>
        <button onClick={() => setActiveTab('messages')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'messages' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <i className="fas fa-comment-dots text-lg"></i><span className="text-[9px] font-black uppercase tracking-tighter">Chat</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'profile' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
          <i className="fas fa-user-cog text-lg"></i><span className="text-[9px] font-black uppercase tracking-tighter">Me</span>
        </button>
      </nav>
    </div>
  );
};

export default WriterPortal;
