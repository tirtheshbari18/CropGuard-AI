import datetime
import random
from sqlalchemy.orm import Session
from app.models.models import (
    User, UserRole, Crop, Disease, Pest, CropInspection, Recommendation, Alert, ModelMetric, AuditLog
)
from app.services.auth_service import get_password_hash

MAHARASHTRA_LOCATIONS = [
    {"district": "Nashik", "state": "Maharashtra", "village": "Ozar", "lat": 20.0059, "lng": 73.7798},
    {"district": "Nashik", "state": "Maharashtra", "village": "Niphad", "lat": 20.0784, "lng": 74.1082},
    {"district": "Pune", "state": "Maharashtra", "village": "Baramati", "lat": 18.1517, "lng": 74.5768},
    {"district": "Pune", "state": "Maharashtra", "village": "Junnar", "lat": 19.2081, "lng": 73.8767},
    {"district": "Satara", "state": "Maharashtra", "village": "Phaltan", "lat": 17.9862, "lng": 74.4321},
    {"district": "Kolhapur", "state": "Maharashtra", "village": "Shirol", "lat": 16.7324, "lng": 74.5978},
    {"district": "Nagpur", "state": "Maharashtra", "village": "Katol", "lat": 21.2842, "lng": 78.5831},
    {"district": "Ahmednagar", "state": "Maharashtra", "village": "Rahuri", "lat": 19.3921, "lng": 74.6543},
    {"district": "Solapur", "state": "Maharashtra", "village": "Pandharpur", "lat": 17.6778, "lng": 75.3262},
]

DEMO_INSPECTIONS = [
    {"crop": "Tomato", "result": "Tomato Early Blight", "type": "DISEASE", "conf": 94.2, "sev_pct": 34.5, "sev_lvl": "MODERATE"},
    {"crop": "Tomato", "result": "Tomato Late Blight", "type": "DISEASE", "conf": 96.8, "sev_pct": 68.2, "sev_lvl": "CRITICAL"},
    {"crop": "Tomato", "result": "Tomato Healthy", "type": "HEALTHY", "conf": 98.1, "sev_pct": 0.0, "sev_lvl": "LOW"},
    {"crop": "Potato", "result": "Potato Early Blight", "type": "DISEASE", "conf": 91.5, "sev_pct": 22.0, "sev_lvl": "MODERATE"},
    {"crop": "Potato", "result": "Potato Late Blight", "type": "DISEASE", "conf": 95.0, "sev_pct": 52.4, "sev_lvl": "HIGH"},
    {"crop": "Potato", "result": "Potato Healthy", "type": "HEALTHY", "conf": 97.4, "sev_pct": 0.0, "sev_lvl": "LOW"},
    {"crop": "Apple", "result": "Apple Scab", "type": "DISEASE", "conf": 89.6, "sev_pct": 41.0, "sev_lvl": "HIGH"},
    {"crop": "Apple", "result": "Apple Black Rot", "type": "DISEASE", "conf": 93.1, "sev_pct": 38.5, "sev_lvl": "HIGH"},
    {"crop": "Corn", "result": "Corn Common Rust", "type": "DISEASE", "conf": 92.7, "sev_pct": 28.0, "sev_lvl": "MODERATE"},
    {"crop": "Corn", "result": "Corn Northern Leaf Blight", "type": "DISEASE", "conf": 90.4, "sev_pct": 48.0, "sev_lvl": "HIGH"},
    {"crop": "Cotton", "result": "Cotton Aphid Attack", "type": "PEST", "conf": 88.9, "sev_pct": 55.0, "sev_lvl": "HIGH"},
    {"crop": "Rice", "result": "Stem Borer Attack", "type": "PEST", "conf": 91.2, "sev_pct": 62.0, "sev_lvl": "CRITICAL"},
]

