import type {
  DashboardStats,
  CropInspection,
  Alert,
  OutbreakCluster,
  ModelMetrics,
  User
} from '../types';

export const MOCK_USER: User = {
  username: 'farmer',
  email: 'farmer@cropguard.ai',
  role: 'FARMER',
  full_name: 'Ramesh Patil',
  state: 'Maharashtra',
  district: 'Nashik'
};

export const MOCK_DASHBOARD_STATS: DashboardStats = {
  total_inspections: 128,
  healthy_crops: 46,
  disease_detected: 62,
  pest_detected: 20,
  high_severity_cases: 19,
  active_alerts: 4,
  affected_districts_count: 8,
  disease_distribution: [
    { name: 'Tomato Early Blight', count: 24 },
    { name: 'Tomato Late Blight', count: 18 },
    { name: 'Potato Late Blight', count: 12 },
    { name: 'Apple Scab', count: 8 },
    { name: 'Corn Common Rust', count: 7 },
    { name: 'Rice Blast', count: 5 }
  ],
  pest_distribution: [
    { name: 'Cotton Aphid Attack', count: 11 },
    { name: 'Stem Borer Attack', count: 9 },
    { name: 'Fall Armyworm', count: 6 },
    { name: 'Whitefly Infestation', count: 4 }
  ],
  crop_distribution: [
    { crop: 'Tomato', count: 42 },
    { crop: 'Potato', count: 28 },
    { crop: 'Cotton', count: 22 },
    { crop: 'Corn', count: 16 },
    { crop: 'Apple', count: 12 },
    { crop: 'Rice', count: 8 }
  ],
  severity_distribution: [
    { severity: 'LOW', count: 46 },
    { severity: 'MODERATE', count: 39 },
    { severity: 'HIGH', count: 29 },
    { severity: 'CRITICAL', count: 14 }
  ],
  timeline_cases: [
    { date: '09-10', cases: 5 },
    { date: '09-11', cases: 8 },
    { date: '09-12', cases: 6 },
    { date: '09-13', cases: 11 },
    { date: '09-14', cases: 9 },
    { date: '09-15', cases: 14 },
    { date: '09-16', cases: 12 },
    { date: '09-17', cases: 15 },
    { date: '09-18', cases: 18 },
    { date: '09-19', cases: 10 },
    { date: '09-20', cases: 16 },
    { date: '09-21', cases: 13 },
    { date: '09-22', cases: 19 },
    { date: '09-23', cases: 17 }
  ],
  district_cases: [
    { district: 'Nashik', cases: 38 },
    { district: 'Pune', cases: 26 },
    { district: 'Satara', cases: 18 },
    { district: 'Kolhapur', cases: 15 },
    { district: 'Ahmednagar', cases: 14 },
    { district: 'Solapur', cases: 10 },
    { district: 'Nagpur', cases: 7 }
  ]
};

