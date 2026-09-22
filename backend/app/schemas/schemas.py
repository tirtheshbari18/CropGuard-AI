from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: str
    role: Optional[str] = "FARMER"
    full_name: Optional[str] = None
    state: Optional[str] = "Maharashtra"
    district: Optional[str] = "Nashik"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserBase

class RecommendationBase(BaseModel):
    title: str
    details: str
    category: str
    urgency: str

class RecommendationOut(RecommendationBase):
    id: int
    class Config:
        from_attributes = True

class InspectionCreate(BaseModel):
    crop_name: Optional[str] = None
    latitude: Optional[float] = 20.0059
    longitude: Optional[float] = 73.7798
    state: Optional[str] = "Maharashtra"
    district: Optional[str] = "Nashik"
    village: Optional[str] = "Ozar"
    notes: Optional[str] = None

class InspectionOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    crop_name: str
    detection_result: str
    detection_type: str
    confidence: float
    severity_score: float
    severity_level: str
    affected_area_pct: float
    image_url: str
    heatmap_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    notes: Optional[str] = None
    model_version: str
    created_at: datetime
    recommendations: List[RecommendationOut] = []

    class Config:
        from_attributes = True

class AnalysisResponse(BaseModel):
    inspection: InspectionOut
    explanation: str
    inference_time_sec: float
    demo_mode: bool

class AlertOut(BaseModel):
    id: int
    alert_title: str
    crop_name: str
    disease_pest_name: str
    severity: str
    state: str
    district: str
    case_count: int
    status: str
    recommended_action: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class AlertUpdate(BaseModel):
    status: str

class OutbreakCluster(BaseModel):
    id: str
    crop_name: str
    disease_pest_name: str
    district: str
    state: str
    case_count: int
    severity: str
    center_lat: float
    center_lng: float
    radius_km: float
    description: str

class DashboardStats(BaseModel):
    total_inspections: int
    healthy_crops: int
    disease_detected: int
    pest_detected: int
    high_severity_cases: int
    active_alerts: int
    affected_districts_count: int
    disease_distribution: List[dict]
    pest_distribution: List[dict]
    crop_distribution: List[dict]
    severity_distribution: List[dict]
    timeline_cases: List[dict]
    district_cases: List[dict]

class ModelStatus(BaseModel):
    disease_model_status: str
    pest_model_status: str
    version: str
    num_supported_diseases: int
    num_supported_pests: int
    avg_inference_sec: float
    supported_crops: List[str]
    supported_diseases: List[str]
    supported_pests: List[str]
