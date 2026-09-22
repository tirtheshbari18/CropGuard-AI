import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
import enum
from app.database.session import Base

class UserRole(str, enum.Enum):
    FARMER = "FARMER"
    OFFICER = "OFFICER"
    ADMIN = "ADMIN"

class SeverityLevel(str, enum.Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class AlertStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    ACKNOWLEDGED = "ACKNOWLEDGED"
    RESOLVED = "RESOLVED"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default=UserRole.FARMER.value)
    full_name = Column(String(100), nullable=True)
    state = Column(String(50), default="Maharashtra")
    district = Column(String(50), default="Nashik")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    inspections = relationship("CropInspection", back_populates="user")

class Crop(Base):
    __tablename__ = "crops"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True, nullable=False)
    scientific_name = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    icon = Column(String(50), nullable=True)

class Disease(Base):
    __tablename__ = "diseases"

    id = Column(Integer, primary_key=True, index=True)
    crop_name = Column(String(50), index=True, nullable=False)
    disease_name = Column(String(100), index=True, nullable=False)
    scientific_name = Column(String(100), nullable=True)
    symptoms = Column(Text, nullable=True)
    causes = Column(Text, nullable=True)
    preventive_measures = Column(Text, nullable=True)
    treatment = Column(Text, nullable=True)

class Pest(Base):
    __tablename__ = "pests"

    id = Column(Integer, primary_key=True, index=True)
    pest_name = Column(String(100), unique=True, index=True, nullable=False)
    scientific_name = Column(String(100), nullable=True)
    affected_crops = Column(String(200), nullable=True)
    symptoms = Column(Text, nullable=True)
    control_measures = Column(Text, nullable=True)

class CropInspection(Base):
    __tablename__ = "crop_inspections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    crop_name = Column(String(50), index=True, nullable=False)
    detection_result = Column(String(100), index=True, nullable=False)
    detection_type = Column(String(20), default="DISEASE") # DISEASE or PEST or HEALTHY
    confidence = Column(Float, nullable=False)
    severity_score = Column(Float, default=0.0) # 0 to 100
    severity_level = Column(String(20), default=SeverityLevel.LOW.value)
    affected_area_pct = Column(Float, default=0.0)
    image_url = Column(String(255), nullable=False)
    heatmap_url = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    state = Column(String(50), index=True, default="Maharashtra")
    district = Column(String(50), index=True, default="Nashik")
    village = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)
    model_version = Column(String(50), default="v1.0.0-MobileNetV3")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)

    user = relationship("User", back_populates="inspections")
    recommendations = relationship("Recommendation", back_populates="inspection", cascade="all, delete-orphan")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    inspection_id = Column(Integer, ForeignKey("crop_inspections.id"), nullable=False)
    title = Column(String(150), nullable=False)
    details = Column(Text, nullable=False)
    category = Column(String(50), default="MANAGEMENT") # ISOLATION, PREVENTIVE, CHEMICAL, EXPERT
    urgency = Column(String(20), default="MEDIUM")

    inspection = relationship("CropInspection", back_populates="recommendations")

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_title = Column(String(150), nullable=False)
    crop_name = Column(String(50), nullable=False)
    disease_pest_name = Column(String(100), nullable=False)
    severity = Column(String(20), default=SeverityLevel.HIGH.value)
    state = Column(String(50), index=True, nullable=False)
    district = Column(String(50), index=True, nullable=False)
    case_count = Column(Integer, default=1)
    status = Column(String(20), default=AlertStatus.ACTIVE.value, index=True)
    recommended_action = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ModelMetric(Base):
    __tablename__ = "model_metrics"

    id = Column(Integer, primary_key=True, index=True)
    model_version = Column(String(50), nullable=False)
    dataset_name = Column(String(100), default="PlantVillage Agronomic CV Dataset")
    accuracy = Column(Float, default=0.942)
    precision = Column(Float, default=0.938)
    recall = Column(Float, default=0.945)
    f1_score = Column(Float, default=0.941)
    map_score = Column(Float, default=0.895)
    num_classes = Column(Integer, default=15)
    training_date = Column(String(50), default="2026-08-15")
    avg_inference_sec = Column(Float, default=0.28)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    action = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
