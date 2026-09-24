# ASTRACARE AI: Automated Kaggle ML Pipeline

## 1. Automated Pipeline Workflow
```
Kaggle Discovery (`kaggle_discover.py`)
       ↓
Dataset Inspection & Provenance Validation
       ↓
Schema & Suitability Assessment (`DATASET_CARD_*.md`)
       ↓
Benchmark Ingestion (`generate_benchmark_data.py`)
       ↓
Preprocessing & Feature Engineering (`pipeline.py`)
       ↓
Candidate Model Comparison & Training (`train_all_models.py`)
       ↓
Evaluation & Leakage Checks (`evaluate_all_models.py`)
       ↓
Model Registry & Artifact Serialization (`model_registry.json`)
       ↓
Inference Service (`predict_engine.py`)
       ↓
Next.js API & UI Integration (`/api/ml/predict`)
```

## 2. CLI Execution Instructions
To re-run the entire pipeline from scratch:
```powershell
python ml/scripts/kaggle_discover.py
python ml/datasets/generate_benchmark_data.py
python ml/training/train_all_models.py
python ml/evaluation/evaluate_all_models.py
python ml/inference/predict_engine.py
```
