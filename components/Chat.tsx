
import React, { useState, useEffect, useRef } from 'react';
import { Task, Message, UserProfile } from '../types.ts';

interface ChatProps {
  task: Task;
  user: UserProfile;
  onUpdateTask: (task: Task) => void;
}

const Chat: React.FC<ChatProps> = ({ task, user, onUpdateTask }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 's1',
      taskId: task.id,
      senderId: 'system',
      text: "Connection accepted. Secure chat is now open.",
      timestamp: new Date().toISOString(),
      type: 'system'
    }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      taskId: task.id,
      senderId: user.id,
      text: input,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b bg-indigo-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black">
            {user.role === 'assigner' ? 'W' : 'A'}
          </div>
          <h4 className="font-black text-slate-800 text-xs uppercase tracking-widest">Active Project</h4>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 px-4 py-4 overflow-y-auto scrollbar-stable space-y-4 bg-slate-50/30">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.senderId === 'system' ? 'justify-center' : msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] ${
              msg.senderId === 'system' 
                ? 'bg-slate-100 text-slate-400 font-bold uppercase tracking-tighter'
                : msg.senderId === user.id 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md font-medium'
                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-sm font-medium'
            }`}>
              <p>{msg.text}</p>
              {msg.senderId !== 'system' && (
                <p className="text-[8px] mt-1 opacity-50">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
          className="flex-1 px-4 py-2 bg-slate-100 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-300"
        />
        <button type="submit" className="w-10 h-10 bg-indigo-600 text-white rounded-xl shadow-md active:scale-95 transition-all">
          <i className="fas fa-paper-plane text-xs"></i>
        </button>
      </form>
    </div>
  );
};

export default Chat;
