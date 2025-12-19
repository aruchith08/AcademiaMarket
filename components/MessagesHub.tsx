
import React, { useEffect } from 'react';
import { Task, UserProfile } from '../types.ts';
import Chat from './Chat.tsx';

interface MessagesHubProps {
  tasks: Task[];
  user: UserProfile;
  onFirestoreUpdate: (taskId: string, updates: Partial<Task>) => Promise<void>;
  initialChatId?: string | null;
  onChatSelect?: (taskId: string | null) => void;
}

const MessagesHub: React.FC<MessagesHubProps> = ({ 
  tasks, 
  user, 
  onFirestoreUpdate, 
  initialChatId,
  onChatSelect
}) => {
  const chatTasks = tasks.filter(t => t.handshakeStatus === 'accepted' && (t.assignerId === user.id || t.writerId === user.id));
  const selectedTask = chatTasks.find(t => t.id === initialChatId);

  // If we have an initialChatId but it's not in our list (maybe newly accepted), 
  // we just show the selection list.
  
  if (chatTasks.length === 0) {
    return (
      <div className="bg-white rounded-[3rem] p-12 text-center border border-slate-100 flex flex-col items-center justify-center min-h-[500px] animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-slate-200 border border-slate-100">
          <i className="fas fa-comments text-4xl"></i>
        </div>
        <h3 className="text-xl font-black text-slate-800 mb-2">No Active Conversations</h3>
        <p className="text-slate-400 text-xs font-medium max-w-xs mx-auto">Once a writer accepts your proposal or vice-versa, your secure chat room will appear here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[70vh] lg:h-[75vh] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Sidebar - Chat List */}
      <div className={`w-full lg:w-80 shrink-0 bg-white rounded-[2.5rem] border border-slate-100 flex flex-col overflow-hidden shadow-sm ${initialChatId ? 'hidden lg:flex' : 'flex'}`}>
        <div className="p-6 border-b border-slate-50">
          <h3 className="text-lg font-black text-slate-800 tracking-tight">Messages</h3>
          <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">{chatTasks.length} Active Hubs</p>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-stable p-4 space-y-2">
          {chatTasks.map(task => (
            <button 
              key={task.id}
              onClick={() => onChatSelect?.(task.id)}
              className={`w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4 ${initialChatId === task.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'hover:bg-slate-50'}`}
            >
              <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-black text-[10px] ${initialChatId === task.id ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>
                {task.subject.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-black truncate ${initialChatId === task.id ? 'text-white' : 'text-slate-800'}`}>{task.title}</p>
                <div className="flex items-center gap-2">
                   <p className={`text-[9px] font-bold uppercase tracking-tight shrink-0 ${initialChatId === task.id ? 'text-indigo-100' : 'text-indigo-500'}`}>{task.subject}</p>
                   {task.lastMessage && (
                     <p className={`text-[9px] truncate italic ${initialChatId === task.id ? 'text-white/60' : 'text-slate-400'}`}>
                       • {task.lastMessage}
                     </p>
                   )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 h-full ${initialChatId ? 'flex' : 'hidden lg:flex items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-slate-200'}`}>
        {selectedTask ? (
          <div className="w-full flex flex-col h-full animate-in zoom-in-95 duration-300">
             <div className="lg:hidden p-4 bg-white border-b flex items-center gap-4">
               <button onClick={() => onChatSelect?.(null)} className="p-2 text-slate-400"><i className="fas fa-arrow-left"></i></button>
               <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest truncate">{selectedTask.title}</h4>
             </div>
             <Chat 
               task={selectedTask} 
               user={user} 
               onUpdateTask={(updates) => onFirestoreUpdate(selectedTask.id, updates)} 
             />
          </div>
        ) : (
          <div className="text-center">
            <i className="fas fa-comment-medical text-slate-100 text-6xl mb-4"></i>
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Select a project to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesHub;
