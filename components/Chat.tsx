
import React, { useState, useEffect, useRef } from 'react';
import { Task, Message, UserProfile } from '../types.ts';
import { db } from '../lib/firebase.ts';
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

interface ChatProps {
  task: Task;
  user: UserProfile;
  onUpdateTask: (task: Task) => void;
}

const Chat: React.FC<ChatProps> = ({ task, user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFileGuide, setShowFileGuide] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesRef = collection(db, 'tasks', task.id, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(msgs);
      setLoading(false);
      
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    });

    return () => unsubscribe();
  }, [task.id]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const textToSend = input;
    setInput('');

    try {
      const messagesRef = collection(db, 'tasks', task.id, 'messages');
      const timestamp = serverTimestamp();
      
      await addDoc(messagesRef, {
        taskId: task.id,
        senderId: user.id,
        senderName: user.name,
        text: textToSend,
        timestamp: timestamp,
        type: 'text'
      });

      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, {
        lastMessage: textToSend,
        lastMessageAt: timestamp
      });
      
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">
      <div className="p-4 border-b bg-indigo-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-[10px] font-black uppercase">
            {task.subject.charAt(0)}
          </div>
          <div>
            <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">Secure Room</h4>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter truncate max-w-[120px]">{task.title}</p>
          </div>
        </div>
        <button 
          onClick={() => setShowFileGuide(!showFileGuide)}
          className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${showFileGuide ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-100'}`}
        >
          <i className="fas fa-file-export mr-1"></i> File Guide
        </button>
      </div>

      {showFileGuide && (
        <div className="absolute top-16 left-4 right-4 z-20 bg-indigo-600 text-white p-6 rounded-3xl shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-4">
             <h5 className="font-black text-[10px] uppercase tracking-[0.2em]">Share File Steps</h5>
             <button onClick={() => setShowFileGuide(false)}><i className="fas fa-times"></i></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <p className="text-[9px] font-black text-indigo-200">STEP 1</p>
                <p className="text-[10px] font-medium">Upload to G-Drive or Dropbox</p>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-black text-indigo-200">STEP 2</p>
                <p className="text-[10px] font-medium">Set "Anyone with link can view"</p>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-black text-indigo-200">STEP 3</p>
                <p className="text-[10px] font-medium">Copy the link address</p>
             </div>
             <div className="space-y-1">
                <p className="text-[9px] font-black text-indigo-200">STEP 4</p>
                <p className="text-[10px] font-medium">Paste link in the chat below</p>
             </div>
          </div>
        </div>
      )}

      <div ref={scrollRef} className="flex-1 px-4 py-4 overflow-y-auto scrollbar-stable space-y-4 bg-slate-50/30">
        {loading ? (
          <div className="flex justify-center py-10">
            <i className="fas fa-spinner fa-spin text-indigo-200 text-2xl"></i>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No messages yet. Start the chat!</p>
          </div>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.senderId === 'system' ? 'justify-center' : msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] shadow-sm ${
                msg.senderId === 'system' 
                  ? 'bg-slate-100 text-slate-400 font-bold uppercase tracking-tighter'
                  : msg.senderId === user.id 
                    ? 'bg-indigo-600 text-white rounded-tr-none font-medium'
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 font-medium'
              }`}>
                {msg.senderId !== user.id && msg.senderId !== 'system' && (
                  <p className="text-[8px] font-black mb-1 opacity-50 uppercase tracking-widest">{msg.senderName}</p>
                )}
                <p className="break-words">
                  {msg.text.includes('http') ? (
                    msg.text.split(' ').map((word, i) => (
                      word.startsWith('http') ? (
                        <a key={i} href={word} target="_blank" rel="noopener noreferrer" className="underline font-black bg-white/10 px-1 rounded mx-0.5">{word}</a>
                      ) : (
                        word + ' '
                      )
                    ))
                  ) : (
                    msg.text
                  )}
                </p>
                {msg.senderId !== 'system' && msg.timestamp && (
                  <p className="text-[8px] mt-1 opacity-50 text-right">
                    {new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex flex-col gap-2">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message or paste document link..."
            className="flex-1 px-4 py-3 bg-slate-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all font-medium"
          />
          <button type="submit" className="w-12 h-12 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 active:scale-90 transition-all flex items-center justify-center">
            <i className="fas fa-paper-plane text-xs"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
