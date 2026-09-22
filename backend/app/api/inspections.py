import os
import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Response, status
from sqlalchemy.orm import Session
from typing import Optional, List
from app.database.session import get_db
from app.models.models import CropInspection, Recommendation, User
from app.schemas.schemas import InspectionOut, AnalysisResponse
from app.services.ml_service import run_ai_analysis, UPLOAD_DIR
from app.services.report_service import generate_inspection_pdf
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/api", tags=["Crop Analysis & Inspections"])

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_crop_image(
    image: Optional[UploadFile] = File(None),
    sample_image_path: Optional[str] = Form(None),
    crop_name: Optional[str] = Form(None),
    latitude: Optional[float] = Form(20.0059),
    longitude: Optional[float] = Form(73.7798),
    state: Optional[str] = Form("Maharashtra"),
    district: Optional[str] = Form("Nashik"),
    village: Optional[str] = Form("Ozar"),
    notes: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    """Run AI computer vision analysis on uploaded or sample crop image."""
    unique_id = uuid.uuid4().hex[:10]
    
    if image:
        # Validate file size & extension
        contents = await image.read()
        if len(contents) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Image size exceeds 10MB limit.")
        
        filename = f"crop_{unique_id}.jpg"
        file_path = os.path.join(UPLOAD_DIR, filename)
        try:
            with open(file_path, "wb") as f:
                f.write(contents)
            image_url = f"/static/uploads/{filename}"
        except Exception:
            import base64
            b64 = base64.b64encode(contents).decode("utf-8")
            image_url = f"data:image/jpeg;base64,{b64}"
        image_bytes = contents
    elif sample_image_path:
        # Use demo sample image
        demo_filename = f"sample_{unique_id}.jpg"
        image_url = sample_image_path
        # Create a synthetic image buffer if physical sample not on disk
        import cv2, numpy as np
        synthetic_cv = np.zeros((400, 400, 3), dtype=np.uint8)
        # Draw realistic leaf pattern
        cv2.ellipse(synthetic_cv, (200, 200), (120, 180), 30, 0, 360, (34, 139, 34), -1)
        cv2.circle(synthetic_cv, (170, 160), 35, (30, 180, 220), -1) # lesion spot
        _, encoded = cv2.imencode('.jpg', synthetic_cv)
        image_bytes = encoded.tobytes()
    else:
        # Default test fallback leaf
        import cv2, numpy as np
        synthetic_cv = np.zeros((400, 400, 3), dtype=np.uint8)
        cv2.ellipse(synthetic_cv, (200, 200), (130, 190), 20, 0, 360, (34, 160, 34), -1)
        cv2.circle(synthetic_cv, (210, 180), 40, (20, 160, 210), -1)
        _, encoded = cv2.imencode('.jpg', synthetic_cv)
        image_bytes = encoded.tobytes()
        image_url = "/static/demo/sample_leaf_default.jpg"

    # Run AI pipeline
    analysis = run_ai_analysis(
        image_bytes=image_bytes,
        user_selected_crop=crop_name,
        filename_base=unique_id
    )

    # Save Inspection to Database
    inspection = CropInspection(
        user_id=1, # Default demo user
        crop_name=analysis["crop_name"],
        detection_result=analysis["detection_result"],
        detection_type=analysis["detection_type"],
        confidence=analysis["confidence"],
        severity_score=analysis["severity_score"],
        severity_level=analysis["severity_level"],
        affected_area_pct=analysis["affected_area_pct"],
        image_url=image_url,
        heatmap_url=analysis["heatmap_url"],
        latitude=latitude,
        longitude=longitude,
        state=state,
        district=district,
        village=village,
        notes=notes or f"Automated inspection created via AI portal.",
        model_version=analysis["model_version"],
        created_at=datetime.datetime.utcnow()
    )
    db.add(inspection)
    db.flush()

    # Save Recommendations
    for rec_data in analysis["recommendations"]:
        rec = Recommendation(
            inspection_id=inspection.id,
            title=rec_data["title"],
            details=rec_data["details"],
            category=rec_data["category"],
            urgency=rec_data["urgency"]
        )
        db.add(rec)

    db.commit()
    db.refresh(inspection)

    return {
        "inspection": InspectionOut.model_validate(inspection),
        "explanation": analysis["explanation"],
        "inference_time_sec": analysis["inference_time_sec"],
        "demo_mode": sample_image_path is not None or image is None
    }

@router.get("/inspections", response_model=List[InspectionOut])
def get_inspections(
    crop: Optional[str] = None,
    disease: Optional[str] = None,
    severity: Optional[str] = None,
    district: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    query = db.query(CropInspection)
    if crop and crop != "ALL":
        query = query.filter(CropInspection.crop_name == crop)
    if disease and disease != "ALL":
        query = query.filter(CropInspection.detection_result == disease)
    if severity and severity != "ALL":
        query = query.filter(CropInspection.severity_level == severity)
    if district and district != "ALL":
        query = query.filter(CropInspection.district == district)
    if search:
        query = query.filter(
            (CropInspection.crop_name.ilike(f"%{search}%")) |
            (CropInspection.detection_result.ilike(f"%{search}%")) |
            (CropInspection.district.ilike(f"%{search}%")) |
            (CropInspection.village.ilike(f"%{search}%"))
        )

    inspections = query.order_by(CropInspection.created_at.desc()).offset(offset).limit(limit).all()
    return [InspectionOut.model_validate(ins) for ins in inspections]

@router.get("/inspections/{inspection_id}", response_model=InspectionOut)
def get_inspection_detail(inspection_id: int, db: Session = Depends(get_db)):
    inspection = db.query(CropInspection).filter(CropInspection.id == inspection_id).first()
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection record not found")
    return InspectionOut.model_validate(inspection)

@router.delete("/inspections/{inspection_id}")
def delete_inspection(inspection_id: int, db: Session = Depends(get_db)):
    inspection = db.query(CropInspection).filter(CropInspection.id == inspection_id).first()
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")
    db.delete(inspection)
    db.commit()
    return {"message": "Inspection deleted successfully"}

@router.get("/inspections/{inspection_id}/report")
def download_inspection_report(inspection_id: int, db: Session = Depends(get_db)):
    inspection = db.query(CropInspection).filter(CropInspection.id == inspection_id).first()
    if not inspection:
        raise HTTPException(status_code=404, detail="Inspection not found")
    
    insp_dict = {
        "id": inspection.id,
        "crop_name": inspection.crop_name,
        "detection_result": inspection.detection_result,
        "detection_type": inspection.detection_type,
        "confidence": inspection.confidence,
        "severity_level": inspection.severity_level,
        "affected_area_pct": inspection.affected_area_pct,
        "state": inspection.state,
        "district": inspection.district,
        "created_at": str(inspection.created_at),
        "explanation": f"MobileNetV3 AI confidence: {inspection.confidence}%. Lesion coverage: {inspection.affected_area_pct}%.",
        "recommendations": [{"title": r.title, "details": r.details, "category": r.category, "urgency": r.urgency} for r in inspection.recommendations]
    }

    pdf_bytes = generate_inspection_pdf(insp_dict)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=CropGuard_Report_#{inspection.id}.pdf"}
    )
