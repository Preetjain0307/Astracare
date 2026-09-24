export async function sendTextBeeSMS(phone: string, message: string): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.TEXTBEE_API_KEY
  const deviceId = process.env.TEXTBEE_DEVICE_ID

  if (!apiKey) {
    console.warn('[TextBee] TEXTBEE_API_KEY is not configured in .env.local')
    // In dev mode without API key, log to console for instant testing
    console.log(`[TextBee DEV SMS] To: ${phone} | Message: ${message}`)
    return { success: true }
  }

  try {
    const endpoint = deviceId
      ? `https://api.textbee.dev/api/v1/gateway/devices/${deviceId}/send-sms`
      : `https://api.textbee.dev/api/v1/gateway/send-sms`

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        recipients: [phone],
        message,
      }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      console.error('[TextBee Error]', data)
      return { success: false, error: data?.message || 'Failed to send SMS via TextBee' }
    }

    return { success: true }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network error sending SMS'
    console.error('[TextBee Network Error]', err)
    return { success: false, error: errorMsg }
  }
}
