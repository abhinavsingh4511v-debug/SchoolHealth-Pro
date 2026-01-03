
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentDirectory from './components/StudentDirectory';
import AIAssistant from './components/AIAssistant';
import VisitLogs from './components/VisitLogs';
import Analytics from './components/Analytics';
import { MOCK_STUDENTS, MOCK_VISITS } from './constants';
import { Student, VisitRecord } from './types';

const STORAGE_KEYS = {
  STUDENTS: 'school_health_pro_students',
  VISITS: 'school_health_pro_visits',
  USER_PROFILE: 'school_health_pro_profile'
};

const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : MOCK_STUDENTS;
  });

  const [visits, setVisits] = useState<VisitRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VISITS);
    return saved ? JSON.parse(saved) : MOCK_VISITS;
  });

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return saved ? JSON.parse(saved) : {
      name: "Nurse Sarah",
      role: "Administrator",
      school: "PM SHRI Kendriya Vidyalaya Katihar",
      email: "nurse.kvkatihar@kvs.gov.in"
    };
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Welcome to School Health Pro!", time: "Just now", type: "info" }
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visits));
  }, [visits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addStudent = (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
    addNotification(`New student record created: ${newStudent.name}`);
  };

  const deleteStudent = (id: string) => {
    if (confirm('Are you sure you want to remove this student? This will also remove their visit history.')) {
      setStudents(prev => prev.filter(s => s.id !== id));
      setVisits(prev => prev.filter(v => v.studentId !== id));
      addNotification(`Student record deleted.`);
    }
  };

  const addVisit = (newVisit: VisitRecord) => {
    setVisits(prev => [newVisit, ...prev]);
    const student = students.find(s => s.id === newVisit.studentId);
    addNotification(`Visit logged for ${student?.name || 'student'}`);
  };

  const deleteVisit = (id: string) => {
    if (confirm('Are you sure you want to delete this visit record?')) {
      setVisits(prev => prev.filter(v => v.id !== id));
      addNotification(`Visit record removed.`);
    }
  };

  const addNotification = (text: string) => {
    setNotifications(prev => [{ id: Date.now(), text, time: "Just now", type: "info" }, ...prev].slice(0, 10));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard students={students} visits={visits} />;
      case 'students':
        return <StudentDirectory students={students} onAdd={addStudent} onDelete={deleteStudent} />;
      case 'visits':
        return <VisitLogs visits={visits} students={students} onAdd={addVisit} onDelete={deleteVisit} />;
      case 'analytics':
        return <Analytics students={students} visits={visits} />;
      case 'ai-assistant':
        return <AIAssistant />;
      default:
        return <Dashboard students={students} visits={visits} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Section */}
      <div 
        className={`transition-all duration-300 ease-in-out h-full border-r bg-white shadow-sm flex-shrink-0 relative ${
          sidebarCollapsed ? 'w-0 overflow-hidden border-none' : 'w-64'
        }`}
      >
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative flex flex-col">
        <header className="sticky top-0 z-30 glass-morphism h-16 flex items-center justify-between px-6 border-b">
          <div className="flex items-center gap-4">
            {/* Sidebar Toggle Icon */}
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-all flex items-center justify-center bg-white border border-gray-200"
              title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <span className="text-xl leading-none">{sidebarCollapsed ? '▶' : '◀'}</span>
            </button>
            <div className="flex flex-col">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                {activeTab === 'dashboard' ? 'Health Overview' : activeTab.replace('-', ' ')}
              </h2>
              <span className="text-[10px] text-blue-600 font-bold uppercase truncate max-w-[200px]">
                {userProfile.school}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-100 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">System Active</span>
            </div>
            
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2 rounded-lg transition-colors relative ${showNotifications ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
              >
                🔔
                {notifications.length > 0 && (
                   <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                  <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-sm text-gray-900">Notifications</h3>
                    <button onClick={() => setNotifications([])} className="text-[10px] text-blue-600 font-bold uppercase hover:underline">Clear All</button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(n => (
                      <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <p className="text-sm text-gray-800">{n.text}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                      </div>
                    )) : (
                      <div className="p-8 text-center text-gray-400 italic text-sm">No new notifications</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setShowSettings(true)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">⚙️</button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>

        <footer className="mt-auto p-8 border-t bg-white/50 text-center">
          <p className="text-xs text-gray-400">
            &copy; 2024 School Health Pro - {userProfile.school}. 
            Secure Information System.
          </p>
        </footer>
      </main>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-6 border-b bg-gray-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">System Settings</h3>
                <p className="text-xs text-gray-400">Manage your account and school preferences</p>
              </div>
              <button onClick={() => setShowSettings(false)} className="hover:opacity-75 text-2xl">✕</button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">User Profile</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Nurse Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Designation</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                      value={userProfile.role}
                      onChange={(e) => setUserProfile({...userProfile, role: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">School Information</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm" 
                    value={userProfile.school}
                    onChange={(e) => setUserProfile({...userProfile, school: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">App Preferences</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive weekly health summaries</p>
                  </div>
                  <div className="w-12 h-6 bg-blue-600 rounded-full p-1 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full translate-x-6 transition-transform"></div>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button 
                  onClick={() => {
                    setShowSettings(false);
                    addNotification("Settings updated successfully");
                  }}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                >
                  Save Changes
                </button>
                <button onClick={() => setShowSettings(false)} className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
