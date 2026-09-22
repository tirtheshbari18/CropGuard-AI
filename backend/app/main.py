import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database.session import Base, engine, SessionLocal
from app.services.seed_service import seed_database
from app.api import auth, inspections, alerts, analytics, system, demo

# Create database tables automatically
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CropGuard AI — API Platform",
    description="AI-Powered Crop Disease, Pest Detection & Early Warning System (SIH26131)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for React Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static File directories for images and heatmaps
uploads_dir = os.path.join(os.getcwd(), "uploads")
demo_dir = os.path.join(os.getcwd(), "data", "demo")
os.makedirs(uploads_dir, exist_ok=True)
os.makedirs(demo_dir, exist_ok=True)

app.mount("/static/uploads", StaticFiles(directory=uploads_dir), name="uploads")
app.mount("/static/demo", StaticFiles(directory=demo_dir), name="demo")

# Include API Routers
app.include_router(auth.router)
app.include_router(inspections.router)
app.include_router(alerts.router)
app.include_router(analytics.router)
app.include_router(system.router)
app.include_router(demo.router)

@app.on_event("startup")
def startup_event():
    """Auto-seed sample demo data on application startup."""
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "project": "CropGuard AI",
        "sih_problem_id": "SIH26131",
        "status": "ONLINE",
        "docs_url": "/docs",
        "api_version": "v1.0.0"
    }
