import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Lock, User, Shield } from 'lucide-react';
import type { UserRole } from '../types';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');
  const [username, setUsername] = useState('farmer');
  const [password, setPassword] = useState('farmer123');

  const handleRolePreset = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'FARMER') {
      setUsername('farmer');
      setPassword('farmer123');
    } else if (role === 'OFFICER') {
      setUsername('officer');
      setPassword('officer123');
    } else {
      setUsername('admin');
      setPassword('admin123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(selectedRole);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-xl shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Sprout className="w-8 h-8 text-emerald-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">CropGuard AI Login</h1>
          <p className="text-xs text-slate-400 mt-1">SIH 2026 Problem SIH26131 — Crop Disease & Early Warning</p>
        </div>

        {/* Quick Role Selection Presets */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 text-center">
            Select Role Demo Preset
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['FARMER', 'OFFICER', 'ADMIN'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRolePreset(r)}
                className={`p-2.5 rounded-xl text-xs font-medium border flex flex-col items-center gap-1 transition-all ${
                  selectedRole === r
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {r === 'FARMER' ? <User className="w-4 h-4" /> : r === 'OFFICER' ? <Shield className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>{r === 'FARMER' ? 'Farmer' : r === 'OFFICER' ? 'Officer' : 'Admin'}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-xl shadow-emerald-600/30 transition-all active:scale-98 mt-2"
          >
            Access CropGuard Command Center
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
          <p>Demo credentials auto-filled. Click submit to proceed.</p>
        </div>

      </div>
    </div>
  );
};
