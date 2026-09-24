import type { ChatIntent, ConfidenceLevel, NLPClassificationResult } from '@/types/chat'

// Emergency keywords requiring immediate escalation
const EMERGENCY_PATTERNS = [
  /\b(chest pain|heart attack|stroke|can'?t breathe|difficulty breathing|shortness of breath)\b/i,
  /\b(severe bleeding|uncontrolled bleeding|heavy hemorrhaging|coughing blood)\b/i,
  /\b(fainted|unconscious|passed out|loss of consciousness|seizure|convulsions)\b/i,
  /\b(suicide|suicidal|end my life|kill myself|self harm)\b/i,
  /\b(anaphylaxis|severe allergic reaction|throat closing)\b/i,
  /\b(overdose|poisoned|poisoning)\b/i,
]

// Medication safety patterns (prescription changes, dosage modification)
const MEDICATION_PATTERNS = [
  /\b(medication|medicine|pill|dosage|dose|prescription|supplement|antibiotic)\b/i,
  /\b(should i stop taking|can i increase|change dosage|take extra|side effect)\b/i,
]

// Intent pattern rules
const INTENT_PATTERNS: { intent: ChatIntent; regex: RegExp }[] = [
  {
    intent: 'hydration',
    regex: /\b(water|drink|hydration|intake|glass|ml|liters?|hydrated|dehydrated)\b/i,
  },
  {
    intent: 'cycle_prediction',
    regex: /\b(next period|when is my period|due date|ovulation date|cycle prediction|period estimate)\b/i,
  },
  {
    intent: 'cycle_information',
    regex: /\b(period|cycle|menstrual|menstruation|spotting|cramps|follicular|luteal|pms)\b/i,
  },
  {
    intent: 'sleep_analysis',
    regex: /\b(sleep|slept|hours of sleep|sleep quality|insomnia|rest|tired|fatigue|asleep|bedtime)\b/i,
  },
  {
    intent: 'stress_analysis',
    regex: /\b(stress|stressed|anxiety|anxious|overwhelmed|tension|burnout|pressure|hrv)\b/i,
  },
  {
    intent: 'activity_analysis',
    regex: /\b(activity|exercise|workout|steps|walk|walking|running|gym|fitness|active|movement)\b/i,
  },
  {
    intent: 'nutrition',
    regex: /\b(diet|food|calories|nutrition|meal|eating|nutrients|protein|carbs)\b/i,
  },
  {
    intent: 'mental_wellness',
    regex: /\b(mood|feeling|depression|mental health|sad|happy|emotional|meditation|mindfulness)\b/i,
  },
  {
    intent: 'wearable_data',
    regex: /\b(wearable|astraband|heart rate|pulse|spo2|temperature|ring|watch)\b/i,
  },
  {
    intent: 'health_report',
    regex: /\b(report|summary|health score|overview|dashboard|export|doctor report)\b/i,
  },
  {
    intent: 'ai_insights',
    regex: /\b(insight|trend|pattern|ai analysis|health intelligence|recommendation)\b/i,
  },
  {
    intent: 'medication_reminder',
    regex: /\b(remind|reminder|pill schedule|medication time|take my medicine)\b/i,
  },
  {
    intent: 'fitness',
    regex: /\b(strength|cardio|pilates|yoga|training|workout plan)\b/i,
  },
]

/**
 * Classifies a user's natural language input into a structured intent and extracts context parameters.
 * Uses Stage 1 NLP rule-based matching with fallback to general health questions.
 */
export function classifyIntent(message: string): NLPClassificationResult {
  const trimmed = message.trim()

  if (!trimmed) {
    return {
      intent: 'unknown',
      confidence: 'low',
      isEmergency: false,
      isMedicationRelated: false,
    }
  }

  // 1. Check Emergency First (Highest Priority)
  for (const pattern of EMERGENCY_PATTERNS) {
    if (pattern.test(trimmed)) {
      return {
        intent: 'emergency',
        confidence: 'high',
        isEmergency: true,
        isMedicationRelated: false,
      }
    }
  }

  // 2. Check Medication Safety Context
  let isMedicationRelated = false
  for (const pattern of MEDICATION_PATTERNS) {
    if (pattern.test(trimmed)) {
      isMedicationRelated = true;
      break
    }
  }

  // 3. Match Intent Patterns
  for (const { intent, regex } of INTENT_PATTERNS) {
    if (regex.test(trimmed)) {
      // Determine timeframe entity
      let timeframe: NLPClassificationResult['timeframe'] = 'last_7_days'
      if (/\b(today|this morning|tonight|right now)\b/i.test(trimmed)) {
        timeframe = 'today'
      } else if (/\b(this month|30 days|monthly|past month)\b/i.test(trimmed)) {
        timeframe = 'last_30_days'
      } else if (/\b(all time|history|ever)\b/i.test(trimmed)) {
        timeframe = 'all_time'
      }

      return {
        intent,
        confidence: 'high',
        timeframe,
        isEmergency: false,
        isMedicationRelated,
      }
    }
  }

  // 4. Default to General Health Question
  return {
    intent: 'general_health_question',
    confidence: 'moderate',
    isEmergency: false,
    isMedicationRelated,
  }
}
