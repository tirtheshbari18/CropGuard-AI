import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Scan,
  History,
  MapPin,
  Bell,
  BarChart3,
  BrainCircuit,
  FileText,
  Activity,
  ShieldCheck,
  Info
} from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../locales/i18n';

interface SidebarProps {
  language: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({ language }) => {
  const t = translations[language];

  const menuItems = [
    { path: '/dashboard', label: t.nav_dashboard, icon: LayoutDashboard },
    { path: '/analyze', label: t.nav_analyze, icon: Scan, badge: 'AI' },
    { path: '/inspections', label: t.nav_inspections, icon: History },
    { path: '/map', label: t.nav_map, icon: MapPin },
    { path: '/alerts', label: t.nav_alerts, icon: Bell },
    { path: '/analytics', label: t.nav_analytics, icon: BarChart3 },
    { path: '/model-performance', label: t.nav_model, icon: BrainCircuit },
    { path: '/reports', label: t.nav_reports, icon: FileText },
    { path: '/system-health', label: t.nav_health, icon: Activity },
    { path: '/admin', label: t.nav_admin, icon: ShieldCheck },
    { path: '/about', label: t.nav_about, icon: Info },
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 min-h-[calc(100vh-65px)] p-4 hidden md:block shrink-0">
      <div className="space-y-1">
        <p className="px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-3">
          Command Center Menu
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600/30 to-teal-600/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      <div className="mt-8 p-3.5 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-slate-900 border border-emerald-500/20 text-xs">
        <div className="flex items-center gap-2 font-semibold text-emerald-400 mb-1">
          <BrainCircuit className="w-4 h-4" />
          <span>MobileNetV3 AI Engine</span>
        </div>
        <p className="text-slate-400 leading-relaxed text-[11px]">
          15 PlantVillage Disease Classes • Grad-CAM Lesion Segmentation • 0.28s Inference
        </p>
      </div>
    </aside>
  );
};
