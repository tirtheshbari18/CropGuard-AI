import type { CropInspection, Alert, OutbreakCluster, DashboardStats, ModelMetrics } from '../types';

export const mockDashboard: DashboardStats = {
  total_inspections: 28,
  healthy_crops: 7,
  disease_detected: 16,
  pest_detected: 5,
  high_severity_cases: 9,
  active_alerts: 2,
  affected_districts_count: 6,
  disease_distribution: [
    { name: 'Tomato Late Blight', count: 5 },
    { name: 'Tomato Early Blight', count: 4 },
    { name: 'Potato Early Blight', count: 3 },
    { name: 'Potato Late Blight', count: 2 },
    { name: 'Corn Common Rust', count: 2 }
  ],
  pest_distribution: [
    { name: 'Cotton Aphid Attack', count: 3 },
    { name: 'Stem Borer Attack', count: 2 }
  ],
  crop_distribution: [
    { crop: 'Tomato', count: 9 },
    { crop: 'Potato', count: 6 },
    { crop: 'Corn', count: 5 },
    { crop: 'Cotton', count: 4 },
    { crop: 'Rice', count: 2 },
    { crop: 'Apple', count: 2 }
  ],
  severity_distribution: [
    { severity: 'LOW', count: 8 },
    { severity: 'MODERATE', count: 11 },
    { severity: 'HIGH', count: 6 },
    { severity: 'CRITICAL', count: 3 }
  ],
  timeline_cases: [
    { date: '2026-09-16', cases: 3 },
    { date: '2026-09-17', cases: 5 },
    { date: '2026-09-18', cases: 4 },
    { date: '2026-09-19', cases: 7 },
    { date: '2026-09-20', cases: 6 },
    { date: '2026-09-21', cases: 8 },
    { date: '2026-09-22', cases: 9 }
  ],
  district_cases: [
    { district: 'Nashik', cases: 9 },
    { district: 'Pune', cases: 6 },
    { district: 'Kolhapur', cases: 4 },
    { district: 'Nagpur', cases: 4 },
    { district: 'Ahmednagar', cases: 3 },
    { district: 'Satara', cases: 2 }
  ]
};

export const mockInspections: CropInspection[] = [
  {
    id: 1,
    crop_name: 'Tomato',
    detection_result: 'Tomato Late Blight',
    detection_type: 'DISEASE',
    confidence: 96.8,
    severity_score: 68.2,
    severity_level: 'CRITICAL',
    affected_area_pct: 68.2,
    image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d69103a49?w=600&auto=format&fit=crop&q=80',
    heatmap_url: 'https://images.unsplash.com/photo-1592417817098-8f3d69103a49?w=600&auto=format&fit=crop&q=80',
    latitude: 20.0784,
    longitude: 74.1082,
    state: 'Maharashtra',
    district: 'Nashik',
    village: 'Niphad',
    notes: 'Outbreak hotspot in onion-tomato crop belt sector B.',
    model_version: 'v1.0.0-MobileNetV3',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    recommendations: [
      {
        id: 101,
        title: 'Foliage Pruning & Isolation',
        details: 'Remove severely affected leaves infected with Late Blight to prevent airborne spore propagation.',
        category: 'ISOLATION',
        urgency: 'HIGH'
      },
      {
        id: 102,
        title: 'Copper Fungicide Spray',
        details: 'Spray Copper Oxychloride 0.25% or Mancozeb immediately during early morning.',
        category: 'TREATMENT',
        urgency: 'HIGH'
      }
    ]
  },
  {
    id: 2,
    crop_name: 'Cotton',
    detection_result: 'Cotton Aphid Attack',
    detection_type: 'PEST',
    confidence: 88.9,
    severity_score: 55.0,
    severity_level: 'HIGH',
    affected_area_pct: 55.0,
    image_url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&auto=format&fit=crop&q=80',
    latitude: 21.2842,
    longitude: 78.5831,
    state: 'Maharashtra',
    district: 'Nagpur',
    village: 'Katol',
    notes: 'Aphid clusters found under lower canopy leaves.',
    model_version: 'v1.0.0-MobileNetV3',
    created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
    recommendations: [
      {
        id: 103,
        title: 'Yellow Sticky Traps',
        details: 'Install 15-20 yellow sticky traps per acre to monitor and capture adult aphids.',
        category: 'MONITORING',
        urgency: 'MEDIUM'
      },
      {
        id: 104,
        title: 'Neem Seed Kernel Extract (NSKE 5%)',
        details: 'Apply organic bio-insecticide to deter sap feeding without harming natural predators.',
        category: 'TREATMENT',
        urgency: 'MEDIUM'
      }
    ]
  },
  {
    id: 3,
    crop_name: 'Tomato',
    detection_result: 'Tomato Healthy',
    detection_type: 'HEALTHY',
    confidence: 98.4,
    severity_score: 0.0,
    severity_level: 'LOW',
    affected_area_pct: 0.0,
    image_url: 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=600&auto=format&fit=crop&q=80',
    latitude: 18.1517,
    longitude: 74.5768,
    state: 'Maharashtra',
    district: 'Pune',
    village: 'Baramati',
    notes: 'Healthy foliage, excellent vigor in drip irrigated plot.',
    model_version: 'v1.0.0-MobileNetV3',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    recommendations: [
      {
        id: 105,
        title: 'Preventive Biostimulant',
        details: 'Maintain balanced micronutrient fertigation to sustain natural pest immunity.',
        category: 'PREVENTION',
        urgency: 'LOW'
      }
    ]
  },
  {
    id: 4,
    crop_name: 'Potato',
    detection_result: 'Potato Early Blight',
    detection_type: 'DISEASE',
    confidence: 91.5,
    severity_score: 24.0,
    severity_level: 'MODERATE',
    affected_area_pct: 24.0,
    image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    latitude: 19.3921,
    longitude: 74.6543,
    state: 'Maharashtra',
    district: 'Ahmednagar',
    village: 'Rahuri',
    notes: 'Concentric ring lesions observed on older leaves.',
    model_version: 'v1.0.0-MobileNetV3',
    created_at: new Date(Date.now() - 3600000 * 36).toISOString(),
    recommendations: [
      {
        id: 106,
        title: 'Chlorothalonil Application',
        details: 'Apply protective contact fungicide at 2g/L water at first sign of target spots.',
        category: 'TREATMENT',
        urgency: 'MEDIUM'
      }
    ]
  },
  {
    id: 5,
    crop_name: 'Corn',
    detection_result: 'Corn Common Rust',
    detection_type: 'DISEASE',
    confidence: 92.7,
    severity_score: 28.0,
    severity_level: 'MODERATE',
    affected_area_pct: 28.0,
    image_url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
    latitude: 17.6778,
    longitude: 75.3262,
    state: 'Maharashtra',
    district: 'Solapur',
    village: 'Pandharpur',
    notes: 'Brown pustules scattered across upper leaves.',
    model_version: 'v1.0.0-MobileNetV3',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    recommendations: [
      {
        id: 107,
        title: 'Azoxystrobin Treatment',
        details: 'Foliar spray of strobilurin fungicide if pustules spread to ear leaf.',
        category: 'TREATMENT',
        urgency: 'MEDIUM'
      }
    ]
  },
  {
    id: 6,
    crop_name: 'Rice',
    detection_result: 'Stem Borer Attack',
    detection_type: 'PEST',
    confidence: 91.2,
    severity_score: 62.0,
    severity_level: 'CRITICAL',
    affected_area_pct: 62.0,
    image_url: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=600&auto=format&fit=crop&q=80',
    latitude: 16.7324,
    longitude: 74.5978,
    state: 'Maharashtra',
    district: 'Kolhapur',
    village: 'Shirol',
    notes: 'Dead heart symptoms in young tillers.',
    model_version: 'v1.0.0-MobileNetV3',
    created_at: new Date(Date.now() - 3600000 * 60).toISOString(),
    recommendations: [
      {
        id: 108,
        title: 'Pheromone Trap Installation',
        details: 'Deploy 8 Scirpophaga incertulas pheromone traps/ha for mass trapping.',
        category: 'TREATMENT',
        urgency: 'HIGH'
      }
    ]
  }
];

