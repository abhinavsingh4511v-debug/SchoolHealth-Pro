
import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
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
          <span className="text-2xl">🏥</span> School Health Pro
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

      <div className="p-4 border-t flex-shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 overflow-hidden">
          <img 
            src="https://picsum.photos/seed/nurse/40/40" 
            className="w-10 h-10 rounded-full border border-blue-200 flex-shrink-0" 
            alt="User" 
          />
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-gray-900 truncate">Nurse Sarah</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider truncate">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
