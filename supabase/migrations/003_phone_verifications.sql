-- ============================================================
-- AstraCare AI — Phone OTP Verifications Table (TextBee)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.phone_verifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone       TEXT NOT NULL,
  otp         TEXT NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  verified    BOOLEAN NOT NULL DEFAULT FALSE,
  attempts    INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_phone_verifications_phone ON public.phone_verifications(phone);

-- Secure the table: Only server service_role can access this table directly
ALTER TABLE public.phone_verifications ENABLE ROW LEVEL SECURITY;
