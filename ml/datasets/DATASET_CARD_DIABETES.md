# Dataset Card: Diabetes & Cardiometabolic Risk

## 1. Overview
- **Dataset Name**: Pima & NHANES Female Cardiometabolic Dataset
- **Canonical Kaggle Source**: `uciml/pima-indians-diabetes-database`
- **Domain**: Endocrinology & Preventive Women's Health
- **Primary Objective**: Cardiometabolic and gestational/type 2 diabetes risk classification.

## 2. Features & Target
| Feature | Type | Description |
|---|---|---|
| `age` | Integer | Patient age |
| `pregnancies_count` | Integer | Total number of pregnancies |
| `bmi` | Float | Body Mass Index ($kg/m^2$) |
| `glucose_fasting_mgdl` | Float | Fasting plasma glucose concentration ($mg/dL$) |
| `blood_pressure_diastolic`| Float | Diastolic blood pressure ($mm Hg$) |
| `skin_thickness_mm` | Float | Triceps skin fold thickness ($mm$) |
| `insulin_micro_u_ml` | Float | 2-Hour serum insulin ($\mu U/mL$) |
| `diabetes_pedigree_function`| Float | Diabetes family genetic pedigree function score |
| `daily_physical_activity_min`| Float | Daily moderate-to-vigorous activity minutes |
| **`diabetes_risk_level`** | **Target** | **0: Low Risk, 1: Moderate Risk, 2: High Risk** |

## 3. Provenance & License
- **Source**: National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK).
- **License**: CC BY-SA 4.0.
- **Clinical Limitation**: Algorithmic risk estimation. Confirmation requires oral glucose tolerance test (OGTT) or laboratory glycated hemoglobin (HbA1c).
