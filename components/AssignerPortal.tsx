
import React, { useState } from 'react';
import { Task, UserProfile, TaskStatus } from '../types.ts';
import Dashboard from './Dashboard.tsx';
import TaskForm from './TaskForm.tsx';
import WritersList from './WritersList.tsx';
import MessagesHub from './MessagesHub.tsx';
import AvatarSelector from './AvatarSelector.tsx';
import TaskDetailView from './TaskDetailView.tsx';
import AssignerProjects from './AssignerProjects.tsx';
import AssignerSettings from './AssignerSettings.tsx';

interface AssignerPortalProps {
  user: UserProfile;
  tasks: Task[];
  allUsers: UserProfile[];
  onUpdateUser: (user: UserProfile) => void;
  onLogout: () => void;
  onFirestoreUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  onFirestoreCreate: (task: Partial<Task>) => Promise<void>;
}

const AssignerPortal: React.FC<AssignerPortalProps> = ({ 
  user, tasks, allUsers, onLogout, onUpdateUser, onFirestoreUpdate, onFirestoreCreate 
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'tasks' | 'writers' | 'messages' | 'profile'>('home');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  const myTasks = tasks.filter(t => t.assignerId === user.id);
  const selectedTask = tasks.find(t => t.id === selectedTaskId) || null;

  const handlePostTask = async (newTask: Partial<Task>) => {
    await onFirestoreCreate({ ...newTask, assignerId: user.id, status: TaskStatus.PENDING, handshakeStatus: 'none', bargainEnabled: true });
    setShowTaskForm(false);
    setActiveTab('tasks');
  };

  const handleHandshake = async (taskId: string, action: any) => {
    if (action === 'accept') {
      await onFirestoreUpdate(taskId, { handshakeStatus: 'accepted', status: TaskStatus.IN_PROGRESS });
    }
  };

  const openChatForTask = (taskId: string) => {
    setActiveChatId(taskId);
    setActiveTab('messages');
    setSelectedTaskId(null);
  };

  const supportEmail = "academiamarkethelp@gmail.com";
  const mailtoLink = `mailto:${supportEmail}?subject=Support Request - ${user.name} (@${user.username})`;

  return (
    <div className="pb-24 md:pb-0">
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tighter leading-none text-left">AcademiaMarket</h1>
            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mt-1 text-left">Student Assistance Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href={mailtoLink}
            className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center transition-all hover:bg-indigo-100 active:scale-95 md:hidden"
            title="Contact Support"
          >
            <i className="fas fa-headset text-sm"></i>
          </a>
          <button onClick={() => {setActiveTab('profile'); setSelectedTaskId(null);}} className="w-10 h-10 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm ring-2 ring-indigo-50 transition-all hover:scale-110">
            <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
        <aside className="hidden md:flex flex-col gap-2 w-64 shrink-0">
          <button onClick={() => {setActiveTab('home'); setSelectedTaskId(null);}} className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'home' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}><i className="fas fa-home"></i> Overview</button>
          <button onClick={() => {setActiveTab('writers'); setSelectedTaskId(null);}} className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'writers' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}><i className="fas fa-users-rays"></i> Find Helpers</button>
          <button onClick={() => {setActiveTab('tasks'); setSelectedTaskId(null);}} className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'tasks' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}><i className="fas fa-clipboard-list"></i> My Requests</button>
          <button onClick={() => {setActiveTab('messages'); setSelectedTaskId(null);}} className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'messages' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}><i className="fas fa-comment-dots"></i> Conversations</button>
          <div className="mt-4"><button onClick={() => setShowTaskForm(true)} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-lg shadow-emerald-100 hover:bg-emerald-600 active:scale-95 transition-all">Ask for a Hand</button></div>
          
          <div className="mt-auto pt-8">
            <a 
              href={mailtoLink}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100"
            >
              <i className="fas fa-headset"></i> Feedback & Support
            </a>
          </div>
        </aside>

        <section className="flex-1">
          {selectedTask ? (
            <TaskDetailView 
              task={selectedTask} role="assigner" onBack={() => setSelectedTaskId(null)} 
              onUpdateStatus={(id, s) => onFirestoreUpdate(id, { status: s })} 
              onHandshake={(id, a) => handleHandshake(id, a)} onOpenChat={openChatForTask} 
            />
          ) : (
            <>
              {activeTab === 'home' && <Dashboard role="assigner" tasks={myTasks} />}
              {activeTab === 'writers' && <WritersList users={allUsers} assignerTasks={myTasks} currentUser={user} onAsk={(w, tId) => onFirestoreUpdate(tId, { writerId: w.id, handshakeStatus: 'assigner_invited', status: TaskStatus.REQUESTED })} />}
              {activeTab === 'tasks' && <AssignerProjects tasks={myTasks} user={user} onSelectTask={setSelectedTaskId} onPostNew={() => setShowTaskForm(true)} />}
              {activeTab === 'messages' && <MessagesHub tasks={tasks} user={user} onFirestoreUpdate={onFirestoreUpdate} initialChatId={activeChatId} onChatSelect={setActiveChatId} />}
              {activeTab === 'profile' && <AssignerSettings user={user} onLogout={onLogout} onShowAvatarSelector={() => setShowAvatarSelector(true)} />}
            </>
          )}
        </section>
      </main>

      {showAvatarSelector && <AvatarSelector currentAvatar={user.avatar} onSelect={(a) => onUpdateUser({...user, avatar: a})} onClose={() => setShowAvatarSelector(false)} />}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-4 flex items-center justify-between md:hidden z-40">
        <button onClick={() => {setActiveTab('home'); setSelectedTaskId(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'home' ? 'text-indigo-600' : 'text-slate-400'}`}><i className="fas fa-home text-lg"></i><span className="text-[9px] font-black uppercase">Stats</span></button>
        <button onClick={() => {setActiveTab('tasks'); setSelectedTaskId(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'tasks' ? 'text-indigo-600' : 'text-slate-400'}`}><i className="fas fa-clipboard-list text-lg"></i><span className="text-[9px] font-black uppercase tracking-tighter">My List</span></button>
        <button onClick={() => {setActiveTab('writers'); setSelectedTaskId(null);}} className={`w-14 h-14 rounded-2xl shadow-xl -mt-10 flex flex-col items-center justify-center border-4 border-slate-50 active:scale-90 transition-all ${activeTab === 'writers' ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-white text-slate-300 shadow-slate-200'}`}><i className="fas fa-hand-holding-heart text-xl"></i><span className="text-[7px] font-black uppercase mt-1">Help</span></button>
        <button onClick={() => {setActiveTab('messages'); setSelectedTaskId(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'messages' ? 'text-indigo-600' : 'text-slate-400'}`}><i className="fas fa-comment-dots text-lg"></i><span className="text-[9px] font-black uppercase">Chat</span></button>
        <button onClick={() => {setActiveTab('profile'); setSelectedTaskId(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'profile' ? 'text-indigo-600' : 'text-slate-400'}`}><i className="fas fa-user-cog text-lg"></i><span className="text-[9px] font-black uppercase">Me</span></button>
      </nav>
      {showTaskForm && <TaskForm onClose={() => setShowTaskForm(false)} onSubmit={handlePostTask} />}
    </div>
  );
};

export default AssignerPortal;
