import crypto from 'crypto'
import { createAdminClient } from '@/lib/supabase/admin'

export type DestinationType = 'EMAIL' | 'PHONE'
export type OtpPurpose = 'EMAIL_VERIFICATION' | 'PHONE_VERIFICATION' | 'PASSWORD_RESET'

export interface CreateOtpParams {
  destination: string
  destinationType: DestinationType
  purpose: OtpPurpose
  userId?: string
}

export interface VerifyOtpParams {
  destination: string
  purpose: OtpPurpose
  otp: string
}

export interface OtpResult {
  success: boolean
  error?: string
  otp?: string // Returned internally to caller for dispatching via Resend or SMS provider
  cooldownSeconds?: number
}

const EXPIRATION_MINUTES = 10
const COOLDOWN_SECONDS = 60
const MAX_ATTEMPTS = 5

// In-memory fallback store for development/environments where database migration 005 hasn't been run yet
interface InMemoryOtp {
  destination: string
  purpose: string
  otpHash: string
  otpPlaintext: string
  expiresAt: number
  lastSentAt: number
  attempts: number
  userId?: string
}

const memoryOtpStore = new Map<string, InMemoryOtp>()

/**
 * Generates a cryptographically secure 6-digit OTP code using crypto.randomInt
 */
export function generateSecureOtp(): string {
  const num = crypto.randomInt(100000, 1000000)
  return num.toString()
}

/**
 * Hashes an OTP code using SHA-256
 */
export function hashOtp(otp: string): string {
  return crypto.createHash('sha256').update(otp.trim()).digest('hex')
}

/**
 * Compares two OTP hashes safely using timingSafeEqual to prevent timing attacks
 */
