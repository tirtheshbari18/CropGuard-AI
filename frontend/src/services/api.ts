import axios from 'axios';
import type { CropInspection, Alert, OutbreakCluster, DashboardStats, ModelMetrics } from '../types';

// Read VITE_API_URL from environment; if empty, use relative same-origin /api path
const rawApiUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');
// Avoid duplicate /api if the user provided e.g. https://domain.com/api in Vercel
export const BASE_URL = rawApiUrl.endsWith('/api') ? rawApiUrl.slice(0, -4) : rawApiUrl;
export const API_BASE = BASE_URL ? `${BASE_URL}/api` : '/api';

/**
 * Resolves static or uploaded asset URLs whether deployed together or separately.
 */
export const getMediaUrl = (path?: string | null): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return BASE_URL ? `${BASE_URL}${cleanPath}` : cleanPath;
};

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

export const api = {
  // Auth
  login: async (username: string, password: string) => {
    const res = await apiClient.post('/auth/login', { username, password });
    return res.data;
  },

  // Analysis
  analyzeImage: async (formData: FormData) => {
    const res = await apiClient.post('/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  // Inspections
  getInspections: async (params?: {
    crop?: string;
    disease?: string;
    severity?: string;
    district?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    const res = await apiClient.get<CropInspection[]>('/inspections', { params });
    return res.data;
  },

  getInspectionById: async (id: number) => {
    const res = await apiClient.get<CropInspection>(`/inspections/${id}`);
    return res.data;
  },

  deleteInspection: async (id: number) => {
    const res = await apiClient.delete(`/inspections/${id}`);
    return res.data;
  },

  getInspectionReportUrl: (id: number) => `${API_BASE}/inspections/${id}/report`,

  // Dashboard & Analytics
  getDashboard: async () => {
    const res = await apiClient.get<DashboardStats>('/dashboard');
    return res.data;
  },

  getMapEvents: async () => {
    const res = await apiClient.get('/map/events');
    return res.data;
  },

  getOutbreaks: async () => {
    const res = await apiClient.get<OutbreakCluster[]>('/outbreaks');
    return res.data;
  },

  // Alerts
  getAlerts: async (status?: string) => {
    const res = await apiClient.get<Alert[]>('/alerts', { params: { status } });
    return res.data;
  },

  updateAlertStatus: async (id: number, status: string) => {
    const res = await apiClient.patch<Alert>(`/alerts/${id}`, { status });
    return res.data;
  },

  // System & Model
  getHealth: async () => {
    const res = await apiClient.get('/health');
    return res.data;
  },

  getSystemHealth: async () => {
    const res = await apiClient.get('/system/health');
    return res.data;
  },

  getModelStatus: async () => {
    const res = await apiClient.get('/model/status');
    return res.data;
  },

  getModelMetrics: async () => {
    const res = await apiClient.get<ModelMetrics>('/model/metrics');
    return res.data;
  },

  // Demo Reset
  resetDemoDatabase: async () => {
    const res = await apiClient.post('/demo/reset');
    return res.data;
  }
};
