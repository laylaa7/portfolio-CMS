"use client"

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

const supabase = createClient()

type Section = any

export default function AboutEditor() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('about_sections').select('*').order('position', { ascending: true })
      if (error) console.error(error)
      else if (data && mounted) setSections(normalize(data))
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [])

  const normalize = (rows: any[]) => rows.map(r => ({ id: r.id, title: r.title, kind: r.kind, position: r.position || 0, payload: typeof r.payload === 'string' ? JSON.parse(r.payload || '{}') : (r.payload || {}), content_html: r.content_html }))

  const saveAll = async () => {
    setSaving(true)
    try {
      const payload = sections.map(s => ({ id: s.id, title: s.title, kind: s.kind, position: s.position, payload: s.payload || null, content_html: s.content_html || null }))

      // POST to server-side save endpoint which will authenticate, sanitize and upsert
      const res = await fetch('/api/admin/about/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: payload }),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        console.error('Save failed', res.status, body)
        alert('Save failed: ' + (body?.error || res.statusText))
      } else {
        // refresh local copy from the DB
        const { data } = await supabase.from('about_sections').select('*').order('position', { ascending: true })
        if (data) setSections(normalize(data))
      }
    } finally {
      setSaving(false)
      setEditingId(null)
    }
  }

  const addSection = (title = 'New Section', kind = 'rich') => {
    const id = crypto.randomUUID()
    const payload = kind === 'rich' ? { html: '<p>New content</p>', enabled: true } : { enabled: true }
    setSections(prev => [...prev, { id, title, kind, position: prev.length, payload }])
    setEditingId(id)
  }

  const deleteSection = async (id: string) => {
    const s = sections.find(x => x.id === id)
    if (!s) return
    if (s.kind === 'hero') return alert('Cannot delete hero section')
    const { error } = await supabase.from('about_sections').delete().eq('id', id)
    if (error) console.error(error)
    else setSections(prev => prev.filter(x => x.id !== id).map((x, i) => ({ ...x, position: i })))
  }

  const move = (id: string, dir: 'up' | 'down') => setSections(prev => {
    const arr = [...prev]
    const i = arr.findIndex(s => s.id === id)
    if (i === -1) return prev
    const t = dir === 'up' ? i - 1 : i + 1
    if (t < 0 || t >= arr.length) return prev
    ;[arr[i], arr[t]] = [arr[t], arr[i]]
    return arr.map((s, idx) => ({ ...s, position: idx }))
  })

  const update = (id: string, patch: Partial<Section>) => setSections(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))

  if (loading) return <div>Loading…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold">About Editor</h2>
        <div className="ml-auto flex gap-2">
          <Button onClick={() => setEditMode(m => !m)}>{editMode ? 'Exit edit mode' : 'Enter edit mode'}</Button>
          <Button onClick={() => addSection()}>Add section</Button>
          <Button onClick={saveAll} disabled={saving}>{saving ? 'Saving...' : 'Save all'}</Button>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map(s => (
          <div key={s.id} className="relative border rounded p-4 bg-white">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <div className="text-sm text-gray-500">{s.kind}</div>
              </div>
              {editMode && (
                <div className="flex items-center gap-2">
                  {s.kind !== 'hero' && <button className="px-2 py-1 border rounded" onClick={() => move(s.id, 'up')}>↑</button>}
                  {s.kind !== 'hero' && <button className="px-2 py-1 border rounded" onClick={() => move(s.id, 'down')}>↓</button>}
                  {s.kind !== 'hero' && <button className="px-2 py-1 border rounded text-red-600" onClick={() => deleteSection(s.id)}>Delete</button>}
                  <button className="px-2 py-1 border rounded" onClick={() => setEditingId(s.id)}>Edit</button>
                </div>
              )}
            </div>

            <div className="mt-4">
              {editingId === s.id ? (
                <div className="space-y-3">
                  <input className="w-full rounded border px-3 py-2" value={s.title || ''} onChange={(e) => update(s.id, { title: e.target.value })} />
                  {s.kind === 'hero' && (
                    <>
                      <input className="w-full rounded border px-3 py-2" placeholder="Main title" value={s.payload?.title_main || ''} onChange={(e) => update(s.id, { payload: { ...(s.payload || {}), title_main: e.target.value } })} />
                      <input className="w-full rounded border px-3 py-2" placeholder="Highlight" value={s.payload?.title_highlight || ''} onChange={(e) => update(s.id, { payload: { ...(s.payload || {}), title_highlight: e.target.value } })} />
                      <input className="w-full rounded border px-3 py-2" placeholder="Subtitle" value={s.payload?.subtitle || ''} onChange={(e) => update(s.id, { payload: { ...(s.payload || {}), subtitle: e.target.value } })} />
                      <input className="w-full rounded border px-3 py-2" placeholder="CTA label" value={s.payload?.primary_cta_label || ''} onChange={(e) => update(s.id, { payload: { ...(s.payload || {}), primary_cta_label: e.target.value } })} />
                      <input className="w-full rounded border px-3 py-2" placeholder="CTA URL" value={s.payload?.primary_cta_url || ''} onChange={(e) => update(s.id, { payload: { ...(s.payload || {}), primary_cta_url: e.target.value } })} />
                      <input className="w-full rounded border px-3 py-2" placeholder="Hero image URL" value={s.payload?.image_url || ''} onChange={(e) => update(s.id, { payload: { ...(s.payload || {}), image_url: e.target.value } })} />
                    </>
                  )}
                  {s.kind === 'rich' && (
                    <textarea className="w-full rounded border p-2" rows={6} value={s.payload?.html || s.content_html || ''} onChange={(e) => update(s.id, { payload: { ...(s.payload || {}), html: e.target.value } })} />
                  )}
                  {s.kind === 'cards' && (
                    <div className="space-y-2">
                      {(s.payload?.cards || []).map((c: any, i: number) => (
                        <div key={i} className="border rounded p-2">
                          <input className="w-full rounded border px-2 py-1 mb-1" value={c.title || ''} onChange={(e) => { const cards = [...(s.payload?.cards || [])]; cards[i] = { ...cards[i], title: e.target.value }; update(s.id, { payload: { ...(s.payload || {}), cards } }) }} />
                          <input className="w-full rounded border px-2 py-1" value={c.description || ''} onChange={(e) => { const cards = [...(s.payload?.cards || [])]; cards[i] = { ...cards[i], description: e.target.value }; update(s.id, { payload: { ...(s.payload || {}), cards } }) }} />
                          <div className="text-right mt-2"><button className="text-sm text-red-600" onClick={() => { const cards = (s.payload?.cards || []).filter((_: any, idx: number) => idx !== i); update(s.id, { payload: { ...(s.payload || {}), cards } }) }}>Remove</button></div>
                        </div>
                      ))}
                      <div><button className="px-3 py-1 border rounded" onClick={() => { const cards = [...(s.payload?.cards || []), { title: 'New', description: '' }]; update(s.id, { payload: { ...(s.payload || {}), cards } }) }}>Add card</button></div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button onClick={() => setEditingId(null)}>Done</Button>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Preview */}
                  {s.kind === 'hero' ? (
                    <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                      <div className="md:col-span-7">
                        <h2 className="text-4xl font-extrabold">{s.payload?.title_main || s.title || ''} <span style={{ color: '#C7A600' }}>{s.payload?.title_highlight || ''}</span></h2>
                        <p className="mt-2 text-gray-700">{s.payload?.subtitle || ''}</p>
                      </div>
                      <div className="md:col-span-5 flex justify-center">
                        <img src={s.payload?.image_url || '/hero-photo.svg'} alt="hero" className="rounded-xl w-64 h-80 object-cover shadow" />
                      </div>
                    </div>
                  ) : s.kind === 'rich' ? (
                    <div dangerouslySetInnerHTML={{ __html: s.payload?.html || s.content_html || '' }} />
                  ) : s.kind === 'cards' ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">{(s.payload?.cards || []).map((c: any, i: number) => <div key={i} className="p-4 bg-gray-50 rounded"><h4 className="font-semibold">{c.title}</h4><p className="text-sm mt-1">{c.description}</p></div>)}</div>
                  ) : (
                    <div>Section preview unavailable</div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
