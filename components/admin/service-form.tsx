"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/image-upload"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { Service } from "@/lib/types"

export function ServiceForm({ service }: { service?: Service }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: service?.title || "",
    description: service?.description || "",
    price: service?.price || "",
    image_url: service?.image_url || "",
    tools: service?.tools || [],
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

    if (service) {
      // Update existing service
      const { error } = await supabase.from("services").update(formData).eq("id", service.id)

      if (error) {
        alert("Error updating service")
        setIsSubmitting(false)
        return
      }
    } else {
      // Create new service
      const { error } = await supabase.from("services").insert([formData])

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
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              placeholder="e.g., $500 or Contact for pricing"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />
          </div>

          <ImageUpload
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            label="Service Image"
          />

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
