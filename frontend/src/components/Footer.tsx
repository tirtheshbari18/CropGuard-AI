import React from 'react';
import { ShieldAlert, Sprout } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 px-4 lg:px-8 mt-auto text-xs text-slate-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sprout className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200">CropGuard AI Platform</span>
          <span>— Smart India Hackathon 2026 (SIH26131)</span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900/60 px-3 py-1 rounded-full border border-slate-800">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>AI Decision Support System — Confirm diagnoses with Krishi Vigyan Kendra (KVK) agronomists.</span>
        </div>
      </div>
    </footer>
  );
};