export const MOCK_INSPECTIONS: CropInspection[] = [
  {
    id: 101,
    crop_name: 'Tomato',
    detection_result: 'Tomato Early Blight (Alternaria solani)',
    detection_type: 'DISEASE',
    confidence: 94.2,
    severity_score: 0.35,
    severity_level: 'MODERATE',
    affected_area_pct: 34.5,
    image_url: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&auto=format&fit=crop&q=80',
    heatmap_url: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=600&auto=format&fit=crop&q=80',
    latitude: 20.0059,
    longitude: 73.7798,
    state: 'Maharashtra',
    district: 'Nashik',
    village: 'Ozar',
    notes: 'Brown concentric ring lesions observed on lower leaves with yellow halo.',
    model_version: 'v1.0.0-MobileNetV3',
    created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    recommendations: [
      {
        id: 1,
        title: 'Fungicidal Spray - Mancozeb 75% WP',
        details: 'Apply Mancozeb 75% WP @ 2.5 g/L of water at 7-10 day intervals during humid weather.',
        category: 'Chemical',
        urgency: 'MODERATE'
      },
      {
        id: 2,
        title: 'Pruning & Canopy Airflow Management',
        details: 'Remove bottom 15 cm infected leaves to prevent soil splash and improve air circulation.',
        category: 'Cultural',
        urgency: 'HIGH'
      }
    ]
  },
  {
    id: 102,
    crop_name: 'Tomato',
    detection_result: 'Tomato Late Blight (Phytophthora infestans)',
    detection_type: 'DISEASE',
    confidence: 96.8,
    severity_score: 0.68,
    severity_level: 'CRITICAL',
    affected_area_pct: 68.2,
    image_url: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80',
    heatmap_url: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=600&auto=format&fit=crop&q=80',
    latitude: 20.0784,
    longitude: 74.1082,
    state: 'Maharashtra',
    district: 'Nashik',
    village: 'Niphad',
    notes: 'Rapidly spreading dark water-soaked lesions with white fungal growth on abaxial leaf surfaces.',
    model_version: 'v1.0.0-MobileNetV3',
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    recommendations: [
      {
        id: 3,
        title: 'Systemic Fungicide Spray - Metalaxyl + Mancozeb',
        details: 'Immediately apply Ridomil Gold (Metalaxyl 8% + Mancozeb 64%) @ 2 g/L water across the block.',
        category: 'Chemical',
        urgency: 'CRITICAL'
      },
      {
        id: 4,
        title: 'Cease Overhead Irrigation',
        details: 'Switch exclusively to drip irrigation immediately to keep foliage dry and arrest spore transmission.',
        category: 'Cultural',
        urgency: 'CRITICAL'
      }
    ]
  },
  {
    id: 103,
    crop_name: 'Potato',
    detection_result: 'Potato Early Blight',
    detection_type: 'DISEASE',
    confidence: 91.5,
    severity_score: 0.22,
    severity_level: 'MODERATE',
    affected_area_pct: 22.0,
    image_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    heatmap_url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80',
    latitude: 18.1517,
    longitude: 74.5768,
    state: 'Maharashtra',
    district: 'Pune',
    village: 'Baramati',
    notes: 'Target-like circular brown patches on older foliage.',
    model_version: 'v1.0.0-MobileNetV3',
    created_at: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    recommendations: [
      {
        id: 5,
        title: 'Chlorothalonil Application',
        details: 'Spray Chlorothalonil 75% WP @ 2 g/L water preventatively.',
        category: 'Chemical',
        urgency: 'MODERATE'
      }
    ]
  },
  {
    id: 104,
    crop_name: 'Cotton',
    detection_result: 'Cotton Aphid Attack (Aphis gossypii)',
    detection_type: 'PEST',
    confidence: 88.9,
    severity_score: 0.55,
    severity_level: 'HIGH',
    affected_area_pct: 55.0,
    image_url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80',
    heatmap_url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&auto=format&fit=crop&q=80',
    latitude: 19.3921,
    longitude: 74.6543,
    state: 'Maharashtra',
    district: 'Ahmednagar',
    village: 'Rahuri',
    notes: 'Curling of terminal leaves with honeydew secretions and sooty mold onset.',
    model_version: 'v1.0.0-MobileNetV3',
    created_at: new Date(Date.now() - 1000 * 60 * 480).toISOString(),
    recommendations: [
      {
        id: 6,
        title: 'Neem Oil 10000 PPM Spray',
        details: 'Spray cold-pressed Neem Oil @ 3 ml/L with mild detergent as an organic repellent.',
        category: 'Biological',
        urgency: 'HIGH'
      },
      {
        id: 7,
        title: 'Flonicamid 50 WG',
        details: 'For dense nymph infestation, spray Flonicamid 50 WG @ 0.3 g/L.',
        category: 'Chemical',
        urgency: 'HIGH'
      }
    ]
  },
  {
    id: 105,
    crop_name: 'Corn',
    detection_result: 'Corn Common Rust (Puccinia sorghi)',
    detection_type: 'DISEASE',
    confidence: 92.7,
    severity_score: 0.28,
    severity_level: 'MODERATE',
    affected_area_pct: 28.0,
    image_url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
    heatmap_url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600&auto=format&fit=crop&q=80',
    latitude: 17.9862,
    longitude: 74.4321,
    state: 'Maharashtra',
    district: 'Satara',
    village: 'Phaltan',
    notes: 'Golden-brown pustules scattered across both upper and lower leaf surfaces.',
    model_version: 'v1.0.0-MobileNetV3',
    created_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    recommendations: [
      {
        id: 8,
        title: 'Azoxystrobin + Difenoconazole',
        details: 'Apply broad-spectrum combination fungicide @ 1 ml/L.',
        category: 'Chemical',
        urgency: 'MODERATE'
      }
    ]
  },
  {
    id: 106,
    crop_name: 'Apple',
    detection_result: 'Apple Scab (Venturia inaequalis)',
    detection_type: 'DISEASE',
    confidence: 93.1,
    severity_score: 0.41,
    severity_level: 'HIGH',
    affected_area_pct: 41.0,
    image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
    heatmap_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80',
    latitude: 16.7324,
    longitude: 74.5978,
    state: 'Maharashtra',
    district: 'Kolhapur',
    village: 'Shirol',
    notes: 'Olive-green to velvety dark spots on leaf margins.',
    model_version: 'v1.0.0-MobileNetV3',
    created_at: new Date(Date.now() - 1000 * 60 * 1440).toISOString(),
    recommendations: [
      {
        id: 9,
        title: 'Captan 50 WP',
        details: 'Foliar application of Captan @ 2.5 g/L during pink bud development stage.',
        category: 'Chemical',
        urgency: 'HIGH'
      }
    ]
  }
];

