# ASTRACARE AI: Database Architecture & Schema

## 1. Relational Database Design
AstraCare AI utilizes a PostgreSQL 15 database managed on Supabase with strict Row Level Security (RLS) policies, normalized schemas, and role-based permissions.

## 2. Core Tables
- `profiles`: Core user demographic & physical information.
- `user_roles`: Role assignment (`patient`, `doctor`, `admin`).
- `security_audit_logs`: Audit trail for HIPAA-style access logging.
- `menstrual_cycles` & `period_logs`: Longitudinal cycle dates, durations, and symptoms.
- `pregnancy_profiles`, `postpartum_profiles`, `menopause_profiles`: Life stage records.
- `nutrition_logs`, `fitness_logs`, `sleep_logs`, `mental_wellness_logs`: Lifestyle metrics.
- `wearable_devices` & `device_metrics`: AstraBand Gen 2 hardware telemetry.
- `ml_model_registry`: Production model metadata, versioning, and validation metrics.
- `ml_risk_assessments`: Audit log of user risk predictions.
- `digital_health_twin`: Multi-system computational twin states.
- `doctor_profiles`, `doctor_patient_relationships`, `doctor_clinical_notes`: Consented doctor workflows.
- `emergency_contacts` & `emergency_sos_events`: Acute escalation records.

## 3. Row Level Security (RLS) Policy Model
1. **Patient Access**: Users can query, insert, and update only their own rows (`auth.uid() = user_id`).
2. **Doctor Access**: Doctors can access patient telemetry only if an active, non-expired consent record exists in `doctor_patient_relationships`.
3. **Admin Access**: Administrative metadata is strictly isolated from patient clinical health records.
