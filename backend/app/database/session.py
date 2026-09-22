import os
import tempfile
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

logger = logging.getLogger("cropguard.database")

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./cropguard.db")

# Fix SQLAlchemy dialect prefix for PostgreSQL cloud providers (Neon, Supabase, Render, Railway)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

connect_args = {}
engine_kwargs = {
    "pool_pre_ping": True,
}

if DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False
    
    # Check if local directory is writable, otherwise use temp directory (for read-only serverless environments)
    db_file_path = DATABASE_URL.replace("sqlite:///", "")
    db_dir = os.path.dirname(os.path.abspath(db_file_path)) if os.path.dirname(db_file_path) else os.getcwd()
    
    if not os.access(db_dir, os.W_OK):
        tmp_db = os.path.join(tempfile.gettempdir(), "cropguard.db")
        DATABASE_URL = f"sqlite:///{tmp_db}"
        logger.info(f"Read-only filesystem detected. Diverting SQLite database to {tmp_db}")
else:
    # Serverless-safe connection pool settings for PostgreSQL
    engine_kwargs["pool_size"] = int(os.getenv("DB_POOL_SIZE", "5"))
    engine_kwargs["max_overflow"] = int(os.getenv("DB_MAX_OVERFLOW", "2"))
    engine_kwargs["pool_recycle"] = 300

try:
    engine = create_engine(DATABASE_URL, connect_args=connect_args, **engine_kwargs)
except Exception as e:
    logger.warning(f"Primary database connection failed: {e}. Falling back to SQLite.")
    fallback_path = os.path.join(tempfile.gettempdir(), "cropguard_fallback.db")
    engine = create_engine(f"sqlite:///{fallback_path}", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
