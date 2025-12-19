
import React, { useState } from 'react';
import { Task, UserProfile, TaskStatus } from './types.ts';
import { INITIAL_TASKS } from './constants.ts';
import Login from './components/Login.tsx';
import AssignerPortal from './components/AssignerPortal.tsx';
import WriterPortal from './components/WriterPortal.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  if (!user) return <Login onLogin={setUser} />;

  const handleUpdateTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setUser(updatedUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {user.role === 'assigner' ? (
        <AssignerPortal 
          user={user} 
          tasks={tasks} 
          onUpdateTasks={handleUpdateTasks} 
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
        />
      ) : (
        <WriterPortal 
          user={user} 
          tasks={tasks} 
          onUpdateTasks={handleUpdateTasks} 
          onUpdateUser={handleUpdateUser}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
