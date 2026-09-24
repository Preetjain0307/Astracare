# Dataset Card: Thyroid Dysfunction (Hypo/Hyperthyroid)

## 1. Overview
- **Dataset Name**: Thyroid Disease Clinical Classification Cohort
- **Canonical Kaggle Source**: `emmanuelfwerr/thyroid-disease-data`
- **Domain**: Endocrinology & Thyroid Health
- **Primary Objective**: Multi-class detection and risk stratification of euthyroid vs hypothyroid vs hyperthyroid functional states.

## 2. Features & Target
| Feature | Type | Description |
|---|---|---|
| `age` | Integer | Patient age |
| `unexplained_weight_change_kg`| Float | Weight delta in kg (+/-) over recent 3–6 months |
| `temperature_sensitivity` | Categorical | -1: Cold intolerance (Hypo tendency), 0: Normal, 1: Heat intolerance (Hyper tendency) |
| `heart_rate_resting_bpm` | Float | Resting heart rate from wearable or clinical measure ($bpm$) |
| `fatigue_level` | Categorical | Energy deficit severity (0–3) |
| `hair_loss_severity` | Categorical | Hair shedding/brittleness score (0–2) |
| `cycle_flow_changes` | Categorical | -1: Scanty/shortened flow, 0: Unchanged, 1: Menorrhagia/delayed flow |
| `mood_anxiety_depression_score`| Float | Affective mood disturbance index (1–10) |
| `tsh_level_est` | Float | Estimated/serum Thyroid Stimulating Hormone surrogate ($\mu IU/mL$) |
| **`thyroid_risk_level`** | **Target** | **0: Euthyroid (Normal), 1: Hypothyroid Risk, 2: Hyperthyroid Risk** |

## 3. Provenance & License
- **Source**: Garavan Institute & UCI Machine Learning Repository.
- **License**: CC BY 4.0.
- **Clinical Limitation**: Informational screener only. Formal clinical confirmation requires serum TSH, Free T3, and Free T4 thyroid panels.
