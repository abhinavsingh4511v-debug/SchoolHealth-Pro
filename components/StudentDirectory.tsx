
import React, { useState, useEffect } from 'react';
import { Student } from '../types';

interface StudentDirectoryProps {
  students: Student[];
  onAdd: (student: Student) => void;
  onDelete: (id: string) => void;
  initialSelectedStudent?: Student | null;
  onClearInitialSelected?: () => void;
}

const StudentDirectory: React.FC<StudentDirectoryProps> = ({ 
  students, 
  onAdd, 
  onDelete, 
  initialSelectedStudent,
  onClearInitialSelected
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New student form state
  const [formData, setFormData] = useState({
    name: '',
    grade: '9th Grade',
    id: '',
    bloodType: 'O+',
    dob: '',
    allergies: '',
    isImmunized: false,
    immunizationDate: '',
    reviewComments: '',
    status: 'Healthy' as const
  });

  useEffect(() => {
    if (initialSelectedStudent) {
      setSelectedStudent(initialSelectedStudent);
      if (onClearInitialSelected) onClearInitialSelected();
    }
  }, [initialSelectedStudent, onClearInitialSelected]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newStudent: Student = {
      ...formData,
      id: formData.id || `S${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      allergies: formData.allergies.split(',').map(s => s.trim()).filter(Boolean),
      medications: [],
      lastCheckup: new Date().toISOString().split('T')[0]
    };
    onAdd(newStudent);
    setShowAddModal(false);
    setFormData({ 
      name: '', 
      grade: '9th Grade', 
      id: '', 
      bloodType: 'O+', 
      dob: '', 
      allergies: '', 
      isImmunized: false, 
      immunizationDate: '',
      reviewComments: '',
      status: 'Healthy' 
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Health Database</h2>
          <p className="text-sm text-gray-500">Manage PM SHRI KV Katihar Student Health Records</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search students..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 text-sm transition-all bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <span>➕</span> New Record
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <div 
            key={student.id} 
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 transition-all cursor-pointer relative group"
            onClick={() => setSelectedStudent(student)}
          >
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(student.id); }}
              className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-2"
            >
              🗑️
            </button>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                student.status === 'Healthy' ? 'bg-green-100 text-green-600' : 
                student.status === 'Observation' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
              }`}>
                {student.name.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-gray-900">{student.name}</h4>
                <p className="text-xs text-gray-500">{student.grade} • {student.id}</p>
              </div>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 uppercase font-semibold tracking-tighter">Health Review</span>
                <span className={`font-bold ${
                  student.status === 'Healthy' ? 'text-green-600' : 'text-amber-600'
                }`}>{student.status}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 uppercase font-semibold tracking-tighter">Immunized</span>
                <span className="text-gray-900 font-bold">{student.isImmunized ? `✅ ${student.immunizationDate || 'Record'}` : '❌ Pending'}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredStudents.length === 0 && (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed">
             <p className="text-gray-400 italic">No student records found in the database.</p>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-6 border-b bg-blue-600 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Comprehensive Student Entry</h3>
              <button onClick={() => setShowAddModal(false)} className="hover:opacity-75">✕</button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Primary Info */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b pb-1">Basic Information</h4>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
                  <input required className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Grade</label>
                    <input required placeholder="e.g. 10th A" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Blood Type</label>
                    <select className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" value={formData.bloodType} onChange={e => setFormData({...formData, bloodType: e.target.value})}>
                      <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Immunization Slot */}
              <div className="space-y-4 pt-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b pb-1">Immunization Slot</h4>
                <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="isImmunized"
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" 
                      checked={formData.isImmunized} 
                      onChange={e => setFormData({...formData, isImmunized: e.target.checked})} 
                    />
                    <label htmlFor="isImmunized" className="text-sm font-semibold text-green-800">Has complete immunization records</label>
                  </div>
                  {formData.isImmunized && (
                    <div className="animate-fadeIn">
                      <label className="text-xs font-bold text-green-700 uppercase block mb-1">Date of Last Vaccination</label>
                      <input 
                        type="date" 
                        className="w-full px-4 py-2 border-green-200 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm bg-white" 
                        value={formData.immunizationDate} 
                        onChange={e => setFormData({...formData, immunizationDate: e.target.value})} 
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Pending Review Slot */}
              <div className="space-y-4 pt-2">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b pb-1">Review & Medical Status</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">Review Status</label>
                    <select className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                      <option value="Healthy">Healthy (No Review)</option>
                      <option value="Observation">Needs Observation</option>
                      <option value="Action Required">Immediate Action Required</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">DOB</label>
                    <input type="date" required className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Nurse Review Comments (Pending Review)</label>
                  <textarea 
                    placeholder="Enter findings for review queue..." 
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    rows={2}
                    value={formData.reviewComments} 
                    onChange={e => setFormData({...formData, reviewComments: e.target.value})} 
                  />
                </div>
              </div>

              <div className="pt-4">
                <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                  Save Student Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-8 border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative">
              <button 
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white"
              >
                ✕
              </button>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl font-bold uppercase">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{selectedStudent.name}</h3>
                  <p className="text-blue-100 font-medium">{selectedStudent.grade} • ID: {selectedStudent.id}</p>
                </div>
              </div>
            </div>
            <div className="p-8 grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Immunization Entry</h4>
                  <p className={`text-sm font-bold ${selectedStudent.isImmunized ? 'text-green-600' : 'text-red-500'}`}>
                    {selectedStudent.isImmunized 
                      ? `Completed on ${selectedStudent.immunizationDate || 'Not specified'}` 
                      : 'Records Pending / Incomplete'}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nurse Review Findings</h4>
                  <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 italic text-sm text-gray-700">
                    {selectedStudent.reviewComments || 'No review notes recorded yet.'}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl flex flex-col justify-center gap-3">
                 <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">Log Clinic Visit</button>
                 <button className="w-full py-2 border border-gray-200 bg-white text-gray-700 rounded-lg text-sm font-bold">Edit Records</button>
                 <button className="w-full py-2 border border-red-100 bg-red-50 text-red-600 rounded-lg text-sm font-bold">Emergency Alert</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDirectory;
