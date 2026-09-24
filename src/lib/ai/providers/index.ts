import type { AIProvider } from './ai-provider'
import { GeminiProvider } from './gemini-provider'
import { OpenAIProvider } from './openai-provider'
import { FallbackLocalProvider } from './fallback-provider'

export * from './ai-provider'
export * from './gemini-provider'
export * from './openai-provider'
export * from './fallback-provider'

/**
 * Resolves the configured AI provider based on environment variables.
 * Priority:
 * 1. AI_PROVIDER env variable explicitly set ('gemini' | 'openai' | 'fallback')
 * 2. Available API keys (GEMINI_API_KEY -> GeminiProvider, OPENAI_API_KEY -> OpenAIProvider)
 * 3. FallbackLocalProvider (Zero cost, works offline without API keys)
 */
export function getAIProvider(): AIProvider {
  const explicitProvider = process.env.AI_PROVIDER?.toLowerCase()

  if (explicitProvider === 'openai' && process.env.OPENAI_API_KEY) {
    return new OpenAIProvider(process.env.OPENAI_API_KEY)
  }

  if (explicitProvider === 'gemini' && process.env.GEMINI_API_KEY) {
    return new GeminiProvider(process.env.GEMINI_API_KEY)
  }

  if (explicitProvider === 'fallback') {
    return new FallbackLocalProvider()
  }

  // Automatic key detection
  if (process.env.GEMINI_API_KEY) {
    return new GeminiProvider(process.env.GEMINI_API_KEY)
  }

  if (process.env.OPENAI_API_KEY) {
    return new OpenAIProvider(process.env.OPENAI_API_KEY)
  }

  // Fallback if no keys available
  return new FallbackLocalProvider()
}
