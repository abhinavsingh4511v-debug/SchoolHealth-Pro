
import React from 'react';
import { User } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  user: User;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout, user }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'students', label: 'Student Directory', icon: '👥' },
    { id: 'visits', label: 'Visit Logs', icon: '📝' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'ai-assistant', label: 'AI Assistant', icon: '🤖' },
  ];

  return (
    <div className="flex flex-col h-full w-64">
      <div className="p-6 border-b flex-shrink-0">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="text-2xl shadow-sm">🏥</span> School Health Pro
        </h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap overflow-hidden ${
              activeTab === item.id
                ? 'bg-blue-50 text-blue-600 shadow-sm'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t flex-shrink-0 space-y-3 bg-gray-50/30">
        <div className="flex items-center gap-3 px-2 py-1 overflow-hidden">
          <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm flex-shrink-0 bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider truncate">{user.role}</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-xl text-xs font-bold transition-all"
        >
          <span className="text-sm">🚪</span>
          Logout System
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
