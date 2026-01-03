
import React, { useMemo } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { Student, VisitRecord } from '../types';

interface AnalyticsProps {
  students: Student[];
  visits: VisitRecord[];
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899'];

const Analytics: React.FC<AnalyticsProps> = ({ students, visits }) => {
  // 1. Health Status Distribution
  const healthStatusData = useMemo(() => {
    const counts: Record<string, number> = {
      'Healthy': 0,
      'Observation': 0,
      'Action Required': 0
    };
    students.forEach(s => counts[s.status]++);
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [students]);

  // 2. Visit Reasons (Ailments)
  const visitReasonData = useMemo(() => {
    const counts: Record<string, number> = {};
    visits.forEach(v => {
      counts[v.reason] = (counts[v.reason] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [visits]);

  // 3. Blood Type Distribution
  const bloodTypeData = useMemo(() => {
    const counts: Record<string, number> = {};
    students.forEach(s => {
      counts[s.bloodType] = (counts[s.bloodType] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [students]);

  // 4. Monthly Visit Trends (Simulated based on current visits)
  const monthlyTrends = [
    { name: 'Sep', count: 12 },
    { name: 'Oct', count: 18 },
    { name: 'Nov', count: 15 },
    { name: 'Dec', count: 8 },
    { name: 'Jan', count: 22 },
    { name: 'Feb', count: visits.length }, // Dynamic
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Health Analytics</h2>
          <p className="text-sm text-gray-500">Comprehensive overview of school health data and trends</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 shadow-sm">
            Last 6 Months
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium shadow-md shadow-blue-100">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Status Pie Chart */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Student Health Status</h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {healthStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {healthStatusData.map((item, idx) => (
              <div key={item.name} className="p-2 rounded-lg bg-gray-50">
                <p className="text-[10px] uppercase font-bold text-gray-400">{item.name}</p>
                <p className="text-lg font-bold" style={{ color: COLORS[idx] }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visit Frequency Area Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Visit Frequency Trend</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrends}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Common Ailments */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Most Common Ailments</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={visitReasonData}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12}} width={100} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#60a5fa" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Blood Group Readiness */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Emergency Prep: Blood Types</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bloodTypeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#f87171" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Alert Banner */}
      <div className="bg-blue-600 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-200">
        <div>
          <h4 className="text-xl font-bold mb-2">Health Report Insight</h4>
          <p className="text-blue-100 text-sm max-w-md">
            Recent data shows an 8% increase in headache-related visits. 
            Consider reviewing hydration protocols in classrooms for 10th-grade students.
          </p>
        </div>
        <button className="whitespace-nowrap bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">
          View Detailed Suggestions
        </button>
      </div>
    </div>
  );
};

export default Analytics;
