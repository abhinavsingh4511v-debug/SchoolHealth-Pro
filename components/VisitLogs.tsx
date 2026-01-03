
import React, { useState } from 'react';
import { VisitRecord, Student } from '../types';

interface VisitLogsProps {
  visits: VisitRecord[];
  students: Student[];
  onAdd: (visit: VisitRecord) => void;
  onDelete: (id: string) => void;
}

const VisitLogs: React.FC<VisitLogsProps> = ({ visits, students, onAdd, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterReason, setFilterReason] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [formData, setFormData] = useState({
    studentId: '',
    reason: '',
    diagnosis: '',
    treatment: '',
    nurseName: 'Nurse Sarah'
  });

  const filteredVisits = visits.filter(visit => {
    const student = students.find(s => s.id === visit.studentId);
    const matchesSearch = (student?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          visit.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterReason === 'All' || visit.reason.includes(filterReason);
    return matchesSearch && matchesFilter;
  });

  const reasons = ['All', 'Headache', 'Sprained Ankle', 'Fever', 'Allergy', 'Stomach Ache', 'Injury'];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId) return alert('Please select a student');
    
    const now = new Date();
    const newVisit: VisitRecord = {
      id: `V${Date.now()}`,
      ...formData,
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
    onAdd(newVisit);
    setShowAddModal(false);
    setFormData({ studentId: '', reason: '', diagnosis: '', treatment: '', nurseName: 'Nurse Sarah' });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clinic Visit Logs</h2>
          <p className="text-sm text-gray-500">Track and manage student infirmary visits</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <span>➕</span> Log New Visit
          </button>
          <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all flex items-center gap-2">
            <span>📥</span> Export Logs
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <input 
            type="text" 
            placeholder="Search by student or reason..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 uppercase">Reason Filter:</span>
          <select 
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={filterReason}
            onChange={(e) => setFilterReason(e.target.value)}
          >
            {reasons.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Reason</th>
                <th className="px-6 py-4">Assessment & Treatment</th>
                <th className="px-6 py-4">Nurse</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredVisits.length > 0 ? (
                filteredVisits.map((visit) => {
                  const student = students.find(s => s.id === visit.studentId);
                  return (
                    <tr key={visit.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900">{visit.date}</div>
                        <div className="text-xs text-gray-500">{visit.time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs uppercase">
                            {student?.name.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{student?.name || 'Unknown'}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-tighter">{student?.grade || 'N/A'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium border border-amber-100">
                          {visit.reason}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 italic">"{visit.diagnosis}"</p>
                        <p className="text-[10px] text-blue-500 mt-1 font-medium">{visit.treatment}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                        {visit.nurseName}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => onDelete(visit.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors px-2 py-1"
                          title="Delete Record"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="text-4xl mb-2">🔎</div>
                    <p className="font-medium">No visit records found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Visit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-6 border-b bg-blue-600 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Log Clinic Visit</h3>
              <button onClick={() => setShowAddModal(false)} className="hover:opacity-75">✕</button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Select Student</label>
                <select required className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" value={formData.studentId} onChange={e => setFormData({...formData, studentId: e.target.value})}>
                  <option value="">Choose a student...</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Reason</label>
                <select className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})}>
                  {reasons.slice(1).map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Diagnosis / Assessment</label>
                <textarea required rows={2} placeholder="Brief clinical findings..." className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Treatment Provided</label>
                <input required placeholder="e.g. Ice pack, rest, 500mg Paracetamol" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" value={formData.treatment} onChange={e => setFormData({...formData, treatment: e.target.value})} />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                  Submit Visit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitLogs;