def seed_database(db: Session):
    """Seed sample data for demo mode."""
    # Check if already seeded
    if db.query(User).count() > 0:
        return

    print("Seeding CropGuard AI database...")

    # 1. Users
    farmer = User(
        username="farmer",
        email="farmer@cropguard.ai",
        hashed_password=get_password_hash("farmer123"),
        role=UserRole.FARMER.value,
        full_name="Ramesh Patil",
        state="Maharashtra",
        district="Nashik"
    )
    officer = User(
        username="officer",
        email="officer@cropguard.ai",
        hashed_password=get_password_hash("officer123"),
        role=UserRole.OFFICER.value,
        full_name="Dr. Sunita Deshmukh (District Krishi Adhikari)",
        state="Maharashtra",
        district="Nashik"
    )
    admin = User(
        username="admin",
        email="admin@cropguard.ai",
        hashed_password=get_password_hash("admin123"),
        role=UserRole.ADMIN.value,
        full_name="System Administrator",
        state="Maharashtra",
        district="Pune"
    )
    db.add_all([farmer, officer, admin])
    db.commit()

    # 2. Model Metrics
    metric = ModelMetric(
        model_version="v1.0.0-MobileNetV3",
        dataset_name="PlantVillage Agronomic Multi-Crop CV Dataset",
        accuracy=0.942,
        precision=0.938,
        recall=0.945,
        f1_score=0.941,
        map_score=0.895,
        num_classes=15,
        training_date="2026-08-15",
        avg_inference_sec=0.28
    )
    db.add(metric)
    db.commit()

    # 3. Inspections & Recommendations
    for i in range(28):
        loc = random.choice(MAHARASHTRA_LOCATIONS)
        insp_spec = random.choice(DEMO_INSPECTIONS)
        
        # Add slight jitter to coordinates for realistic Leaflet map clustering
        lat_jitter = loc["lat"] + random.uniform(-0.04, 0.04)
        lng_jitter = loc["lng"] + random.uniform(-0.04, 0.04)
        days_ago = random.randint(0, 20)
        created_dt = datetime.datetime.utcnow() - datetime.timedelta(days=days_ago, hours=random.randint(1, 12))
        
        sample_img = f"/static/demo/sample_{insp_spec['crop'].lower()}_{i % 3 + 1}.jpg"
        heatmap_img = f"/static/demo/heatmap_{insp_spec['crop'].lower()}_{i % 3 + 1}.jpg"

        inspection = CropInspection(
            user_id=farmer.id,
            crop_name=insp_spec["crop"],
            detection_result=insp_spec["result"],
            detection_type=insp_spec["type"],
            confidence=insp_spec["conf"],
            severity_score=insp_spec["sev_pct"],
            severity_level=insp_spec["sev_lvl"],
            affected_area_pct=insp_spec["sev_pct"],
            image_url=sample_img,
            heatmap_url=heatmap_img,
            latitude=round(lat_jitter, 5),
            longitude=round(lng_jitter, 5),
            state=loc["state"],
            district=loc["district"],
            village=loc["village"],
            notes=f"Inspected crop plot in {loc['village']} sector B.",
            model_version="v1.0.0-MobileNetV3",
            created_at=created_dt
        )
        db.add(inspection)
        db.flush()

        # Add Recommendations
        if insp_spec["type"] != "HEALTHY":
            r1 = Recommendation(
                inspection_id=inspection.id,
                title="Foliage Pruning & Isolation",
                details=f"Remove severely affected leaves infected with {insp_spec['result']} to prevent airborne spore propagation.",
                category="ISOLATION",
                urgency="HIGH" if insp_spec["sev_lvl"] in ["HIGH", "CRITICAL"] else "MEDIUM"
            )
            r2 = Recommendation(
                inspection_id=inspection.id,
                title="Bio-Fungicide / Neem Oil Application",
                details="Apply Trichoderma viride or 5% Neem Seed Kernel Extract (NSKE) during non-peak sun hours.",
                category="TREATMENT",
                urgency="MEDIUM"
            )
            db.add_all([r1, r2])

    db.commit()

    # 4. Alerts
    alert1 = Alert(
        alert_title="Outbreak Alert: Tomato Late Blight in Niphad",
        crop_name="Tomato",
        disease_pest_name="Tomato Late Blight",
        severity="CRITICAL",
        state="Maharashtra",
        district="Nashik",
        case_count=8,
        status="ACTIVE",
        recommended_action="Advisory issued for Niphad onion & tomato belt. Spray Copper Oxychloride 0.25% immediately."
    )
    alert2 = Alert(
        alert_title="Pest Cluster Alert: Cotton Aphids in Katol",
        crop_name="Cotton",
        disease_pest_name="Cotton Aphid Attack",
        severity="HIGH",
        state="Maharashtra",
        district="Nagpur",
        case_count=5,
        status="ACTIVE",
        recommended_action="Deploy yellow sticky traps. Contact Krishi Vigyan Kendra Nagpur for bio-agent releases."
    )
    alert3 = Alert(
        alert_title="Resolved Alert: Potato Early Blight in Baramati",
        crop_name="Potato",
        disease_pest_name="Potato Early Blight",
        severity="MODERATE",
        state="Maharashtra",
        district="Pune",
        case_count=4,
        status="RESOLVED",
        recommended_action="Field inspection completed by Agricultural Officer. Disease under control."
    )
    db.add_all([alert1, alert2, alert3])
    db.commit()

    print("CropGuard AI sample data successfully seeded!")
