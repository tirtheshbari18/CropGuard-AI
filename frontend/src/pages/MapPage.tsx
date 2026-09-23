import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, AlertTriangle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import type { OutbreakCluster, Language } from '../types';

interface MapPageProps {
  language: Language;
}

// Leaflet default icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom colored SVG pin markers for severity levels
const createCustomPin = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid #0f172a; box-shadow: 0 0 10px ${color};"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

const MARKER_ICONS = {
  LOW: createCustomPin('#22c55e'),
  MODERATE: createCustomPin('#eab308'),
  HIGH: createCustomPin('#f97316'),
  CRITICAL: createCustomPin('#ef4444'),
};

export const MapPage: React.FC<MapPageProps> = () => {
  const [mapEvents, setMapEvents] = useState<any[]>([]);
  const [outbreaks, setOutbreaks] = useState<OutbreakCluster[]>([]);
  const [loading, setLoading] = useState(true);
  const [layerFilter, setLayerFilter] = useState<'ALL' | 'DISEASE' | 'PEST' | 'HIGH_SEVERITY'>('ALL');
  const [showOutbreaks, setShowOutbreaks] = useState(true);

  const fetchMapData = async () => {
    try {
      setLoading(true);
      const [eventsData, outbreakData] = await Promise.all([
        api.getMapEvents(),
        api.getOutbreaks()
      ]);
      setMapEvents(eventsData);
      setOutbreaks(outbreakData);
    } catch (err) {
      console.error('Failed to load GIS map data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, []);

  const filteredEvents = mapEvents.filter(ev => {
    if (layerFilter === 'DISEASE') return ev.detection_type === 'DISEASE';
    if (layerFilter === 'PEST') return ev.detection_type === 'PEST';
    if (layerFilter === 'HIGH_SEVERITY') return ev.severity_level === 'HIGH' || ev.severity_level === 'CRITICAL';
    return true;
  });

  return (
    <div className="space-y-4">
      
      {/* Map Controls Header */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <span>GIS Regional Disease & Outbreak Map</span>
          </h1>
          <p className="text-xs text-slate-400">
            Geographic spatial-temporal occurrence distribution & anomaly cluster detection
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setLayerFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              layerFilter === 'ALL' ? 'bg-emerald-500 text-white border-emerald-500 font-semibold' : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            All Inspections
          </button>

          <button
            onClick={() => setLayerFilter('DISEASE')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              layerFilter === 'DISEASE' ? 'bg-amber-500 text-white border-amber-500 font-semibold' : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            Diseases Only
          </button>

          <button
            onClick={() => setLayerFilter('PEST')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              layerFilter === 'PEST' ? 'bg-rose-500 text-white border-rose-500 font-semibold' : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            Pest Attacks
          </button>

          <button
            onClick={() => setLayerFilter('HIGH_SEVERITY')}
            className={`px-3 py-1.5 rounded-xl border transition-all ${
              layerFilter === 'HIGH_SEVERITY' ? 'bg-red-600 text-white border-red-600 font-semibold' : 'bg-slate-900 border-slate-700 text-slate-400'
            }`}
          >
            High Severity Cases
          </button>

          <label className="flex items-center gap-1.5 text-xs text-slate-300 ml-2 cursor-pointer bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
            <input
              type="checkbox"
              checked={showOutbreaks}
              onChange={(e) => setShowOutbreaks(e.target.checked)}
              className="accent-emerald-500 rounded"
            />
            <span>Show Outbreak Clusters</span>
          </label>
        </div>
      </div>

      {/* Main Leaflet Map Container */}
      <div className="glass-panel p-2 rounded-3xl border border-slate-800 h-[680px] relative overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full text-xs text-slate-400">
            Loading interactive GIS map markers...
          </div>
        ) : (
          <MapContainer
            center={[19.7515, 75.7139]}
            zoom={7}
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%', borderRadius: '1.25rem' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Outbreak Cluster Circles */}
            {showOutbreaks && outbreaks.map((cl) => (
              <Circle
                key={cl.id}
                center={[cl.center_lat, cl.center_lng]}
                radius={cl.radius_km * 10000}
                pathOptions={{
                  color: cl.severity === 'CRITICAL' ? '#ef4444' : '#f97316',
                  fillColor: cl.severity === 'CRITICAL' ? '#ef4444' : '#f97316',
                  fillOpacity: 0.25,
                  weight: 2
                }}
              >
                <Popup>
                  <div className="p-1 space-y-1 text-slate-900">
                    <p className="font-bold text-xs text-rose-600 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{cl.crop_name} — Potential Outbreak Cluster</span>
                    </p>
                    <p className="text-xs font-semibold">{cl.disease_pest_name}</p>
                    <p className="text-[11px] text-slate-600">{cl.description}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      {cl.case_count} Cases Recorded
                    </span>
                  </div>
                </Popup>
              </Circle>
            ))}

            {/* Inspection Event Markers */}
            {filteredEvents.map((ev) => (
              <Marker
                key={ev.id}
                position={[ev.latitude, ev.longitude]}
                icon={MARKER_ICONS[ev.severity_level as keyof typeof MARKER_ICONS] || MARKER_ICONS.LOW}
              >
                <Popup>
                  <div className="p-1 max-w-xs space-y-1.5 text-slate-900">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-emerald-800">{ev.crop_name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200">
                        {ev.severity_level}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-800">{ev.detection_result}</p>
                    <p className="text-[11px] text-slate-600">
                      Location: {ev.village ? `${ev.village}, ` : ''}{ev.district}, {ev.state}
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Confidence: {ev.confidence}% • Lesion area: {ev.affected_area_pct}%
                    </p>
                    <div className="pt-1">
                      <Link
                        to={`/result/${ev.id}`}
                        className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        <span>View Inspection Result &rarr;</span>
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

          </MapContainer>
        )}
      </div>

    </div>
  );
};
