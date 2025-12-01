"use client"

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

const supabase = createClient()

type Section = {
  id: string
  title?: string
  kind?: string
  position?: number
  content_html?: string
  payload?: any
}

export default function AboutInlineEditor() {
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(true) // start in edit mode for admin

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('about_sections').select('*').order('position', { ascending: true })
      if (error) console.error('Failed to load sections', error)
      else if (data && mounted) setSections(normalizeData(data))
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [])

  const normalizeData = (rows: any[]) => rows.map(r => ({
    id: r.id,
    title: r.title || '',
    kind: r.kind || 'rich',
    position: r.position ?? 0,
    content_html: r.content_html || '',
    payload: typeof r.payload === 'string' ? JSON.parse(r.payload || '{}') : (r.payload || {})
  }))

  const addSection = (kind: string) => {
    const id = crypto.randomUUID()
    const payload = kind === 'rich' ? { html: '<p>New content</p>', enabled: true } : { items: [], cards: [], enabled: true }
    const s: Section = { id, title: 'New section', kind, position: sections.length, payload }
    setSections(prev => [...prev, s])
    setEditingId(id)
  }

  const moveById = (id: string, dir: 'up' | 'down') => {
    setSections(prev => {
      const next = [...prev]
      const i = next.findIndex(s => s.id === id)
      if (i === -1) return prev
      const t = dir === 'up' ? i - 1 : i + 1
      if (t < 0 || t >= next.length) return prev
      ;[next[i], next[t]] = [next[t], next[i]]
      return next.map((s, idx) => ({ ...s, position: idx }))
    })
  }

  const deleteById = async (id: string) => {
    // hero cannot be deleted
    const s = sections.find(x => x.id === id)
    if (!s) return
    if (s.kind === 'hero') return alert('Hero cannot be deleted')

    const { error } = await supabase.from('about_sections').delete().eq('id', id)
    if (error) return console.error('Delete failed', error)
    setSections(prev => prev.filter(x => x.id !== id).map((x, i) => ({ ...x, position: i })))
  }

  const updateSection = (id: string, patch: Partial<Section>) => setSections(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))

  const saveAll = async () => {
    setSaving(true)
    try {
      const payload = sections.map(s => ({ id: s.id, title: s.title, content_html: s.content_html || null, position: s.position || 0, kind: s.kind || 'rich', payload: s.payload || null }))
      const { error } = await supabase.from('about_sections').upsert(payload, { onConflict: 'id' })
      if (error) console.error('Save failed', error)
      else {
        const { data } = await supabase.from('about_sections').select('*').order('position', { ascending: true })
        if (data) setSections(normalizeData(data))
      }
    } finally {
      setSaving(false)
      setEditingId(null)
    }
  }

  if (loading) return <div>Loading…</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">About Editor</h2>
        <div className="ml-auto flex gap-2">
          <Button onClick={() => setEditMode(m => !m)}>{editMode ? 'Exit edit mode' : 'Enter edit mode'}</Button>
          <Button onClick={() => addSection('rich')}>+ Section</Button>
          <Button onClick={() => addSection('cards')}>+ Cards</Button>
          <Button onClick={() => addSection('timeline')}>+ Timeline</Button>
          <Button onClick={saveAll} disabled={saving}>{saving ? 'Saving...' : 'Save all'}</Button>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map(s => (
          <EditableSection
            key={s.id}
            section={s}
            editMode={editMode}
            isEditing={editingId === s.id}
            onStartEdit={() => setEditingId(s.id)}
            onCloseEdit={() => setEditingId(null)}
            onMoveUp={() => moveById(s.id, 'up')}
            onMoveDown={() => moveById(s.id, 'down')}
            onDelete={() => deleteById(s.id)}
            onChange={(patch: Partial<Section>) => updateSection(s.id, patch)}
          />
        ))}
      </div>
    </div>
  )
}

