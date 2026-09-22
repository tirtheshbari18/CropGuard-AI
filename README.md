# CropGuard AI — AI-Powered Crop Disease, Pest Detection & Early Warning System

**Smart India Hackathon 2026 (SIH 2026)**
* **Problem Statement ID:** SIH26131 — Crop Disease/Pest Detection
* **Category:** Software
* **Theme:** Agriculture, FoodTech & Rural Development

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftirtheshbari18%2FCropGuard-AI&root-directory=frontend)

---

## 🌾 Project Overview

**CropGuard AI** is an end-to-end intelligent agricultural health platform designed for farmers, agricultural extension officers, and system administrators. It combines computer vision, explainable AI (Grad-CAM), lesion surface area estimation (OpenCV), spatial-temporal density outbreak detection, and early warning advisories into a unified command center.

---

## ⚡ Key Features

1. **AI Crop Image Analysis**: Upload or select leaf sample photos for multi-crop disease classification (MobileNetV3 backbone).
2. **OpenCV Lesion Severity Estimation**: Calculates exact affected leaf surface area percentage mapped to LOW, MODERATE, HIGH, and CRITICAL severity ratings.
3. **AI Explainability (Grad-CAM)**: Visual jet-colormap focus overlay highlighting infected spots on leaf surfaces.
4. **GIS Disease & Outbreak Map**: Interactive Leaflet map displaying real-time inspection markers and spatial density outbreak cluster circles.
5. **Early Warning Alert System**: Automated alert generation with Krishi Vigyan Kendra (KVK) officer advisories.
6. **Multi-Role Portal**: Tailored workflows for Farmers, Agricultural Officers, and Admins.
7. **Downloadable PDF Reports**: Automated PDF agronomic inspection report generation using ReportLab.
8. **Multi-Language Support**: English, Hindi (हिन्दी), and Marathi (मराठी) support.
9. **Demo Mode**: Instant offline demonstration dataset with seeded inspections across Maharashtra districts.

---

## 🚀 Quick Start & Installation

### Prerequisites
* Node.js v18+ and npm
* Python 3.10+
* (Optional) PostgreSQL database (defaults to SQLite if not configured)

### 1. Backend Setup & Startup
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Backend API interactive Swagger documentation will be available at `http://127.0.0.1:8000/docs`.

### 2. Frontend Setup & Startup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## 🔑 Demo Credentials

| Role | Username | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Farmer** | `farmer` | `farmer123` | Image Upload, Diagnostics, Personal History |
| **Agricultural Officer** | `officer` | `officer123` | Regional Map, Outbreaks, Alert Acknowledgment |
| **Admin** | `admin` | `admin123` | Full Access, Demo Reset, Model Metrics |

---

## 🏗️ Project Architecture

```
CropGuard AI/
├── frontend/             # React + TypeScript + Vite + Tailwind CSS + Leaflet
├── backend/              # FastAPI + SQLAlchemy + Pydantic + ReportLab
│   └── app/
│       ├── api/          # REST API Endpoints
│       ├── models/       # Database Schemas
│       ├── services/     # ML Inference, Outbreak Engine, PDF Engine
│       └── main.py       # FastAPI Entrypoint
├── data/
│   └── demo/             # Sample Leaf Dataset & Generated Heatmaps
├── docs/                 # Architecture, API, ML & Demo Guides
├── docker-compose.yml    # Docker Containerization Setup
└── README.md
```

---

## 📜 Disclaimer
*CropGuard AI outputs are decision-support tools for agricultural officers and farmers. Predictions do not claim 100% clinical certainty and should be verified with certified Krishi Vigyan Kendra (KVK) agronomists.*
