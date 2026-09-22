import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Globe, Sparkles, RefreshCw } from 'lucide-react';
import type { UserRole, Language } from '../types';
import { translations } from '../locales/i18n';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onResetDemo: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageChange,
  onResetDemo
}) => {
  const navigate = useNavigate();
  const t = translations[language];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        
        {/* Logo & Brand */}
        <Link to="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-green-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <Sprout className="w-6 h-6 text-emerald-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl tracking-tight text-white">{t.app_title}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                SIH 2026
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">{t.sub_title}</p>
          </div>
        </Link>

        {/* Demo Mode Badge */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>DEMO MODE</span>
          <button 
            onClick={onResetDemo}
            title="Reset Demo Data"
            className="ml-2 hover:text-amber-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          
          {/* Analyze CTA */}
          <button
            onClick={() => navigate('/analyze')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-sm shadow-lg shadow-emerald-600/25 transition-all hover:shadow-emerald-500/40 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-emerald-200 animate-pulse" />
            <span className="hidden md:inline">{t.btn_analyze_now}</span>
          </button>

          {/* Role Switcher */}
          <div className="relative flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 text-xs">
            {(['FARMER', 'OFFICER', 'ADMIN'] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => onRoleChange(role)}
                className={`px-2.5 py-1.5 rounded-lg font-medium transition-all ${
                  currentRole === role
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {role === 'FARMER' ? 'Farmer' : role === 'OFFICER' ? 'Officer' : 'Admin'}
              </button>
            ))}
          </div>

          {/* Language Selector */}
          <div className="relative flex items-center bg-slate-800/80 px-2 py-1.5 rounded-xl border border-slate-700/60 text-xs text-slate-300">
            <Globe className="w-3.5 h-3.5 text-emerald-400 mr-1.5" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="en" className="bg-slate-900">English</option>
              <option value="hi" className="bg-slate-900">हिन्दी</option>
              <option value="mr" className="bg-slate-900">मराठी</option>
            </select>
          </div>

        </div>

      </div>
    </header>
  );
};
