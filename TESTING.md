# ASTRACARE AI: Testing Guide

## 1. Automated ML Pipeline & Inference Validation
To execute automated unit and integration tests across the ML pipelines:
```powershell
python ml/scripts/kaggle_discover.py
python ml/datasets/generate_benchmark_data.py
python ml/training/train_all_models.py
python ml/evaluation/evaluate_all_models.py
python ml/inference/predict_engine.py
```

## 2. Frontend & API Validation
To test Next.js App Router endpoints, TypeScript type-safety, and production compilation:
```powershell
npm run build
```

## 3. RLS & Security Verification
Verify in Supabase SQL editor that unauthenticated users cannot read patient tables, and doctor queries are restricted to consented patients.
