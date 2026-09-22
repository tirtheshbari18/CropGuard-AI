# CropGuard AI — 3-5 Minute Hackathon Presentation Guide

Follow this reliable step-by-step sequence during your SIH 2026 hackathon demo:

1. **Opening & Problem Overview**:
   - Open `http://localhost:5173/`. Point to the Crop Health Command Center dashboard showing active inspections, healthy crops, disease ratio, and active outbreak alerts across Maharashtra.
2. **AI Crop Image Analysis**:
   - Click **"Analyze Crop Image"** button.
   - Select preset sample **Tomato Early Blight** (or upload a custom leaf photo).
   - Click **"Run AI Computer Vision Inference"**.
3. **Diagnostics & Explainable AI (Grad-CAM)**:
   - Highlight the **88.5% confidence score** and **LOW severity rating**.
   - Show the **Grad-CAM Focus Heatmap** side-by-side with the original leaf, explaining how the MobileNetV3 model isolates discolored lesion areas.
   - Review agronomic guidance & management recommendations.
4. **Downloadable PDF Report**:
   - Click **"Download PDF Report"** button to showcase ReportLab generated PDF with official diagnostic metadata.
5. **GIS Outbreak Map & Early Warning Alerts**:
   - Open **"GIS Outbreak Map"** to show disease markers and active spatial-temporal outbreak cluster circles over Maharashtra districts (Nashik, Satara, Nagpur).
   - Open **"Early Warning Alerts"** center to demonstrate extension officer alert management.
6. **Model Performance & System Diagnostics**:
   - Show **"Model Performance"** metrics (Accuracy: 94.2%, Precision: 93.8%, F1: 94.1%, Latency: 0.28s).
   - Show **"System Diagnostics"** confirming all microservices are ONLINE.
