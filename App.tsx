
import React, { useState, useEffect, useRef } from 'react';
import { Task, UserProfile, TaskStatus, Notification } from './types.ts';
import Login from './components/Login.tsx';
import AssignerPortal from './components/AssignerPortal.tsx';
import WriterPortal from './components/WriterPortal.tsx';
import { db, sanitizeForFirestore } from './lib/firebase.ts';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const lastTasksState = useRef<Record<string, Task>>({});
  const isInitialLoad = useRef(true);

  // Persistence: Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('academia_market_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem('academia_market_user');
      }
    }
  }, []);

  useEffect(() => {
    const qTasks = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsubTasks = onSnapshot(qTasks, 
      (snapshot) => {
        const updatedTasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Task[];

        if (user && !isInitialLoad.current) {
          updatedTasks.forEach(task => {
            const oldTask = lastTasksState.current[task.id];
            if (!oldTask) return;

            if (task.status !== oldTask.status || task.handshakeStatus !== oldTask.handshakeStatus) {
              if (user.role === 'assigner' && task.assignerId === user.id) {
                if (task.status === TaskStatus.REQUESTED && oldTask.status !== TaskStatus.REQUESTED) {
                  addNotification("New Proposal", `A writer is interested in "${task.title}"`, 'info', task.id);
                } else if (task.status === TaskStatus.REVIEW && oldTask.status !== TaskStatus.REVIEW) {
                  addNotification("Draft Submitted", `New work ready for review in "${task.title}"`, 'success', task.id);
                }
              }
              if (user.role === 'writer' && task.writerId === user.id) {
                if (task.handshakeStatus === 'accepted' && oldTask.handshakeStatus !== 'accepted') {
                  addNotification("Partnered!", `Proposal for "${task.title}" was accepted!`, 'success', task.id);
                } else if (task.handshakeStatus === 'assigner_invited' && oldTask.handshakeStatus !== 'assigner_invited') {
                  addNotification("Direct Invitation", `You've been invited for "${task.title}"`, 'info', task.id);
                } else if (task.status === TaskStatus.COMPLETED && oldTask.status !== TaskStatus.COMPLETED) {
                  addNotification("Completed!", `Task "${task.title}" marked as complete.`, 'success', task.id);
                }
              }
            }

            if (task.lastMessageAt && (!oldTask.lastMessageAt || task.lastMessageAt.seconds > oldTask.lastMessageAt.seconds)) {
              if (task.assignerId === user.id || task.writerId === user.id) {
                 addNotification("New Message", `Project: ${task.title}`, 'message', task.id);
              }
            }
          });
        }

        const taskMap: Record<string, Task> = {};
        updatedTasks.forEach(t => taskMap[t.id] = t);
        lastTasksState.current = taskMap;
        isInitialLoad.current = false;

        setTasks(updatedTasks);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore Tasks Error:", error);
        setLoading(false);
      }
    );

    const qUsers = query(collection(db, 'users'));
    const unsubUsers = onSnapshot(qUsers, (snapshot) => {
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UserProfile[];
      setAllUsers(usersList);
    });

    return () => {
      unsubTasks();
      unsubUsers();
    };
  }, [user?.id]);

  const addNotification = (title: string, message: string, type: Notification['type'], taskId?: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotif: Notification = { id, title, message, type, timestamp: Date.now(), taskId };
    setNotifications(prev => [newNotif, ...prev].slice(0, 5));
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  const handleLogin = (userData: UserProfile) => {
    setUser(userData);
    localStorage.setItem('academia_market_user', JSON.stringify(userData));
    isInitialLoad.current = true;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('academia_market_user');
  };

  const handleCreateTask = async (task: Partial<Task>) => {
    try {
      await addDoc(collection(db, 'tasks'), sanitizeForFirestore(task));
    } catch (err) {
      console.error("Error creating task", err);
    }
  };

  const handleUpdateSingleTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, sanitizeForFirestore(updates));
    } catch (err) {
      console.error("Error updating task", err);
    }
  };

  const handleUpdateUser = async (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem('academia_market_user', JSON.stringify(updatedUser));
    try {
      const userRef = doc(db, 'users', updatedUser.id);
      await updateDoc(userRef, sanitizeForFirestore(updatedUser));
    } catch (err) {
      console.error("User update failed", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-indigo-600 flex flex-col items-center justify-center text-white p-6">
        <div className="relative">
          <i className="fas fa-graduation-cap text-6xl mb-6 animate-bounce"></i>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white/20 blur-sm rounded-full"></div>
        </div>
        <h2 className="font-black text-2xl mb-2 tracking-tighter text-center">AcademiaMarket</h2>
        <p className="font-black uppercase tracking-[0.3em] text-[9px] animate-pulse opacity-70">Syncing Secure Environment...</p>
      </div>
    );
  }

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-x-hidden">
      {/* Responsive Notification Toast System */}
      <div className="fixed top-4 sm:top-6 right-0 left-0 sm:left-auto sm:right-6 z-[100] flex flex-col gap-2 sm:gap-3 pointer-events-none px-4 sm:px-0 w-full sm:max-w-sm">
        {notifications.map(n => (
          <div key={n.id} className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-100 p-4 flex items-start gap-4 animate-in slide-in-from-top-4 sm:slide-in-from-right-8 fade-in duration-300">
             <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center ${
               n.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 
               n.type === 'warning' ? 'bg-amber-100 text-amber-600' : 
               n.type === 'message' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'
             }`}>
               <i className={`fas ${
                 n.type === 'success' ? 'fa-check-circle' : 
                 n.type === 'warning' ? 'fa-exclamation-triangle' : 
                 n.type === 'message' ? 'fa-comment' : 'fa-info-circle'
               }`}></i>
             </div>
             <div className="flex-1 min-w-0">
                <h5 className="text-[11px] font-black uppercase tracking-widest text-slate-800">{n.title}</h5>
                <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5 truncate">{n.message}</p>
             </div>
             <button onClick={() => setNotifications(prev => prev.filter(notif => notif.id !== n.id))} className="text-slate-300 hover:text-slate-500 shrink-0">
               <i className="fas fa-times text-[10px]"></i>
             </button>
          </div>
        ))}
      </div>

      {user.role === 'assigner' ? (
        <AssignerPortal 
          user={user} tasks={tasks} allUsers={allUsers}
          onUpdateUser={handleUpdateUser} onLogout={handleLogout}
          onFirestoreUpdate={handleUpdateSingleTask} onFirestoreCreate={handleCreateTask}
        />
      ) : (
        <WriterPortal 
          user={user} tasks={tasks} allUsers={allUsers}
          onUpdateUser={handleUpdateUser} onLogout={handleLogout}
          onFirestoreUpdate={handleUpdateSingleTask}
        />
      )}
    </div>
  );
};

export default App;
