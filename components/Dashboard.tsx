
import React from 'react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis
} from 'recharts';
import { UserRole, Task, TaskStatus } from '../types.ts';

interface DashboardProps {
  role: UserRole;
  tasks: Task[];
}

const Dashboard: React.FC<DashboardProps> = ({ role, tasks }) => {
  const isWriter = role === 'writer';

  const statusCounts = tasks.reduce((acc: any, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(statusCounts).map(status => ({
    name: status,
    value: statusCounts[status]
  }));

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const earningsData = [
    { day: 'Mon', amount: 1200 },
    { day: 'Tue', amount: 2000 },
    { day: 'Wed', amount: 1500 },
    { day: 'Thu', amount: 3000 },
    { day: 'Fri', amount: 2500 },
    { day: 'Sat', amount: 4000 },
    { day: 'Sun', amount: 3500 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Active Tasks</p>
          <h3 className="text-3xl font-bold mt-1">
            {tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">
            {isWriter ? 'Total Earnings' : 'Total Spent'}
          </p>
          <h3 className="text-3xl font-bold mt-1 text-indigo-600">
            ₹{isWriter ? '12,400.00' : '4,500.00'}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm font-medium">Reputation</p>
          <div className="flex items-center gap-1 mt-1">
            <h3 className="text-3xl font-bold">4.9</h3>
            <span className="text-yellow-400 text-xl">★</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="text-lg font-semibold mb-6">Task Overview</h4>
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
                <span className="text-xs text-slate-600">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h4 className="text-lg font-semibold mb-6">
            {isWriter ? 'Earnings Velocity' : 'Expense Breakdown'}
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis hide />
                <Tooltip formatter={(value) => [`₹${value}`, 'Amount']} />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#6366f1" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorAmt)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
