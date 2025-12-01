// Compatibility wrapper: export the clean AboutForm implementation.
export { AboutForm } from "./about-form-new"
export { default } from "./about-form-new"
"use client"

import React, { useEffect, useState } from "react"
import RichText from "@/components/ui/rich-text"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type Section = { id: string; title: string; content_html: string; position?: number }

export default function AboutForm() {
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
        setSections(data.map((d: any) => ({ id: d.id, title: d.title || '', content_html: d.content_html || '', position: d.position || 0 })))
      }
      setLoading(false)
    }
    load()
    return () => { mounted = false }
  }, [supabase])

  const addSection = () => {
    const id = crypto.randomUUID()
    setSections(prev => [...prev, { id, title: 'New section', content_html: '<p>Content</p>', position: prev.length }])
  }

  const removeSection = (id: string) => setSections(prev => prev.filter(s => s.id !== id))

  const updateSection = (id: string, patch: Partial<Section>) => setSections(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof window !== 'undefined' && !navigator.onLine) {
      toast.error('You appear to be offline. Check your connection and try again.')
      return
    }

                id="email"
                type="email"
                placeholder="contact@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (234) 567-890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL</Label>
              <Input
                id="linkedin"
                type="url"
                placeholder="https://linkedin.com/in/username"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
