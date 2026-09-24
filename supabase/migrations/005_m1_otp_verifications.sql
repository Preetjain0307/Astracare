-- ============================================================
-- AstraCare AI — M1 OTP Verifications Table & Profile Verification Columns
-- ============================================================

-- Create OTP verifications table for email, phone, and password reset
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id          UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  destination      TEXT NOT NULL,
  destination_type TEXT NOT NULL CHECK (destination_type IN ('EMAIL', 'PHONE')),
  purpose          TEXT NOT NULL CHECK (purpose IN ('EMAIL_VERIFICATION', 'PHONE_VERIFICATION', 'PASSWORD_RESET')),
  otp_hash         TEXT NOT NULL,
  attempts         INTEGER NOT NULL DEFAULT 0,
  expires_at       TIMESTAMPTZ NOT NULL,
  last_sent_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at      TIMESTAMPTZ,
  consumed_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add indexes for fast lookup and rate limiting checks
CREATE INDEX IF NOT EXISTS idx_otp_verifications_dest_purpose ON public.otp_verifications(destination, purpose);
CREATE INDEX IF NOT EXISTS idx_otp_verifications_user_id ON public.otp_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_otp_verifications_created_at ON public.otp_verifications(created_at);

-- RLS: Enable security on table so only server (service_role) can directly select/insert/update
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Add verification status columns to profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS phone_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS fully_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- Index for verification lookups
CREATE INDEX IF NOT EXISTS idx_profiles_verification ON public.profiles(user_id, fully_verified);
