"use client"

import React, { useEffect, useState } from "react"
import RichText from "@/components/ui/rich-text"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import LivePreview from "./live-preview"

type Section = {
  id: string
  title: string
  content_html: string
  position?: number
  image_url?: string
  kind?: string
  payload?: any
}

export default function AboutSectionsForm() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sections, setSections] = useState<Section[]>([])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('about_sections').select('*').order('position', { ascending: true })
      if (error) {
        console.error('Error loading about sections:', error)
        toast.error('Failed to load about sections')
      } else if (data && mounted) {
        const normalize = (d: any) => {
          const base = {
            id: d.id,
            title: d.title || '',
            content_html: d.content_html || '',
            position: d.position || 0,
            image_url: d.image_url || '',
            kind: d.kind || 'rich',
              payload: d.payload || (d.content_html ? { html: d.content_html } : {})
          }
            // ensure enabled flag exists
            base.payload = base.payload || {}
            base.payload.enabled = typeof base.payload.enabled === 'boolean' ? base.payload.enabled : true
          // normalize payload shapes for cards/timeline/list so editors can assume objects
          try {
            if (base.kind === 'cards') {
              base.payload = base.payload || {}
              base.payload.cards = (base.payload.cards || []).map((c: any) => ({ icon: c.icon || '', title: c.title || '', description: c.description || '', image_url: c.image_url || '' }))
            }
            if (base.kind === 'timeline') {
              base.payload = base.payload || {}
              base.payload.items = (base.payload.items || []).map((it: any) => ({ date: it?.date || '', title: it?.title || '', description: it?.description || '', image_url: it?.image_url || '' }))
            }
            if (base.kind === 'list') {
              base.payload = base.payload || {}
              base.payload.items = (base.payload.items || []).map((it: any) => (typeof it === 'string' ? { html: it, image_url: '' } : { html: it?.html || '', image_url: it?.image_url || '' }))
            }
          } catch (err) {
            console.warn('Error normalizing payload for about section', err)
          }
          return base
        }

        setSections(data.map((d: any) => normalize(d)))
      }
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [supabase])

  const addSection = () => {
    const id = crypto.randomUUID()
    // new sections are appended after existing ones and cannot be created as 'hero'
    setSections(prev => [...prev, { id, title: 'New section', content_html: '<p>Content</p>', position: prev.length, image_url: '', kind: 'rich', payload: { html: '<p>Content</p>', enabled: true } }])
  }

  const moveSection = (index: number, direction: 'up' | 'down') => {
    setSections(prev => {
      const next = [...prev]
      const target = direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= next.length) return prev
      const tmp = next[target]
      next[target] = next[index]
      next[index] = tmp
      // fix positions
      return next.map((s, i) => ({ ...s, position: i }))
    })
  }

  // Move a section by id (safe when rendering filtered lists where indexes don't match)
  const moveSectionById = (id: string, direction: 'up' | 'down') => {
    setSections(prev => {
      const next = [...prev]
      const index = next.findIndex(s => s.id === id)
      if (index === -1) return prev
      const target = direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= next.length) return prev
      const tmp = next[target]
      next[target] = next[index]
      next[index] = tmp
      return next.map((s, i) => ({ ...s, position: i }))
    })
  }

  // mark a section as disabled (hidden). We keep it in the admin list so admins can re-enable or permanently delete later.
  const removeSection = (id: string) => setSections(prev => prev.map(s => s.id === id ? { ...s, payload: { ...(s.payload || {}), enabled: false } } : s))

  const updateSection = (id: string, patch: Partial<Section>) => setSections(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof window !== 'undefined' && !navigator.onLine) {
      toast.error('You appear to be offline. Check your connection and try again.')
      return
    }
    setSaving(true)
    try {
      // ensure positions and map to DB shape (include kind and payload)
      const payload = sections.map((s, idx) => ({
        id: s.id,
        title: s.title,
        content_html: s.content_html || (s.payload?.html ?? null),
        position: s.position ?? idx,
        image_url: s.image_url || null,
        kind: s.kind || 'rich',
        payload: s.payload || null,
      }))

      const { error } = await supabase.from('about_sections').upsert(payload, { onConflict: 'id' })
      if (error) {
        console.error('Error saving about sections:', error)
        toast.error('Save failed')
      } else {
        toast.success('Saved')
        router.refresh()
      }
    } catch (err) {
      console.error(err)
      toast.error('Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading…</div>

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={handleSave} className="space-y-6">
        {/* Hero editor (single) */}
        {(() => {
          const hero = sections.find((x) => x.kind === 'hero')
          if (hero) {
            return (
              <div key={hero.id} className="border rounded p-4 space-y-3">
                <div className="flex items-center justify-between gap-4">
                  <input className="flex-1 rounded border px-3 py-2" value={hero.title} onChange={(e) => updateSection(hero.id, { title: e.target.value })} />
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Visible</label>
                    <input type="checkbox" checked={hero.payload?.enabled !== false} onChange={(e) => updateSection(hero.id, { payload: { ...(hero.payload || {}), enabled: e.target.checked } })} />
                    <Button variant="ghost" size="sm" type="button" onClick={() => removeSection(hero.id)}>Remove</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium mb-2">Section type</label>
                    <select value={hero.kind || 'hero'} onChange={(e) => updateSection(hero.id, { kind: e.target.value })} className="w-full rounded border px-3 py-2">
                      <option value="hero">Hero</option>
                    </select>
                  </div>

                  {/* Image uploads removed — hero image handling is disabled to avoid rendering issues */}
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="rounded border px-3 py-2" placeholder="Badge label" value={hero.payload?.badge_label || ''} onChange={(e) => updateSection(hero.id, { payload: { ...(hero.payload || {}), badge_label: e.target.value } })} />
                    <input className="rounded border px-3 py-2" placeholder="Subtitle" value={hero.payload?.subtitle || ''} onChange={(e) => updateSection(hero.id, { payload: { ...(hero.payload || {}), subtitle: e.target.value } })} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="rounded border px-3 py-2" placeholder="Title main" value={hero.payload?.title_main || ''} onChange={(e) => updateSection(hero.id, { payload: { ...(hero.payload || {}), title_main: e.target.value } })} />
                    <input className="rounded border px-3 py-2" placeholder="Title highlight" value={hero.payload?.title_highlight || ''} onChange={(e) => updateSection(hero.id, { payload: { ...(hero.payload || {}), title_highlight: e.target.value } })} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="rounded border px-3 py-2" placeholder="Primary CTA label" value={hero.payload?.primary_cta_label || ''} onChange={(e) => updateSection(hero.id, { payload: { ...(hero.payload || {}), primary_cta_label: e.target.value } })} />
                    <input className="rounded border px-3 py-2" placeholder="Primary CTA URL" value={hero.payload?.primary_cta_url || ''} onChange={(e) => updateSection(hero.id, { payload: { ...(hero.payload || {}), primary_cta_url: e.target.value } })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Hero HTML (optional)</label>
                    <RichText value={hero.payload?.html || hero.content_html || ''} onChange={(html) => updateSection(hero.id, { payload: { ...(hero.payload || {}), html } })} placeholder="Hero content" />
                  </div>
                </div>
              </div>
            )
          }
          // no hero: show create hero button
          return (
            <div className="mb-4">
              <Button type="button" onClick={() => {
                const id = crypto.randomUUID()
                setSections(prev => [{ id, title: 'Hero', content_html: '', position: 0, image_url: '', kind: 'hero', payload: { html: '', enabled: true } }, ...prev.map((s) => ({ ...s, position: (s.position || 0) + 1 }))])
              }}>Create hero section</Button>
            </div>
          )
        })()}

        {/* Other sections */}
        {sections.filter(s => s.kind !== 'hero').map((s, idx) => (
          <div key={s.id} className="border rounded p-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <input className="flex-1 rounded border px-3 py-2" value={s.title} onChange={(e) => updateSection(s.id, { title: e.target.value })} />
                <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => moveSectionById(s.id, 'up')}>↑</Button>
                <Button variant="ghost" size="sm" type="button" onClick={() => moveSectionById(s.id, 'down')}>↓</Button>
                <Button variant="ghost" size="sm" type="button" onClick={() => removeSection(s.id)}>Remove</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2">Section type</label>
                <select value={s.kind || 'rich'} onChange={(e) => updateSection(s.id, { kind: e.target.value })} className="w-full rounded border px-3 py-2">
                  {/* hero is managed specially at the top; do not allow creating additional hero sections here */}
                  <option value="rich">Rich text</option>
                  <option value="cards">Cards/Grid</option>
                  <option value="timeline">Timeline</option>
                  <option value="list">List / bullets</option>
                </select>
              </div>

              {/* Image uploads removed for sections */}
            </div>

            {/* Kind-specific editors */}
            {s.kind === 'hero' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="rounded border px-3 py-2" placeholder="Badge label" value={s.payload?.badge_label || ''} onChange={(e) => updateSection(s.id, { payload: { ...(s.payload || {}), badge_label: e.target.value } })} />
                  <input className="rounded border px-3 py-2" placeholder="Subtitle" value={s.payload?.subtitle || ''} onChange={(e) => updateSection(s.id, { payload: { ...(s.payload || {}), subtitle: e.target.value } })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="rounded border px-3 py-2" placeholder="Title main" value={s.payload?.title_main || ''} onChange={(e) => updateSection(s.id, { payload: { ...(s.payload || {}), title_main: e.target.value } })} />
                  <input className="rounded border px-3 py-2" placeholder="Title highlight" value={s.payload?.title_highlight || ''} onChange={(e) => updateSection(s.id, { payload: { ...(s.payload || {}), title_highlight: e.target.value } })} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input className="rounded border px-3 py-2" placeholder="Primary CTA label" value={s.payload?.primary_cta_label || ''} onChange={(e) => updateSection(s.id, { payload: { ...(s.payload || {}), primary_cta_label: e.target.value } })} />
                  <input className="rounded border px-3 py-2" placeholder="Primary CTA URL" value={s.payload?.primary_cta_url || ''} onChange={(e) => updateSection(s.id, { payload: { ...(s.payload || {}), primary_cta_url: e.target.value } })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Hero HTML (optional)</label>
                  <RichText value={s.payload?.html || s.content_html || ''} onChange={(html) => updateSection(s.id, { payload: { ...(s.payload || {}), html } })} placeholder="Hero content" />
                </div>
              </div>
            )}

            {s.kind === 'timeline' && (
              <div className="space-y-3">
                {(s.payload?.items || []).map((it: any, i: number) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-start">
                    <input className="col-span-3 rounded border px-2 py-1" placeholder="Date (e.g. 2010 - 2015)" value={it.date || ''} onChange={(e) => {
                      const items = [...(s.payload?.items || [])]; items[i] = { ...items[i], date: e.target.value }; updateSection(s.id, { payload: { ...(s.payload || {}), items } })
                    }} />
                    <input className="col-span-9 rounded border px-2 py-1" placeholder="Title" value={it.title || ''} onChange={(e) => {
                      const items = [...(s.payload?.items || [])]; items[i] = { ...items[i], title: e.target.value }; updateSection(s.id, { payload: { ...(s.payload || {}), items } })
                    }} />
                    <div className="col-span-12 mt-2">
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <RichText value={it.description || ''} onChange={(html) => { const items = [...(s.payload?.items || [])]; items[i] = { ...items[i], description: html }; updateSection(s.id, { payload: { ...(s.payload || {}), items } }) }} />
                    </div>
                    {/* Item images disabled */}
                    <div className="col-span-12 text-right">
                      <Button variant="ghost" size="sm" onClick={() => { const items = (s.payload?.items || []).filter((_: any, idx2: number) => idx2 !== i); updateSection(s.id, { payload: { ...(s.payload || {}), items } }) }}>Remove</Button>
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={() => { const items = [...(s.payload?.items || []), { date: '', title: '', description: '' }]; updateSection(s.id, { payload: { ...(s.payload || {}), items } }) }}>Add timeline item</Button>
              </div>
            )}

            {s.kind === 'list' && (
              <div className="space-y-3">
                {(s.payload?.items || []).map((it: any, i: number) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-10">
                      <RichText value={(it && it.html) || ''} onChange={(html) => { const items = [...(s.payload?.items || [])]; items[i] = { ...(items[i] || {}), html }; updateSection(s.id, { payload: { ...(s.payload || {}), items } }) }} />
                    </div>
                    {/* Item images disabled */}
                    <div className="col-span-2">
                      <Button variant="ghost" size="sm" onClick={() => { const items = (s.payload?.items || []).filter((_: any, idx2: number) => idx2 !== i); updateSection(s.id, { payload: { ...(s.payload || {}), items } }) }}>Remove</Button>
                    </div>
                  </div>
                ))}
                <Button type="button" onClick={() => { const items = [...(s.payload?.items || []), { html: '', image_url: '' }]; updateSection(s.id, { payload: { ...(s.payload || {}), items } }) }}>Add list item</Button>
              </div>
            )}

            {s.kind === 'cards' && (
              <div className="space-y-3">
                <div className="space-y-2">
                  {(s.payload?.cards || []).map((c: any, i: number) => (
                    <div key={i} className="border rounded p-3">
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <input className="col-span-3 rounded border px-2 py-1" placeholder="Icon" value={c.icon || ''} onChange={(e) => {
                          const cards = [...(s.payload?.cards || [])]; cards[i] = { ...cards[i], icon: e.target.value }; updateSection(s.id, { payload: { ...(s.payload || {}), cards } })
                        }} />
                        <input className="col-span-4 rounded border px-2 py-1" placeholder="Title" value={c.title || ''} onChange={(e) => {
                          const cards = [...(s.payload?.cards || [])]; cards[i] = { ...cards[i], title: e.target.value }; updateSection(s.id, { payload: { ...(s.payload || {}), cards } })
                        }} />
                        <input className="col-span-4 rounded border px-2 py-1" placeholder="Description" value={c.description || ''} onChange={(e) => {
                          const cards = [...(s.payload?.cards || [])]; cards[i] = { ...cards[i], description: e.target.value }; updateSection(s.id, { payload: { ...(s.payload || {}), cards } })
                        }} />
                        <Button className="col-span-1" variant="ghost" size="sm" onClick={() => {
                          const cards = (s.payload?.cards || []).filter((_: any, idx2: number) => idx2 !== i)
                          updateSection(s.id, { payload: { ...(s.payload || {}), cards } })
                        }}>Remove</Button>
                      </div>
                      {/* Card images disabled */}
                    </div>
                  ))}
                </div>
                <Button type="button" onClick={() => {
                  const cards = [...(s.payload?.cards || []), { icon: '', title: '', description: '', image_url: '' }]
                  updateSection(s.id, { payload: { ...(s.payload || {}), cards } })
                }}>Add card</Button>
              </div>
            )}

            {s.kind === 'rich' && (
              <div>
                <label className="block text-sm font-medium mb-2">Content (rich)</label>
                <RichText value={s.payload?.html || s.content_html || ''} onChange={(html) => updateSection(s.id, { payload: { ...(s.payload || {}), html } })} placeholder="Section content" />
              </div>
            )}

            {/* Fallback simple HTML editor if no specific kind */}
            {!s.kind && (
              <div>
                <label className="block text-sm font-medium mb-2">Content (rich)</label>
                <RichText value={s.content_html} onChange={(html) => updateSection(s.id, { content_html: html })} placeholder="Section content" />
              </div>
            )}
          </div>
        ))}

        <div className="flex gap-4">
          <Button type="button" onClick={addSection}>Add section</Button>
          <div className="ml-auto flex gap-2">
            <Button type="submit" className="bg-secondary text-secondary-foreground" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          </div>
        </div>
        </form>

        {/* Live preview of the About page sections built from current form state */}
        <LivePreview title="Live preview">
          <div className="space-y-12">
              {sections.filter(s => s.payload?.enabled !== false).filter(s => s.kind !== 'hero').map((s) => (
              <div key={s.id} className="prose max-w-none">
                {s.title && <h2 className="text-3xl font-bold" style={{ color: '#0D0A53' }}>{s.title}</h2>}
                {s.kind === 'hero' ? (
                  <div>
                    {s.image_url && <div className="w-full rounded-lg overflow-hidden mb-4"><img src={s.image_url} alt={s.title || ''} className="w-full h-48 object-cover rounded-md"/></div>}
                    <div dangerouslySetInnerHTML={{ __html: s.payload?.html || s.content_html || '' }} />
                  </div>
                ) : s.kind === 'cards' ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(s.payload?.cards || []).map((c: any, i: number) => (
                      <div key={i} className="bg-white p-4 rounded shadow">
                        {c.image_url ? <div className="mb-2 w-full h-40 overflow-hidden rounded"><img src={c.image_url} alt={c.title || ''} className="w-full h-full object-cover"/></div> : null}
                        {c.icon && <div className="mb-2">{c.icon}</div>}
                        <h4 className="font-semibold">{c.title}</h4>
                        <p dangerouslySetInnerHTML={{ __html: c.description || '' }} />
                      </div>
                    ))}
                  </div>
                ) : s.kind === 'timeline' ? (
                  <div className="space-y-6">
                    {(s.payload?.items || []).map((it: any, i: number) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-12 text-center text-sm font-medium" style={{ color: '#C7A600' }}>{it.date}</div>
                        <div>
                          <h4 className="font-semibold">{it.title}</h4>
                          {it.image_url ? <div className="my-2 w-full rounded overflow-hidden"><img src={it.image_url} alt={it.title || ''} className="w-full h-40 object-cover rounded-md"/></div> : null}
                          <div dangerouslySetInnerHTML={{ __html: it.description || '' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : s.kind === 'list' ? (
                  <ul className="list-disc ml-6 space-y-2">
                    {(s.payload?.items || []).map((it: any, i: number) => (
                      <li key={i}>
                        {it.image_url ? <div className="mb-2 w-40 h-28 overflow-hidden inline-block align-middle mr-3"><img src={it.image_url} alt="" className="w-full h-full object-cover rounded"/></div> : null}
                        <span dangerouslySetInnerHTML={{ __html: (it && it.html) || '' }} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>
                    {s.image_url && <div className="w-full rounded-lg overflow-hidden mb-4"><img src={s.image_url} alt={s.title || ''} className="w-full h-48 object-cover rounded-md"/></div>}
                    <div dangerouslySetInnerHTML={{ __html: s.payload?.html || s.content_html || '' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </LivePreview>
      </div>
    </div>
  )
}
