import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, role } = await request.json()

    if (!userId || !role) {
      return NextResponse.json({ error: 'Missing userId or role' }, { status: 400 })
    }

    const supabase = await createClient()

    // Update public.users table
    const { error: updateError } = await supabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating users table:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    // Update Auth user's metadata using Supabase Admin REST API with service_role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL')
      return NextResponse.json({ warning: 'Updated users table but server is not configured to update auth metadata' }, { status: 207 })
    }

    try {
      const res = await fetch(`${supabaseUrl}/auth/v1/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
        },
        body: JSON.stringify({ user_metadata: { role } }),
      })

      if (!res.ok) {
        const body = await res.text()
        console.error('Error updating auth metadata via admin API:', res.status, body)
        return NextResponse.json({ warning: 'Updated users table but failed to update auth metadata', error: body }, { status: 207 })
      }
    } catch (err: any) {
      console.error('Unexpected error updating auth metadata:', err)
      return NextResponse.json({ warning: 'Updated users table but failed to update auth metadata', error: String(err) }, { status: 207 })
    }

    return NextResponse.json({ message: 'Role updated' }, { status: 200 })
  } catch (err: any) {
    console.error('Update role API error:', err)
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}
