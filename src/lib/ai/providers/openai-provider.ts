import type { AIProvider, GenerateInput } from './ai-provider'

export class OpenAIProvider implements AIProvider {
  name = 'OpenAI API'
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async generateResponse(input: GenerateInput): Promise<string> {
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
    const url = 'https://api.openai.com/v1/chat/completions'

    const messages: any[] = [
      { role: 'system', content: input.systemPrompt },
    ]

    if (input.conversationHistory && input.conversationHistory.length > 0) {
      for (const msg of input.conversationHistory.slice(-6)) {
        messages.push({
          role: msg.role,
          content: msg.content,
        })
      }
    }

    let fullPrompt = input.userMessage
    if (input.contextData && Object.keys(input.contextData).length > 0) {
      fullPrompt = `[Retrieved User Context]\n${JSON.stringify(input.contextData, null, 2)}\n\n[User Question]\n${input.userMessage}`
    }

    messages.push({ role: 'user', content: fullPrompt })

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.4,
        max_tokens: 600,
      }),
    })

    if (!res.ok) {
      const errText = await res.text()
      throw new Error(`OpenAI API call failed with status ${res.status}: ${errText}`)
    }

    const data = await res.json()
    const text = data?.choices?.[0]?.message?.content

    if (!text) {
      throw new Error('OpenAI API returned empty completion')
    }

    return text.trim()
  }
}
