import nodemailer from 'nodemailer'

export interface SmtpConfig {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
  from: string
}

export function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    return null
  }

  const port = parseInt(process.env.SMTP_PORT || '587', 10)
  const secure = process.env.SMTP_SECURE === 'true' || port === 465
  const from = process.env.SMTP_FROM || `AstraCare AI <${user}>`

  return { host, port, secure, user, pass, from }
}

export function createSmtpTransporter() {
  const config = getSmtpConfig()
  if (!config) return null

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  })
}

export async function sendSmtpEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<{ success: boolean; error?: string }> {
  const config = getSmtpConfig()
  const transporter = createSmtpTransporter()

  if (!config || !transporter) {
    return { success: false, error: 'SMTP server is not configured in .env.local' }
  }

  try {
    const info = await transporter.sendMail({
      from: config.from,
      to,
      subject,
      html,
    })

    console.log(`[SMTP Email Success] MessageId: ${info.messageId} to ${to}`)
    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'SMTP Email delivery failed'
    console.error('[SMTP Send Error]', err)
    return { success: false, error: errorMsg }
  }
}
