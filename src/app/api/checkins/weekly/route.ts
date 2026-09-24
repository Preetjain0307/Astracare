import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { submitWeeklyCheckIn, getCurrentWeekCheckIn } from '@/services/questionnaire'
import { z } from 'zod'

const weeklyCheckInSchema = z.object({
  overall_health: z.number().min(1).max(10),
  exercise_frequency: z.string().min(1),
  stress_level: z.number().min(1).max(10),
  unusual_symptoms: z.boolean(),
  notes: z.string().optional(),
  week_start_date: z.string().optional(),
})

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const checkIn = await getCurrentWeekCheckIn(user.id)
    return NextResponse.json({ checkIn })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = weeklyCheckInSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.format() }, { status: 400 })
    }

    const result = await submitWeeklyCheckIn(user.id, parsed.data)
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to save weekly check-in' }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Weekly Check-In Saved ✓' })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  return POST(request)
}
