import React, { useEffect, useState } from 'react';
import { BrainCircuit, Cpu, Database } from 'lucide-react';
import { api } from '../services/api';
import type { ModelMetrics, Language } from '../types';

interface ModelPerformancePageProps {
  language: Language;
}

export const ModelPerformancePage: React.FC<ModelPerformancePageProps> = () => {
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [modelStatus, setModelStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchModelInfo();
  }, []);

  const fetchModelInfo = async () => {
    try {
      setLoading(true);
      const [m, s] = await Promise.all([
        api.getModelMetrics(),
        api.getModelStatus()
      ]);
      setMetrics(m);
      setModelStatus(s);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xs text-slate-400">Loading AI Model Performance Evaluation...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-emerald-400" />
          <span>AI Computer Vision Model Diagnostics & Performance</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          MobileNetV3 PyTorch multi-class classifier & OpenCV lesion segmentation evaluation
        </p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        
        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold">Model Accuracy</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{(metrics.accuracy * 100).toFixed(1)}%</p>
          <span className="text-[10px] text-emerald-500 font-medium">Test Set (N=4,800)</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold">Precision</span>
          <p className="text-2xl font-bold text-cyan-400 mt-1">{(metrics.precision * 100).toFixed(1)}%</p>
          <span className="text-[10px] text-cyan-500 font-medium">False Positive Control</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold">Recall (Sensitivity)</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">{(metrics.recall * 100).toFixed(1)}%</p>
          <span className="text-[10px] text-amber-500 font-medium">Early Disease Catch</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold">F1-Score</span>
          <p className="text-2xl font-bold text-purple-400 mt-1">{(metrics.f1_score * 100).toFixed(1)}%</p>
          <span className="text-[10px] text-purple-500 font-medium">Harmonic Mean</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] text-slate-400 font-semibold">Avg Latency</span>
          <p className="text-2xl font-bold text-teal-400 mt-1">{metrics.avg_inference_sec}s</p>
          <span className="text-[10px] text-teal-500 font-medium">224x224 Tensor</span>
        </div>

      </div>

      {/* Model Specifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <span>Architecture & Training Specifications</span>
          </h3>

          <div className="divide-y divide-slate-800/80">
            <div className="py-2 flex justify-between">
              <span className="text-slate-400">CNN Backbone:</span>
              <span className="font-mono text-emerald-400 font-semibold">{metrics.model_version}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Dataset Source:</span>
              <span className="text-slate-200 font-semibold">{metrics.dataset_name}</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Number of Classes:</span>
              <span className="text-slate-200 font-semibold">{metrics.num_classes} Disease & Pest Classes</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Lesion Segmentation:</span>
              <span className="text-slate-200 font-semibold">OpenCV HSV Color Masking</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Explainable AI:</span>
              <span className="text-slate-200 font-semibold">Grad-CAM Colormap Jet Generator</span>
            </div>
            <div className="py-2 flex justify-between">
              <span className="text-slate-400">Training Checkpoint Date:</span>
              <span className="text-slate-200 font-semibold">{metrics.training_date}</span>
            </div>
          </div>
        </div>

        {/* Supported Classes */}
        <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-3 text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Supported Crop & Disease Catalog</span>
          </h3>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {modelStatus && modelStatus.supported_diseases?.map((d: string, idx: number) => (
              <div key={idx} className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-medium">
                • {d}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
