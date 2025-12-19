
import React, { useState, useEffect } from 'react';
import { Task, UserProfile, TaskStatus } from './types.ts';
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
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    // Sync Tasks
    const qTasks = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const unsubTasks = onSnapshot(qTasks, 
      (snapshot) => {
        const updatedTasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Task[];
        setTasks(updatedTasks);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore Tasks Error:", error);
        setDbError("Database connection issue. Ensure Firestore is enabled.");
        setLoading(false);
      }
    );

    // Sync Users (for discovering writers and matching colleges)
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
  }, []);

  if (dbError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white p-8 rounded-[2rem] shadow-xl border border-rose-100">
           <i className="fas fa-exclamation-triangle text-rose-500 text-4xl mb-4"></i>
           <h2 className="text-xl font-black text-slate-800 mb-2">Firestore Not Ready</h2>
           <p className="text-slate-500 text-sm mb-6 leading-relaxed">Please enable 'Firestore Database' in your Firebase console and set rules to allow read/write.</p>
           <button onClick={() => window.location.reload()} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest">Retry Connection</button>
        </div>
      </div>
    );
  }

  const handleLogin = (userData: UserProfile) => {
    setUser(userData);
  };

  const handleCreateTask = async (task: Partial<Task>) => {
    try {
      await addDoc(collection(db, 'tasks'), sanitizeForFirestore(task));
    } catch (err) {
      console.error("Error creating task", err);
      alert("Failed to post task. Check Firestore rules.");
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
        <i className="fas fa-graduation-cap text-6xl mb-6 animate-bounce"></i>
        <h2 className="font-black text-xl mb-2 tracking-tighter">AcademiaMarket</h2>
        <p className="font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Initializing Secured Environment...</p>
      </div>
    );
  }

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {user.role === 'assigner' ? (
        <AssignerPortal 
          user={user} 
          tasks={tasks} 
          allUsers={allUsers}
          onUpdateUser={handleUpdateUser}
          onLogout={() => setUser(null)}
          onFirestoreUpdate={handleUpdateSingleTask}
          onFirestoreCreate={handleCreateTask}
        />
      ) : (
        <WriterPortal 
          user={user} 
          tasks={tasks} 
          allUsers={allUsers}
          onUpdateUser={handleUpdateUser}
          onLogout={() => setUser(null)}
          onFirestoreUpdate={handleUpdateSingleTask}
        />
      )}
    </div>
  );
};

export default App;
