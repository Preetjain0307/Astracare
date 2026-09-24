-- ============================================================
-- ASTRACARE AI: COMPREHENSIVE PRODUCTION DATABASE SCHEMA
-- Modules M1 through M18
-- ============================================================

-- 1. Roles & Security Enum Types
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('patient', 'doctor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE risk_level_type AS ENUM ('low', 'moderate', 'high', 'critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE device_sync_status AS ENUM ('unpaired', 'pairing', 'connected', 'disconnected', 'syncing', 'error');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. User Roles & Security Audit
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role_type NOT NULL DEFAULT 'patient',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, role)
);

CREATE TABLE IF NOT EXISTS public.security_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action_type TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT,
    ip_address TEXT,
    user_agent TEXT,
    status TEXT NOT NULL DEFAULT 'success',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Life Stage Profiles (Pregnancy, Postpartum, Menopause)
CREATE TABLE IF NOT EXISTS public.pregnancy_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    conception_date DATE,
    expected_due_date DATE NOT NULL,
    current_gestational_week INT DEFAULT 1,
    trimester INT DEFAULT 1,
    high_risk_flag BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.postpartum_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    delivery_date DATE NOT NULL,
    delivery_type TEXT DEFAULT 'vaginal',
    recovery_status TEXT DEFAULT 'normal',
    mood_score INT DEFAULT 7,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.menopause_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stage TEXT NOT NULL DEFAULT 'perimenopause', -- perimenopause, menopause, postmenopause
    hot_flashes_freq_daily INT DEFAULT 0,
    night_sweats_flag BOOLEAN DEFAULT FALSE,
    sleep_disturbance_level INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Nutrition, Fitness, Sleep, Wellness Logs
CREATE TABLE IF NOT EXISTS public.nutrition_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    meal_type TEXT NOT NULL, -- breakfast, lunch, dinner, snack
    food_name TEXT NOT NULL,
    calories INT DEFAULT 0,
    protein_g NUMERIC(6,2) DEFAULT 0,
    carbs_g NUMERIC(6,2) DEFAULT 0,
    fat_g NUMERIC(6,2) DEFAULT 0,
    micronutrients JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.fitness_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    activity_type TEXT NOT NULL, -- walking, running, yoga, strength, cycling
    duration_minutes INT NOT NULL DEFAULT 0,
    calories_burned INT DEFAULT 0,
    steps INT DEFAULT 0,
    avg_heart_rate INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sleep_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    sleep_duration_hours NUMERIC(4,2) NOT NULL DEFAULT 7.5,
    sleep_quality_score INT DEFAULT 80,
    deep_sleep_hours NUMERIC(4,2),
    rem_sleep_hours NUMERIC(4,2),
    light_sleep_hours NUMERIC(4,2),
    wakeups_count INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.mental_wellness_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL DEFAULT CURRENT_DATE,
    mood_emoji TEXT DEFAULT '😊',
    mood_score INT DEFAULT 8,
    stress_level INT DEFAULT 3, -- 1 to 10
    anxiety_score INT DEFAULT 2,
    energy_level INT DEFAULT 7,
    journal_entry TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Wearables & AstraBand Integration
