from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.models import Alert, AlertStatus
from app.schemas.schemas import AlertOut, AlertUpdate, OutbreakCluster
from app.services.outbreak_service import detect_outbreaks

router = APIRouter(prefix="/api", tags=["Alerts & Outbreak GIS"])

@router.get("/alerts", response_model=List[AlertOut])
def get_alerts(status: Optional[str] = None, district: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Alert)
    if status:
        query = query.filter(Alert.status == status)
    if district:
        query = query.filter(Alert.district == district)
    alerts = query.order_by(Alert.created_at.desc()).all()
    return [AlertOut.model_validate(a) for a in alerts]

@router.patch("/alerts/{alert_id}", response_model=AlertOut)
def update_alert_status(alert_id: int, payload: AlertUpdate, db: Session = Depends(get_db)):
    alert = db.query(Alert).filter(Alert.id == alert_id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = payload.status
    db.commit()
    db.refresh(alert)
    return AlertOut.model_validate(alert)

@router.get("/outbreaks", response_model=List[OutbreakCluster])
def get_outbreak_clusters(db: Session = Depends(get_db)):
    outbreaks = detect_outbreaks(db, days_window=14, min_cluster_cases=3)
    return outbreaks
