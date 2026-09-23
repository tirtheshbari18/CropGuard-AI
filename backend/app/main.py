import os
import tempfile
import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.database.session import Base, engine, SessionLocal
from app.services.seed_service import seed_database
from app.api import auth, inspections, alerts, analytics, system, demo

logger = logging.getLogger("cropguard.main")

# Create database tables automatically if connection succeeds
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    logger.warning(f"Could not verify/create tables on startup: {e}")

app = FastAPI(
    title="CropGuard AI — API Platform",
    description="AI-Powered Crop Disease, Pest Detection & Early Warning System (SIH26131)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Environment-based CORS configuration
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")
allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if allowed_origins_env:
    for o in allowed_origins_env.split(","):
        clean_o = o.strip()
        if clean_o and clean_o not in allowed_origins:
            allowed_origins.append(clean_o)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Safe directory setup for uploads & demo files
app_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(app_dir)
root_dir = os.path.dirname(backend_dir)

demo_candidates = [
    os.path.join(backend_dir, "data", "demo"),
    os.path.join(root_dir, "data", "demo"),
    os.path.join(os.getcwd(), "data", "demo"),
]
demo_dir = next((d for d in demo_candidates if os.path.exists(d)), demo_candidates[0])

uploads_candidates = [
    os.path.join(backend_dir, "uploads"),
    os.path.join(root_dir, "uploads"),
    os.path.join(os.getcwd(), "uploads"),
]
uploads_dir = next((u for u in uploads_candidates if os.path.exists(u)), uploads_candidates[0])

try:
    os.makedirs(uploads_dir, exist_ok=True)
    os.makedirs(demo_dir, exist_ok=True)
    app.mount("/static/uploads", StaticFiles(directory=uploads_dir), name="uploads")
    app.mount("/static/demo", StaticFiles(directory=demo_dir), name="demo")
except Exception:
    # Read-only fallback for serverless execution
    tmp_uploads = os.path.join(tempfile.gettempdir(), "cropguard_uploads")
    tmp_demo = os.path.join(tempfile.gettempdir(), "cropguard_demo")
    os.makedirs(tmp_uploads, exist_ok=True)
    os.makedirs(tmp_demo, exist_ok=True)
    app.mount("/static/uploads", StaticFiles(directory=tmp_uploads), name="uploads")
    app.mount("/static/demo", StaticFiles(directory=tmp_demo), name="demo")

# Include API Routers
app.include_router(auth.router)
app.include_router(inspections.router)
app.include_router(alerts.router)
app.include_router(analytics.router)
app.include_router(system.router)
app.include_router(demo.router)

@app.on_event("startup")
def startup_event():
    """Auto-seed sample demo data on application startup if enabled."""
    auto_seed = os.getenv("AUTO_SEED", "true").lower() in ("true", "1", "yes")
    if auto_seed:
        try:
            db = SessionLocal()
            try:
                seed_database(db)
            finally:
                db.close()
        except Exception as e:
            logger.warning(f"Startup seeding notice: {e}")

@app.get("/api/health")
def api_health():
    """Simple health check endpoint required for Vercel/cloud monitoring."""
    return {"status": "ok"}

@app.get("/")
def root():
    return {
        "project": "CropGuard AI",
        "sih_problem_id": "SIH26131",
        "status": "ONLINE",
        "docs_url": "/docs",
        "api_version": "v1.0.0"
    }
