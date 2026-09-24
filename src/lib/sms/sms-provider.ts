import { sendTextBeeSMS } from './textbee'
import { sendTwilioSMS } from './twilio'
import { sendTwoFactorSMS } from './twofactor'
import { sendSmtpEmail, getSmtpConfig } from '@/lib/email/smtp-service'

export interface SmsProviderResult {
  success: boolean
  error?: string
  warning?: string
  devOtp?: string
  provider?: string
}

export interface SmsProvider {
  sendOtp(phoneNumber: string, otp: string, recipientEmail?: string): Promise<SmsProviderResult>
}

/**
 * Safe Development SMS Provider
 * Logs OTP securely to server console without sending actual SMS messages.
 */
export class DevelopmentSmsProvider implements SmsProvider {
  async sendOtp(phoneNumber: string, otp: string): Promise<SmsProviderResult> {
    console.log(`\n======================================================`)
    console.log(`📱 [DEV SMS MOCK] AstraCare AI OTP for ${phoneNumber}: ${otp}`)
    console.log(`======================================================\n`)

    return {
      success: true,
      provider: 'DEV',
      devOtp: otp,
      warning: `[Dev Mode] Mobile verification code is: ${otp}`,
    }
  }
}

/**
 * Twilio SMS Provider (Real SMS delivery to mobile numbers worldwide)
 */
export class TwilioSmsProvider implements SmsProvider {
  async sendOtp(phoneNumber: string, otp: string): Promise<SmsProviderResult> {
    const result = await sendTwilioSMS(phoneNumber, otp)

    if (!result.success) {
      console.warn(`[Twilio Notice] ${result.error}`)
      if (process.env.NODE_ENV !== 'production') {
        return {
          success: true,
          provider: 'DEV_FALLBACK',
          devOtp: otp,
          warning: `Twilio Notice (${result.error}). Mobile verification code is: ${otp}`,
        }
      }
      return { success: false, error: result.error }
    }

    return { success: true, provider: 'TWILIO' }
  }
}

/**
 * 2Factor SMS Provider (Real SMS delivery to mobile numbers in India)
 */
export class TwoFactorSmsProvider implements SmsProvider {
  async sendOtp(phoneNumber: string, otp: string): Promise<SmsProviderResult> {
    const result = await sendTwoFactorSMS(phoneNumber, otp)

    if (!result.success) {
      console.warn(`[2Factor Notice] ${result.error}`)
      if (process.env.NODE_ENV !== 'production') {
        return {
          success: true,
          provider: 'DEV_FALLBACK',
          devOtp: otp,
          warning: `2Factor Notice (${result.error}). Mobile verification code is: ${otp}`,
        }
      }
      return { success: false, error: result.error }
    }

    return { success: true, provider: '2FACTOR' }
  }
}

/**
 * Fast2SMS Gateway Provider (Real SMS delivery to mobile numbers in India)
 */
export class Fast2SmsProvider implements SmsProvider {
  async sendOtp(phoneNumber: string, otp: string): Promise<SmsProviderResult> {
    const apiKey = process.env.FAST2SMS_API_KEY
    if (!apiKey) {
      return new DevelopmentSmsProvider().sendOtp(phoneNumber, otp)
    }

    const digitsOnly = phoneNumber.replace(/\D/g, '').slice(-10)

    try {
      const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otp,
          numbers: digitsOnly,
        }),
      })

      const data = await response.json().catch(() => ({}))

      if (data.return) {
        return { success: true, provider: 'FAST2SMS' }
      }

      console.warn('[Fast2SMS Notice]', data.message || 'Fast2SMS dispatch failed')
      if (process.env.NODE_ENV !== 'production') {
        return {
          success: true,
          provider: 'DEV_FALLBACK',
          devOtp: otp,
          warning: `Fast2SMS Notice (${data.message}). Mobile verification code is: ${otp}`,
        }
      }
      return { success: false, error: data.message || 'Fast2SMS dispatch failed' }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fast2SMS network error'
      console.error('[Fast2SMS Error]', err)
      return { success: false, error: msg }
    }
  }
}

/**
 * Production TextBee Gateway Provider (textbee.dev)
 */
