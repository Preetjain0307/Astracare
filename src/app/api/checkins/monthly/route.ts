import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { submitMonthlyReview, getCurrentMonthReview } from '@/services/questionnaire'
import { z } from 'zod'

const monthlyReviewSchema = z.object({
  period_regular: z.string().min(1),
  severe_symptoms: z.boolean(),
  weight_change: z.string().min(1),
  sleep_quality: z.string().min(1),
  stress_level: z.number().min(1).max(10),
  notes: z.string().optional(),
  review_month: z.string().optional(),
})

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const review = await getCurrentMonthReview(user.id)
    return NextResponse.json({ review })
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
    const parsed = monthlyReviewSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Validation error', details: parsed.error.format() }, { status: 400 })
    }

    const result = await submitMonthlyReview(user.id, parsed.data)
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to save monthly review' }, { status: 400 })
    }

    return NextResponse.json({ success: true, message: 'Monthly Review Saved ✓' })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  return POST(request)
}
