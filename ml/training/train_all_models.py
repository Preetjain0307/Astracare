"""
ASTRACARE AI - Master Model Training & Validation Engine
Trains, validates, compares multiple candidate algorithms, and registers production models for:
1. PCOS Risk Classifier
2. Cycle Length & Phase Predictor
3. Anemia & Iron Deficiency Screener
4. Diabetes Risk Classifier
5. Thyroid Dysfunction Screener
"""

import os
import sys
import json
import datetime

# Ensure project root is in python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any

from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, ExtraTreesClassifier
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, ExtraTreesRegressor
from sklearn.linear_model import LogisticRegression, Ridge
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, roc_auc_score,
    mean_absolute_error, mean_squared_error, r2_score, confusion_matrix
)
from sklearn.pipeline import Pipeline

# Local module imports
from ml.configs.ml_config import ML_CONFIGS
from ml.preprocessing.pipeline import get_preprocessing_pipeline, prepare_data_split
from ml.datasets.generate_benchmark_data import generate_all_datasets


def train_and_evaluate_classification(domain_key: str, dataset_path: str) -> Dict[str, Any]:
    cfg = ML_CONFIGS[domain_key]
    df = pd.read_csv(dataset_path)
    
    data = prepare_data_split(
        df, 
        feature_cols=cfg["features"], 
        target_col=cfg["target"],
        is_classification=True
    )
    
    # Candidate architectures
    candidates = {
        "RandomForest": RandomForestClassifier(n_estimators=120, max_depth=8, min_samples_split=4, random_state=42),
        "GradientBoosting": GradientBoostingClassifier(n_estimators=100, learning_rate=0.08, max_depth=4, random_state=42),
        "ExtraTrees": ExtraTreesClassifier(n_estimators=120, max_depth=8, random_state=42),
        "LogisticRegression": LogisticRegression(max_iter=1000, C=1.0, random_state=42)
    }
    
    best_name = None
    best_pipeline = None
    best_score = -1.0
    best_metrics = {}
    candidate_scores = {}
    
    for name, estimator in candidates.items():
        pipe = Pipeline([
            ('preprocessor', get_preprocessing_pipeline(domain_key)),
            ('classifier', estimator)
        ])
        
        # Train on train split
        pipe.fit(data["X_train"], data["y_train"])
        
        # Validate on validation split
        y_val_pred = pipe.predict(data["X_val"])
        val_f1 = f1_score(data["y_val"], y_val_pred, average='weighted')
        candidate_scores[name] = float(np.round(val_f1, 4))
        
        if val_f1 > best_score:
            best_score = val_f1
            best_name = name
            best_pipeline = pipe
    
    # Final evaluation on unseen test split
    y_test_pred = best_pipeline.predict(data["X_test"])
    test_acc = accuracy_score(data["y_test"], y_test_pred)
    test_prec = precision_score(data["y_test"], y_test_pred, average='weighted', zero_division=0)
    test_rec = recall_score(data["y_test"], y_test_pred, average='weighted', zero_division=0)
    test_f1 = f1_score(data["y_test"], y_test_pred, average='weighted', zero_division=0)
    
    # ROC-AUC if probability estimates are available
    try:
        y_test_proba = best_pipeline.predict_proba(data["X_test"])
        if len(np.unique(data["y_test"])) == 2:
            test_roc = roc_auc_score(data["y_test"], y_test_proba[:, 1])
        else:
            test_roc = roc_auc_score(data["y_test"], y_test_proba, multi_class='ovr')
    except Exception:
        test_roc = None
        
    cm = confusion_matrix(data["y_test"], y_test_pred).tolist()
    
    best_metrics = {
        "accuracy": float(np.round(test_acc, 4)),
        "precision": float(np.round(test_prec, 4)),
        "recall": float(np.round(test_rec, 4)),
        "f1_score": float(np.round(test_f1, 4)),
        "roc_auc": float(np.round(test_roc, 4)) if test_roc is not None else None,
        "confusion_matrix": cm,
        "candidate_comparison_f1": candidate_scores,
        "selected_algorithm": best_name
    }
    
    return {
        "domain": domain_key,
        "pipeline": best_pipeline,
        "metrics": best_metrics,
        "config": cfg,
        "test_samples": len(data["y_test"])
    }

def train_and_evaluate_regression(domain_key: str, dataset_path: str) -> Dict[str, Any]:
    cfg = ML_CONFIGS[domain_key]
    df = pd.read_csv(dataset_path)
    
    data = prepare_data_split(
        df, 
        feature_cols=cfg["features"], 
        target_col=cfg["target"],
        is_classification=False
    )
    
    candidates = {
        "RandomForestRegressor": RandomForestRegressor(n_estimators=120, max_depth=7, random_state=42),
        "GradientBoostingRegressor": GradientBoostingRegressor(n_estimators=100, learning_rate=0.06, max_depth=4, random_state=42),
        "ExtraTreesRegressor": ExtraTreesRegressor(n_estimators=120, max_depth=7, random_state=42),
        "RidgeRegressor": Ridge(alpha=1.0, random_state=42)
    }
    
    best_name = None
    best_pipeline = None
    best_mae = float('inf')
    candidate_scores = {}
    
    for name, estimator in candidates.items():
        pipe = Pipeline([
            ('preprocessor', get_preprocessing_pipeline(domain_key)),
            ('regressor', estimator)
        ])
        
        pipe.fit(data["X_train"], data["y_train"])
        y_val_pred = pipe.predict(data["X_val"])
        val_mae = mean_absolute_error(data["y_val"], y_val_pred)
        candidate_scores[name] = float(np.round(val_mae, 4))
        
        if val_mae < best_mae:
            best_mae = val_mae
            best_name = name
            best_pipeline = pipe
            
    # Test evaluation
    y_test_pred = best_pipeline.predict(data["X_test"])
    test_mae = mean_absolute_error(data["y_test"], y_test_pred)
    test_mse = mean_squared_error(data["y_test"], y_test_pred)
    test_rmse = np.sqrt(test_mse)
    test_r2 = r2_score(data["y_test"], y_test_pred)
    
    best_metrics = {
        "mae": float(np.round(test_mae, 4)),
        "rmse": float(np.round(test_rmse, 4)),
        "r2_score": float(np.round(test_r2, 4)),
        "candidate_comparison_mae": candidate_scores,
        "selected_algorithm": best_name
    }
    
    return {
        "domain": domain_key,
        "pipeline": best_pipeline,
        "metrics": best_metrics,
        "config": cfg,
        "test_samples": len(data["y_test"])
    }

def train_all() -> Dict[str, Any]:
    print("[AstraCare ML] Initiating Master Training Pipeline...")
    # Ensure datasets exist
    generate_all_datasets()
    
    models_dir = "ml/models"
    registry_dir = "ml/registry"
    os.makedirs(models_dir, exist_ok=True)
    os.makedirs(registry_dir, exist_ok=True)
    
    dataset_paths = {
        "pcos_risk": "ml/datasets/pcos_benchmark.csv",
        "cycle_length": "ml/datasets/cycle_benchmark.csv",
        "anemia_risk": "ml/datasets/anemia_benchmark.csv",
        "diabetes_risk": "ml/datasets/diabetes_benchmark.csv",
        "thyroid_risk": "ml/datasets/thyroid_benchmark.csv"
    }
    
    registry = {
        "system": "ASTRACARE AI Model Registry",
        "last_updated": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "total_active_models": len(dataset_paths),
        "models": {}
    }
    
    results = {}
    
    for domain_key, dataset_path in dataset_paths.items():
        print(f"\n--- Training Domain: {domain_key.upper()} ---")
        cfg = ML_CONFIGS[domain_key]
        if cfg["type"] == "classification":
            res = train_and_evaluate_classification(domain_key, dataset_path)
        else:
            res = train_and_evaluate_regression(domain_key, dataset_path)
            
        results[domain_key] = res
        
        # Save model artifact
        model_filename = f"{cfg['model_id']}.joblib"
        model_filepath = os.path.join(models_dir, model_filename)
        joblib.dump(res["pipeline"], model_filepath)
        print(f" [OK] Model artifact saved to: {model_filepath}")
        print(f" [OK] Metrics: {res['metrics']}")

        
        # Register model metadata
        registry["models"][domain_key] = {
            "model_id": cfg["model_id"],
            "model_name": cfg["name"],
            "version": cfg["version"],
            "status": "ACTIVE",
            "type": cfg["type"],
            "features": cfg["features"],
            "target": cfg["target"],
            "labels": cfg.get("labels", []),
            "algorithm": res["metrics"]["selected_algorithm"],
            "training_dataset": cfg["dataset_name"],
            "provenance": cfg["provenance"],
            "license": cfg["license"],
            "metrics": res["metrics"],
            "artifact_path": model_filepath,
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
            "limitations": cfg["limitations"],
            "data_safety_disclaimer": "Informational health intelligence indicator only. Not a medical diagnostic device."
        }
        
    registry_filepath = os.path.join(registry_dir, "model_registry.json")
    with open(registry_filepath, "w", encoding="utf-8") as f:
        json.dump(registry, f, indent=2)
        
    print(f"\n[AstraCare ML] Complete Model Registry updated at {registry_filepath}")
    return registry

if __name__ == "__main__":
    train_all()
