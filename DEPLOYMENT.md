# ASTRACARE AI: Deployment Guide

## 1. Frontend & API Deployment (Vercel)
1. Link GitHub repository to Vercel.
2. Set Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `AI_PROVIDER_API_KEY`).
3. Deploy branch `main`.

## 2. Supabase Backend Setup
1. Create a Supabase Project.
2. Execute migration scripts in `supabase/migrations/` in order:
   - `001_initial_schema.sql`
   - `002_rls_policies.sql`
   - `003_phone_verifications.sql`
   - `004_m2_womens_health.sql`
   - `005_m1_otp_verifications.sql`
   - `005_m5_hydration_and_analytics.sql`
   - `006_m4_chat_assistant.sql`
   - `007_complete_astracare_schema.sql`

## 3. Python ML Inference Service (Container / Local)
Ensure Python 3.10+ is available with `scikit-learn`, `joblib`, `pandas`, and `numpy` installed.
Execute `python ml/training/train_all_models.py` during deployment to generate fresh model artifacts into `ml/models/`.
