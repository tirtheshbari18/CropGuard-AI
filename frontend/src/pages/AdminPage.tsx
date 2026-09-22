import React, { useState } from 'react';
import { ShieldCheck, RefreshCw, Settings, Database, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export const AdminPage: React.FC = () => {
  const [resetting, setResetting] = useState(false);
  const [resetMsg, setResetMsg] = useState<string | null>(null);

  const handleResetDemo = async () => {
    if (window.confirm('Reset the demo database to default state with seeded sample inspections?')) {
      try {
        setResetting(true);
        const res = await api.resetDemoDatabase();
        setResetMsg(res.message);
      } catch (err) {
        setResetMsg('Failed to reset demo database.');
      } finally {
        setResetting(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <span>System Administration & Platform Configuration</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage system thresholds, user accounts, model metadata, and demo environment reset
        </p>
      </div>

      {resetMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{resetMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Environment Reset */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Demo Dataset & Environment Control</span>
          </h3>
          <p className="text-xs text-slate-400">
            Re-seed the database with 28+ realistic crop inspections across Maharashtra, active alert triggers, and model metrics for hackathon demonstrations.
          </p>

          <button
            onClick={handleResetDemo}
            disabled={resetting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-xs shadow-lg shadow-amber-600/20 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${resetting ? 'animate-spin' : ''}`} />
            <span>Reset Demo Database & Re-Seed Sample Data</span>
          </button>
        </div>

        {/* Threshold Configuration */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-emerald-400" />
            <span>Outbreak Alert Threshold Engine</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Spatial Cluster Trigger Radius</label>
              <input type="text" value="2.5 km (Dynamic expansion based on case count)" disabled className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Temporal Detection Window</label>
              <input type="text" value="14 Days" disabled className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Minimum Case Threshold for Outbreak Alert</label>
              <input type="text" value="3 Disease Occurrences in Same District" disabled className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono" />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