export const MOCK_ALERTS: Alert[] = [
  {
    id: 201,
    alert_title: 'Tomato Late Blight Outbreak Threat',
    crop_name: 'Tomato',
    disease_pest_name: 'Late Blight (Phytophthora infestans)',
    severity: 'CRITICAL',
    state: 'Maharashtra',
    district: 'Nashik',
    case_count: 14,
    status: 'ACTIVE',
    recommended_action: 'Advise farmers in Niphad & Dindori blocks to apply preventative contact fungicides due to overcast humid weather.',
    created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString()
  },
  {
    id: 202,
    alert_title: 'Cotton Aphid Cluster Detected',
    crop_name: 'Cotton',
    disease_pest_name: 'Aphis gossypii',
    severity: 'HIGH',
    state: 'Maharashtra',
    district: 'Ahmednagar',
    case_count: 9,
    status: 'ACTIVE',
    recommended_action: 'Deploy yellow sticky traps @ 10-12/acre and recommend neem seed kernel extract (NSKE 5%) spray.',
    created_at: new Date(Date.now() - 1000 * 60 * 210).toISOString()
  },
  {
    id: 203,
    alert_title: 'Early Blight Spread in Solanaceous Crops',
    crop_name: 'Potato',
    disease_pest_name: 'Early Blight',
    severity: 'MODERATE',
    state: 'Maharashtra',
    district: 'Pune',
    case_count: 6,
    status: 'ACKNOWLEDGED',
    recommended_action: 'Monitor field boundaries for nightshade weeds that serve as alternate hosts.',
    created_at: new Date(Date.now() - 1000 * 60 * 500).toISOString()
  },
  {
    id: 204,
    alert_title: 'Stem Borer Warning in Paddy Nursery',
    crop_name: 'Rice',
    disease_pest_name: 'Yellow Stem Borer',
    severity: 'HIGH',
    state: 'Maharashtra',
    district: 'Kolhapur',
    case_count: 8,
    status: 'ACTIVE',
    recommended_action: 'Install pheromone traps @ 5/ha for pest population monitoring and clip seedling leaf tips before transplanting.',
    created_at: new Date(Date.now() - 1000 * 60 * 780).toISOString()
  }
];