export function timingSafeHashCompare(hashA: string, hashB: string): boolean {
  if (hashA.length !== hashB.length) return false
  const bufA = Buffer.from(hashA, 'hex')
  const bufB = Buffer.from(hashB, 'hex')
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

/**
 * Creates and stores a new hashed OTP in the database (or memory fallback).
 * Enforces 60-second cooldown and invalidates previous active OTPs.
 */
export async function createAndStoreOtp({
  destination,
  destinationType,
  purpose,
  userId,
}: CreateOtpParams): Promise<OtpResult> {
  const supabase = createAdminClient()
  const normalizedDest = destination.trim().toLowerCase()
  const now = new Date()
  const nowMs = now.getTime()
  const storeKey = `${normalizedDest}:${purpose}`

  // 1. Check Resend Cooldown (60 seconds)
  try {
    const { data: recentRecords, error: cooldownErr } = await supabase
      .from('otp_verifications')
      .select('last_sent_at')
      .eq('destination', normalizedDest)
      .eq('purpose', purpose)
      .is('consumed_at', null)
      .order('last_sent_at', { ascending: false })
      .limit(1)

    if (!cooldownErr && recentRecords && recentRecords.length > 0) {
      const lastSent = new Date(recentRecords[0].last_sent_at)
      const diffSeconds = Math.floor((nowMs - lastSent.getTime()) / 1000)
      if (diffSeconds < COOLDOWN_SECONDS) {
        const cooldownRemaining = COOLDOWN_SECONDS - diffSeconds
        return {
          success: false,
          error: `Please wait ${cooldownRemaining} seconds before requesting a new code.`,
          cooldownSeconds: cooldownRemaining,
        }
      }
    }
  } catch {
    // Ignore DB fetch errors if table missing
  }

  // Memory fallback cooldown check
  const memRecord = memoryOtpStore.get(storeKey)
  if (memRecord) {
    const diffSec = Math.floor((nowMs - memRecord.lastSentAt) / 1000)
    if (diffSec < COOLDOWN_SECONDS) {
      const cooldownRemaining = COOLDOWN_SECONDS - diffSec
      return {
        success: false,
        error: `Please wait ${cooldownRemaining} seconds before requesting a new code.`,
        cooldownSeconds: cooldownRemaining,
      }
    }
  }

  // 2. Invalidate previous active unconsumed OTPs
  try {
    await supabase
      .from('otp_verifications')
      .update({ expires_at: now.toISOString() })
      .eq('destination', normalizedDest)
      .eq('purpose', purpose)
      .is('consumed_at', null)
      .gt('expires_at', now.toISOString())
  } catch {
    // Ignore error
  }

  // 3. Generate 6-digit OTP and compute SHA-256 hash
  const otp = generateSecureOtp()
  const otpHash = hashOtp(otp)
  const expiresAt = new Date(nowMs + EXPIRATION_MINUTES * 60 * 1000)

  // Save to Memory Fallback Store
  memoryOtpStore.set(storeKey, {
    destination: normalizedDest,
    purpose,
    otpHash,
    otpPlaintext: otp,
    expiresAt: expiresAt.getTime(),
    lastSentAt: nowMs,
    attempts: 0,
    userId,
  })

  // 4. Try storing in Supabase `otp_verifications` table
  const { error: dbError } = await supabase.from('otp_verifications').insert({
    user_id: userId || null,
    destination: normalizedDest,
    destination_type: destinationType,
    purpose,
    otp_hash: otpHash,
    attempts: 0,
    expires_at: expiresAt.toISOString(),
    last_sent_at: now.toISOString(),
  })

  // Fallback to `phone_verifications` table if destination is PHONE
  if (dbError && destinationType === 'PHONE') {
    try {
      await supabase.from('phone_verifications').insert({
        phone: normalizedDest,
        otp: otp,
        expires_at: expiresAt.toISOString(),
        verified: false,
        attempts: 0,
      })
    } catch (fallbackErr) {
      console.warn('[OTP Service] Phone fallback table insert error:', fallbackErr)
    }
  }

  return {
    success: true,
    otp, // Returned to server service ONLY for sending via Resend or SMS provider
  }
}

/**
 * Verifies a submitted OTP against DB (or Memory fallback).
 * Marks OTP as verified and consumed upon success.
 */
export async function verifyOtp({
  destination,
  purpose,
  otp,
}: VerifyOtpParams): Promise<{ success: boolean; error?: string; userId?: string }> {
  const supabase = createAdminClient()
  const normalizedDest = destination.trim().toLowerCase()
  const cleanOtp = otp.trim()
  const now = new Date()
  const nowMs = now.getTime()
  const storeKey = `${normalizedDest}:${purpose}`

  if (cleanOtp.length !== 6 || !/^\d{6}$/.test(cleanOtp)) {
    return { success: false, error: 'Verification code must be exactly 6 digits.' }
  }

  const inputHash = hashOtp(cleanOtp)

  // A. Try fetching from Supabase `otp_verifications` table
  let dbRecord: any = null
  try {
    const { data: record, error: fetchErr } = await supabase
      .from('otp_verifications')
      .select('*')
      .eq('destination', normalizedDest)
      .eq('purpose', purpose)
      .is('consumed_at', null)
      .gt('expires_at', now.toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (!fetchErr && record) {
      dbRecord = record
    }
  } catch {
    // Ignore error if table doesn't exist
  }

  if (dbRecord) {
    if (dbRecord.attempts >= MAX_ATTEMPTS) {
      await supabase
        .from('otp_verifications')
        .update({ expires_at: now.toISOString() })
        .eq('id', dbRecord.id)

      return {
        success: false,
        error: 'Maximum verification attempts exceeded (5/5). Please request a new code.',
      }
    }

    const isMatch = timingSafeHashCompare(dbRecord.otp_hash, inputHash)

    if (!isMatch) {
      const newAttempts = dbRecord.attempts + 1
      const attemptsLeft = MAX_ATTEMPTS - newAttempts

      await supabase
        .from('otp_verifications')
        .update({
          attempts: newAttempts,
          ...(newAttempts >= MAX_ATTEMPTS ? { expires_at: now.toISOString() } : {}),
        })
        .eq('id', dbRecord.id)

      return {
        success: false,
        error: `Invalid verification code. ${attemptsLeft > 0 ? `${attemptsLeft} attempt(s) remaining.` : 'Please request a new code.'}`,
      }
    }

    // Success — mark as consumed
    await supabase
      .from('otp_verifications')
      .update({
        verified_at: now.toISOString(),
        consumed_at: now.toISOString(),
      })
      .eq('id', dbRecord.id)

    memoryOtpStore.delete(storeKey)
    return { success: true, userId: dbRecord.user_id || undefined }
  }

  // B. Try fallback check against `phone_verifications` table
  try {
    const { data: phoneRec } = await supabase
      .from('phone_verifications')
      .select('*')
      .eq('phone', normalizedDest)
      .eq('verified', false)
      .gt('expires_at', now.toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (phoneRec) {
      if (phoneRec.otp === cleanOtp || timingSafeHashCompare(hashOtp(phoneRec.otp), inputHash)) {
        await supabase
          .from('phone_verifications')
          .update({ verified: true })
          .eq('id', phoneRec.id)

        memoryOtpStore.delete(storeKey)
        return { success: true }
      }
    }
  } catch {
    // Ignore error
  }

  // C. Fallback check against In-Memory Store
  const memRecord = memoryOtpStore.get(storeKey)

  if (memRecord) {
    if (memRecord.expiresAt < nowMs) {
      memoryOtpStore.delete(storeKey)
      return { success: false, error: 'Verification code has expired. Please request a new code.' }
    }

    if (memRecord.attempts >= MAX_ATTEMPTS) {
      memoryOtpStore.delete(storeKey)
      return { success: false, error: 'Maximum verification attempts exceeded (5/5). Please request a new code.' }
    }

    const isMatch = timingSafeHashCompare(memRecord.otpHash, inputHash) || memRecord.otpPlaintext === cleanOtp

    if (!isMatch) {
      memRecord.attempts += 1
      const attemptsLeft = MAX_ATTEMPTS - memRecord.attempts
      if (attemptsLeft <= 0) {
        memoryOtpStore.delete(storeKey)
      }
      return {
        success: false,
        error: `Invalid verification code. ${attemptsLeft > 0 ? `${attemptsLeft} attempt(s) remaining.` : 'Please request a new code.'}`,
      }
    }

    // Success in Memory Store
    memoryOtpStore.delete(storeKey)
    return { success: true, userId: memRecord.userId }
  }

  return {
    success: false,
    error: 'Invalid or expired verification code. Please request a new code.',
  }
}
