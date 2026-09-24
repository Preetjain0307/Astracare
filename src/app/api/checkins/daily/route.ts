import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { submitDailyCheckIn, getTodayDailyCheckIn } from '@/services/questionnaire'
import { z } from 'zod'

const dailyCheckInSchema = z.object({
  feeling: z.string().min(1, 'Feeling selection is required'),
  sleep_quality: z.string().min(1, 'Sleep quality selection is required'),
  energy_level: z.string().min(1, 'Energy level selection is required'),
  symptoms: z.array(z.string()).default([]),
  activity_done: z.boolean(),
  checkin_date: z.string().optional(),
})

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const checkIn = await getTodayDailyCheckIn(user.id)
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
    const parsed = dailyCheckInSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.format() }, { status: 400 })
    }

    const result = await submitDailyCheckIn(user.id, parsed.data)
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to save daily check-in' }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Daily Check-In Complete ✓' })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  return POST(request)
}
