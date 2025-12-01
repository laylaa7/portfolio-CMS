import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, subject, message } = body
    if (!name || !email || !message) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const supabase = await createClient()

    // fetch admin contact email from 'about' table (contact_info.email)
    const { data: about } = await supabase.from('about').select('contact_info').single()
    const adminEmail = (about?.contact_info && about.contact_info.email) || process.env.CONTACT_EMAIL || null

    // insert message into contact_messages table for record-keeping
    const payload = {
      name,
      email,
      subject,
      message,
      sent: false
    }
    try {
      await supabase.from('contact_messages').insert(payload)
    } catch (err) {
      // table might not exist; ignore insertion error but continue
      console.warn('contact_messages insert failed (table may be missing):', err)
    }

    // If admin email present and SMTP env configured we could attempt to send here.
    // For now we simply acknowledge receipt; sending via SMTP/3rd-party can be added later.

    // Optionally, return adminEmail so frontend can show where it's being sent (not exposing secrets)
    return NextResponse.json({ ok: true, adminEmail: adminEmail || null })
  } catch (err) {
    console.error('Error handling contact POST', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
