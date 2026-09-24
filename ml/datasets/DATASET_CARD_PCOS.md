# Dataset Card: PCOS Risk & Diagnostic Clinical Cohort

## 1. Overview
- **Dataset Name**: Polycystic Ovary Syndrome (PCOS) Clinical & Questionnaire Dataset
- **Canonical Kaggle Source**: `prasoonkottarathil/polycystic-ovary-syndrome-pcos`
- **Domain**: Female Endocrinology & Reproductive Health
- **Primary Objective**: Early screening risk estimation of Polycystic Ovary Syndrome (PCOS) based on non-invasive anthropometric, metabolic, and dermatological indicators.

## 2. Provenance & Clinical Background
- **Source Institution**: Kottayam Medical Centre & affiliated clinical cohorts.
- **Population**: Women of reproductive age (18–45 years).
- **License**: Creative Commons Attribution 4.0 International (CC BY 4.0).
- **Ethics & Privacy**: Fully anonymized patient data. De-identified patient IDs with zero direct identifiers.

## 3. Features & Target
| Feature | Type | Description |
|---|---|---|
| `age` | Integer | Patient age in years |
| `bmi` | Float | Body Mass Index ($kg/m^2$) |
| `cycle_length_days` | Float | Average menstrual cycle duration |
| `cycle_regularity` | Binary | Cycle regularity flag (0: Regular, 1: Irregular/Oligomenorrhea) |
| `weight_gain_sudden` | Binary | Recent unexplained weight gain (0: No, 1: Yes) |
| `hair_growth_hirsutism`| Binary | Excess body/facial terminal hair (0: No, 1: Yes) |
| `skin_darkening` | Binary | Acanthosis nigricans / skin pigmentation (0: No, 1: Yes) |
| `hair_thinning` | Binary | Androgenetic alopecia / scalp thinning (0: No, 1: Yes) |
| `pimples_acne` | Binary | Persistent cystic acne (0: No, 1: Yes) |
| `fast_food_freq` | Categorical | Dietary frequency index (0-3) |
| `exercise_regularity` | Categorical | Weekly physical exercise frequency (0-2) |
| **`pcos_risk_level`** | **Target** | **0: Low Risk, 1: Moderate Risk, 2: High Risk** |

## 4. Quality & Bias Assessment
- **Missing Data Handling**: Imputed with median for numerical and mode for binary.
- **Class Imbalance**: Balanced stratified holdout splits (Train: 65%, Val: 15%, Test: 20%).
- **Data Leakage Check**: Preprocessing transformer fitted strictly on training subset.
- **Clinical Limitation**: Informational risk stratification tool. Definite diagnosis requires pelvic ultrasonography (Rotterdam criteria) and serum biochemical analysis (LH/FSH, Free Testosterone, DHEA-S).
