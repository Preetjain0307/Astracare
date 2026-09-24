# ASTRACARE AI: API Reference & Service Endpoints

## 1. Machine Learning & Predictive Risk Endpoints
- **`POST /api/ml/predict`**
  - **Description**: Evaluates input parameters against selected ML model pipeline.
  - **Payload**:
    ```json
    {
      "domain": "pcos_risk",
      "features": {
        "age": 26,
        "bmi": 24.5,
        "cycle_length_days": 34,
        "cycle_regularity": 1,
        "hair_growth_hirsutism": 1
      }
    }
    ```
  - **Response**: Returns `prediction`, `confidence`, `data_quality`, `model_id`, `model_version`, and `disclaimer`.

## 2. Authentication & Onboarding
- **`POST /api/auth/register`**: Registers new patient or clinician with hashed credentials.
- **`POST /api/auth/login`**: Authenticates user and issues secure session token.
- **`POST /api/auth/email/request-otp` & `verify-otp`**: Email OTP validation.
- **`POST /api/auth/phone/send-otp` & `verify-otp`**: Mobile SMS OTP verification.

## 3. Telemetry & Analytics
- **`GET /api/dashboard/summary`**: Computes overall daily health score (0-100) and sub-indices.
- **`GET /api/dashboard/analytics`**: Returns time-series trends for sleep, HRV, and hydration.
- **`POST /api/ai/chat`**: Conversational AI query endpoint with context injection and safety guardrails.
