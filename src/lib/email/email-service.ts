import { Resend } from 'resend'
import { getSmtpConfig, sendSmtpEmail } from './smtp-service'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

const SENDER_EMAIL = process.env.RESEND_FROM_EMAIL || 'AstraCare AI <onboarding@resend.dev>'

export interface SendEmailOtpOptions {
  toEmail: string
  otp: string
  purpose: 'EMAIL_VERIFICATION' | 'PASSWORD_RESET'
  userName?: string
}

export interface SendEmailOtpResult {
  success: boolean
  error?: string
  warning?: string
  devOtp?: string
  provider?: 'SMTP' | 'RESEND' | 'DEV'
}

export async function sendEmailOtp({
  toEmail,
  otp,
  purpose,
  userName,
}: SendEmailOtpOptions): Promise<SendEmailOtpResult> {
  const isPasswordReset = purpose === 'PASSWORD_RESET'
  const subject = isPasswordReset
    ? 'Reset your AstraCare AI Password'
    : 'Your AstraCare AI Verification Code'

  const title = isPasswordReset ? 'Password Reset Code' : 'Verify Your Email Address'
  const messageText = isPasswordReset
    ? 'Use the following 6-digit security code to reset your AstraCare AI password.'
    : 'Welcome to AstraCare AI! Use the 6-digit verification code below to verify your email address.'

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fdf2f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #fdf2f8; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 500px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 30px rgba(225, 29, 72, 0.08); border: 1px solid #fbcfe8; overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #be123c 0%, #e11d48 50%, #f43f5e 100%); padding: 32px 24px; text-align: center;">
              <div style="display: inline-block; width: 44px; height: 44px; background: rgba(255, 255, 255, 0.2); border-radius: 12px; line-height: 44px; margin-bottom: 8px;">
                <span style="font-size: 24px; color: #ffffff;">🌸</span>
              </div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">AstraCare AI</h1>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #fecdd3;">Intelligent Women's Health & Predictive Healthcare</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px 28px;">
              ${userName ? `<p style="margin: 0 0 16px 0; font-size: 15px; font-weight: 600; color: #334155;">Hello ${userName},</p>` : ''}
              <h2 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 600; color: #0f172a;">${title}</h2>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #64748b; line-height: 1.6;">${messageText}</p>
              
              <!-- OTP Box -->
              <div style="background-color: #fff1f2; border: 2px dashed #f43f5e; border-radius: 16px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <span style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #be123c; display: block; margin-left: 10px;">${otp}</span>
                <span style="display: inline-block; margin-top: 8px; font-size: 12px; font-weight: 500; color: #9f1239; background-color: #ffe4e6; padding: 4px 12px; border-radius: 20px;">⏱️ Expires in 10 minutes</span>
              </div>

              <!-- Security Notice -->
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 14px 16px; margin-bottom: 24px; border-left: 4px solid #e11d48;">
                <p style="margin: 0; font-size: 12px; color: #475569; line-height: 1.5;">
                  <strong>🔒 Security Warning:</strong> Never share this 6-digit verification code with anyone. AstraCare AI support staff will never ask for your code.
                </p>
              </div>

              <p style="margin: 0; font-size: 13px; color: #94a3b8; line-height: 1.5;">
                If you did not request this email, please safely ignore it or contact our support team.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 28px; text-align: center; border-top: 1px solid #f1f5f9;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                © 2026 AstraCare AI Systems Inc. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `

  // Log OTP in server console for quick dev testing
  if (process.env.NODE_ENV !== 'production') {
    console.log(`\n======================================================`)
    console.log(`📧 AstraCare AI Email OTP for ${toEmail}: ${otp} [${purpose}]`)
    console.log(`======================================================\n`)
  }

  // 1. Try SMTP if configured in .env.local
  const smtpConfig = getSmtpConfig()
  if (smtpConfig) {
    const smtpRes = await sendSmtpEmail({
      to: toEmail,
      subject,
      html: htmlContent,
    })

    if (smtpRes.success) {
      return { success: true, provider: 'SMTP' }
    } else {
      console.warn('[SMTP Fallback Warning]', smtpRes.error)
    }
  }

  // 2. Fallback to Resend API
  if (resend) {
    try {
      const response = await resend.emails.send({
        from: SENDER_EMAIL,
        to: [toEmail],
        subject,
        html: htmlContent,
      })

      if (!response.error) {
        return { success: true, provider: 'RESEND' }
      }

      const isDomainError =
        response.error.message.includes('only send testing emails') ||
        response.error.message.includes('verify a domain')

      console.error('[Resend Email Error]', response.error.message)

      if (process.env.NODE_ENV !== 'production' && isDomainError) {
        return {
          success: true,
          provider: 'DEV',
          devOtp: otp,
          warning: `Resend test domain limit. Verification code: ${otp}`,
        }
      }

      return { success: false, error: response.error.message }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send email'
      console.error('[Send Email Exception]', err)
    }
  }

  // 3. Development Fallback
  if (process.env.NODE_ENV !== 'production') {
    return {
      success: true,
      provider: 'DEV',
      devOtp: otp,
      warning: `[Dev Mode] Verification code: ${otp}`,
    }
  }

  return {
    success: false,
    error: 'No valid email delivery service (SMTP or Resend) is configured on the server.',
  }
}