CREATE TABLE IF NOT EXISTS public.wearable_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_name TEXT NOT NULL DEFAULT 'AstraBand Pulse Gen 2',
    mac_address TEXT,
    serial_number TEXT,
    connection_status device_sync_status NOT NULL DEFAULT 'disconnected',
    battery_level INT DEFAULT 100,
    firmware_version TEXT DEFAULT 'v2.4.1',
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.device_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    device_id UUID REFERENCES public.wearable_devices(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    heart_rate INT,
    hrv_ms NUMERIC(6,2),
    spo2_pct NUMERIC(4,1),
    skin_temp_celsius NUMERIC(4,2),
    steps INT DEFAULT 0,
    raw_ecg JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. ML Model Registry & Risk Predictions
CREATE TABLE IF NOT EXISTS public.ml_model_registry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id TEXT UNIQUE NOT NULL,
    model_name TEXT NOT NULL,
    version TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE', -- EXPERIMENTAL, VALIDATION, ACTIVE, RETIRED
    domain TEXT NOT NULL,
    algorithm TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    metrics JSONB NOT NULL DEFAULT '{}'::jsonb,
    dataset_name TEXT,
    license TEXT,
    provenance TEXT,
    artifact_uri TEXT,
    limitations TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ml_risk_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    domain TEXT NOT NULL, -- pcos, cycle, anemia, diabetes, thyroid
    model_id TEXT NOT NULL,
    model_version TEXT NOT NULL,
    risk_level TEXT NOT NULL, -- Low, Moderate, High, Normal, etc.
    confidence_score NUMERIC(4,3) NOT NULL DEFAULT 0.85,
    probability_distribution JSONB DEFAULT '{}'::jsonb,
    input_features JSONB NOT NULL DEFAULT '{}'::jsonb,
    data_quality TEXT DEFAULT 'HIGH',
    clinical_recommendation TEXT,
    disclaimer TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Digital Health Twin
CREATE TABLE IF NOT EXISTS public.digital_health_twin (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    overall_vitality_score INT DEFAULT 85,
    biological_age_delta NUMERIC(3,1) DEFAULT -1.5,
    metabolic_health_index INT DEFAULT 88,
    hormonal_stability_index INT DEFAULT 82,
    circadian_alignment_index INT DEFAULT 90,
    stress_resilience_index INT DEFAULT 78,
    system_states JSONB NOT NULL DEFAULT '{}'::jsonb,
    projected_risks JSONB NOT NULL DEFAULT '[]'::jsonb,
    last_computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Doctor Console & Patient Consent Sharing
CREATE TABLE IF NOT EXISTS public.doctor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    license_number TEXT NOT NULL,
    specialization TEXT NOT NULL DEFAULT 'Obstetrics & Gynecology',
    hospital_affiliation TEXT,
    verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.doctor_patient_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctor_profiles(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'active', -- pending, active, revoked, expired
    consent_granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    consent_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '90 days'),
    access_scope JSONB DEFAULT '["vitals", "cycle", "reports", "insights", "risks"]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(doctor_id, patient_id)
);

CREATE TABLE IF NOT EXISTS public.doctor_clinical_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES public.doctor_profiles(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    note_type TEXT DEFAULT 'Consultation',
    clinical_observations TEXT NOT NULL,
    recommendations TEXT,
    prescription_suggestions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Emergency Contacts & SOS Events
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    contact_name TEXT NOT NULL,
    relationship TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.emergency_sos_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    trigger_type TEXT NOT NULL DEFAULT 'manual_button', -- manual_button, anomalous_fall, critical_vitals
    latitude NUMERIC(10,7),
    longitude NUMERIC(10,7),
    contacts_notified JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'acknowledged',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Enable Row Level Security (RLS) on all created tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pregnancy_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.postpartum_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menopause_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mental_wellness_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wearable_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_model_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ml_risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_health_twin ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_patient_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_clinical_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_sos_events ENABLE ROW LEVEL SECURITY;

-- 11. Core RLS Policies
-- Users can access own records
CREATE POLICY "Users access own roles" ON public.user_roles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own audit logs" ON public.security_audit_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users access own pregnancy profile" ON public.pregnancy_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own postpartum profile" ON public.postpartum_profiles FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own menopause profile" ON public.menopause_profiles FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own nutrition" ON public.nutrition_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own fitness" ON public.fitness_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own sleep" ON public.sleep_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own wellness" ON public.mental_wellness_logs FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own wearable devices" ON public.wearable_devices FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own device metrics" ON public.device_metrics FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public read model registry" ON public.ml_model_registry FOR SELECT USING (true);
CREATE POLICY "Users access own risk assessments" ON public.ml_risk_assessments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own digital twin" ON public.digital_health_twin FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users access own emergency contacts" ON public.emergency_contacts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users access own SOS events" ON public.emergency_sos_events FOR ALL USING (auth.uid() = user_id);

-- Doctors access consented patient data
CREATE POLICY "Doctors access consented patient digital twin" ON public.digital_health_twin FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.doctor_patient_relationships dpr
        JOIN public.doctor_profiles dp ON dp.id = dpr.doctor_id
        WHERE dp.user_id = auth.uid() 
          AND dpr.patient_id = digital_health_twin.user_id 
          AND dpr.status = 'active'
          AND dpr.consent_expires_at > NOW()
    )
);

CREATE POLICY "Doctors access clinical notes" ON public.doctor_clinical_notes FOR ALL USING (
    doctor_id IN (SELECT id FROM public.doctor_profiles WHERE user_id = auth.uid())
);
