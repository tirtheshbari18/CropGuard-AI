import React, { useEffect, useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { api } from '../services/api';
import type { CropInspection } from '../types';

export const ReportsPage: React.FC = () => {
  const [inspections, setInspections] = useState<CropInspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await api.getInspections({ limit: 30 });
      setInspections(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <FileText className="w-6 h-6 text-emerald-400" />
          <span>PDF Reports Archive & Batch Export</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Generate and download official PDF agronomic diagnostic reports with ReportLab
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center text-xs text-slate-400 p-8">Loading PDF reports...</div>
        ) : (
          inspections.map((insp) => (
            <div key={insp.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400">#REPORT-{insp.id}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  PDF Ready
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{insp.crop_name}</h3>
                <p className="text-xs text-emerald-400 font-semibold">{insp.detection_result}</p>
                <p className="text-[11px] text-slate-400 mt-1">{insp.district}, {insp.state} • {new Date(insp.created_at).toLocaleDateString()}</p>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <a
                  href={api.getInspectionReportUrl(insp.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
