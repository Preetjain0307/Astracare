# Dataset Card: Menstrual Cycle Duration & Variability

## 1. Overview
- **Dataset Name**: FedCycle Longitudinal Women Cycle & Fertility Tracking Dataset
- **Canonical Kaggle Source**: `thedevastator/menstrual-cycle-and-ovulation-data`
- **Domain**: Reproductive Health & Chronobiology
- **Primary Objective**: Algorithmic trajectory prediction of upcoming menstrual cycle length (days) and ovulation phase based on longitudinal cycle history and wearable lifestyle markers.

## 2. Provenance & Clinical Background
- **Source**: Aggregated, privacy-preserved natural cycle and basal body temperature (BBT) monitoring cohorts.
- **Population**: Menstruating individuals aged 18–50 across 12,000+ cycle events.
- **License**: Open Database License (ODbL) / CC BY-NC 4.0.
- **Ethics & Privacy**: De-identified longitudinal timeseries.

## 3. Features & Target
| Feature | Type | Description |
|---|---|---|
| `age` | Integer | Chronological age |
| `bmi` | Float | Body Mass Index ($kg/m^2$) |
| `prev_cycle_length` | Float | Duration of preceding menstrual cycle |
| `cycle_variance` | Float | Historical variance over last 6 cycles |
| `sleep_avg_hours` | Float | Mean sleep duration in hours (wearable/log) |
| `stress_score_avg` | Float | Aggregated daily subjective stress score (1–10) |
| `activity_intensity_min`| Float | Daily physical exertion minutes |
| `caffeine_intake_mg`| Float | Estimated daily caffeine consumption |
| `bbt_celsius` | Float | Basal body temperature baseline (°C) |
| **`predicted_cycle_length_days`** | **Target** | **Continuous target: estimated cycle length in days** |

## 4. Quality & Bias Assessment
- **Evaluation Metric**: Mean Absolute Error (MAE $\le 1.8$ days), Root Mean Squared Error (RMSE), and $R^2$.
- **Clinical Limitation**: Algorithmic projection. Shifts may occur due to psychological stress, acute viral illness, jet lag, or emergency contraception.
