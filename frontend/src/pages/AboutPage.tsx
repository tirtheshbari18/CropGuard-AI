import React from 'react';
import { Sprout, ShieldAlert } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 text-center space-y-3 relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
          Smart India Hackathon 2026 — Problem SIH26131
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          CropGuard AI Platform
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          AI-Powered Crop Disease & Pest Detection, Computer Vision Severity Analysis, GIS Outbreak Mapping, and Early Warning System
        </p>
      </div>

      {/* Problem vs Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-panel p-6 rounded-3xl border border-rose-500/20 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <ShieldAlert className="w-5 h-5" />
            <span>The Agricultural Challenge</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Crop diseases and rapid pest infestations reduce agricultural productivity by up to 40% in India annually. Delayed identification and lack of early warning systems lead to overuse of broad-spectrum pesticides and financial strain on farmers.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Sprout className="w-5 h-5" />
            <span>The CropGuard AI Solution</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            CropGuard AI provides instant MobileNetV3 computer vision leaf image analysis, OpenCV lesion severity percentage estimation, Grad-CAM explainable focus heatmaps, GIS spatial cluster outbreak detection, and automated advisories.
          </p>
        </div>

      </div>

      {/* End-to-End Pipeline Workflow */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white text-center">
          End-to-End AI Diagnostic Pipeline Architecture
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 block">1. Crop Image</span>
            <span className="text-[10px] text-slate-400">Leaf Upload / Camera</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 block">2. OpenCV CV</span>
            <span className="text-[10px] text-slate-400">Resize to 224x224</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 block">3. PyTorch Model</span>
            <span className="text-[10px] text-slate-400">MobileNetV3 Classifier</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 block">4. Severity %</span>
            <span className="text-[10px] text-slate-400">HSV Lesion Mask</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 block">5. Grad-CAM</span>
            <span className="text-[10px] text-slate-400">Explainable Heatmap</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 block">6. GIS Outbreak</span>
            <span className="text-[10px] text-slate-400">Density Cluster</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-400 block">7. Early Warning</span>
            <span className="text-[10px] text-slate-400">Officer Advisories</span>
          </div>

        </div>
      </div>

      {/* AI Transparency Disclaimer */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-2">
        <h4 className="font-bold flex items-center gap-1.5 text-amber-400">
          <ShieldAlert className="w-4 h-4" />
          <span>AI Transparency & Responsible Agronomic Advisory</span>
        </h4>
        <p className="leading-relaxed text-amber-200/90">
          CropGuard AI outputs are intended strictly as decision-support software for farmers and agricultural extension officers. Predictions do not claim 100% agronomic certainty. Chemical treatments must be confirmed with Krishi Vigyan Kendra (KVK) officers before field application.
        </p>
      </div>

    </div>
  );
};
