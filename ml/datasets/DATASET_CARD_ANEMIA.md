# Dataset Card: Anemia & Iron Deficiency Screener

## 1. Overview
- **Dataset Name**: Anemia, Hemoglobin & Female Symptom Classification Cohort
- **Canonical Kaggle Source**: `biswaranjanrao/anemia-dataset`
- **Domain**: Hematology & Nutritional Women's Health
- **Primary Objective**: Multi-symptom risk stratification of iron deficiency and microcytic anemia in women of reproductive age.

## 2. Features & Target
| Feature | Type | Description |
|---|---|---|
| `age` | Integer | Patient age |
| `period_flow_intensity`| Categorical | Menstrual blood loss intensity (0: Light, 1: Moderate, 2: Heavy, 3: Very Heavy) |
| `fatigue_frequency` | Categorical | Chronic tiredness score (0: Rarely, 1: Sometimes, 2: Often, 3: Constant) |
| `dizziness_frequency` | Categorical | Postural lightheadedness frequency (0–3) |
| `pale_skin_flag` | Binary | Conjunctival/skin pallor observation (0: No, 1: Yes) |
| `cold_hands_feet_flag` | Binary | Peripheral vasospasm / cold extremities (0: No, 1: Yes) |
| `diet_type_code` | Categorical | 0: Vegan, 1: Vegetarian, 2: Omnivore |
| `shortness_of_breath_flag`| Binary | Dyspnea on moderate exertion (0: No, 1: Yes) |
| `estimated_hemoglobin_gl` | Float | Estimated baseline surrogate ($g/dL$) |
| **`anemia_risk_level`** | **Target** | **0: Normal, 1: Mild Risk, 2: Moderate/Severe Risk** |

## 3. Provenance & License
- **License**: Creative Commons CC0 (Public Domain).
- **Clinical Limitation**: Screening indicator. Definitive clinical evaluation requires laboratory Complete Blood Count (CBC), Serum Ferritin, and Total Iron Binding Capacity (TIBC).
