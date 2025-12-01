"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import RichText from "@/components/ui/rich-text"
import { ImageUpload } from "@/components/ui/image-upload"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { Service } from "@/lib/types"

export function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<any>({
    title: service?.title || "",
    description: service?.description || "",
    image_url: service?.image_url || "",
    tools: service?.tools || [],
    long_description: service?.long_description || "",
    // structured fields for friendly editing
    features: Array.isArray(service?.features) ? service?.features : (service?.features ? JSON.parse(service.features) : []),
    outcomes: Array.isArray(service?.outcomes) ? service?.outcomes : (service?.outcomes ? JSON.parse(service.outcomes) : []),
    testimonial: typeof service?.testimonial === 'object' && service?.testimonial !== null ? service.testimonial : (service?.testimonial ? JSON.parse(service.testimonial) : { quote: '', author: '', role: '' }),
    page_cta_text: service?.page_cta_text || "",
    page_cta_link: service?.page_cta_link || "",
  })
  
  const [toolsInput, setToolsInput] = useState(
    service?.tools ? service.tools.join(", ") : ""
  )

  const handleToolsChange = (value: string) => {
    setToolsInput(value)
    // Convert comma-separated string to array
    const toolsArray = value
      .split(",")
      .map(tool => tool.trim())
      .filter(tool => tool.length > 0)
    setFormData({ ...formData, tools: toolsArray })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = createClient()

    // prepare payload (features/outcomes/testimonial are structured already)
    const payload: any = { ...formData }
    if (service) {
      // Update existing service
      const { error } = await supabase.from("services").update(payload).eq("id", service.id)

      if (error) {
        alert("Error updating service")
        setIsSubmitting(false)
        return
      }
    } else {
      // Create new service
      const { error } = await supabase.from("services").insert([payload])

      if (error) {
        alert("Error creating service")
        setIsSubmitting(false)
        return
      }
    }

    router.push("/admin/services")
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{service ? "Edit Service" : "Add New Service"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <RichText value={formData.description} onChange={(html) => setFormData({ ...formData, description: html })} />
          </div>

          {/* Price removed per request - pricing is not displayed publicly */}

          <ImageUpload
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            label="Service Image"
          />

          <div className="space-y-2">
            <Label htmlFor="long_description">Long description</Label>
            <RichText value={formData.long_description} onChange={(html) => setFormData({ ...formData, long_description: html })} />
            <p className="text-sm text-muted-foreground">Optional detailed content for the service page.</p>
          </div>

          {/* Features (friendly editor) */}
          <div className="space-y-2">
            <Label>Features</Label>
            <div className="space-y-2">
              {(formData.features || []).map((f: any, idx: number) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                  <Input
                    placeholder="Feature title"
                    value={f?.title || ''}
                    onChange={(e) => {
                      const next = [...formData.features]
                      next[idx] = { ...next[idx], title: e.target.value }
                      setFormData({ ...formData, features: next })
                    }}
                  />
                  <Input
                    placeholder="Feature text"
                    value={f?.text || ''}
                    onChange={(e) => {
                      const next = [...formData.features]
                      next[idx] = { ...next[idx], text: e.target.value }
                      setFormData({ ...formData, features: next })
                    }}
                  />
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => {
                      const next = [...formData.features]
                      next.splice(idx, 1)
                      setFormData({ ...formData, features: next })
                    }}>Remove</Button>
                  </div>
                </div>
              ))}
              <Button type="button" onClick={() => setFormData({ ...formData, features: [...(formData.features || []), { title: '', text: '' }] })}>Add feature</Button>
            </div>
          </div>

          {/* Outcomes (friendly editor) */}
          <div className="space-y-2">
            <Label>Outcomes</Label>
            <div className="space-y-2">
              {(formData.outcomes || []).map((o: any, idx: number) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                  <Input
                    placeholder="Benefit"
                    value={o?.benefit || ''}
                    onChange={(e) => {
                      const next = [...formData.outcomes]
                      next[idx] = { ...next[idx], benefit: e.target.value }
                      setFormData({ ...formData, outcomes: next })
                    }}
                  />
                  <Input
                    placeholder="Supporting text"
                    value={o?.text || ''}
                    onChange={(e) => {
                      const next = [...formData.outcomes]
                      next[idx] = { ...next[idx], text: e.target.value }
                      setFormData({ ...formData, outcomes: next })
                    }}
                  />
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" onClick={() => {
                      const next = [...formData.outcomes]
                      next.splice(idx, 1)
                      setFormData({ ...formData, outcomes: next })
                    }}>Remove</Button>
                  </div>
                </div>
              ))}
              <Button type="button" onClick={() => setFormData({ ...formData, outcomes: [...(formData.outcomes || []), { benefit: '', text: '' }] })}>Add outcome</Button>
            </div>
          </div>

          {/* Testimonial (friendly editor) */}
          <div className="space-y-2">
            <Label>Testimonial</Label>
            <Textarea
              rows={3}
              placeholder="Quote"
              value={formData.testimonial?.quote || ''}
              onChange={(e) => setFormData({ ...formData, testimonial: { ...formData.testimonial, quote: e.target.value } })}
            />
            <div className="grid md:grid-cols-2 gap-2">
              <Input placeholder="Author" value={formData.testimonial?.author || ''} onChange={(e) => setFormData({ ...formData, testimonial: { ...formData.testimonial, author: e.target.value } })} />
              <Input placeholder="Role" value={formData.testimonial?.role || ''} onChange={(e) => setFormData({ ...formData, testimonial: { ...formData.testimonial, role: e.target.value } })} />
            </div>
            <p className="text-sm text-muted-foreground">Optional testimonial to show on the service page.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="page_cta_text">Page CTA text</Label>
              <Input id="page_cta_text" value={formData.page_cta_text} onChange={(e) => setFormData({ ...formData, page_cta_text: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="page_cta_link">Page CTA link</Label>
              <Input id="page_cta_link" value={formData.page_cta_link} onChange={(e) => setFormData({ ...formData, page_cta_link: e.target.value })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tools">Tools & Technologies</Label>
            <Input
              id="tools"
              placeholder="e.g., ATD Framework, Assessment Tools, Study Guides (comma-separated)"
              value={toolsInput}
              onChange={(e) => handleToolsChange(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Enter tools, technologies, or methodologies used in this service, separated by commas
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : service ? "Update Service" : "Create Service"}
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
