
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import StudentDirectory from './components/StudentDirectory';
import AIAssistant from './components/AIAssistant';
import VisitLogs from './components/VisitLogs';
import Analytics from './components/Analytics';
import Login from './components/Login';
import IDScanner from './components/IDScanner';
import { MOCK_STUDENTS, MOCK_VISITS } from './constants';
import { Student, VisitRecord, User } from './types';

const STORAGE_KEYS = {
  STUDENTS: 'school_health_pro_students',
  VISITS: 'school_health_pro_visits',
  USER_PROFILE: 'school_health_pro_profile',
  AUTH: 'school_health_pro_auth'
};

const App: React.FC = () => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

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
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [scannedStudent, setScannedStudent] = useState<Student | null>(null);
  
  const [notifications, setNotifications] = useState([
    { id: 1, text: "System active and secure.", time: "Just now", type: "info" }
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VISITS, JSON.stringify(visits));
  }, [visits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(userProfile));
  }, [userProfile]);

  // Handle outside clicks for notification dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogin = (user: User) => {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user));
    setCurrentUser(user);
    setUserProfile(prev => ({ ...prev, name: user.name }));
  };

  /**
   * IMMEDIATE LOGOUT:
   * Direct state reset and storage removal to force redirect to login screen.
   */
  const handleLogout = (e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Immediate storage clearance
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    
    // Trigger UI change by setting currentUser to null
    setCurrentUser(null);
    
    // Clear other UI flags
    setShowSettings(false);
    setShowNotifications(false);
    setIsScannerOpen(false);
  };

  const addStudent = (newStudent: Student) => {
    setStudents(prev => [...prev, newStudent]);
    addNotification(`Student added: ${newStudent.name}`);
  };

  const deleteStudent = (id: string) => {
    if (confirm('Delete student record?')) {
      setStudents(prev => prev.filter(s => s.id !== id));
      setVisits(prev => prev.filter(v => v.studentId !== id));
    }
  };

  const addVisit = (newVisit: VisitRecord) => {
    setVisits(prev => [newVisit, ...prev]);
    addNotification(`Visit logged.`);
  };

  const deleteVisit = (id: string) => {
    if (confirm('Delete visit record?')) {
      setVisits(prev => prev.filter(v => v.id !== id));
    }
  };

  const addNotification = (text: string) => {
    setNotifications(prev => [{ id: Date.now(), text, time: "Just now", type: "info" }, ...prev].slice(0, 5));
  };

  const handleScanSuccess = (student: Student) => {
    setIsScannerOpen(false);
    setActiveTab('students');
    setScannedStudent(student);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard students={students} visits={visits} />;
      case 'students': return <StudentDirectory students={students} onAdd={addStudent} onDelete={deleteStudent} initialSelectedStudent={scannedStudent} onClearInitialSelected={() => setScannedStudent(null)} />;
      case 'visits': return <VisitLogs visits={visits} students={students} onAdd={addVisit} onDelete={deleteVisit} />;
      case 'analytics': return <Analytics students={students} visits={visits} />;
      case 'ai-assistant': return <AIAssistant />;
      default: return <Dashboard students={students} visits={visits} />;
    }
  };

  // REDIRECT TO LOGIN IF NOT AUTHENTICATED
  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className={`transition-all duration-300 h-full border-r bg-white shadow-sm flex-shrink-0 relative ${sidebarCollapsed ? 'w-0 overflow-hidden border-none' : 'w-64'}`}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} user={currentUser} />
      </div>

      <main className="flex-1 overflow-y-auto flex flex-col relative">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md h-16 flex items-center justify-between px-6 border-b">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400"
            >
              {sidebarCollapsed ? '▶' : '◀'}
            </button>
            <div className="flex flex-col">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-tighter">
                {activeTab.replace('-', ' ')}
              </h2>
              <span className="text-[10px] text-blue-600 font-bold uppercase truncate max-w-[150px]">
                {userProfile.school}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsScannerOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-100"
            >
              📸 Scan
            </button>

            <div className="relative" ref={notificationRef}>
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors relative">
                🔔
                {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                  <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-900 uppercase">Alerts</span>
                    <button onClick={() => setNotifications([])} className="text-[9px] text-blue-600 font-black uppercase">Clear</button>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <p className="text-xs text-gray-700 font-medium">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setShowSettings(true)} className="p-2 text-gray-400 hover:text-blue-600 transition-colors">⚙️</button>

            {/* HEADER LOGOUT BUTTON - RED THEME AS REQUESTED */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-100"
            >
              🚪 Sign Out
            </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full flex-1">
          {renderContent()}
        </div>

        <footer className="p-8 border-t bg-white/50 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            School Health Pro • Secure Environment • {userProfile.school}
          </p>
        </footer>
      </main>

      {isScannerOpen && <IDScanner students={students} onScanSuccess={handleScanSuccess} onClose={() => setIsScannerOpen(false)} />}
      
      {showSettings && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-8 border-b bg-gray-900 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black tracking-tighter">System Configuration</h3>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Profile Management</p>
              </div>
              <button onClick={() => setShowSettings(false)} className="text-2xl opacity-50 hover:opacity-100 transition-opacity">✕</button>
            </div>
            <div className="p-8 space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nurse Name</label>
                <input className="w-full px-5 py-3 bg-gray-50 border rounded-2xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500" value={userProfile.name} onChange={e => setUserProfile({...userProfile, name: e.target.value})} />
              </div>
              <div className="pt-6 border-t flex flex-col gap-3">
                <button onClick={() => setShowSettings(false)} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Save Changes</button>
                <button onClick={handleLogout} className="w-full py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">Instant Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
