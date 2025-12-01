"use client"

import React, { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function ContactForm() {
  const supabase = createClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    headline: 'Get in touch',
    description: 'Have questions? Send a message.',
    email: '',
    phone: '',
    linkedin: ''
  })

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('about').select('*').single()
      if (error) {
        console.error('Error loading contact data', error)
        toast.error('Failed to load contact info')
      } else if (data && mounted) {
        const ci = data.contact_info || {}
        setForm({
          headline: data.headline || data.title || 'Get in touch',
          description: data.description || data.bio || 'Have questions? Send a message.',
          email: ci.email || '',
          phone: ci.phone || '',
          linkedin: ci.linkedin || ''
        })
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
      const payload = {
        id: 'default',
        headline: form.headline,
        description: form.description,
        contact_info: { email: form.email, phone: form.phone, linkedin: form.linkedin }
      }
      const { error } = await supabase.from('about').upsert(payload, { onConflict: 'id' })
      if (error) {
        console.error('Error saving contact info', error)
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

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="headline">Headline</Label>
        <Input id="headline" value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="email">Contact Email</Label>
          <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input id="linkedin" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
