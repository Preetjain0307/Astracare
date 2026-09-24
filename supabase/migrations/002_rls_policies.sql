-- ============================================================
-- AstraCare AI — Row Level Security Policies
-- Run AFTER 001_initial_schema.sql
-- ============================================================

-- ============================================================
-- Enable RLS on all tables
-- ============================================================
ALTER TABLE public.profiles              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_questionnaire  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reproductive_health   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menstrual_history     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pregnancy_fertility   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_history       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lifestyle_information ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wellness_information  ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PROFILES — Users can only access their own profile
-- ============================================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- HEALTH_QUESTIONNAIRE — Users can only access their own data
-- ============================================================
DROP POLICY IF EXISTS "Users can view own questionnaire" ON public.health_questionnaire;
CREATE POLICY "Users can view own questionnaire"
  ON public.health_questionnaire FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own questionnaire" ON public.health_questionnaire;
CREATE POLICY "Users can insert own questionnaire"
  ON public.health_questionnaire FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own questionnaire" ON public.health_questionnaire;
CREATE POLICY "Users can update own questionnaire"
  ON public.health_questionnaire FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- REPRODUCTIVE_HEALTH
-- ============================================================
DROP POLICY IF EXISTS "Users can view own reproductive health" ON public.reproductive_health;
CREATE POLICY "Users can view own reproductive health"
  ON public.reproductive_health FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own reproductive health" ON public.reproductive_health;
CREATE POLICY "Users can insert own reproductive health"
  ON public.reproductive_health FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reproductive health" ON public.reproductive_health;
CREATE POLICY "Users can update own reproductive health"
  ON public.reproductive_health FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- MENSTRUAL_HISTORY
-- ============================================================
DROP POLICY IF EXISTS "Users can view own menstrual history" ON public.menstrual_history;
CREATE POLICY "Users can view own menstrual history"
  ON public.menstrual_history FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own menstrual history" ON public.menstrual_history;
CREATE POLICY "Users can insert own menstrual history"
  ON public.menstrual_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own menstrual history" ON public.menstrual_history;
CREATE POLICY "Users can update own menstrual history"
  ON public.menstrual_history FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- PREGNANCY_FERTILITY
-- ============================================================
DROP POLICY IF EXISTS "Users can view own pregnancy fertility" ON public.pregnancy_fertility;
CREATE POLICY "Users can view own pregnancy fertility"
  ON public.pregnancy_fertility FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own pregnancy fertility" ON public.pregnancy_fertility;
CREATE POLICY "Users can insert own pregnancy fertility"
  ON public.pregnancy_fertility FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own pregnancy fertility" ON public.pregnancy_fertility;
CREATE POLICY "Users can update own pregnancy fertility"
  ON public.pregnancy_fertility FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- MEDICAL_HISTORY
-- ============================================================
DROP POLICY IF EXISTS "Users can view own medical history" ON public.medical_history;
CREATE POLICY "Users can view own medical history"
  ON public.medical_history FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own medical history" ON public.medical_history;
CREATE POLICY "Users can insert own medical history"
  ON public.medical_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own medical history" ON public.medical_history;
CREATE POLICY "Users can update own medical history"
  ON public.medical_history FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- LIFESTYLE_INFORMATION
-- ============================================================
DROP POLICY IF EXISTS "Users can view own lifestyle" ON public.lifestyle_information;
CREATE POLICY "Users can view own lifestyle"
  ON public.lifestyle_information FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own lifestyle" ON public.lifestyle_information;
CREATE POLICY "Users can insert own lifestyle"
  ON public.lifestyle_information FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own lifestyle" ON public.lifestyle_information;
CREATE POLICY "Users can update own lifestyle"
  ON public.lifestyle_information FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- WELLNESS_INFORMATION
-- ============================================================
DROP POLICY IF EXISTS "Users can view own wellness" ON public.wellness_information;
CREATE POLICY "Users can view own wellness"
  ON public.wellness_information FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own wellness" ON public.wellness_information;
CREATE POLICY "Users can insert own wellness"
  ON public.wellness_information FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own wellness" ON public.wellness_information;
CREATE POLICY "Users can update own wellness"
  ON public.wellness_information FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