export const MOCK_OUTBREAKS: OutbreakCluster[] = [
  {
    id: 'cluster-nashik-01',
    crop_name: 'Tomato',
    disease_pest_name: 'Tomato Late Blight',
    district: 'Nashik',
    state: 'Maharashtra',
    case_count: 14,
    severity: 'CRITICAL',
    center_lat: 20.0784,
    center_lng: 74.1082,
    radius_km: 12.5,
    description: 'High moisture micro-climate in Niphad tehsil accelerating late blight spore dispersal.'
  },
  {
    id: 'cluster-ahmednagar-02',
    crop_name: 'Cotton',
    disease_pest_name: 'Cotton Aphid Attack',
    district: 'Ahmednagar',
    state: 'Maharashtra',
    case_count: 9,
    severity: 'HIGH',
    center_lat: 19.3921,
    center_lng: 74.6543,
    radius_km: 18.0,
    description: 'Nymph infestation clustering along Godavari river agricultural belt.'
  },
  {
    id: 'cluster-pune-03',
    crop_name: 'Potato',
    disease_pest_name: 'Potato Early Blight',
    district: 'Pune',
    state: 'Maharashtra',
    case_count: 6,
    severity: 'MODERATE',
    center_lat: 18.1517,
    center_lng: 74.5768,
    radius_km: 15.0,
    description: 'Scattered moderate blight detections in Baramati taluka potato plots.'
  }
];

export const MOCK_MAP_EVENTS = MOCK_INSPECTIONS.map((insp) => ({
  id: insp.id,
  crop_name: insp.crop_name,
  detection_result: insp.detection_result,
  detection_type: insp.detection_type,
  confidence: insp.confidence,
  severity_level: insp.severity_level,
  affected_area_pct: insp.affected_area_pct,
  latitude: insp.latitude,
  longitude: insp.longitude,
  state: insp.state,
  district: insp.district,
  village: insp.village,
  created_at: insp.created_at.slice(0, 10)
}));

export const MOCK_MODEL_METRICS: ModelMetrics = {
  model_version: 'v1.0.0-MobileNetV3',
  dataset_name: 'PlantVillage Multi-Crop Agronomic Benchmark (54,306 images)',
  accuracy: 0.942,
  precision: 0.938,
  recall: 0.945,
  f1_score: 0.941,
  map_score: 0.895,
  num_classes: 15,
  training_date: '2026-08-15',
  avg_inference_sec: 0.28
};

export const MOCK_MODEL_STATUS = {
  status: 'ONLINE',
  version: 'v1.0.0-MobileNetV3',
  architecture: 'MobileNetV3-Large + Grad-CAM Feature Heatmap',
  device: 'CPU / Neural Engine (Optimized Web Assembly / PyTorch)',
  supported_crops: ['Tomato', 'Potato', 'Apple', 'Corn', 'Cotton', 'Rice'],
  supported_diseases: [
    'Tomato Early Blight',
    'Tomato Late Blight',
    'Tomato Healthy',
    'Potato Early Blight',
    'Potato Late Blight',
    'Potato Healthy',
    'Apple Scab',
    'Apple Black Rot',
    'Apple Healthy',
    'Corn Common Rust',
    'Corn Northern Leaf Blight',
    'Corn Healthy',
    'Cotton Aphid Attack',
    'Rice Stem Borer Attack',
    'Rice Blast'
  ]
};

export function generateMockAnalysisResult(cropName?: string, district?: string): CropInspection {
  const chosenCrop = cropName && cropName !== 'AUTO_DETECT' ? cropName : 'Tomato';
  const matches = MOCK_INSPECTIONS.filter((i) => i.crop_name.toLowerCase() === chosenCrop.toLowerCase());
  const base = matches.length > 0 ? matches[0] : MOCK_INSPECTIONS[0];
  
  return {
    ...base,
    id: Date.now() % 100000,
    district: district || base.district,
    created_at: new Date().toISOString()
  };
}
