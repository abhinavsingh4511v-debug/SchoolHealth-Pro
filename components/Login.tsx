
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulated Authentication Process
    setTimeout(() => {
      // Default credentials for demonstration: admin / password123
      if (username === 'admin' && password === 'password123') {
        const userData: User = {
          username: username,
          name: 'Nurse Sarah',
          role: 'Health Administrator',
          lastLogin: new Date().toLocaleString()
        };
        onLogin(userData);
      } else {
        setError('Invalid username or password. Please try again.');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl shadow-blue-100/50 overflow-hidden animate-scaleIn border border-blue-50">
        <div className="p-10 sm:p-12">
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 bg-blue-600 rounded-[2rem] shadow-2xl shadow-blue-200 flex items-center justify-center text-5xl mb-8 transform hover:scale-105 transition-transform duration-500">
              🏥
            </div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tighter text-center">
              School Health <span className="text-blue-600">Pro</span>
            </h1>
            <p className="text-gray-400 text-sm mt-3 font-bold uppercase tracking-widest">PM SHRI KV Katihar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Credential ID</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">👤</span>
                <input 
                  type="text" 
                  required
                  placeholder="Username"
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-semibold"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Access Key</label>
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
                <input 
                  type="password" 
                  required
                  placeholder="Password"
                  className="w-full pl-12 pr-5 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-semibold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl animate-shake">
                <p className="text-xs text-red-600 font-bold text-center">⚠️ {error}</p>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-3 text-lg group"
            >
              {isLoading ? (
                <span className="flex gap-2">
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </span>
              ) : (
                <>
                  <span className="group-hover:rotate-12 transition-transform">🔐</span>
                  <span>Enter Secure System</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-[11px] text-gray-300 leading-relaxed font-medium uppercase tracking-tight">
              Privacy Protected Environment<br/>
              Unauthorized entry will be logged
            </p>
          </div>
        </div>
        
        <div className="bg-gray-50/50 p-6 border-t border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">v2.5.0 Secure Access Layer • PM SHRI KV Katihar</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
