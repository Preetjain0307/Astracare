import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  addHydrationEntry,
  deleteHydrationEntry,
  getTodayHydration,
  setHydrationGoal,
} from '@/services/questionnaire'
import { z } from 'zod'

const addHydrationSchema = z.object({
  amount_ml: z.number().min(50, 'Amount must be at least 50ml').max(2000, 'Single entry limit is 2000ml'),
})

const goalSchema = z.object({
  daily_goal_ml: z.number().min(500, 'Minimum hydration goal is 500ml').max(10000, 'Maximum hydration goal is 10000ml'),
})

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const data = await getTodayHydration(user.id)
    return NextResponse.json(data)
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
    const parsed = addHydrationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid amount', details: parsed.error.format() }, { status: 400 })
    }

    const result = await addHydrationEntry(user.id, parsed.data.amount_ml)
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to add hydration' }, { status: 400 })
    }

    const updated = await getTodayHydration(user.id)
    return NextResponse.json({ success: true, ...updated })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const parsed = goalSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid goal', details: parsed.error.format() }, { status: 400 })
    }

    const result = await setHydrationGoal(user.id, parsed.data.daily_goal_ml)
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to update goal' }, { status: 400 })
    }

    const updated = await getTodayHydration(user.id)
    return NextResponse.json({ success: true, ...updated })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const entryId = searchParams.get('id')
    if (!entryId) {
      return NextResponse.json({ error: 'Entry ID required' }, { status: 400 })
    }

    const result = await deleteHydrationEntry(user.id, entryId)
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to delete entry' }, { status: 400 })
    }

    const updated = await getTodayHydration(user.id)
    return NextResponse.json({ success: true, ...updated })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 })
  }
}
