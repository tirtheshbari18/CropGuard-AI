from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db, Base, engine
from app.services.seed_service import seed_database

router = APIRouter(prefix="/api/demo", tags=["Demo Mode"])

@router.get("/status")
def get_demo_status():
    return {
        "demo_mode": True,
        "message": "DEMO MODE — Results are for demonstration and do not replace professional agricultural diagnosis.",
        "sample_dataset": "PlantVillage Multi-Crop Dataset Sample",
        "supported_features": [
            "AI Crop Disease Classification",
            "Pest Bounding Box Detection Demo",
            "OpenCV Lesion Severity Estimation",
            "Grad-CAM Heatmap Explainability",
            "Outbreak Anomaly Detection",
            "GIS Heatmap & Cluster Markers",
            "Downloadable PDF Reports"
        ]
    }

@router.post("/reset")
def reset_demo_database(db: Session = Depends(get_db)):
    """Reset database tables and re-seed sample demo data."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    seed_database(db)
    return {"message": "Demo environment successfully reset with sample dataset."}
