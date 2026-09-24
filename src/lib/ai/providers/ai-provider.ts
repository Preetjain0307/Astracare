export interface GenerateInput {
  systemPrompt: string
  userMessage: string
  conversationHistory?: { role: 'user' | 'assistant'; content: string }[]
  contextData?: Record<string, any>
}

export interface AIProvider {
  name: string
  generateResponse(input: GenerateInput): Promise<string>
}
