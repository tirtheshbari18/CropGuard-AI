import React, { useEffect, useState, useCallback } from 'react';
import { Bell, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import type { Alert, UserRole, Language } from '../types';

interface AlertsPageProps {
  currentRole: UserRole;
  language: Language;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ currentRole }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ACTIVE');
  const [loading, setLoading] = useState(true);

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getAlerts(statusFilter === 'ALL' ? undefined : statusFilter);
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    await api.updateAlertStatus(id, newStatus);
    fetchAlerts();
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-400" />
            <span>Early Warning Alert Center</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated disease outbreak notifications & Krishi Vigyan Kendra extension advisories
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 text-xs">
          {['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'ALL'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                statusFilter === st
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Stream */}
      <div className="space-y-4">
        {loading ? (
          <div className="glass-panel p-12 text-center text-xs text-slate-400 rounded-3xl">
            Loading early warning alerts...
          </div>
        ) : !Array.isArray(alerts) || alerts.length === 0 ? (
          <div className="glass-panel p-12 text-center text-xs text-slate-400 rounded-3xl">
            No alerts found for selected filter status ({statusFilter}).
          </div>
        ) : (
          (Array.isArray(alerts) ? alerts : []).map((alert) => (
            <div
              key={alert.id}
              className="glass-panel p-6 rounded-3xl border border-slate-800/80 hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-2xl ${
                    alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    alert.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-400">ALERT #{alert.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        alert.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {alert.severity} SEVERITY
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-0.5">{alert.alert_title}</h3>
                  </div>
                </div>

                {/* Status Badge & Officer Action Buttons */}
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${
                    alert.status === 'ACTIVE' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                    alert.status === 'ACKNOWLEDGED' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {alert.status}
                  </span>

                  {currentRole !== 'FARMER' && (
                    <div className="flex items-center gap-1">
                      {alert.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleUpdateStatus(alert.id, 'ACKNOWLEDGED')}
                          className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold hover:bg-amber-500/30"
                        >
                          Acknowledge
                        </button>
                      )}
                      {alert.status !== 'RESOLVED' && (
                        <button
                          onClick={() => handleUpdateStatus(alert.id, 'RESOLVED')}
                          className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold hover:bg-emerald-500/30"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Alert Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400">Target Crop & Disease:</span>
                  <p className="font-bold text-white mt-0.5">{alert.crop_name} — {alert.disease_pest_name}</p>
                </div>
                <div>
                  <span className="text-slate-400">Location & Case Count:</span>
                  <p className="font-bold text-white mt-0.5">{alert.district}, {alert.state} ({alert.case_count} cases)</p>
                </div>
                <div>
                  <span className="text-slate-400">Detection Date:</span>
                  <p className="font-bold text-white mt-0.5">{new Date(alert.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Action Recommended */}
              {alert.recommended_action && (
                <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-slate-300">
                  <span className="font-bold text-emerald-400 block mb-1">Recommended Extension Officer Action:</span>
                  <p>{alert.recommended_action}</p>
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
};
