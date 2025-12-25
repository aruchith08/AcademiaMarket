
import React, { useState } from 'react';
import { Task, UserProfile, TaskStatus } from '../types.ts';
import Dashboard from './Dashboard.tsx';
import MessagesHub from './MessagesHub.tsx';
import AvatarSelector from './AvatarSelector.tsx';
import WriterBoard from './WriterBoard.tsx';
import WriterActiveWork from './WriterActiveWork.tsx';
import WriterSettings from './WriterSettings.tsx';
import TaskDetailView from './TaskDetailView.tsx';
import UserGuide from './UserGuide.tsx';

interface WriterPortalProps {
  user: UserProfile;
  tasks: Task[];
  allUsers: UserProfile[];
  onUpdateUser: (user: UserProfile) => void;
  onLogout: () => void;
  onFirestoreUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
}

const WriterPortal: React.FC<WriterPortalProps> = ({ 
  user, tasks, allUsers, onUpdateUser, onLogout, onFirestoreUpdate 
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'board' | 'my-projects' | 'messages' | 'profile'>('home');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showUserGuide, setShowUserGuide] = useState(false);

  const myActiveTasks = tasks.filter(t => t.writerId === user.id);
  const selectedTask = tasks.find(t => t.id === selectedTaskId) || null;

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

  const handleBargain = async (taskId: string, newPrice: number) => {
    await onFirestoreUpdate(taskId, { agreedPrice: newPrice });
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
      <header className="bg-white/80 backdrop-blur-lg border-b sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <i className="fas fa-handshake-angle"></i>
          </div>
          <div className="leading-tight text-left">
            <h1 className="text-xl font-black text-slate-800 tracking-tighter">AcademiaMarket</h1>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Student Helper Mode</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowUserGuide(true)}
            className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center transition-all hover:bg-indigo-100 active:scale-95"
            title="How it Works"
          >
            <i className="fas fa-circle-question text-sm"></i>
          </button>
          <button onClick={() => {setActiveTab('profile'); setSelectedTaskId(null);}} className="w-10 h-10 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-indigo-100 transition-all active:scale-95">
            <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">
        <aside className="hidden md:flex flex-col gap-2 w-72 shrink-0">
          <button onClick={() => {setActiveTab('home'); setSelectedTaskId(null);}} className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'home' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}><i className="fas fa-chart-pie"></i> Activity</button>
          <button onClick={() => {setActiveTab('board'); setSelectedTaskId(null);}} className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'board' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}><i className="fas fa-magnifying-glass"></i> Help a Peer</button>
          <button onClick={() => {setActiveTab('my-projects'); setSelectedTaskId(null);}} className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'my-projects' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}><i className="fas fa-hand-holding-heart"></i> My Tasks</button>
          <button onClick={() => {setActiveTab('messages'); setSelectedTaskId(null);}} className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'messages' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}><i className="fas fa-comment-dots"></i> Chat</button>
          <button onClick={() => {setActiveTab('profile'); setSelectedTaskId(null);}} className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}><i className="fas fa-user-cog"></i> Profile</button>
          
          <div className="mt-auto space-y-2 pt-8 text-left">
            <button 
              onClick={() => setShowUserGuide(true)}
              className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-indigo-50 text-indigo-600 font-black text-[10px] uppercase tracking-widest transition-all hover:bg-indigo-100"
            >
              <i className="fas fa-book-open"></i> App User Guide
            </button>
            <a 
              href={mailtoLink}
              className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 font-black text-[10px] uppercase tracking-widest transition-all hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100"
            >
              <i className="fas fa-headset"></i> Support & Help
            </a>
          </div>
        </aside>

        <section className="flex-1 min-h-[70vh]">
          {selectedTask ? (
            <TaskDetailView 
              task={selectedTask} role="writer" onBack={() => setSelectedTaskId(null)} 
              onUpdateStatus={(id, s) => onFirestoreUpdate(id, { status: s })} 
              onHandshake={handleHandshake} onOpenChat={openChatForTask} 
              onBargain={handleBargain}
            />
          ) : (
            <>
              {activeTab === 'home' && <Dashboard role="writer" tasks={myActiveTasks} />}
              {activeTab === 'board' && <WriterBoard tasks={tasks} user={user} allUsers={allUsers} onSelectTask={setSelectedTaskId} />}
              {activeTab === 'my-projects' && <WriterActiveWork tasks={myActiveTasks} allUsers={allUsers} onSelectTask={setSelectedTaskId} />}
              {activeTab === 'messages' && <MessagesHub tasks={tasks} user={user} onFirestoreUpdate={onFirestoreUpdate} initialChatId={activeChatId} onChatSelect={setActiveChatId} />}
              {activeTab === 'profile' && <WriterSettings user={user} onUpdateUser={onUpdateUser} onLogout={onLogout} onShowAvatarSelector={() => setShowAvatarSelector(true)} />}
            </>
          )}
        </section>
      </main>

      {showAvatarSelector && <AvatarSelector currentAvatar={user.avatar} onSelect={(a) => onUpdateUser({...user, avatar: a})} onClose={() => setShowAvatarSelector(false)} />}
      {showUserGuide && <UserGuide role="writer" onClose={() => setShowUserGuide(false)} />}

      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-4 flex items-center justify-between md:hidden z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <button onClick={() => {setActiveTab('home'); setSelectedTaskId(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'home' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}><i className="fas fa-chart-line text-lg"></i><span className="text-[9px] font-black uppercase tracking-tighter">Activity</span></button>
        <button onClick={() => {setActiveTab('board'); setSelectedTaskId(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'board' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}><i className="fas fa-magnifying-glass text-lg"></i><span className="text-[9px] font-black uppercase tracking-tighter">Explore</span></button>
        <button onClick={() => {setActiveTab('my-projects'); setSelectedTaskId(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'my-projects' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}><i className="fas fa-hand-holding-heart text-lg"></i><span className="text-[9px] font-black uppercase tracking-tighter">Help</span></button>
        <button onClick={() => {setActiveTab('messages'); setSelectedTaskId(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'messages' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}><i className="fas fa-comment-dots text-lg"></i><span className="text-[9px] font-black uppercase tracking-tighter">Chat</span></button>
        <button onClick={() => {setActiveTab('profile'); setSelectedTaskId(null);}} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'profile' ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}><i className="fas fa-user-cog text-lg"></i><span className="text-[9px] font-black uppercase tracking-tighter">Me</span></button>
      </nav>
    </div>
  );
};

export default WriterPortal;
