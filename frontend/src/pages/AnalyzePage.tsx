import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Sparkles,
  AlertCircle,
  MapPin,
  BrainCircuit,
  Info
} from 'lucide-react';
import { api, getMediaUrl } from '../services/api';
import type { Language } from '../types';

interface AnalyzePageProps {
  language: Language;
}

const SAMPLE_GALLERY = [
  { name: 'Tomato Early Blight', crop: 'Tomato', path: '/static/demo/sample_tomato_1.jpg' },
  { name: 'Tomato Late Blight', crop: 'Tomato', path: '/static/demo/sample_tomato_2.jpg' },
  { name: 'Potato Early Blight', crop: 'Potato', path: '/static/demo/sample_potato_1.jpg' },
  { name: 'Apple Scab', crop: 'Apple', path: '/static/demo/sample_apple_1.jpg' },
  { name: 'Corn Rust', crop: 'Corn', path: '/static/demo/sample_corn_1.jpg' },
];

export const AnalyzePage: React.FC<AnalyzePageProps> = () => {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSample, setSelectedSample] = useState<string | null>(SAMPLE_GALLERY[0].path);
  const [previewUrl, setPreviewUrl] = useState<string | null>(SAMPLE_GALLERY[0].path);
  const [cropName, setCropName] = useState<string>('AUTO_DETECT');
  
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('Nashik');
  const [village, setVillage] = useState('Ozar');
  const [latitude] = useState(20.0059);
  const [longitude] = useState(73.7798);

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setErrorMsg('Please upload a valid crop image (JPG, PNG, WEBP).');
        return;
      }
      setSelectedFile(file);
      setSelectedSample(null);
      setPreviewUrl(URL.createObjectURL(file));
      setErrorMsg(null);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_GALLERY[0]) => {
    setSelectedFile(null);
    setSelectedSample(sample.path);
    setPreviewUrl(sample.path);
    if (sample.crop) setCropName(sample.crop);
    setErrorMsg(null);
  };

  const handleRunAnalysis = async () => {
    if (!selectedFile && !selectedSample) {
      setErrorMsg('Please upload an image or select a demo sample.');
      return;
    }

    try {
      setAnalyzing(true);
      setErrorMsg(null);

      // Simulated pipeline progress steps for presentation impact
      setAnalysisStep('1/4: Preprocessing & Resizing to 224x224...');
      await new Promise(r => setTimeout(r, 400));
      
      setAnalysisStep('2/4: Running MobileNetV3 PyTorch Inference...');
      await new Promise(r => setTimeout(r, 400));

      setAnalysisStep('3/4: Estimating OpenCV HSV Lesion Surface Area % & Grad-CAM...');
      await new Promise(r => setTimeout(r, 400));

      setAnalysisStep('4/4: Building Agronomic Recommendations & Saving Record...');

      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (selectedSample) {
        formData.append('sample_image_path', selectedSample);
      }

      if (cropName !== 'AUTO_DETECT') {
        formData.append('crop_name', cropName);
      }
      formData.append('state', state);
      formData.append('district', district);
      formData.append('village', village);
      formData.append('latitude', latitude.toString());
      formData.append('longitude', longitude.toString());

      const res = await api.analyzeImage(formData);
      navigate(`/result/${res.inspection.id}`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.detail || 'Analysis failed. Please check image format.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">AI Crop Health Diagnostics</h1>
            <p className="text-xs text-slate-400">MobileNetV3 PyTorch Multi-Crop Computer Vision Analysis</p>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Image Upload & Sample Selector */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Main Dropzone / Preview */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 text-center relative">
            <h3 className="text-sm font-bold text-white mb-3 text-left">Upload Crop Leaf Image</h3>
            
            {previewUrl ? (
              <div className="relative group rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 max-h-80 flex items-center justify-center">
                <img
                  src={previewUrl.startsWith('blob:') || previewUrl.startsWith('data:') ? previewUrl : getMediaUrl(previewUrl)}
                  alt="Preview"
                  className="max-h-80 w-auto object-contain mx-auto"
                />
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <label className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold cursor-pointer hover:bg-slate-700">
                    Change Image
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-900/40">
                <Upload className="w-10 h-10 text-emerald-400 mb-3 animate-bounce" />
                <p className="text-sm font-semibold text-slate-200">Drag & Drop leaf photo here or click to browse</p>
                <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP up to 10MB</p>
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>

          {/* Sample Dataset Quick Selector */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Or Select Preset Demo Leaf Sample
              </h3>
              <span className="text-[10px] text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Instant Test
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {SAMPLE_GALLERY.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => handleSelectSample(sample)}
                  className={`p-2 rounded-2xl border text-left transition-all ${
                    selectedSample === sample.path
                      ? 'bg-emerald-500/20 border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={getMediaUrl(sample.path)}
                    alt={sample.name}
                    className="w-full h-16 object-cover rounded-xl mb-1.5"
                  />
                  <p className="text-[11px] font-bold text-white truncate">{sample.crop}</p>
                  <p className="text-[10px] text-slate-400 truncate">{sample.name}</p>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Options & Location Controls */}
        <div className="space-y-6">
          
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white pb-2 border-b border-slate-800">
              Inspection Metadata
            </h3>

            {/* Crop Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Crop Type</label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="AUTO_DETECT">✨ Auto-Detect Crop (AI Vision)</option>
                <option value="Tomato">Tomato (Solanum lycopersicum)</option>
                <option value="Potato">Potato (Solanum tuberosum)</option>
                <option value="Apple">Apple (Malus domestica)</option>
                <option value="Corn">Corn / Maize (Zea mays)</option>
                <option value="Cotton">Cotton (Gossypium)</option>
                <option value="Rice">Rice (Oryza sativa)</option>
              </select>
            </div>

            {/* Location Form */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>Geographic Location Tagging</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-0.5">Village / Sector</label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>

            {/* Run Analysis Button */}
            <button
              onClick={handleRunAnalysis}
              disabled={analyzing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 transition-all active:scale-98 flex items-center justify-center gap-2 mt-4"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Run AI Computer Vision Inference</span>
                </>
              )}
            </button>

            {analyzing && (
              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/30 text-[11px] text-emerald-400 font-mono text-center animate-pulse">
                {analysisStep}
              </div>
            )}

          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
            <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
              <Info className="w-4 h-4 text-emerald-400" />
              <span>AI Model Pipeline Details</span>
            </div>
            <p>
              Extracts 224x224 feature maps using MobileNetV3 backbone. Calculates leaf lesion area via OpenCV HSV color thresholding and generates a Grad-CAM jet colormap attention map.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
