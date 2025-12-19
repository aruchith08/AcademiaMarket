
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

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Active Projects</p>
          <h3 className="text-3xl font-black mt-1 text-slate-800">
            {tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total Completed</p>
          <h3 className="text-3xl font-black mt-1 text-emerald-500">
            {tasks.filter(t => t.status === TaskStatus.COMPLETED).length}
          </h3>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
        <h4 className="text-sm font-black text-slate-800 mb-6 uppercase tracking-tight">Project Status Distribution</h4>
        {pieData.length > 0 ? (
          <>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap gap-4 justify-center">
              {pieData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{d.name}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="h-64 flex flex-col items-center justify-center text-slate-300">
            <i className="fas fa-chart-pie text-4xl mb-4 opacity-20"></i>
            <p className="text-[10px] font-black uppercase tracking-widest">No data to display yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
