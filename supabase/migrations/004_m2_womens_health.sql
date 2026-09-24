-- ============================================================
-- AstraCare AI — M2 Women's Life Stage & Reproductive Health Schema
-- Migration 004
-- ============================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: health_goals
-- Stores selected user health goals (Step 1 of Onboarding)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.health_goals (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  selected_goals TEXT[] NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- TABLE: otp_verifications
-- Secure SHA-256 Hashed OTP verifications table
-- ============================================================
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  destination      TEXT NOT NULL,
  destination_type TEXT NOT NULL DEFAULT 'PHONE',
  purpose          TEXT NOT NULL DEFAULT 'PHONE_VERIFICATION',
  otp_hash         TEXT NOT NULL,
  attempts         INTEGER NOT NULL DEFAULT 0,
  expires_at       TIMESTAMPTZ NOT NULL,
  last_sent_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  consumed_at      TIMESTAMPTZ,
  verified_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_otp_verifications_dest ON public.otp_verifications(destination, purpose);

-- ============================================================
-- TABLE: ai_preferences
-- Stores AI feature preferences (Step 5 of Onboarding)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ai_preferences (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferences    TEXT[] NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- TABLE: smart_band_setup
-- Stores Smart Band pairing & permissions configuration
-- ============================================================
CREATE TABLE IF NOT EXISTS public.smart_band_setup (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owns_band      BOOLEAN NOT NULL DEFAULT FALSE,
  permissions    TEXT[] DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- TABLE: goal_specific_responses
-- Stores dynamic goal-based questionnaire answers
-- ============================================================
CREATE TABLE IF NOT EXISTS public.goal_specific_responses (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  responses      JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- TABLE: daily_checkins
-- Rapid 10-30s daily health check-in tracking
-- ============================================================
CREATE TABLE IF NOT EXISTS public.daily_checkins (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  checkin_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  feeling        TEXT,
  sleep_quality  TEXT,
  energy_level   TEXT,
  symptoms       TEXT[] DEFAULT '{}',
  activity_done  BOOLEAN,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, checkin_date)
);

-- ============================================================
-- TABLE: weekly_checkins
-- Weekly health reflection
-- ============================================================
CREATE TABLE IF NOT EXISTS public.weekly_checkins (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  overall_health     INTEGER CHECK (overall_health BETWEEN 1 AND 10),
  exercise_frequency TEXT,
  stress_level       INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  unusual_symptoms   BOOLEAN DEFAULT FALSE,
  notes              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: monthly_reviews
-- Monthly health review
-- ============================================================
CREATE TABLE IF NOT EXISTS public.monthly_reviews (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  review_month     TEXT NOT NULL, -- e.g. "2026-09"
  period_regular   TEXT, -- "yes", "no", "not_applicable"
  severe_symptoms  BOOLEAN DEFAULT FALSE,
  weight_change    TEXT, -- "increased", "decreased", "no_change"
  sleep_quality    TEXT,
  stress_level     INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, review_month)
);

-- ============================================================
-- ALTER EXISTING TABLES (Add missing fields for M2)
-- ============================================================

-- Profiles table extensions
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS age INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_year INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS height_unit TEXT DEFAULT 'metric';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS weight_unit TEXT DEFAULT 'metric';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS activity_level TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS smoking TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS alcohol TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS time_zone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS prefer_not_to_say_sensitive BOOLEAN DEFAULT FALSE;

-- Medical History table extensions
ALTER TABLE public.medical_history ADD COLUMN IF NOT EXISTS pcos_diagnosed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.medical_history ADD COLUMN IF NOT EXISTS endometriosis_diagnosed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.medical_history ADD COLUMN IF NOT EXISTS thyroid_diagnosed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.medical_history ADD COLUMN IF NOT EXISTS diabetes_diagnosed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.medical_history ADD COLUMN IF NOT EXISTS hypertension_diagnosed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.medical_history ADD COLUMN IF NOT EXISTS anemia_diagnosed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.medical_history ADD COLUMN IF NOT EXISTS anxiety_depression_diagnosed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.medical_history ADD COLUMN IF NOT EXISTS asthma_diagnosed BOOLEAN DEFAULT FALSE;

-- Health Questionnaire Step tracking extension
ALTER TABLE public.health_questionnaire ADD COLUMN IF NOT EXISTS completed_steps INTEGER[] DEFAULT '{}';
ALTER TABLE public.health_questionnaire ADD COLUMN IF NOT EXISTS draft_answers JSONB DEFAULT '{}'::jsonb;

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.health_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.smart_band_setup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_specific_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_reviews ENABLE ROW LEVEL SECURITY;

-- Health Goals Policies
DROP POLICY IF EXISTS "Users can view own health goals" ON public.health_goals;
CREATE POLICY "Users can view own health goals" ON public.health_goals FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own health goals" ON public.health_goals;
CREATE POLICY "Users can insert own health goals" ON public.health_goals FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own health goals" ON public.health_goals;
CREATE POLICY "Users can update own health goals" ON public.health_goals FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- AI Preferences Policies
DROP POLICY IF EXISTS "Users can view own ai preferences" ON public.ai_preferences;
CREATE POLICY "Users can view own ai preferences" ON public.ai_preferences FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own ai preferences" ON public.ai_preferences;
CREATE POLICY "Users can insert own ai preferences" ON public.ai_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own ai preferences" ON public.ai_preferences;
CREATE POLICY "Users can update own ai preferences" ON public.ai_preferences FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Smart Band Policies
DROP POLICY IF EXISTS "Users can view own smart band setup" ON public.smart_band_setup;
CREATE POLICY "Users can view own smart band setup" ON public.smart_band_setup FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own smart band setup" ON public.smart_band_setup;
CREATE POLICY "Users can insert own smart band setup" ON public.smart_band_setup FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own smart band setup" ON public.smart_band_setup;
CREATE POLICY "Users can update own smart band setup" ON public.smart_band_setup FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Goal Specific Responses Policies
DROP POLICY IF EXISTS "Users can view own goal responses" ON public.goal_specific_responses;
CREATE POLICY "Users can view own goal responses" ON public.goal_specific_responses FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own goal responses" ON public.goal_specific_responses;
CREATE POLICY "Users can insert own goal responses" ON public.goal_specific_responses FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own goal responses" ON public.goal_specific_responses;
CREATE POLICY "Users can update own goal responses" ON public.goal_specific_responses FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Daily Checkins Policies
DROP POLICY IF EXISTS "Users can view own daily checkins" ON public.daily_checkins;
CREATE POLICY "Users can view own daily checkins" ON public.daily_checkins FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own daily checkins" ON public.daily_checkins;
CREATE POLICY "Users can insert own daily checkins" ON public.daily_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own daily checkins" ON public.daily_checkins;
CREATE POLICY "Users can update own daily checkins" ON public.daily_checkins FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Weekly Checkins Policies
DROP POLICY IF EXISTS "Users can view own weekly checkins" ON public.weekly_checkins;
CREATE POLICY "Users can view own weekly checkins" ON public.weekly_checkins FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own weekly checkins" ON public.weekly_checkins;
CREATE POLICY "Users can insert own weekly checkins" ON public.weekly_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own weekly checkins" ON public.weekly_checkins;
CREATE POLICY "Users can update own weekly checkins" ON public.weekly_checkins FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Monthly Reviews Policies
DROP POLICY IF EXISTS "Users can view own monthly reviews" ON public.monthly_reviews;
CREATE POLICY "Users can view own monthly reviews" ON public.monthly_reviews FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own monthly reviews" ON public.monthly_reviews;
CREATE POLICY "Users can insert own monthly reviews" ON public.monthly_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own monthly reviews" ON public.monthly_reviews;
CREATE POLICY "Users can update own monthly reviews" ON public.monthly_reviews FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_health_goals_user_id ON public.health_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_preferences_user_id ON public.ai_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_smart_band_setup_user_id ON public.smart_band_setup(user_id);
CREATE INDEX IF NOT EXISTS idx_goal_specific_responses_user_id ON public.goal_specific_responses(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_date ON public.daily_checkins(user_id, checkin_date);
CREATE INDEX IF NOT EXISTS idx_weekly_checkins_user_id ON public.weekly_checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_reviews_user_month ON public.monthly_reviews(user_id, review_month);

-- Triggers for updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'health_goals', 'ai_preferences', 'smart_band_setup', 'goal_specific_responses'
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
