# CropGuard AI — Architecture Documentation

## 1. System Overview

CropGuard AI is built using a modern decoupled 3-tier architecture:
1. **Frontend**: Single Page Application built with React 19, TypeScript, Vite, Tailwind CSS, Leaflet Maps, and Recharts.
2. **Backend**: RESTful API service built with Python FastAPI, SQLAlchemy ORM, and ReportLab PDF Engine.
3. **AI / ML Pipeline**: PyTorch MobileNetV3 deep learning classifier, OpenCV HSV color segmentation lesion area estimator, and Grad-CAM explainable AI focus map generator.

```
┌────────────────────────────────────────────────────────┐
│                      Client Layer                      │
│             React + TypeScript + Vite + GIS            │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON REST APIs
┌───────────────────────────▼────────────────────────────┐
│                      Backend Layer                     │
│    FastAPI + JWT Auth + Spatial Clustering + PDF       │
└───────┬───────────────────┬───────────────────┬────────┘
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌───────▼────────┐
│ PyTorch & CV   │  │ PostgreSQL /   │  │ Static Uploads │
│ Inference      │  │ SQLite DB      │  │ & Heatmaps     │
└────────────────┘  └────────────────┘  └────────────────┘
```

## 2. Spatial-Temporal Outbreak Engine
The outbreak engine scans recent crop inspection records (`created_at >= 14 days ago`) grouped by district, state, crop, and disease/pest result. If the case count in a district exceeds 3, an active outbreak alert is created.
