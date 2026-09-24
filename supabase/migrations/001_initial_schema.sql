-- ============================================================
-- AstraCare AI — Initial Database Schema
-- Run in Supabase SQL Editor or via Supabase CLI migrations
-- ============================================================

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: profiles
-- Extended user profile linked to auth.users
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name   TEXT,
  last_name    TEXT,
  date_of_birth DATE,
  phone        TEXT,
  avatar_url   TEXT,
  height_cm    NUMERIC(5, 1),
  weight_kg    NUMERIC(5, 1),
  blood_group  TEXT,
  location     TEXT,
  emergency_contact_name  TEXT,
  emergency_contact_phone TEXT,
  role         TEXT NOT NULL DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin')),
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- TABLE: health_questionnaire
-- Tracks user progress through the 8-step onboarding
-- ============================================================
CREATE TABLE IF NOT EXISTS public.health_questionnaire (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  current_step INTEGER NOT NULL DEFAULT 1 CHECK (current_step BETWEEN 1 AND 8),
  completed    BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- TABLE: reproductive_health
-- Step 2 — Women's Health questionnaire data
-- ============================================================
CREATE TABLE IF NOT EXISTS public.reproductive_health (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  life_stage            TEXT,
  menstrual_status      TEXT,
  cycle_regularity      TEXT,
  avg_cycle_length      INTEGER,
  avg_period_duration   INTEGER,
  last_menstrual_period DATE,
  menstrual_symptoms    TEXT[],
  pain_level            INTEGER CHECK (pain_level BETWEEN 0 AND 10),
  pms_symptoms          TEXT[],
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- TABLE: menstrual_history
-- Step 3 — Menstrual history data
-- ============================================================
CREATE TABLE IF NOT EXISTS public.menstrual_history (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  last_period_date     DATE,
  avg_cycle_length     INTEGER,
  avg_period_duration  INTEGER,
  cycle_regularity     TEXT,
  symptoms             TEXT[],
  pain_level           INTEGER CHECK (pain_level BETWEEN 0 AND 10),
  spotting             BOOLEAN,
  prev_irregularity    TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- TABLE: pregnancy_fertility
-- Step 4 — Pregnancy & Fertility data
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pregnancy_fertility (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  currently_pregnant  TEXT CHECK (currently_pregnant IN ('yes', 'no', 'prefer_not_to_say')),
  due_date            DATE,
  pregnancy_history   TEXT,
  num_pregnancies     INTEGER CHECK (num_pregnancies >= 0),
  num_live_births     INTEGER CHECK (num_live_births >= 0),
  fertility_tracking  BOOLEAN,
  pregnancy_planning  TEXT,
  contraception       TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- TABLE: medical_history
-- Step 5 — Medical history data
-- ============================================================
CREATE TABLE IF NOT EXISTS public.medical_history (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conditions       TEXT[],
  allergies        TEXT[],
  medications      TEXT[],
  surgeries        TEXT[],
  diagnoses        TEXT[],
  family_history   TEXT[],
  other_conditions TEXT,
  other_allergies  TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- TABLE: lifestyle_information
-- Step 6 — Lifestyle data
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lifestyle_information (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sleep_duration       NUMERIC(3,1),
  sleep_quality        TEXT,
  activity_level       TEXT,
  water_intake         NUMERIC(3,1),
  dietary_preference   TEXT,
  smoking_status       TEXT,
  alcohol_consumption  TEXT,
  stress_level         INTEGER CHECK (stress_level BETWEEN 0 AND 10),
  occupation           TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- TABLE: wellness_information
-- Step 7 — Mental wellness data
-- ============================================================
CREATE TABLE IF NOT EXISTS public.wellness_information (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stress_level     INTEGER CHECK (stress_level BETWEEN 0 AND 10),
  mood             TEXT,
  sleep_quality    TEXT,
  general_wellness TEXT,
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_health_questionnaire_user_id ON public.health_questionnaire(user_id);
CREATE INDEX IF NOT EXISTS idx_reproductive_health_user_id ON public.reproductive_health(user_id);
CREATE INDEX IF NOT EXISTS idx_menstrual_history_user_id ON public.menstrual_history(user_id);
CREATE INDEX IF NOT EXISTS idx_pregnancy_fertility_user_id ON public.pregnancy_fertility(user_id);
CREATE INDEX IF NOT EXISTS idx_medical_history_user_id ON public.medical_history(user_id);
CREATE INDEX IF NOT EXISTS idx_lifestyle_information_user_id ON public.lifestyle_information(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_information_user_id ON public.wellness_information(user_id);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'profiles', 'health_questionnaire', 'reproductive_health',
    'menstrual_history', 'pregnancy_fertility', 'medical_history',
    'lifestyle_information', 'wellness_information'
  ]
  LOOP
    EXECUTE FORMAT(
      'DROP TRIGGER IF EXISTS trigger_updated_at ON public.%I;
       CREATE TRIGGER trigger_updated_at
       BEFORE UPDATE ON public.%I
       FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();',
      t, t
    );
  END LOOP;
END;
$$;

-- ============================================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  full_name TEXT;
  f_name TEXT;
  l_name TEXT;
BEGIN
  full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '');
  
  IF full_name <> '' THEN
    f_name := split_part(full_name, ' ', 1);
    l_name := substring(full_name from length(f_name) + 2);
  ELSE
    f_name := NULL;
    l_name := NULL;
  END IF;

  INSERT INTO public.profiles (
    user_id,
    first_name,
    last_name,
    phone,
    avatar_url,
    role,
    onboarding_completed
  )
  VALUES (
    NEW.id,
    f_name,
    NULLIF(l_name, ''),
    NEW.phone,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture'),
    'patient',
    FALSE
  )
  ON CONFLICT (user_id) DO UPDATE SET
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
    first_name = COALESCE(public.profiles.first_name, EXCLUDED.first_name),
    last_name = COALESCE(public.profiles.last_name, EXCLUDED.last_name),
    avatar_url = COALESCE(public.profiles.avatar_url, EXCLUDED.avatar_url);

  INSERT INTO public.health_questionnaire (user_id, current_step, completed)
  VALUES (NEW.id, 1, FALSE)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
