import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Scan, ArrowRight } from 'lucide-react';
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
  AreaChart,
  Area
} from 'recharts';
import { api, getMediaUrl } from '../services/api';
import type { DashboardStats, CropInspection, UserRole, Language } from '../types';
import { translations } from '../locales/i18n';

interface DashboardPageProps {
  currentRole: UserRole;
  language: Language;
}

const COLORS = ['#22c55e', '#eab308', '#f97316', '#ef4444', '#06b6d4', '#8b5cf6'];

export const DashboardPage: React.FC<DashboardPageProps> = ({ currentRole, language }) => {
  const navigate = useNavigate();
  const t = translations[language];
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInspections, setRecentInspections] = useState<CropInspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [dashData, inspData] = await Promise.all([
        api.getDashboard(),
        api.getInspections({ limit: 6 })
      ]);
      setStats(dashData);
      setRecentInspections(inspData);
    } catch (err: any) {
      console.error('Failed to load dashboard statistics', err);
      setError(err?.message || 'Unable to connect to CropGuard AI backend service. Please verify your backend server or VITE_API_URL.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (error && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="glass-panel p-8 rounded-3xl border border-rose-500/30 text-center max-w-md space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
            !
          </div>
          <h2 className="text-lg font-bold text-white">Backend Connection Notice</h2>
          <p className="text-xs text-slate-300">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading Agronomic Command Center...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Banner / Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              {currentRole === 'FARMER' ? 'Farmer View' : currentRole === 'OFFICER' ? 'Regional Officer View' : 'Admin View'}
            </span>
            <span className="text-xs text-slate-400">• Maharashtra Region</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Crop Health Command Center</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time disease detection stream, outbreak anomaly alerts, and computer vision severity analysis.
          </p>
        </div>

        <button
          onClick={() => navigate('/analyze')}
          className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-xl shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95 shrink-0 z-10"
        >
          <Scan className="w-5 h-5 animate-pulse" />
          <span>{t.btn_analyze_now}</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        
        <div className="glass-card p-4 rounded-2xl border border-slate-800/80">
          <p className="text-[11px] font-medium text-slate-400">Total Inspections</p>
          <p className="text-2xl font-bold text-white mt-1">{stats.total_inspections}</p>
          <span className="text-[10px] text-emerald-400 font-medium">Verified database</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800/80">
          <p className="text-[11px] font-medium text-slate-400">Healthy Crops</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.healthy_crops}</p>
          <span className="text-[10px] text-emerald-500 font-medium">Optimal health</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800/80">
          <p className="text-[11px] font-medium text-slate-400">Diseases Found</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{stats.disease_detected}</p>
          <span className="text-[10px] text-amber-400 font-medium">Fungal/Bacterial</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800/80">
          <p className="text-[11px] font-medium text-slate-400">Pests Detected</p>
          <p className="text-2xl font-bold text-rose-400 mt-1">{stats.pest_detected}</p>
          <span className="text-[10px] text-rose-400 font-medium">Aphid/Borer attack</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800/80">
          <p className="text-[11px] font-medium text-slate-400">High Severity</p>
          <p className="text-2xl font-bold text-red-500 mt-1">{stats.high_severity_cases}</p>
          <span className="text-[10px] text-red-400 font-medium">&gt;35% affected area</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800/80">
          <p className="text-[11px] font-medium text-slate-400">Active Alerts</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.active_alerts}</p>
          <span className="text-[10px] text-yellow-400 font-medium">Cluster trigger</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800/80">
          <p className="text-[11px] font-medium text-slate-400">Districts</p>
          <p className="text-2xl font-bold text-cyan-400 mt-1">{stats.affected_districts_count}</p>
          <span className="text-[10px] text-cyan-400 font-medium">Geographic span</span>
        </div>

      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline Area Chart */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Disease & Pest Occurrences Over Time</h3>
              <p className="text-xs text-slate-400">Daily crop inspection case volume trend</p>
            </div>
            <span className="text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              Live Feed
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.timeline_cases}>
                <defs>
                  <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }}
                />
                <Area type="monotone" dataKey="cases" stroke="#22c55e" strokeWidth={2} fillOpacity={1} fill="url(#colorCases)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Breakdown Donut */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800">
          <h3 className="text-base font-bold text-white mb-1">Severity Distribution</h3>
          <p className="text-xs text-slate-400 mb-4">Categorized leaf lesion surface area impact</p>
          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.severity_distribution}
                  dataKey="count"
                  nameKey="severity"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {stats.severity_distribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs mt-2">
            {stats.severity_distribution.map((item, idx) => (
              <div key={item.severity} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-slate-300 font-medium">{item.severity}: {item.count}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row 2: Crop Distribution & District Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Crop Wise Frequency */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800">
          <h3 className="text-base font-bold text-white mb-1">Crop-Wise Inspection Frequency</h3>
          <p className="text-xs text-slate-400 mb-4">Total inspection breakdown by crop type</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.crop_distribution}>
                <XAxis dataKey="crop" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }} />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* District Wise Breakdown */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800">
          <h3 className="text-base font-bold text-white mb-1">District-Wise Case Counts</h3>
          <p className="text-xs text-slate-400 mb-4">Geographic distribution across Maharashtra</p>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.district_cases} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis dataKey="district" type="category" stroke="#64748b" fontSize={11} tickLine={false} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#fff' }} />
                <Bar dataKey="cases" fill="#06b6d4" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Inspections Stream */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Recent Crop Inspections</h3>
            <p className="text-xs text-slate-400">Latest AI computer vision analysis records</p>
          </div>
          <Link
            to="/inspections"
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            <span>View All Records</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentInspections.map((insp) => (
            <Link
              key={insp.id}
              to={`/result/${insp.id}`}
              className="glass-card p-4 rounded-2xl border border-slate-800 hover:border-emerald-500/30 transition-all flex items-start gap-4 group"
            >
              <img
                src={getMediaUrl(insp.image_url)}
                alt={insp.crop_name}
                className="w-16 h-16 rounded-xl object-cover border border-slate-700/80 group-hover:scale-105 transition-transform shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-white truncate">{insp.crop_name}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    insp.severity_level === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    insp.severity_level === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {insp.severity_level}
                  </span>
                </div>
                <p className="text-xs font-semibold text-emerald-400 truncate">{insp.detection_result}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                  <span>{insp.district}, {insp.state}</span>
                  <span className="font-medium text-slate-300">{insp.confidence}% conf</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};