export const mockOutbreaks: OutbreakCluster[] = [
  {
    id: 'outbreak-1',
    crop_name: 'Tomato',
    disease_pest_name: 'Tomato Late Blight',
    district: 'Nashik',
    state: 'Maharashtra',
    case_count: 8,
    severity: 'CRITICAL',
    center_lat: 20.0784,
    center_lng: 74.1082,
    radius_km: 12,
    description: 'High density fungal outbreak detected in Niphad grape and tomato belt.'
  },
  {
    id: 'outbreak-2',
    crop_name: 'Cotton',
    disease_pest_name: 'Cotton Aphid Attack',
    district: 'Nagpur',
    state: 'Maharashtra',
    case_count: 5,
    severity: 'HIGH',
    center_lat: 21.2842,
    center_lng: 78.5831,
    radius_km: 15,
    description: 'Pest vector cluster across Katol orange and cotton plantations.'
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 1,
    alert_title: 'Outbreak Alert: Tomato Late Blight in Niphad',
    crop_name: 'Tomato',
    disease_pest_name: 'Tomato Late Blight',
    severity: 'CRITICAL',
    state: 'Maharashtra',
    district: 'Nashik',
    case_count: 8,
    status: 'ACTIVE',
    recommended_action: 'Advisory issued for Niphad onion & tomato belt. Spray Copper Oxychloride 0.25% immediately.',
    created_at: new Date(Date.now() - 3600000 * 6).toISOString()
  },
  {
    id: 2,
    alert_title: 'Pest Cluster Alert: Cotton Aphids in Katol',
    crop_name: 'Cotton',
    disease_pest_name: 'Cotton Aphid Attack',
    severity: 'HIGH',
    state: 'Maharashtra',
    district: 'Nagpur',
    case_count: 5,
    status: 'ACTIVE',
    recommended_action: 'Deploy yellow sticky traps. Contact Krishi Vigyan Kendra Nagpur for bio-agent releases.',
    created_at: new Date(Date.now() - 3600000 * 18).toISOString()
  },
  {
    id: 3,
    alert_title: 'Resolved Alert: Potato Early Blight in Baramati',
    crop_name: 'Potato',
    disease_pest_name: 'Potato Early Blight',
    severity: 'MODERATE',
    state: 'Maharashtra',
    district: 'Pune',
    case_count: 4,
    status: 'RESOLVED',
    recommended_action: 'Field inspection completed by Agricultural Officer. Disease brought under control.',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString()
  }
];

export const mockModelMetrics: ModelMetrics = {
  model_version: 'v1.0.0-MobileNetV3',
  dataset_name: 'PlantVillage Agronomic Multi-Crop CV Dataset',
  accuracy: 0.942,
  precision: 0.938,
  recall: 0.945,
  f1_score: 0.941,
  map_score: 0.895,
  num_classes: 15,
  training_date: '2026-08-15',
  avg_inference_sec: 0.28
};
