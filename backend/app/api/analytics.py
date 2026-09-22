from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database.session import get_db
from app.models.models import CropInspection, Alert, AlertStatus, SeverityLevel
from app.schemas.schemas import DashboardStats
from app.services.ml_service import DISEASE_CLASSES, PEST_CLASSES

router = APIRouter(prefix="/api", tags=["Analytics & Catalog"])

@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_statistics(db: Session = Depends(get_db)):
    total = db.query(CropInspection).count()
    healthy = db.query(CropInspection).filter(CropInspection.detection_type == "HEALTHY").count()
    disease = db.query(CropInspection).filter(CropInspection.detection_type == "DISEASE").count()
    pest = db.query(CropInspection).filter(CropInspection.detection_type == "PEST").count()
    high_sev = db.query(CropInspection).filter(CropInspection.severity_level.in_([SeverityLevel.HIGH.value, SeverityLevel.CRITICAL.value])).count()
    active_alerts = db.query(Alert).filter(Alert.status == AlertStatus.ACTIVE.value).count()
    districts_count = db.query(func.count(func.distinct(CropInspection.district))).scalar() or 0

    # Disease distribution
    disease_q = db.query(CropInspection.detection_result, func.count(CropInspection.id))\
        .filter(CropInspection.detection_type == "DISEASE")\
        .group_by(CropInspection.detection_result).all()
    disease_dist = [{"name": name, "count": count} for name, count in disease_q]

    # Pest distribution
    pest_q = db.query(CropInspection.detection_result, func.count(CropInspection.id))\
        .filter(CropInspection.detection_type == "PEST")\
        .group_by(CropInspection.detection_result).all()
    pest_dist = [{"name": name, "count": count} for name, count in pest_q]

    # Crop distribution
    crop_q = db.query(CropInspection.crop_name, func.count(CropInspection.id))\
        .group_by(CropInspection.crop_name).all()
    crop_dist = [{"crop": crop, "count": count} for crop, count in crop_q]

    # Severity distribution
    sev_q = db.query(CropInspection.severity_level, func.count(CropInspection.id))\
        .group_by(CropInspection.severity_level).all()
    sev_dist = [{"severity": sev, "count": count} for sev, count in sev_q]

    # Timeline (last 7 days grouped)
    timeline_q = db.query(func.date(CropInspection.created_at).label("date"), func.count(CropInspection.id))\
        .group_by(func.date(CropInspection.created_at))\
        .order_by(func.date(CropInspection.created_at).desc()).limit(14).all()
    timeline_dist = [{"date": str(d), "cases": c} for d, c in reversed(timeline_q)]

    # District cases
    district_q = db.query(CropInspection.district, func.count(CropInspection.id))\
        .group_by(CropInspection.district).all()
    district_dist = [{"district": d or "Nashik", "cases": c} for d, c in district_q]

    return {
        "total_inspections": total,
        "healthy_crops": healthy,
        "disease_detected": disease,
        "pest_detected": pest,
        "high_severity_cases": high_sev,
        "active_alerts": active_alerts,
        "affected_districts_count": districts_count,
        "disease_distribution": disease_dist,
        "pest_distribution": pest_dist,
        "crop_distribution": crop_dist,
        "severity_distribution": sev_dist,
        "timeline_cases": timeline_dist,
        "district_cases": district_dist
    }

@router.get("/map/events")
def get_map_events(db: Session = Depends(get_db)):
    inspections = db.query(CropInspection).all()
    events = []
    for ins in inspections:
        events.append({
            "id": ins.id,
            "crop_name": ins.crop_name,
            "detection_result": ins.detection_result,
            "detection_type": ins.detection_type,
            "confidence": ins.confidence,
            "severity_level": ins.severity_level,
            "affected_area_pct": ins.affected_area_pct,
            "latitude": ins.latitude or 20.0059,
            "longitude": ins.longitude or 73.7798,
            "state": ins.state or "Maharashtra",
            "district": ins.district or "Nashik",
            "village": ins.village or "Ozar",
            "created_at": str(ins.created_at)[:10]
        })
    return events

@router.get("/crops")
def get_supported_crops():
    crops = sorted(list(set([c["crop"] for c in DISEASE_CLASSES])))
    return [{"name": crop} for crop in crops]

@router.get("/diseases")
def get_supported_diseases():
    return [c for c in DISEASE_CLASSES if c["type"] == "DISEASE"]

@router.get("/pests")
def get_supported_pests():
    return PEST_CLASSES
