export type UserRole = 'FARMER' | 'OFFICER' | 'ADMIN';
export type SeverityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
export type Language = 'en' | 'hi' | 'mr';

export interface User {
  username: string;
  email: string;
  role: UserRole;
  full_name: string;
  state: string;
  district: string;
}

export interface Recommendation {
  id?: number;
  title: string;
  details: string;
  category: string;
  urgency: string;
}

export interface CropInspection {
  id: number;
  user_id?: number;
  crop_name: string;
  detection_result: string;
  detection_type: 'DISEASE' | 'PEST' | 'HEALTHY';
  confidence: number;
  severity_score: number;
  severity_level: SeverityLevel;
  affected_area_pct: number;
  image_url: string;
  heatmap_url?: string;
  latitude: number;
  longitude: number;
  state: string;
  district: string;
  village?: string;
  notes?: string;
  model_version: string;
  created_at: string;
  recommendations: Recommendation[];
}

export interface Alert {
  id: number;
  alert_title: string;
  crop_name: string;
  disease_pest_name: string;
  severity: SeverityLevel;
  state: string;
  district: string;
  case_count: number;
  status: AlertStatus;
  recommended_action?: string;
  created_at: string;
}

export interface OutbreakCluster {
  id: string;
  crop_name: string;
  disease_pest_name: string;
  district: string;
  state: string;
  case_count: number;
  severity: SeverityLevel;
  center_lat: number;
  center_lng: number;
  radius_km: number;
  description: string;
}

export interface DashboardStats {
  total_inspections: number;
  healthy_crops: number;
  disease_detected: number;
  pest_detected: number;
  high_severity_cases: number;
  active_alerts: number;
  affected_districts_count: number;
  disease_distribution: { name: string; count: number }[];
  pest_distribution: { name: string; count: number }[];
  crop_distribution: { crop: string; count: number }[];
  severity_distribution: { severity: string; count: number }[];
  timeline_cases: { date: string; cases: number }[];
  district_cases: { district: string; cases: number }[];
}

export interface ModelMetrics {
  model_version: string;
  dataset_name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  map_score: number;
  num_classes: number;
  training_date: string;
  avg_inference_sec: number;
}
