import os
import io
import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_inspection_pdf(inspection_data: dict) -> bytes:
    """Generate professional PDF inspection report with ReportLab."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#166534'),
        alignment=0,
        spaceAfter=12
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#475569'),
        spaceAfter=15
    )

    heading2_style = ParagraphStyle(
        'Heading2',
        parent=styles['Heading2'],
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#15803d'),
        spaceBefore=12,
        spaceAfter=6
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#1e293b')
    )

    elements = []

    # Header Title
    elements.append(Paragraph("<b>CROPGUARD AI — CROP HEALTH INSPECTION REPORT</b>", title_style))
    elements.append(Paragraph(f"Official AI Agronomic Diagnostic Report | Generated: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | Hackathon SIH26131", subtitle_style))
    elements.append(Spacer(1, 10))

    # Inspection Metadata Table
    meta_data = [
        [Paragraph("<b>Inspection ID:</b>", body_style), Paragraph(f"#{inspection_data.get('id', 'N/A')}", body_style),
         Paragraph("<b>Date & Time:</b>", body_style), Paragraph(str(inspection_data.get('created_at', 'Now'))[:19], body_style)],
        [Paragraph("<b>Target Crop:</b>", body_style), Paragraph(str(inspection_data.get('crop_name', 'Unknown')), body_style),
         Paragraph("<b>Location:</b>", body_style), Paragraph(f"{inspection_data.get('district', 'Nashik')}, {inspection_data.get('state', 'Maharashtra')}", body_style)],
        [Paragraph("<b>Detection Result:</b>", body_style), Paragraph(f"<b>{inspection_data.get('detection_result', 'N/A')}</b>", body_style),
         Paragraph("<b>Detection Type:</b>", body_style), Paragraph(str(inspection_data.get('detection_type', 'DISEASE')), body_style)],
        [Paragraph("<b>AI Confidence:</b>", body_style), Paragraph(f"{inspection_data.get('confidence', 0)}%", body_style),
         Paragraph("<b>Severity Rating:</b>", body_style), Paragraph(f"<b>{inspection_data.get('severity_level', 'LOW')} ({inspection_data.get('affected_area_pct', 0)}% area)</b>", body_style)]
    ]

    t_meta = Table(meta_data, colWidths=[110, 150, 110, 150])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#e2e8f0')),
        ('PADDING', (0,0), (-1,-1), 6),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    elements.append(t_meta)
    elements.append(Spacer(1, 15))

    # AI Explainability Section
    elements.append(Paragraph("<b>1. AI Computer Vision Explainability & Focus Area</b>", heading2_style))
    elements.append(Paragraph(inspection_data.get('explanation', 'MobileNetV3 attention maps highlight focal leaf lesion areas.'), body_style))
    elements.append(Spacer(1, 12))

    # Agronomic Recommendations Section
    elements.append(Paragraph("<b>2. Agronomic Guidance & Management Recommendations</b>", heading2_style))
    recs = inspection_data.get('recommendations', [])
    if recs:
        rec_table_data = [[Paragraph("<b>Category</b>", body_style), Paragraph("<b>Action Item & Description</b>", body_style), Paragraph("<b>Urgency</b>", body_style)]]
        for r in recs:
            title = r.get('title', '') if isinstance(r, dict) else getattr(r, 'title', '')
            details = r.get('details', '') if isinstance(r, dict) else getattr(r, 'details', '')
            cat = r.get('category', '') if isinstance(r, dict) else getattr(r, 'category', '')
            urg = r.get('urgency', '') if isinstance(r, dict) else getattr(r, 'urgency', '')
            rec_table_data.append([
                Paragraph(f"<b>{cat}</b>", body_style),
                Paragraph(f"<b>{title}</b><br/>{details}", body_style),
                Paragraph(f"<font color='#dc2626'><b>{urg}</b></font>" if urg in ['HIGH','CRITICAL'] else f"<b>{urg}</b>", body_style)
            ])
        t_recs = Table(rec_table_data, colWidths=[100, 330, 90])
        t_recs.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#f1f5f9')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
            ('PADDING', (0,0), (-1,-1), 5),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        elements.append(t_recs)
    else:
        elements.append(Paragraph("No specific chemical or biological recommendations stored for this inspection.", body_style))

    elements.append(Spacer(1, 20))

    # Disclaimer Footer
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#64748b'),
        alignment=0
    )
    elements.append(Paragraph(
        "<b>DISCLAIMER:</b> CropGuard AI output is an automated decision-support tool powered by computer vision. "
        "It does not replace clinical field diagnosis by certified agricultural extension officers or Krishi Vigyan Kendra (KVK) agronomists. "
        "Verify dosages with local government agricultural authorities before application.",
        disclaimer_style
    ))

    doc.build(elements)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