function EditableSection({ section, editMode, isEditing, onStartEdit, onCloseEdit, onMoveUp, onMoveDown, onDelete, onChange }: any) {
  const [hover, setHover] = useState(false)
  const payload = typeof section.payload === 'string' ? JSON.parse(section.payload || '{}') : (section.payload || {})

  return (
    <div className="relative border rounded-md p-4 bg-white" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-baseline gap-3">
            <h3 className="text-lg font-semibold">{section.title || (section.kind === 'hero' ? 'Hero' : 'Section')}</h3>
            <span className="text-sm text-gray-500">{section.kind}</span>
          </div>
          {section.kind !== 'hero' && <div className="text-sm text-gray-600">Position: {section.position}</div>}
        </div>

        {editMode && hover && (
          <div className="flex items-center gap-2">
            {section.kind !== 'hero' && <button className="px-2 py-1 border rounded" onClick={onMoveUp} title="Move up">↑</button>}
            {section.kind !== 'hero' && <button className="px-2 py-1 border rounded" onClick={onMoveDown} title="Move down">↓</button>}
            {section.kind !== 'hero' && <button className="px-2 py-1 border rounded text-red-600" onClick={onDelete} title="Delete">Delete</button>}
            <button className="px-2 py-1 border rounded" onClick={isEditing ? onCloseEdit : onStartEdit}>{isEditing ? 'Close' : 'Edit'}</button>
          </div>
        )}
      </div>

      <div className="mt-4">
        {!isEditing && (
          <SectionPreview section={section} />
        )}

        {isEditing && (
          <SectionEditorControls section={section} onChange={onChange} onClose={onCloseEdit} />
        )}
      </div>
    </div>
  )
}

function SectionPreview({ section }: any) {
  const payload = typeof section.payload === 'string' ? JSON.parse(section.payload || '{}') : (section.payload || {})

  if (section.kind === 'hero') {
    const main = payload.title_main || section.title || "Hello, I'm"
    const highlight = payload.title_highlight || ''
    const subtitle = payload.subtitle || ''
    const image = payload.image_url || '/hero-photo.svg'
    const cta = payload.primary_cta_label || ''
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
        <div className="md:col-span-7">
          <h1 className="text-4xl md:text-5xl font-extrabold"><span className="text-[#0D0A53]">{main} </span><span style={{ color: '#C7A600' }}>{highlight}</span></h1>
          {subtitle && <p className="mt-3 text-gray-700">{subtitle}</p>}
          {cta && <div className="mt-4"><a href={payload.primary_cta_url || '#'} className="inline-block px-5 py-2 rounded bg-[#0D0A53] text-white">{cta}</a></div>}
        </div>
        <div className="md:col-span-5 flex justify-center">
          <img src={image} alt="hero" className="w-64 h-80 object-cover rounded-xl shadow" />
        </div>
      </div>
    )
  }

  if (section.kind === 'rich') {
    return <div dangerouslySetInnerHTML={{ __html: payload.html || section.content_html || '' }} />
  }

  if (section.kind === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(payload.cards || []).map((c: any, i: number) => (
          <div key={i} className="p-4 rounded bg-gray-50">
            <h4 className="font-semibold">{c.title}</h4>
            <p className="text-sm mt-1">{c.description}</p>
          </div>
        ))}
      </div>
    )
  }

  if (section.kind === 'timeline') {
    return (
      <div className="space-y-4">
        {(payload.items || []).map((it: any, i: number) => (
          <div key={i}>
            <div className="text-sm text-gray-500">{it.date}</div>
            <div className="font-semibold">{it.title}</div>
            <div dangerouslySetInnerHTML={{ __html: it.description || '' }} />
          </div>
        ))}
      </div>
    )
  }

  return <div>Preview not available for this section type.</div>
}

