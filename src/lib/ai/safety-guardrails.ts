import type { ChatIntent } from '@/types/chat'

/**
 * Builds the secure AstraCare AI system prompt defining assistant persona, non-diagnostic behavior,
 * privacy, and evidence-aware language guidelines.
 */
export function buildAstraCareSystemPrompt(intent: ChatIntent): string {
  return `You are AstraCare AI — an empathetic, evidence-aware Women's Health & Wellness Assistant.

CORE GUIDELINES & SAFETY RULES:
1. NON-DIAGNOSTIC PERSONA: You are an AI informational assistant, NOT a doctor or licensed physician. Never diagnose medical conditions, diseases, or disorders.
2. NO PRESCRIPTIONS OR DOSAGE ALTERATIONS: Never prescribe medication, change dosages, or recommend stopping prescribed treatments.
3. EVIDENCE-AWARE & PROBABILISTIC LANGUAGE: Always use cautious, non-certainty language such as "may", "could", "estimated", or "based on your logged history".
4. NO FABRICATED MEASUREMENTS OR READINGS: Only reference health data explicitly provided in the retrieved context. If data is not available, state that clearly without guessing.
5. PRIVACY & CONFIDENTIALITY: Respect user privacy. Keep responses focused on the user's specific health intent without unnecessary disclosures.
6. CONCISE & EMPATHETIC TONE: Provide warm, encouraging, supportive responses tailored to women's health. Keep answers structured and clear.

Current user query intent category: "${intent}".
Answer the user's question directly, incorporating the retrieved context data accurately.`
}

/**
 * Safe escalation response for emergency medical situations.
 * Clearly states that M13 Emergency & SOS module is not yet active without fabricating service dispatch.
 */
export function getEmergencyResponse(): string {
  return `⚠️ EMERGENCY SAFETY NOTICE ⚠️

If you are experiencing a medical emergency, severe pain, heavy bleeding, difficulty breathing, or sudden severe symptoms, please seek immediate medical attention:

• Emergency Medical Services: Call 911 (US/Canada), 112 (Europe), 108 (India), or your local emergency number immediately.
• Nearest Healthcare Facility: Go to the nearest Hospital Emergency Department.

Note: AstraCare AI Assistant cannot provide emergency medical intervention. (Note: M13 Emergency & SOS dispatch integration is pending in this release).`
}

/**
 * Safe advice notice for medication queries.
 */
export function getMedicationSafetyNotice(): string {
  return `💊 MEDICATION SAFETY NOTICE:

AstraCare AI cannot prescribe medications, adjust dosages, or advise on stopping treatments.

Please consult your physician, prescribing doctor, or a licensed pharmacist before modifying any medication regime or starting new supplements.`
}

/**
 * Sanitizes and validates the AI response before sending it to the client.
 * Catches dangerous medical claims, diagnostic statements, or medication changes.
 */
export function validateAndSanitizeResponse(response: string, isMedicationRelated: boolean): string {
  let sanitized = response

  // Check for dangerous medical assertions
  const dangerousDiagnosis = /\b(you have|you are suffering from|I diagnose you with)\b/i
  if (dangerousDiagnosis.test(sanitized)) {
    sanitized = sanitized.replace(
      dangerousDiagnosis,
      'Your symptoms may be associated with'
    )
  }

  // Check for prescription / dosage commands
  const prescriptionCommands = /\b(take \d+\s?mg|increase your dose to|stop taking your|discontinue your)\b/i
  if (prescriptionCommands.test(sanitized)) {
    sanitized += `\n\n${getMedicationSafetyNotice()}`
  } else if (isMedicationRelated && !sanitized.includes('consult your doctor')) {
    sanitized += `\n\n(Please consult your doctor or pharmacist regarding any medication adjustments.)`
  }

  return sanitized
}
