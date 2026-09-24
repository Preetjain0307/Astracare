# ASTRACARE AI: Medical Disclaimers & Known System Limitations

## 1. Non-Diagnostic Medical Scope
AstraCare AI is designed strictly as an educational and predictive decision-support system. It is **NOT** a certified medical diagnostic device (FDA/CE Class IIa/IIb) and does **NOT** provide definitive medical diagnoses, replace clinical consultations, or prescribe medications.

## 2. Machine Learning Algorithmic Limitations
- **Screening Indicators**: The models (PCOS, Anemia, Diabetes, Thyroid) compute probabilistic risk indices based on clinical symptom questionnaires and anthropometric surrogates.
- **Definitive Tests Required**:
  - PCOS: Requires pelvic ultrasonography (Rotterdam criteria) and serum hormone tests (LH, FSH, DHEA-S).
  - Anemia: Requires Complete Blood Count (CBC) and serum ferritin testing.
  - Diabetes: Requires laboratory fasting plasma glucose, HbA1c, or Oral Glucose Tolerance Test (OGTT).
  - Thyroid: Requires serum TSH, Free T3, and Free T4 thyroid panels.

## 3. Hardware & Browser Integration Boundaries
- Web Bluetooth (Web-BLE) telemetry is simulated in desktop browsers where native Bluetooth pairing requires specialized platform permissions or native mobile gateways.
- Emergency SOS broadcast triggers simulated emergency telemetry and notifies registered in-app contacts. In acute life-threatening emergencies, patients must directly dial local emergency medical services (e.g. 911 / 112).