function SectionEditorControls({ section, onChange, onClose }: any) {
  const payload = typeof section.payload === 'string' ? JSON.parse(section.payload || '{}') : (section.payload || {})

  const updatePayload = (next: any) => onChange({ payload: { ...(payload || {}), ...next } })

  return (
    <div className="space-y-3">
      <input className="w-full rounded border px-3 py-2" value={section.title || ''} onChange={(e) => onChange({ title: e.target.value })} placeholder="Section title" />

      {section.kind === 'hero' && (
        <>
          <input className="w-full rounded border px-3 py-2" value={payload.title_main || ''} onChange={(e) => updatePayload({ title_main: e.target.value })} placeholder="Main title" />
          <input className="w-full rounded border px-3 py-2" value={payload.title_highlight || ''} onChange={(e) => updatePayload({ title_highlight: e.target.value })} placeholder="Highlight" />
          <input className="w-full rounded border px-3 py-2" value={payload.subtitle || ''} onChange={(e) => updatePayload({ subtitle: e.target.value })} placeholder="Subtitle" />
          <input className="w-full rounded border px-3 py-2" value={payload.primary_cta_label || ''} onChange={(e) => updatePayload({ primary_cta_label: e.target.value })} placeholder="CTA label" />
          <input className="w-full rounded border px-3 py-2" value={payload.primary_cta_url || ''} onChange={(e) => updatePayload({ primary_cta_url: e.target.value })} placeholder="CTA URL" />
          <input className="w-full rounded border px-3 py-2" value={payload.image_url || ''} onChange={(e) => updatePayload({ image_url: e.target.value })} placeholder="Hero image URL (optional)" />
        </>
      )}

      {section.kind === 'rich' && (
        <textarea className="w-full rounded border p-2" rows={6} value={payload.html || section.content_html || ''} onChange={(e) => updatePayload({ html: e.target.value })} />
      )}

      {section.kind === 'cards' && (
        <div className="space-y-2">
          {(payload.cards || []).map((c: any, i: number) => (
            <div key={i} className="border rounded p-2">
              <input className="w-full rounded border px-2 py-1 mb-1" value={c.title || ''} onChange={(e) => { const cards = [...(payload.cards || [])]; cards[i] = { ...cards[i], title: e.target.value }; updatePayload({ cards }) }} />
              <input className="w-full rounded border px-2 py-1" value={c.description || ''} onChange={(e) => { const cards = [...(payload.cards || [])]; cards[i] = { ...cards[i], description: e.target.value }; updatePayload({ cards }) }} />
              <div className="text-right mt-2"><button className="text-sm text-red-600" onClick={() => { const cards = (payload.cards || []).filter((_: any, idx: number) => idx !== i); updatePayload({ cards }) }}>Remove</button></div>
            </div>
          ))}
          <div><button className="px-3 py-1 border rounded" onClick={() => { const cards = [...(payload.cards || []), { title: 'New', description: '' }]; updatePayload({ cards }) }}>Add card</button></div>
        </div>
      )}

      {section.kind === 'timeline' && (
        <div className="space-y-2">
          {(payload.items || []).map((it: any, i: number) => (
            <div key={i} className="border rounded p-2">
              <input className="w-full rounded border px-2 py-1 mb-1" value={it.date || ''} onChange={(e) => { const items = [...(payload.items || [])]; items[i] = { ...items[i], date: e.target.value }; updatePayload({ items }) }} />
              <input className="w-full rounded border px-2 py-1 mb-1" value={it.title || ''} onChange={(e) => { const items = [...(payload.items || [])]; items[i] = { ...items[i], title: e.target.value }; updatePayload({ items }) }} />
              <textarea className="w-full rounded border p-2" rows={3} value={it.description || ''} onChange={(e) => { const items = [...(payload.items || [])]; items[i] = { ...items[i], description: e.target.value }; updatePayload({ items }) }} />
              <div className="text-right mt-2"><button className="text-sm text-red-600" onClick={() => { const items = (payload.items || []).filter((_: any, idx: number) => idx !== i); updatePayload({ items }) }}>Remove</button></div>
            </div>
          ))}
          <div><button className="px-3 py-1 border rounded" onClick={() => { const items = [...(payload.items || []), { date: '', title: '', description: '' }]; updatePayload({ items }) }}>Add item</button></div>
        </div>
      )}

      <div className="flex gap-2 mt-3">
        <Button onClick={onClose}>Done</Button>
      </div>
    </div>
  )
}
