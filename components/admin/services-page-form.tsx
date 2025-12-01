"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import RichText from "@/components/ui/rich-text"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function ServicesPageForm() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<any>({})

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      const { data: rows, error } = await supabase.from("services_page").select("*").limit(1)
      if (error) {
        console.error("Error loading services page content:", error)
      } else if (rows && rows.length > 0 && mounted) {
        // Normalize JSON fields into structured data for friendly editing
        const row = rows[0]
        row.audience = Array.isArray(row.audience) ? row.audience : (row.audience ? JSON.parse(row.audience) : [])
        row.outcomes = Array.isArray(row.outcomes) ? row.outcomes : (row.outcomes ? JSON.parse(row.outcomes) : [])
        row.testimonial = typeof row.testimonial === 'object' && row.testimonial !== null ? row.testimonial : (row.testimonial ? JSON.parse(row.testimonial) : { quote: '', author: '', role: '' })
        setData(row)
      }
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Use structured fields directly (audience/outcomes/testimonial are arrays/objects)
      const payload = {
        hero_title: data.hero_title || null,
        hero_subtitle: data.hero_subtitle || null,
        hero_cta_text: data.hero_cta_text || null,
        hero_cta_link: data.hero_cta_link || null,
        intro_title: data.intro_title || null,
        intro_paragraph: data.intro_paragraph || null,
        audience: data.audience || [],
        outcomes: data.outcomes || [],
        testimonial: data.testimonial || { quote: '', author: '', role: '' },
        final_cta_title: data.final_cta_title || null,
        final_cta_text: data.final_cta_text || null,
        final_cta_button_text: data.final_cta_button_text || null,
      }

      // Include id if present so upsert updates the existing row
      if (data.id) {
        const payloadAny: any = payload
        payloadAny.id = data.id
      }

      const { error } = await supabase.from('services_page').upsert([payload], { onConflict: 'id' })
      if (error) {
        console.error('Error saving services page content:', error)
        alert('Error saving content')
      } else {
        router.refresh()
        alert('Saved')
      }
    } catch (err: any) {
      console.error('Save error:', err)
      alert('Invalid JSON in audience/outcomes/testimonial fields')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading…</div>

  // Display simple form; audience/outcomes/testimonial are edited as JSON for flexibility
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <form onSubmit={handleSave} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Hero title</label>
          <Input value={data.hero_title || ''} onChange={(e) => setData({ ...data, hero_title: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Hero subtitle</label>
          <Input value={data.hero_subtitle || ''} onChange={(e) => setData({ ...data, hero_subtitle: e.target.value })} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Hero CTA text</label>
          <Input value={data.hero_cta_text || ''} onChange={(e) => setData({ ...data, hero_cta_text: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Hero CTA link</label>
          <Input value={data.hero_cta_link || ''} onChange={(e) => setData({ ...data, hero_cta_link: e.target.value })} />
        </div>
      </div>

      <div>
  <label className="block text-sm font-medium mb-2">Intro title</label>
  <Input value={data.intro_title || ''} onChange={(e) => setData({ ...data, intro_title: e.target.value })} />
  <label className="block text-sm font-medium mb-2 mt-3">Intro paragraph</label>
  <RichText value={data.intro_paragraph || ''} onChange={(html) => setData({ ...data, intro_paragraph: html })} />
      </div>

      {/* Audience (friendly editor) */}
      <div>
        <label className="block text-sm font-medium mb-2">Audience</label>
        <div className="space-y-2">
          {(data.audience || []).map((a: any, idx: number) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
              <Input
                placeholder="Title (e.g. Trainers)"
                value={a?.title || ''}
                onChange={(e) => {
                  const next = [...(data.audience || [])]
                  next[idx] = { ...next[idx], title: e.target.value }
                  setData({ ...data, audience: next })
                }}
              />
              <Input
                placeholder="Short description"
                value={a?.description || ''}
                onChange={(e) => {
                  const next = [...(data.audience || [])]
                  next[idx] = { ...next[idx], description: e.target.value }
                  setData({ ...data, audience: next })
                }}
              />
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  const next = [...(data.audience || [])]
                  next.splice(idx, 1)
                  setData({ ...data, audience: next })
                }}>Remove</Button>
              </div>
            </div>
          ))}
          <Button type="button" onClick={() => setData({ ...data, audience: [...(data.audience || []), { title: '', description: '' }] })}>Add audience item</Button>
        </div>
      </div>

      {/* Outcomes (friendly editor) */}
      <div>
        <label className="block text-sm font-medium mb-2">Outcomes</label>
        <div className="space-y-2">
          {(data.outcomes || []).map((o: any, idx: number) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
              <Input
                placeholder="Benefit"
                value={o?.benefit || ''}
                onChange={(e) => {
                  const next = [...(data.outcomes || [])]
                  next[idx] = { ...next[idx], benefit: e.target.value }
                  setData({ ...data, outcomes: next })
                }}
              />
              <Input
                placeholder="Supporting sentence"
                value={o?.text || ''}
                onChange={(e) => {
                  const next = [...(data.outcomes || [])]
                  next[idx] = { ...next[idx], text: e.target.value }
                  setData({ ...data, outcomes: next })
                }}
              />
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  const next = [...(data.outcomes || [])]
                  next.splice(idx, 1)
                  setData({ ...data, outcomes: next })
                }}>Remove</Button>
              </div>
            </div>
          ))}
          <Button type="button" onClick={() => setData({ ...data, outcomes: [...(data.outcomes || []), { benefit: '', text: '' }] })}>Add outcome</Button>
        </div>
      </div>

      {/* Testimonial (friendly editor) */}
      <div>
        <label className="block text-sm font-medium mb-2">Testimonial</label>
        <Textarea rows={3} placeholder="Quote" value={data.testimonial?.quote || ''} onChange={(e) => setData({ ...data, testimonial: { ...data.testimonial, quote: e.target.value } })} />
        <div className="grid md:grid-cols-2 gap-2 mt-2">
          <Input placeholder="Author" value={data.testimonial?.author || ''} onChange={(e) => setData({ ...data, testimonial: { ...data.testimonial, author: e.target.value } })} />
          <Input placeholder="Role" value={data.testimonial?.role || ''} onChange={(e) => setData({ ...data, testimonial: { ...data.testimonial, role: e.target.value } })} />
        </div>
        <p className="text-sm text-muted-foreground">Optional testimonial to show on services page.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-2">Final CTA title</label>
          <Input value={data.final_cta_title || ''} onChange={(e) => setData({ ...data, final_cta_title: e.target.value })} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Final CTA text</label>
          <RichText value={data.final_cta_text || ''} onChange={(html) => setData({ ...data, final_cta_text: html })} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Final CTA button text</label>
        <Input value={data.final_cta_button_text || ''} onChange={(e) => setData({ ...data, final_cta_button_text: e.target.value })} />
      </div>

      <div className="flex gap-4">
        <Button type="submit" className="bg-secondary text-secondary-foreground" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
      </form>

      {/* Live preview */}
      <div>
        <h3 className="text-lg font-semibold">Live preview</h3>
        <div className="mt-4 border-2 p-6 rounded" style={{ borderColor: 'var(--preview-border)' }}>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">{data.hero_title}</h1>
            {data.hero_subtitle && <p className="mb-4">{data.hero_subtitle}</p>}
            <div className="space-y-4">
              {data.audience && data.audience.map((a: any, i: number) => (
                <div key={i} className="p-4 bg-white rounded shadow">
                  <h4 className="font-semibold">{a.title}</h4>
                  <p>{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesPageForm
