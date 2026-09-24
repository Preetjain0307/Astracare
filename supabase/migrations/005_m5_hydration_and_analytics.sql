-- ============================================================
-- AstraCare AI — M5 Health Dashboard & Analytics Schema
-- Migration 005
-- ============================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: hydration_entries
-- Tracks individual water intake entries per user per day
-- ============================================================
CREATE TABLE IF NOT EXISTS public.hydration_entries (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date   DATE NOT NULL DEFAULT CURRENT_DATE,
  amount_ml    INTEGER NOT NULL CHECK (amount_ml > 0),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: hydration_goals
-- Stores configurable daily hydration target per user
-- ============================================================
CREATE TABLE IF NOT EXISTS public.hydration_goals (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_goal_ml  INTEGER NOT NULL DEFAULT 2500 CHECK (daily_goal_ml > 0),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.hydration_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hydration_goals ENABLE ROW LEVEL SECURITY;

-- Hydration Entries Policies
DROP POLICY IF EXISTS "Users can view own hydration entries" ON public.hydration_entries;
CREATE POLICY "Users can view own hydration entries" ON public.hydration_entries
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own hydration entries" ON public.hydration_entries;
CREATE POLICY "Users can insert own hydration entries" ON public.hydration_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own hydration entries" ON public.hydration_entries;
CREATE POLICY "Users can delete own hydration entries" ON public.hydration_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Hydration Goals Policies
DROP POLICY IF EXISTS "Users can view own hydration goal" ON public.hydration_goals;
CREATE POLICY "Users can view own hydration goal" ON public.hydration_goals
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own hydration goal" ON public.hydration_goals;
CREATE POLICY "Users can insert own hydration goal" ON public.hydration_goals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own hydration goal" ON public.hydration_goals;
CREATE POLICY "Users can update own hydration goal" ON public.hydration_goals
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Indexes for optimal query performance
CREATE INDEX IF NOT EXISTS idx_hydration_entries_user_date ON public.hydration_entries(user_id, entry_date);
CREATE INDEX IF NOT EXISTS idx_hydration_goals_user_id ON public.hydration_goals(user_id);
