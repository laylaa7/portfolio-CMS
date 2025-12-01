"use client"

import React, { useEffect, useState } from "react"
import RichText from "@/components/ui/rich-text"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type LinkItem = { id: string; label: string; url: string }
type SocialItem = { id: string; label: string; iconName?: string | null; iconUrl?: string | null; url: string }

export default function FooterForm() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [leftHtml, setLeftHtml] = useState<string>('')
  const [quickLinks, setQuickLinks] = useState<LinkItem[]>([])
  const [aboutLinks, setAboutLinks] = useState<LinkItem[]>([])
  const [socialLinks, setSocialLinks] = useState<SocialItem[]>([])
  const [copyrightHtml, setCopyrightHtml] = useState<string>('')
  const [id, setId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      const { data: rows, error } = await supabase.from('footer').select('*').limit(1)
      if (error) {
        console.error('Error loading footer content:', error)
      } else if (rows && rows.length > 0 && mounted) {
        const r = rows[0]
        setId(r.id || null)
        setLeftHtml(r.left_html || '')
        setQuickLinks(Array.isArray(r.quick_links) ? r.quick_links : [])
        setAboutLinks(Array.isArray(r.about_links) ? r.about_links : [])
        setSocialLinks(Array.isArray(r.social_links) ? r.social_links : [])
        setCopyrightHtml(r.copyright_html || '')
      }
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [supabase])

  const addLink = (setter: React.Dispatch<React.SetStateAction<LinkItem[]>>) => {
    const n = crypto.randomUUID()
    setter(prev => [...prev, { id: n, label: '', url: '' }])
  }

  const removeLink = (setter: React.Dispatch<React.SetStateAction<any[]>>, itemId: string) => {
    setter((prev) => prev.filter((p) => p.id !== itemId))
  }

  const addSocial = () => {
    const n = crypto.randomUUID()
    setSocialLinks(prev => [...prev, { id: n, label: '', iconName: 'linkedin', iconUrl: null, url: '' }])
  }

  const updateSocial = (id: string, patch: Partial<SocialItem>) => {
    setSocialLinks(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof window !== 'undefined' && !navigator.onLine) {
      toast.error('You appear to be offline. Check your connection and try again.')
      return
    }
    setSaving(true)
    try {
      const payload: any = {
        left_html: leftHtml || null,
        quick_links: quickLinks || [],
        about_links: aboutLinks || [],
        social_links: socialLinks || [],
        copyright_html: copyrightHtml || null,
      }
      if (id) payload.id = id

      const { error } = await supabase.from('footer').upsert([payload], { onConflict: 'id' })
      if (error) {
        console.error('Error saving footer:', error)
        toast.error(`Save failed: ${error.message || 'server error'}`)
      } else {
        router.refresh()
        toast.success('Footer saved')
      }
    } catch (err: any) {
      console.error('Save error:', err)
      toast.error('Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Loading…</div>

  return (
    <div className="space-y-6">
      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Left column text (rich)</label>
          <RichText value={leftHtml} onChange={(html) => setLeftHtml(html)} placeholder="Left column HTML" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold mb-2">Quick Links</h4>
            <div className="space-y-2">
              {quickLinks.map((l, idx) => (
                    <div key={l.id} className="grid grid-cols-12 gap-2 items-center">
                      <input className="col-span-5 rounded border px-3 py-2" placeholder="Label" value={l.label} onChange={(e) => setQuickLinks(prev => prev.map(p => p.id === l.id ? { ...p, label: e.target.value } : p))} />
                      <select className="col-span-4 rounded border px-3 py-2" value={l.url || 'custom'} onChange={(e) => {
                        const val = e.target.value
                        if (val === 'custom') {
                          setQuickLinks(prev => prev.map(p => p.id === l.id ? { ...p, url: '' } : p))
                        } else {
                          setQuickLinks(prev => prev.map(p => p.id === l.id ? { ...p, url: val } : p))
                        }
                      }}>
                        <option value="/">Home</option>
                        <option value="/about">About</option>
                        <option value="/services">Services</option>
                        <option value="/events">Events</option>
                        <option value="/blog">Blog</option>
                        <option value="/resources">Resources</option>
                        <option value="/contact">Contact</option>
                        <option value="custom">Custom URL...</option>
                      </select>
                      <input className="col-span-2 rounded border px-3 py-2" placeholder="URL (if custom)" value={l.url} onChange={(e) => setQuickLinks(prev => prev.map(p => p.id === l.id ? { ...p, url: e.target.value } : p))} />
                      <Button className="col-span-1" variant="ghost" size="sm" type="button" onClick={() => removeLink(setQuickLinks, l.id)}>Remove</Button>
                    </div>
                  ))}
                  <Button type="button" onClick={() => addLink(setQuickLinks)}>Add link</Button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">About Links</h4>
            <div className="space-y-2">
              {aboutLinks.map((l) => (
                <div key={l.id} className="grid grid-cols-12 gap-2 items-center">
                  <input className="col-span-7 rounded border px-3 py-2" placeholder="Label" value={l.label} onChange={(e) => setAboutLinks(prev => prev.map(p => p.id === l.id ? { ...p, label: e.target.value } : p))} />
                  <input className="col-span-4 rounded border px-3 py-2" placeholder="URL" value={l.url} onChange={(e) => setAboutLinks(prev => prev.map(p => p.id === l.id ? { ...p, url: e.target.value } : p))} />
                  <Button className="col-span-1" variant="ghost" size="sm" type="button" onClick={() => removeLink(setAboutLinks, l.id)}>Remove</Button>
                </div>
              ))}
              <Button type="button" onClick={() => addLink(setAboutLinks)}>Add link</Button>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">Social links</h4>
          <div className="space-y-3">
            {socialLinks.map((s) => (
              <div key={s.id} className="grid grid-cols-12 gap-2 items-center">
                <input className="col-span-3 rounded border px-3 py-2" placeholder="Label" value={s.label} onChange={(e) => updateSocial(s.id, { label: e.target.value })} />
                <select className="col-span-3 rounded border px-3 py-2" value={s.iconName || 'linkedin'} onChange={(e) => updateSocial(s.id, { iconName: e.target.value, iconUrl: null })}>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="x">X</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="github">GitHub</option>
                  <option value="youtube">YouTube</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telegram">Telegram</option>
                  <option value="slack">Slack</option>
                  <option value="spotify">Spotify</option>
                  <option value="tiktok">TikTok</option>
                  <option value="custom">Custom (image URL)</option>
                </select>
                <input className="col-span-4 rounded border px-3 py-2" placeholder="URL" value={s.url} onChange={(e) => updateSocial(s.id, { url: e.target.value })} />
                <input className="col-span-2 rounded border px-3 py-2" placeholder="Icon image URL (for custom)" value={s.iconUrl || ''} onChange={(e) => updateSocial(s.id, { iconUrl: e.target.value, iconName: 'custom' })} />
                <div className="col-span-12">
                  <div className="mt-2">
                    <span className="text-sm text-muted-foreground">Preview: </span>
                    {s.iconUrl ? (
                      <img src={s.iconUrl} alt={s.label} className="inline-block h-5 w-5 ml-2" />
                    ) : (
                      <span className="inline-block ml-2 h-5 w-20 text-sm text-muted-foreground">{s.iconName}</span>
                    )}
                  </div>
                </div>
                <div className="col-span-12 text-right">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setSocialLinks(prev => prev.filter(x => x.id !== s.id))}>Remove</Button>
                </div>
              </div>
            ))}
            <Button type="button" onClick={addSocial}>Add social link</Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Copyright (rich)</label>
          <RichText value={copyrightHtml} onChange={(html) => setCopyrightHtml(html)} placeholder="Copyright text" />
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="bg-secondary text-secondary-foreground" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>

      {/* Live preview */}
      <div className="pt-6 border-t">
        <h3 className="text-lg font-semibold">Live preview</h3>
        <div className="mt-4">
          <div className="border-2 p-6 rounded" style={{ borderColor: 'var(--preview-border)' }}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <h4 className="font-semibold">Left</h4>
                <div dangerouslySetInnerHTML={{ __html: leftHtml || '<p>Left column</p>' }} />
              </div>

              <div>
                <h4 className="font-semibold">Quick Links</h4>
                <ul className="space-y-1">
                  {quickLinks.map(l => <li key={l.id}><a href={l.url || '#'} className="text-sm text-muted-foreground">{l.label || '—'}</a></li>)}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">About</h4>
                <ul className="space-y-1">
                  {aboutLinks.map(l => <li key={l.id}><a href={l.url || '#'} className="text-sm text-muted-foreground">{l.label || '—'}</a></li>)}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">Social</h4>
                <div className="flex gap-3">
                  {socialLinks.map(s => (
                    <a key={s.id} href={s.url || '#'} className="text-muted-foreground">
                      {s.iconUrl ? <img src={s.iconUrl} alt={s.label} className="h-5 w-5" /> : <span className="inline-block h-5 w-5">{s.iconName}</span>}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <div dangerouslySetInnerHTML={{ __html: copyrightHtml || `&copy; ${new Date().getFullYear()} Mohamed Elaghoury. All rights reserved.` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
