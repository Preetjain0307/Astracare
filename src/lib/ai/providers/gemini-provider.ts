import type { AIProvider, GenerateInput } from './ai-provider'

export class GeminiProvider implements AIProvider {
  name = 'Google Gemini API'
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateResponse(input: GenerateInput): Promise<string> {
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`

    // Build parts & system instruction
    const contents: any[] = []

    // Include short conversation history
    if (input.conversationHistory && input.conversationHistory.length > 0) {
      for (const msg of input.conversationHistory.slice(-6)) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        })
      }
    }

    // Add current user prompt with attached structured context
    let fullPrompt = input.userMessage
    if (input.contextData && Object.keys(input.contextData).length > 0) {
      fullPrompt = `[Retrieved User Context]\n${JSON.stringify(input.contextData, null, 2)}\n\n[User Question]\n${input.userMessage}`
    }

    contents.push({
      role: 'user',
      parts: [{ text: fullPrompt }],
    })

    const payload = {
      systemInstruction: {
        parts: [{ text: input.systemPrompt }],
      },
      contents,
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 600,
      },
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`Gemini API call failed with status ${res.status}: ${errText}`)
    }

    const data = await res.json()
    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!responseText) {
      throw new Error('Gemini API returned an empty response candidate')
    }

    return responseText.trim()
  }
}
