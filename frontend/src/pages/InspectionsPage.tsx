import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, Trash2, Eye, History } from 'lucide-react';
import { api, getMediaUrl } from '../services/api';
import type { CropInspection, Language } from '../types';

interface InspectionsPageProps {
  language: Language;
}

export const InspectionsPage: React.FC<InspectionsPageProps> = () => {
  const [inspections, setInspections] = useState<CropInspection[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [districtFilter, setDistrictFilter] = useState('ALL');

  useEffect(() => {
    fetchInspections();
  }, [cropFilter, severityFilter, districtFilter]);

  const fetchInspections = async () => {
    try {
      setLoading(true);
      const data = await api.getInspections({
        crop: cropFilter,
        severity: severityFilter,
        district: districtFilter,
        search: search.trim() || undefined
      });
      setInspections(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInspections();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm(`Delete inspection record #${id}?`)) {
      await api.deleteInspection(id);
      fetchInspections();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-400" />
            <span>Crop Inspections History</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Searchable historical archive of AI crop disease and pest diagnostic records
          </p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center gap-3">
        
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Crop, Disease, Pest, District or Village..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </form>

        {/* Crop Filter */}
        <select
          value={cropFilter}
          onChange={(e) => setCropFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value="ALL">All Crops</option>
          <option value="Tomato">Tomato</option>
          <option value="Potato">Potato</option>
          <option value="Apple">Apple</option>
          <option value="Corn">Corn</option>
          <option value="Cotton">Cotton</option>
          <option value="Rice">Rice</option>
        </select>

        {/* Severity Filter */}
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value="ALL">All Severity</option>
          <option value="LOW">LOW</option>
          <option value="MODERATE">MODERATE</option>
          <option value="HIGH">HIGH</option>
          <option value="CRITICAL">CRITICAL</option>
        </select>

        {/* District Filter */}
        <select
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value="ALL">All Districts</option>
          <option value="Nashik">Nashik</option>
          <option value="Pune">Pune</option>
          <option value="Satara">Satara</option>
          <option value="Kolhapur">Kolhapur</option>
          <option value="Nagpur">Nagpur</option>
        </select>

      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading inspection records...</div>
        ) : inspections.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No crop inspections match your search filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Photo</th>
                  <th className="py-3.5 px-4">ID & Date</th>
                  <th className="py-3.5 px-4">Crop</th>
                  <th className="py-3.5 px-4">Detection Result</th>
                  <th className="py-3.5 px-4">Confidence</th>
                  <th className="py-3.5 px-4">Severity</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {inspections.map((insp) => (
                  <tr key={insp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <img
                        src={getMediaUrl(insp.image_url)}
                        alt={insp.crop_name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-700"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-white">
                      #{insp.id}
                      <div className="text-[10px] text-slate-400 font-sans">{new Date(insp.created_at).toLocaleDateString()}</div>
                    </td>
                    <td className="py-3 px-4 font-bold text-white">{insp.crop_name}</td>
                    <td className="py-3 px-4 font-semibold text-emerald-400">{insp.detection_result}</td>
                    <td className="py-3 px-4 text-slate-300 font-medium">{insp.confidence}%</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        insp.severity_level === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        insp.severity_level === 'HIGH' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {insp.severity_level} ({insp.affected_area_pct}%)
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">{insp.district}, {insp.state}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        to={`/result/${insp.id}`}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 inline-block"
                        title="View Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <a
                        href={api.getInspectionReportUrl(insp.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 inline-block border border-emerald-500/30"
                        title="Download PDF Report"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDelete(insp.id)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 inline-block border border-rose-500/20"
                        title="Delete Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
