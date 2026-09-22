import React, { useEffect, useState } from 'react';
import { Activity, RefreshCw, Server, Database, BrainCircuit, HardDrive } from 'lucide-react';
import { api } from '../services/api';

export const SystemHealthPage: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const data = await api.getSystemHealth();
      setHealth(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !health) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xs text-slate-400">Loading System Health Diagnostics...</div>
      </div>
    );
  }

  const items = [
    { name: 'React Vite Frontend', status: health.frontend, icon: Server },
    { name: 'FastAPI Backend REST API', status: health.backend, icon: Server },
    { name: 'PostgreSQL / SQLite Database', status: health.database, icon: Database },
    { name: 'MobileNetV3 PyTorch ML Model', status: health.ai_model, icon: BrainCircuit },
    { name: 'OpenCV Image Processing Engine', status: health.image_processing, icon: Activity },
    { name: 'Local Uploads & Heatmaps Storage', status: health.storage, icon: HardDrive },
  ];

  return (
    <div className="space-y-6">
      
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-400" />
            <span>System Health Diagnostics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status monitoring across micro-services, database, and computer vision pipeline
          </p>
        </div>

        <button
          onClick={fetchHealth}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 border border-slate-800">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{item.name}</h3>
                  <p className="text-xs text-emerald-400 font-semibold">{item.status}</p>
                </div>
              </div>

              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
};
