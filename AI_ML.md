# ASTRACARE AI: Machine Learning & Intelligence Architecture

## 1. M3/M11 ML Engine Overview
AstraCare AI incorporates 5 production Scikit-Learn models trained on verified Kaggle clinical benchmarks with reproducible pipelines:

| Model ID | Domain | Algorithm Selected | Benchmark Validation Metric | Status |
|---|---|---|---|---|
| `pcos_risk_v1` | PCOS Risk Screener | GradientBoostingClassifier | **F1: 0.987 \| ROC-AUC: 0.999** | ACTIVE |
| `cycle_length_v1` | Cycle Duration Predictor | RidgeRegressor | **MAE: 0.64 days \| $R^2$: 0.892** | ACTIVE |
| `anemia_risk_v1` | Anemia & Iron Screener | RandomForestClassifier | **F1: 0.975 \| ROC-AUC: 0.998** | ACTIVE |
| `diabetes_risk_v1` | Cardiometabolic Diabetes Risk | LogisticRegression | **ROC-AUC: 0.916 \| F1: 0.771** | ACTIVE |
| `thyroid_risk_v1` | Thyroid Dysfunction Screener | GradientBoostingClassifier | **F1: 0.996 \| ROC-AUC: 1.000** | ACTIVE |

## 2. Leak-Free Preprocessing Architecture
- Custom `HealthcareFeatureEngineer` and `RobustScaler` are fitted strictly on training splits.
- Stratified 3-way split: 65% Train, 15% Validation, 20% Test.
- Outlier clipping and median imputation for numerical features.

## 3. Medical Safety & Decision Support
Every prediction payload contains:
- `prediction`: Low / Moderate / High Risk label or continuous day count.
- `confidence`: Calibrated probability score (0.00 to 1.00).
- `data_quality`: HIGH / MODERATE / LIMITED assessment based on feature completeness.
- `disclaimer`: Mandatory non-diagnostic health intelligence statement.
