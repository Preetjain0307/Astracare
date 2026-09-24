import { z } from 'zod'

// Step 1: Health Goals Selection
export const healthGoalsSchema = z.object({
  selected_goals: z
    .array(z.string())
    .min(1, 'Please select at least one health goal to personalize your experience'),
})

// Step 2: Basic Profile
export const basicProfileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().min(1, 'Last name is required').max(50),
  date_of_birth: z.string().optional().nullable(),
  age: z.coerce.number().min(12, 'Age must be at least 12').max(120, 'Please enter a valid age').optional().nullable(),
  birth_year: z.coerce.number().min(1900).max(new Date().getFullYear()).optional().nullable(),
  height_unit: z.enum(['metric', 'imperial']).default('metric'),
  height_cm: z.coerce.number().min(50, 'Min 50 cm').max(250, 'Max 250 cm').optional().nullable(),
  weight_unit: z.enum(['metric', 'imperial']).default('metric'),
  weight_kg: z.coerce.number().min(20, 'Min 20 kg').max(300, 'Max 300 kg').optional().nullable(),
  activity_level: z.string().min(1, 'Please select your activity level'),
  smoking: z.string().min(1, 'Please select smoking habit'),
  alcohol: z.string().min(1, 'Please select alcohol consumption'),
  blood_group: z.string().optional().nullable(),
  location: z.string().max(100).optional().nullable(),
  country: z.string().optional().nullable(),
  time_zone: z.string().optional().nullable(),
  emergency_contact_name: z.string().max(100).optional().nullable(),
  emergency_contact_phone: z.string().max(20).optional().nullable(),
  prefer_not_to_say_sensitive: z.boolean().default(false),
})

// Step 3: Medical History
export const medicalHistorySchema = z.object({
  diagnoses: z.array(z.string()).default([]),
  other_conditions: z.string().max(500).optional().nullable(),
  surgeries: z.string().max(500).optional().nullable(),
  current_medications: z.string().max(500).optional().nullable(),
  allergies: z.string().max(500).optional().nullable(),
  family_history: z.array(z.string()).default([]),
})

// Step 4: Smart Band Setup
export const smartBandSchema = z.object({
  owns_band: z.boolean(),
  permissions: z.array(z.string()).default([]),
})

// Step 5: AI Preferences
export const aiPreferencesSchema = z.object({
  preferences: z.array(z.string()).default([]),
})

// Step 6: Dynamic Essential Goal Questions Schema
export const goalQuestionsSchema = z.object({
  // Period & Cycle
  last_period_date: z.string().optional().nullable(),
  avg_cycle_length: z.coerce.number().min(14).max(60).optional().nullable(),
  pain_level: z.coerce.number().min(0).max(10).optional().nullable(),
  cycle_regularity: z.string().optional().nullable(),

  // PCOS
  pcos_diagnosed: z.string().optional().nullable(),
  pcos_irregular_periods: z.boolean().optional().nullable(),
  pcos_symptoms: z.array(z.string()).optional().nullable(),

  // Trying to Conceive
  conceiving_last_period: z.string().optional().nullable(),
  tracks_ovulation: z.boolean().optional().nullable(),
  tracking_method: z.string().optional().nullable(),

  // Pregnancy
  pregnancy_week_or_due_date: z.string().optional().nullable(),
  high_risk_info: z.string().optional().nullable(),
  pregnancy_symptoms: z.array(z.string()).optional().nullable(),

  // Postpartum
  postpartum_date: z.string().optional().nullable(),
  feeding_method: z.string().optional().nullable(),
  postpartum_challenge: z.string().optional().nullable(),

  // Menopause
  menopause_last_period: z.string().optional().nullable(),
  hot_flash_frequency: z.string().optional().nullable(),
  menopause_challenge: z.string().optional().nullable(),

  // Fitness
  fitness_goal: z.string().optional().nullable(),
  exercise_types: z.array(z.string()).optional().nullable(),
  exercise_frequency: z.string().optional().nullable(),

  // Nutrition
  food_preference: z.string().optional().nullable(),
  water_intake_liters: z.coerce.number().min(0).max(10).optional().nullable(),
  meals_per_day: z.string().optional().nullable(),
  food_allergies: z.string().optional().nullable(),

  // Mental Wellness
  stress_level: z.coerce.number().min(1).max(10).optional().nullable(),
  current_mood: z.string().optional().nullable(),
  sleep_hours: z.coerce.number().min(0).max(24).optional().nullable(),
  mental_health_diagnosis: z.string().optional().nullable(),
})

// Check-ins Schemas
export const dailyCheckInSchema = z.object({
  feeling: z.string().min(1, 'Please select how you are feeling'),
  sleep_quality: z.string().min(1, 'Please select sleep quality'),
  energy_level: z.string().min(1, 'Please select energy level'),
  symptoms: z.array(z.string()).default([]),
  activity_done: z.boolean().default(false),
})

export const weeklyCheckInSchema = z.object({
  overall_health: z.coerce.number().min(1).max(10),
  exercise_frequency: z.string().min(1, 'Please select exercise frequency'),
  stress_level: z.coerce.number().min(1).max(10),
  unusual_symptoms: z.boolean().default(false),
  notes: z.string().max(500).optional(),
})

export const monthlyReviewSchema = z.object({
  period_regular: z.string().min(1, 'Please select period regularity'),
  severe_symptoms: z.boolean().default(false),
  weight_change: z.string().min(1, 'Please select weight change'),
  sleep_quality: z.string().min(1, 'Please select overall sleep quality'),
  stress_level: z.coerce.number().min(1).max(10),
  notes: z.string().max(500).optional(),
})

export type HealthGoalsFormData = z.infer<typeof healthGoalsSchema>
export type BasicProfileFormData = z.infer<typeof basicProfileSchema>
export type MedicalHistoryFormData = z.infer<typeof medicalHistorySchema>
export type SmartBandFormData = z.infer<typeof smartBandSchema>
export type AIPreferencesFormData = z.infer<typeof aiPreferencesSchema>
export type GoalQuestionsFormData = z.infer<typeof goalQuestionsSchema>
export type DailyCheckInFormData = z.infer<typeof dailyCheckInSchema>
export type WeeklyCheckInFormData = z.infer<typeof weeklyCheckInSchema>
export type MonthlyReviewFormData = z.infer<typeof monthlyReviewSchema>
