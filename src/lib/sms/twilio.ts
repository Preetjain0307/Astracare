export async function sendTwilioSMS(
  phoneNumber: string,
  otp: string
): Promise<{ success: boolean; error?: string }> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const fromPhone = process.env.TWILIO_PHONE_NUMBER

  if (!accountSid || !authToken || !fromPhone) {
    return { success: false, error: 'Twilio SID, Auth Token, or From Number is missing in .env.local' }
  }

  const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`
  const bodyParams = new URLSearchParams({
    To: phoneNumber,
    From: fromPhone,
    Body: `Your AstraCare AI verification code is: ${otp}. Valid for 10 minutes. Do not share.`,
  })

  const authHeader = 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64')

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: authHeader,
      },
      body: bodyParams.toString(),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      console.error('[Twilio SMS Error]', data)
      return { success: false, error: data.message || 'Failed to send SMS via Twilio' }
    }

    console.log(`[Twilio SMS Success] Message SID: ${data.sid} to ${phoneNumber}`)
    return { success: true }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Twilio network request failed'
    console.error('[Twilio Exception]', err)
    return { success: false, error: msg }
  }
}
