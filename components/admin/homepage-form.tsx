"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

export function HomePageForm() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [data, setData] = useState<any>({
    badge_label: '',
    title_main: '',
    title_highlight: '',
    subtitle: '',
    primary_cta_label: '',
    primary_cta_url: '',
    secondary_cta_label: '',
    secondary_cta_url: '',
  })

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      const { data: rows, error } = await supabase.from("homepage").select("*").limit(1)
      if (error) {
        console.error("Error loading homepage content:", error)
      } else if (rows && rows.length > 0 && mounted) {
        setData({
          badge_label: rows[0].badge_label || '',
          title_main: rows[0].title_main || '',
          title_highlight: rows[0].title_highlight || '',
          subtitle: rows[0].subtitle || '',
          primary_cta_label: rows[0].primary_cta_label || '',
          primary_cta_url: rows[0].primary_cta_url || '',
          secondary_cta_label: rows[0].secondary_cta_label || '',
          secondary_cta_url: rows[0].secondary_cta_url || '',
          hero_html: rows[0].hero_html || '',
          id: rows[0].id,
        })
      }
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    // Quick early check for offline state to give a clearer message
    if (typeof window !== 'undefined' && !navigator.onLine) {
      alert('You appear to be offline. Please check your internet connection and try again.')
      return
    }
    setSaving(true)
    try {
      const payload: any = {
        badge_label: data.badge_label || null,
        title_main: data.title_main || null,
        title_highlight: data.title_highlight || null,
        subtitle: data.subtitle || null,
        primary_cta_label: data.primary_cta_label || null,
        primary_cta_url: data.primary_cta_url || null,
        secondary_cta_label: data.secondary_cta_label || null,
        secondary_cta_url: data.secondary_cta_url || null,
        hero_html: data.hero_html || null,
      }

      if (data.id) payload.id = data.id

      const { error } = await supabase.from('homepage').upsert([payload], { onConflict: 'id' })
      if (error) {
        // Provide more helpful information for network vs server errors
        console.error('Error saving homepage content:', error)
        const msg = error?.message || JSON.stringify(error)
        const details = error?.details ? `\nDetails: ${error.details}` : ''
        alert(`Error saving content: ${msg}${details}`)
      } else {
        router.refresh()
        alert('Saved')
      }
    } catch (err: any) {
      console.error('Save error:', err)
      alert('Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading…</div>

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Badge label</label>
            <Input value={data.badge_label} onChange={(e) => setData({ ...data, badge_label: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <Input value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Title (main)</label>
            <Input value={data.title_main} onChange={(e) => setData({ ...data, title_main: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title (highlight)</label>
            <Input value={data.title_highlight} onChange={(e) => setData({ ...data, title_highlight: e.target.value })} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Primary CTA label</label>
            <Input value={data.primary_cta_label} onChange={(e) => setData({ ...data, primary_cta_label: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Primary CTA URL</label>
            <Input value={data.primary_cta_url} onChange={(e) => setData({ ...data, primary_cta_url: e.target.value })} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">Secondary CTA label</label>
            <Input value={data.secondary_cta_label} onChange={(e) => setData({ ...data, secondary_cta_label: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Secondary CTA URL</label>
            <Input value={data.secondary_cta_url} onChange={(e) => setData({ ...data, secondary_cta_url: e.target.value })} />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="bg-secondary text-secondary-foreground" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>

      {/* Live preview */}
      <div className="pt-6 border-t">
        <h3 className="text-lg font-semibold">Live preview</h3>
  <section className="relative overflow-hidden gradient-primary py-12 md:py-16 lg:py-20 mt-4 rounded border-2" style={{ borderColor: 'var(--preview-border)' }}>
          <div className="relative z-10 px-6 mx-auto">
            <div className="mx-auto max-w-3xl text-center">
              {data.badge_label && (
                <Badge className="mb-4 bg-accent text-primary text-sm px-4 py-1 font-semibold inline-flex items-center">
                  {data.badge_label}
                </Badge>
              )}

              <h1 className="mb-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-primary-foreground leading-[1.1]">
                {data.title_main} {data.title_highlight ? <span className="text-accent">{data.title_highlight}</span> : null}
              </h1>

              {data.subtitle && (
                <p className="mb-6 text-base sm:text-lg md:text-xl text-primary-foreground/90 leading-relaxed max-w-3xl mx-auto px-4 sm:px-0">
                  {data.subtitle}
                </p>
              )}

              <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:justify-center px-4 sm:px-0">
                {data.primary_cta_label && (
                  <Button asChild size="lg" className="bg-accent text-primary font-semibold">
                    <a href={data.primary_cta_url || '#'}>
                      {data.primary_cta_label} <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                )}
                {data.secondary_cta_label && (
                  <Button asChild size="lg" variant="outline" className="font-semibold">
                    <a href={data.secondary_cta_url || '#'}>{data.secondary_cta_label}</a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default HomePageForm
