"""
ASTRACARE AI - Machine Learning Configuration & Schemas
Domain Schemas for 5 Key Healthcare Areas:
1. PCOS Risk Assessment (Classification: Low/Moderate/High)
2. Menstrual Cycle Length Prediction (Regression & Irregularity Classification)
3. Anemia / Iron Deficiency Risk (Classification: Normal/Mild/Moderate/Severe)
4. Diabetes Risk Assessment (Classification: Low/Moderate/High)
5. Thyroid Disorder Risk (Classification: Normal/Hypothyroid/Hyperthyroid)
"""

from typing import Dict, Any, List

# Standard ML Configs
ML_CONFIGS: Dict[str, Dict[str, Any]] = {
    "pcos_risk": {
        "model_id": "pcos_risk_v1",
        "name": "PCOS Hormonal Risk Classifier",
        "type": "classification",
        "version": "1.0.0",
        "features": [
            "age", "bmi", "cycle_length_days", "cycle_regularity", 
            "weight_gain_sudden", "hair_growth_hirsutism", "skin_darkening", 
            "hair_thinning", "pimples_acne", "fast_food_freq", "exercise_regularity"
        ],
        "target": "pcos_risk_level",
        "labels": ["Low Risk", "Moderate Risk", "High Risk"],
        "metric_target": "roc_auc",
        "min_acceptable_f1": 0.78,
        "dataset_name": "PCOS Diagnostic and Clinical Dataset",
        "license": "CC BY 4.0 / Public Clinical Research Archive",
        "provenance": "Kaggle Clinical Cohort (Kottayam Medical Study & Synthetic Validated Augmentations)",
        "limitations": "Screening risk indicator only. Not a medical ultrasound or biochemical diagnosis."
    },
    "cycle_length": {
        "model_id": "cycle_length_v1",
        "name": "Menstrual Cycle Duration & Phase Predictor",
        "type": "regression",
        "version": "1.0.0",
        "features": [
            "age", "bmi", "prev_cycle_length", "cycle_variance", 
            "sleep_avg_hours", "stress_score_avg", "activity_intensity_min", 
            "caffeine_intake_mg", "bbt_celsius"
        ],
        "target": "predicted_cycle_length_days",
        "metric_target": "mae",
        "min_acceptable_mae": 1.8,
        "dataset_name": "FedCycle Longitudinal Women Cycle Dataset",
        "license": "Open Database License (ODbL)",
        "provenance": "Aggregated Anonymized Natural Cycle Tracking Data",
        "limitations": "Estimated statistical trajectory. Cycle may shift due to acute stress, illness, or travel."
    },
    "anemia_risk": {
        "model_id": "anemia_risk_v1",
        "name": "Anemia & Iron Deficiency Screener",
        "type": "classification",
        "version": "1.0.0",
        "features": [
            "age", "period_flow_intensity", "fatigue_frequency", 
            "dizziness_frequency", "pale_skin_flag", "cold_hands_feet_flag", 
            "diet_type_code", "shortness_of_breath_flag", "estimated_hemoglobin_gl"
        ],
        "target": "anemia_risk_level",
        "labels": ["Normal", "Mild Risk", "Moderate/Severe Risk"],
        "metric_target": "f1_macro",
        "min_acceptable_f1": 0.82,
        "dataset_name": "Complete Blood Count & Symptom Anemia Cohort",
        "license": "CC0: Public Domain",
        "provenance": "Clinical Hematology Benchmark & Symptom Profiles",
        "limitations": "Symptom & surrogate screener. Requires CBC laboratory test confirmation."
    },
    "diabetes_risk": {
        "model_id": "diabetes_risk_v1",
        "name": "Metabolic & Gestational Diabetes Risk Classifier",
        "type": "classification",
        "version": "1.0.0",
        "features": [
            "age", "bmi", "pregnancies_count", "glucose_fasting_mgdl", 
            "blood_pressure_diastolic", "skin_thickness_mm", "insulin_micro_u_ml", 
            "diabetes_pedigree_function", "daily_physical_activity_min"
        ],
        "target": "diabetes_risk_level",
        "labels": ["Low Risk", "Moderate Risk", "High Risk"],
        "metric_target": "roc_auc",
        "min_acceptable_f1": 0.80,
        "dataset_name": "Pima & NHANES Female Cardiometabolic Dataset",
        "license": "CC BY-SA 4.0 (UCI / Kaggle)",
        "provenance": "National Institute of Diabetes and Digestive and Kidney Diseases",
        "limitations": "Risk stratification tool. Formal diagnosis requires Oral Glucose Tolerance Test (OGTT) or HbA1c."
    },
    "thyroid_risk": {
        "model_id": "thyroid_risk_v1",
        "name": "Thyroid Dysfunction Screener (Hypo/Hyperthyroid)",
        "type": "classification",
        "version": "1.0.0",
        "features": [
            "age", "unexplained_weight_change_kg", "temperature_sensitivity", 
            "heart_rate_resting_bpm", "fatigue_level", "hair_loss_severity", 
            "cycle_flow_changes", "mood_anxiety_depression_score", "tsh_level_est"
        ],
        "target": "thyroid_risk_level",
        "labels": ["Euthyroid (Normal)", "Hypothyroid Risk", "Hyperthyroid Risk"],
        "metric_target": "f1_macro",
        "min_acceptable_f1": 0.80,
        "dataset_name": "Thyroid Disease Clinical Classification Dataset",
        "license": "Open Data Commons (UCI / Kaggle)",
        "provenance": "Garavan Institute & Synthetic Women Hormonal Benchmarks",
        "limitations": "Indicative only. Serum TSH, Free T3, and Free T4 tests are necessary for clinical confirmation."
    }
}
