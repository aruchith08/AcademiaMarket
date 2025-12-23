
import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer
} from 'recharts';
import { UserRole, Task, TaskStatus } from '../types.ts';

interface DashboardProps {
  role: UserRole;
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ role, tasks }) => {
  const statusCounts = tasks.reduce((acc: any, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div className="space-y-6 pb-20 sm:pb-0">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Active</p>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-800">
            {tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length}
          </h3>
        </div>
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Finished</p>
          <h3 className="text-2xl sm:text-3xl font-black text-emerald-500">
            {tasks.filter(t => t.status === TaskStatus.COMPLETED).length}
          </h3>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] shadow-sm border border-slate-100">
        <h4 className="text-[10px] font-black text-slate-800 mb-6 uppercase tracking-[0.2em] text-left">Help Ecosystem Overview</h4>
        {pieData.length > 0 ? (
          <>
            <div className="h-56 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 justify-center px-4">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter truncate max-w-[80px]">{d.name}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-300">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-chart-pie text-2xl opacity-20"></i>
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest">No activity data yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