export class TextBeeSmsProvider implements SmsProvider {
  async sendOtp(phoneNumber: string, otp: string): Promise<SmsProviderResult> {
    const message = `Your AstraCare AI verification code is: ${otp}. Valid for 10 minutes. Do not share.`
    const result = await sendTextBeeSMS(phoneNumber, message)

    if (!result.success) {
      console.warn(`[SMS Provider Notice] TextBee gateway response: ${result.error}`)

      if (process.env.NODE_ENV !== 'production') {
        return {
          success: true,
          provider: 'DEV_FALLBACK',
          devOtp: otp,
          warning: `TextBee Limit Notice: (${result.error}). Mobile verification code is: ${otp}`,
        }
      }

      return {
        success: false,
        error: result.error || 'Failed to dispatch SMS through SMS provider.',
      }
    }

    return { success: true, provider: 'TEXTBEE' }
  }
}

/**
 * SMTP SMS Provider (Sends SMS OTP via Email Relay)
 */
export class SmtpSmsProvider implements SmsProvider {
  async sendOtp(phoneNumber: string, otp: string, recipientEmail?: string): Promise<SmsProviderResult> {
    const targetEmail = recipientEmail || process.env.SMTP_USER

    if (!targetEmail) {
      return new DevelopmentSmsProvider().sendOtp(phoneNumber, otp)
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fdf2f8; border-radius: 12px;">
        <h2 style="color: #be123c; margin-top: 0;">📱 Mobile OTP Code - AstraCare AI</h2>
        <p style="color: #334155; font-size: 14px;">Your 6-digit mobile verification code for <strong>${phoneNumber}</strong> is:</p>
        <div style="background-color: #ffffff; padding: 16px; border-radius: 10px; border: 2px dashed #f43f5e; text-align: center; margin: 16px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #be123c;">${otp}</span>
        </div>
        <p style="color: #64748b; font-size: 12px;">This code expires in 10 minutes. Do not share it with anyone.</p>
      </div>
    `

    const result = await sendSmtpEmail({
      to: targetEmail,
      subject: `📱 Mobile Verification Code for ${phoneNumber}: ${otp}`,
      html: htmlContent,
    })

    if (result.success) {
      return {
        success: true,
        provider: 'SMTP',
        warning: `Mobile OTP sent to ${targetEmail} via SMTP. Code: ${otp}`,
        devOtp: otp,
      }
    }

    return new DevelopmentSmsProvider().sendOtp(phoneNumber, otp)
  }
}

/**
 * Returns configured SMS provider instance based on environment settings
 */
export function getSmsProvider(): SmsProvider {
  const providerType = process.env.SMS_PROVIDER?.toLowerCase()

  // 1. Explicit SMS_PROVIDER selection
  if (providerType === 'textbee') return new TextBeeSmsProvider()
  if (providerType === 'twilio') return new TwilioSmsProvider()
  if (providerType === '2factor') return new TwoFactorSmsProvider()
  if (providerType === 'fast2sms') return new Fast2SmsProvider()
  if (providerType === 'smtp') return new SmtpSmsProvider()

  // 2. Auto-detect based on available API keys in .env.local
  if (process.env.TEXTBEE_API_KEY) return new TextBeeSmsProvider()
  if (process.env.TWILIO_ACCOUNT_SID) return new TwilioSmsProvider()
  if (process.env.TWOFACTOR_API_KEY) return new TwoFactorSmsProvider()
  if (process.env.FAST2SMS_API_KEY) return new Fast2SmsProvider()

  // Fallback to Development mock adapter
  return new DevelopmentSmsProvider()
}


/**
 * Normalizes phone numbers to standard E.164 format (+91XXXXXXXXXX)
 */
export function normalizePhoneNumber(phone: string): string {
  const trimmed = phone.trim()
  if (trimmed.startsWith('+')) {
    return trimmed.replace(/[^\d+]/g, '')
  }
  // Default to +91 (India) if no country code provided
  const digits = trimmed.replace(/\D/g, '')
  if (digits.length === 10) {
    return `+91${digits}`
  }
  return `+${digits}`
}
