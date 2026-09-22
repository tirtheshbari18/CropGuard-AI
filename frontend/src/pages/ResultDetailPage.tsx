import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  MapPin,
  ShieldAlert,
  FileText,
  Sparkles,
  Flame
} from 'lucide-react';
import { api } from '../services/api';
import type { CropInspection, Language } from '../types';
import { translations } from '../locales/i18n';

interface ResultDetailPageProps {
  language: Language;
}

export const ResultDetailPage: React.FC<ResultDetailPageProps> = ({ language }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const t = translations[language];

  const [inspection, setInspection] = useState<CropInspection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchInspectionDetail(parseInt(id, 10));
    }
  }, [id]);

  const fetchInspectionDetail = async (inspId: number) => {
    try {
      setLoading(true);
      const data = await api.getInspectionById(inspId);
      setInspection(data);
    } catch (err) {
      setError('Inspection record not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (inspection) {
      window.open(api.getInspectionReportUrl(inspection.id), '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading Agronomic Report #{id}...</p>
        </div>
      </div>
    );
  }

  if (error || !inspection) {
    return (
      <div className="p-8 text-center glass-panel rounded-3xl border border-slate-800 max-w-md mx-auto">
        <ShieldAlert className="w-10 h-10 text-rose-400 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-white">Record Not Found</h2>
        <p className="text-xs text-slate-400 mt-1 mb-4">{error}</p>
        <button
          onClick={() => navigate('/inspections')}
          className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold"
        >
          Back to Inspections
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.download_report}</span>
          </button>
          
          <button
            onClick={() => navigate('/analyze')}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Analyze Another Image
          </button>
        </div>
      </div>

      {/* Main Result Card */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
        
        {/* Header Metadata */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Inspection Report #{inspection.id}
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {inspection.model_version}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              {inspection.crop_name} — {inspection.detection_result}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{inspection.village ? `${inspection.village}, ` : ''}{inspection.district}, {inspection.state}</span>
              <span>• {new Date(inspection.created_at).toLocaleString()}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Confidence Badge */}
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center min-w-[100px]">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Confidence</p>
              <p className="text-xl font-bold text-emerald-400 mt-0.5">{inspection.confidence}%</p>
            </div>

            {/* Severity Gauge Badge */}
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-center min-w-[110px]">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Severity Level</p>
              <p className={`text-xl font-bold mt-0.5 ${
                inspection.severity_level === 'CRITICAL' ? 'text-red-500' :
                inspection.severity_level === 'HIGH' ? 'text-amber-400' :
                'text-emerald-400'
              }`}>
                {inspection.severity_level}
              </p>
            </div>
          </div>
        </div>

        {/* Side-by-side Images: Original vs AI Heatmap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <p className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <span>Original Leaf Photo</span>
            </p>
            <div className="rounded-xl overflow-hidden bg-slate-950 h-64 flex items-center justify-center border border-slate-800">
              <img
                src={inspection.image_url}
                alt="Original Leaf"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl border border-slate-800">
            <p className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              <span>AI Focus Area (Grad-CAM Jet Overlay)</span>
            </p>
            <div className="rounded-xl overflow-hidden bg-slate-950 h-64 flex items-center justify-center border border-slate-800 relative">
              <img
                src={inspection.heatmap_url || inspection.image_url}
                alt="Grad-CAM Focus Heatmap"
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-2 right-2 text-[10px] font-bold px-2 py-1 rounded bg-slate-900/90 text-emerald-400 border border-emerald-500/30">
                Focus Heatmap
              </span>
            </div>
          </div>

        </div>

        {/* AI Explainability Banner */}
        <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-slate-300 space-y-1">
          <div className="flex items-center gap-2 font-bold text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>AI Explainability Insights</span>
          </div>
          <p className="leading-relaxed text-slate-300">
            MobileNetV3 attention heatmap highlights discolored leaf spots contributing to the {inspection.confidence}% confidence score.
            Calculated lesion surface area coverage is ~{inspection.affected_area_pct}%.
          </p>
        </div>

        {/* Agronomic Guidance & Management Recommendations */}
        <div className="space-y-3 pt-2">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Agronomic Guidance & Management Recommendations</span>
          </h3>

          <div className="space-y-2">
            {inspection.recommendations && inspection.recommendations.length > 0 ? (
              inspection.recommendations.map((rec, idx) => (
                <div key={idx} className="glass-card p-4 rounded-2xl border border-slate-800/80 flex items-start gap-3">
                  <div className={`p-2 rounded-xl text-xs font-bold shrink-0 ${
                    rec.urgency === 'HIGH' || rec.urgency === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {rec.category}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-white">{rec.title}</h4>
                      <span className="text-[10px] font-semibold text-slate-400">{rec.urgency} Urgency</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{rec.details}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No specific management recommendations required.</p>
            )}
          </div>
        </div>

        {/* Footer Link to Map */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Inspection Location: Lat {inspection.latitude}, Lng {inspection.longitude}</span>
          <Link to="/map" className="text-emerald-400 font-semibold hover:underline">
            View on GIS Disease Map &rarr;
          </Link>
        </div>

      </div>

    </div>
  );
};
