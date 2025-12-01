import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function sanitizeHtml(html: string | null | undefined) {
  if (!html) return html
  let s = String(html)
  // remove script/style tags and their content
  s = s.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
  s = s.replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, '')
  // remove HTML comments
  s = s.replace(/<!--([\s\S]*?)-->/g, '')
  // remove on* attributes (onclick, onerror, etc.)
  s = s.replace(/\son\w+=\"[^\"]*\"/gi, '')
  s = s.replace(/\son\w+=\'[^\']*\'/gi, '')
  // strip javascript: URIs in href/src
  s = s.replace(/(href|src)=["']\s*javascript:[^"']*["']/gi, '')
  return s
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const sections = body?.sections
    if (!Array.isArray(sections)) {
      return NextResponse.json({ error: 'Missing sections array' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

    // Check admin role: prefer metadata, fallback to users table
    const metaRole = (user.user_metadata as any)?.role
    let isAdmin = metaRole === 'admin'
    if (!isAdmin) {
      const { data, error } = await supabase.from('users').select('role').eq('id', user.id).single()
      if (error) {
        console.error('Error checking user role:', error)
      } else {
        isAdmin = data?.role === 'admin'
      }
    }
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Sanitize and normalize incoming sections
    const normalized = sections.map((s: any, idx: number) => {
      const payload = s.payload || null
      // deep sanitize HTML fields inside payload where present
      if (payload && typeof payload === 'object') {
        if (payload.html) payload.html = sanitizeHtml(payload.html)
        if (Array.isArray(payload.items)) {
          payload.items = payload.items.map((it: any) => ({ ...it, description: sanitizeHtml(it.description) }))
        }
        if (Array.isArray(payload.cards)) {
          payload.cards = payload.cards.map((c: any) => ({ ...c, description: sanitizeHtml(c.description) }))
        }
      }
      // also sanitize content_html top-level
      const content_html = sanitizeHtml(s.content_html)

      return {
        id: s.id || undefined,
        title: s.title || null,
        kind: s.kind || 'rich',
        position: typeof s.position === 'number' ? s.position : idx,
        payload: payload ? payload : null,
        content_html,
        updated_at: new Date().toISOString(),
      }
    })

    // Upsert rows in a single call
    const { error: upsertError } = await supabase.from('about_sections').upsert(normalized, { onConflict: 'id' })
    if (upsertError) {
      console.error('Upsert error:', upsertError)
      return NextResponse.json({ error: upsertError.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Saved' }, { status: 200 })
  } catch (err: any) {
    console.error('Save about API error:', err)
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}
