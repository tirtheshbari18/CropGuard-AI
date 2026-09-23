import React, { useEffect, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { api } from '../services/api';
import type { DashboardStats, Language } from '../types';

interface AnalyticsPageProps {
  language: Language;
}

const COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899'];

export const AnalyticsPage: React.FC<AnalyticsPageProps> = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboard();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xs text-slate-400">Loading Agronomic Analytics Engine...</div>
      </div>
    );
  }

  const healthyPct = Math.round((stats.healthy_crops / (stats.total_inspections || 1)) * 100);
  const diseasePct = Math.round((stats.disease_detected / (stats.total_inspections || 1)) * 100);
  const pestPct = Math.round((stats.pest_detected / (stats.total_inspections || 1)) * 100);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-emerald-400" />
          <span>Agronomic Health Analytics & Trends</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Multi-dimensional disease frequency, pest attack ratio, and severity trends
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Healthy Crop Ratio</span>
          <p className="text-3xl font-bold text-emerald-400 mt-1">{healthyPct}%</p>
          <p className="text-[11px] text-slate-400 mt-1">{stats.healthy_crops} of {stats.total_inspections} total inspections</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Fungal / Bacterial Disease Ratio</span>
          <p className="text-3xl font-bold text-amber-400 mt-1">{diseasePct}%</p>
          <p className="text-[11px] text-slate-400 mt-1">{stats.disease_detected} infected crop cases</p>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Pest Attack Density</span>
          <p className="text-3xl font-bold text-rose-400 mt-1">{pestPct}%</p>
          <p className="text-[11px] text-slate-400 mt-1">{stats.pest_detected} aphid/borer cases</p>
        </div>

      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Disease Distribution Pie */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800">
          <h3 className="text-base font-bold text-white mb-1">Disease Frequency Breakdown</h3>
          <p className="text-xs text-slate-400 mb-4">Relative proportion of detected plant pathogens</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.disease_distribution}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {stats.disease_distribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pest Attacks Bar Chart */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800">
          <h3 className="text-base font-bold text-white mb-1">Pest Attack Frequencies</h3>
          <p className="text-xs text-slate-400 mb-4">Aphids, Armyworm, Stem Borer case volume</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.pest_distribution}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }} />
                <Bar dataKey="count" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};
