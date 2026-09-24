# ASTRACARE AI: Security Architecture & HIPAA Compliance Principles

## 1. Authentication & Role-Based Access Control (RBAC)
- **Supabase Auth**: JWT-backed sessions with secure HTTP-only cookies.
- **Roles**: Distinct role partitioning for `patient`, `doctor`, and `admin`.
- **Row Level Security (RLS)**: PostgreSQL enforces zero cross-tenant visibility. Patients can only query rows where `auth.uid() = user_id`.

## 2. Cryptographic Doctor Consent Architecture
- Doctor access to patient longitudinal records is bounded by `doctor_patient_relationships` with explicit expiration timestamps.
- Patients can revoke consent at any moment from the Health Reports interface.

## 3. Secret Management & Non-Exposure
- `SUPABASE_SERVICE_ROLE_KEY`, AI provider keys, and SMTP credentials are never bundled into client-side JS bundles.
- All ML inference runs in controlled backend server actions and Next.js App Router API routes.
