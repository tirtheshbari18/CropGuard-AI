import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.models import CropInspection, Alert, AlertStatus, SeverityLevel

def detect_outbreaks(db: Session, days_window: int = 14, min_cluster_cases: int = 3):
    """
    Data-driven outbreak anomaly detection engine.
    Scans recent crop inspections grouped by district, crop, and disease/pest.
    If occurrences in a district exceed threshold, auto-generates or updates early warning Alert.
    """
    cutoff_date = datetime.datetime.utcnow() - datetime.timedelta(days=days_window)
    
    # Query inspections grouped by district, state, crop_name, detection_result
    clusters = db.query(
        CropInspection.district,
        CropInspection.state,
        CropInspection.crop_name,
        CropInspection.detection_result,
        func.count(CropInspection.id).label("case_count"),
        func.avg(CropInspection.latitude).label("avg_lat"),
        func.avg(CropInspection.longitude).label("avg_lng")
    ).filter(
        CropInspection.created_at >= cutoff_date,
        CropInspection.detection_type != "HEALTHY"
    ).group_by(
        CropInspection.district,
        CropInspection.state,
        CropInspection.crop_name,
        CropInspection.detection_result
    ).all()
    
    detected_outbreaks = []
    
    for cluster in clusters:
        if cluster.case_count >= min_cluster_cases:
            district = cluster.district or "Nashik"
            state = cluster.state or "Maharashtra"
            crop = cluster.crop_name
            disease_pest = cluster.detection_result
            cases = cluster.case_count
            
            severity = SeverityLevel.HIGH.value if cases >= 5 else SeverityLevel.MODERATE.value
            
            alert_title = f"Potential Outbreak: {disease_pest} on {crop} in {district}"
            
            # Check if active alert already exists
            existing_alert = db.query(Alert).filter(
                Alert.district == district,
                Alert.disease_pest_name == disease_pest,
                Alert.status == AlertStatus.ACTIVE.value
            ).first()
            
            if existing_alert:
                existing_alert.case_count = cases
                existing_alert.severity = severity
            else:
                new_alert = Alert(
                    alert_title=alert_title,
                    crop_name=crop,
                    disease_pest_name=disease_pest,
                    severity=severity,
                    state=state,
                    district=district,
                    case_count=cases,
                    status=AlertStatus.ACTIVE.value,
                    recommended_action=f"District Officers: Initiate field inspection in {district} for {disease_pest}. Advise bio-pesticide application."
                )
                db.add(new_alert)
                
            db.commit()
            
            detected_outbreaks.append({
                "id": f"cluster-{district.lower()}-{disease_pest.replace(' ', '-').lower()}",
                "crop_name": crop,
                "disease_pest_name": disease_pest,
                "district": district,
                "state": state,
                "case_count": cases,
                "severity": severity,
                "center_lat": float(cluster.avg_lat) if cluster.avg_lat else 20.0059,
                "center_lng": float(cluster.avg_lng) if cluster.avg_lng else 73.7798,
                "radius_km": round(2.5 + (cases * 0.8), 1),
                "description": f"Spatial cluster of {cases} cases detected within 14 days in {district} district."
            })
            
    return detected_outbreaks
