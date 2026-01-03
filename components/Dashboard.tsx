
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { MOCK_METRICS } from '../constants';
import { Student, VisitRecord } from '../types';

interface DashboardProps {
  students: Student[];
  visits: VisitRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ students, visits }) => {
  // Dynamic calculation for stats
  const immunizedCount = students.filter(s => s.isImmunized).length;
  const immunizationRate = students.length > 0 
    ? Math.round((immunizedCount / students.length) * 100) 
    : 0;

  const pendingReviews = students.filter(s => s.status !== 'Healthy');

  const stats = [
    { label: 'Total Students', value: students.length.toString(), change: 'Live', icon: '👥', color: 'blue' },
    { label: 'Total Visits', value: visits.length.toString(), change: 'Live', icon: '🏥', color: 'red' },
    { label: 'Immunized', value: `${immunizationRate}%`, change: `${immunizedCount} Students`, icon: '💉', color: 'green' },
    { label: 'Pending Reviews', value: pendingReviews.length.toString(), change: 'Requires Action', icon: '📋', color: 'amber' },
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const barData = days.slice(1, 6).map(day => {
    const count = visits.filter(v => v.date.includes(day)).length;
    return { name: day, visits: count };
  });

  const displayBarData = barData.some(d => d.visits > 0) ? barData : [
    { name: 'Mon', visits: 0 },
    { name: 'Tue', visits: 0 },
    { name: 'Wed', visits: 0 },
    { name: 'Thu', visits: 0 },
    { name: 'Fri', visits: 0 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <span className="text-2xl">{stat.icon}</span>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
                stat.color === 'green' ? 'bg-green-50 text-green-600' : 
                stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="mt-4 text-gray-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Trends */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">BMI Aggregate Trends</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_METRICS}>
                <defs>
                  <linearGradient id="colorBmi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="bmi" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBmi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Visits */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Visit Volume</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={displayBarData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="visits" fill="#93c5fd" radius={[6, 6, 0, 0]}>
                  {displayBarData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.visits > 0 ? '#3b82f6' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Visits Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-800">Recent Activity</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Reason</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visits.slice(0, 5).map((visit) => {
                  const student = students.find(s => s.id === visit.studentId);
                  return (
                    <tr key={visit.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{student?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{visit.reason}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700">Done</span>
                      </td>
                    </tr>
                  );
                })}
                {visits.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-400 text-sm italic">No records.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Review Queue */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between bg-amber-50/30">
            <h3 className="text-lg font-bold text-amber-800">Review Queue</h3>
            <span className="bg-amber-100 text-amber-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase">Awaiting Nurse Review</span>
          </div>
          <div className="overflow-y-auto max-h-[400px]">
            <div className="divide-y divide-gray-100">
              {pendingReviews.length > 0 ? pendingReviews.map(student => (
                <div key={student.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.grade} • {student.status}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-white border border-gray-200 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50">
                      Open File
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center text-gray-400">
                  <span className="text-4xl block mb-2">✅</span>
                  <p className="text-sm font-medium">All student records are up to date.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;