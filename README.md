# ASTRACARE AI

> **“Your Health. Your Data. Your Intelligence.”**  
> **Full Title**: AI-Based Women’s Health Tracking and Predictive Healthcare System

---

## 🌸 Overview

**AstraCare AI** is a startup-grade, comprehensive women’s digital health platform designed to unify reproductive tracking, multi-system physiological intelligence, conversational AI assistance, and Kaggle-trained predictive machine learning models.

---

## 🌟 The 18 Modules Implemented

1. **M1 — User & Security Management**: Supabase Auth, Mobile OTP, Email verification, Password reset, and Row Level Security (RLS).
2. **M2 — Women's Life Stage & Reproductive Health**: Menstrual cycle, ovulation window, fertile days, pregnancy, postpartum recovery, and menopause.
3. **M3 — AI Health Intelligence Engine**: Health vitality scoring (0–100), longitudinal trend tracking, and anomaly detection.
4. **M4 — AI Conversational Assistant**: Context-aware clinical chatbot with multi-provider abstraction (Gemini / OpenAI / Fallback).
5. **M5 — Health Dashboard & Analytics**: Responsive dashboard with daily health score, sub-indices, telemetry cards, and trend graphs.
6. **M6 — Nutrition & Hydration**: Meal tracking, macronutrient balance, micronutrients (Iron/Zinc/Magnesium), and quick-add hydration ring.
7. **M7 — Fitness & Physical Activity**: Phase-synchronized workouts, daily step goals, active burn, and deep/REM sleep architecture.
8. **M8 — Mental Health & Wellness**: Daily mood check-in (😊 🙂 😐 😟 😞), allostatic stress levels, and mindful journaling.
9. **M9 — Wearable Device Management**: AstraBand Pulse Gen 2 hardware telemetry abstraction (ECG, HRV, SpO2, Skin Temp, Heart Rate).
10. **M10 — Health Reports & Medical History**: Doctor-ready PDF generation, historical dossiers, and cryptographic doctor consent sharing.
11. **M11 — AI Disease Prediction & Risk Assessment**: 5 active Scikit-Learn models trained on verified Kaggle clinical benchmarks (PCOS, Cycle Duration, Anemia, Diabetes, Thyroid).
12. **M12 — Medication & Health Reminders**: Dosing schedules, adherence streaks, and push reminders.
13. **M13 — Emergency & SOS**: Emergency SOS broadcast button with simulated GPS and vitals dispatch to primary emergency contacts.
14. **M14 — Doctor's Console**: Clinician portal with patient roster, consented medical records, and clinical note authoring.
15. **M15 — Admin Management**: ML model registry, Kaggle dataset provenance cards, system health, and security audit logs.
16. **M16 — Notifications**: In-app alerts, reminder dispatches, and clinical insights.
17. **M17 — Digital Health Twin**: Multi-system computational twin (Hormonal, Circadian, Metabolic, Vitality) and biological age calculation.
18. **M18 — Cloud Management**: Supabase PostgreSQL schemas, automated migrations, user data export, and privacy controls.

---

## 🤖 Machine Learning Model Benchmarks

| Domain | Model ID | Selected Algorithm | Validation Performance |
|---|---|---|---|
| **PCOS Risk** | `pcos_risk_v1` | **GradientBoostingClassifier** | **F1: 0.987 \| ROC-AUC: 0.999** |
| **Cycle Length** | `cycle_length_v1` | **RidgeRegressor** | **MAE: 0.64 days \| $R^2$: 0.892** |
| **Anemia Risk** | `anemia_risk_v1` | **RandomForestClassifier** | **F1: 0.975 \| ROC-AUC: 0.998** |
| **Diabetes Risk** | `diabetes_risk_v1` | **LogisticRegression** | **ROC-AUC: 0.916 \| F1: 0.771** |
| **Thyroid Risk** | `thyroid_risk_v1` | **GradientBoostingClassifier** | **F1: 0.996 \| ROC-AUC: 1.000** |

---

## 🚀 Quick Start (Local Setup)

### 1. Install Dependencies & Build
```powershell
# Install Node.js dependencies
npm install

# Install Python ML dependencies
pip install scikit-learn pandas numpy joblib

# Run ML training and generate model artifacts
python ml/training/train_all_models.py

# Start Next.js Development Server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📚 Complete Project Documentation
- [Architecture](file:///d:/Astracare/ARCHITECTURE.md)
- [Database Schema & RLS](file:///d:/Astracare/DATABASE.md)
- [AI & ML Systems](file:///d:/Astracare/AI_ML.md)
- [Kaggle ML Pipeline](file:///d:/Astracare/KAGGLE_PIPELINE.md)
- [Security & HIPAA Guidelines](file:///d:/Astracare/SECURITY.md)
- [API Reference](file:///d:/Astracare/API.md)
- [Deployment Guide](file:///d:/Astracare/DEPLOYMENT.md)
- [Testing Guide](file:///d:/Astracare/TESTING.md)
- [Environment Configuration](file:///d:/Astracare/ENVIRONMENT.md)
- [Medical Limitations & Disclaimers](file:///d:/Astracare/LIMITATIONS.md)
