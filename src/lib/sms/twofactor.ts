export async function sendTwoFactorSMS(
  phoneNumber: string,
  otp: string
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.TWOFACTOR_API_KEY
  if (!apiKey) {
    return { success: false, error: 'TWOFACTOR_API_KEY is not configured in .env.local' }
  }

  const cleanPhone = phoneNumber.replace(/\D/g, '').slice(-10)
  const endpoint = `https://2factor.in/API/V1/${apiKey}/SMS/${cleanPhone}/${otp}/AUTOGEN`

  try {
    const response = await fetch(endpoint, { method: 'GET' })
    const data = await response.json().catch(() => ({}))

    if (data.Status === 'Success') {
      console.log(`[2Factor SMS Success] Session ID: ${data.Details} to ${phoneNumber}`)
      return { success: true }
    }

    console.error('[2Factor SMS Error]', data)
    return { success: false, error: data.Details || 'Failed to send SMS via 2Factor' }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '2Factor request failed'
    return { success: false, error: msg }
  }
}
