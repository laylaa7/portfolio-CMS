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
import type { About } from "@/lib/types"

export function AboutForm({ about }: { about?: About | null }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    bio: about?.bio || "",
    image_url: about?.image_url || "",
    email: about?.contact_info?.email || "",
    phone: about?.contact_info?.phone || "",
    linkedin: about?.contact_info?.linkedin || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = createClient()
    const dataToSubmit = {
      bio: formData.bio,
      image_url: formData.image_url,
      contact_info: {
        email: formData.email,
        phone: formData.phone,
        linkedin: formData.linkedin,
      },
    }

    if (about) {
      const { error } = await supabase.from("about").update(dataToSubmit).eq("id", about.id)

      if (error) {
        alert("Error updating about page")
        setIsSubmitting(false)
        return
      }
    } else {
      const { error } = await supabase.from("about").insert([dataToSubmit])

      if (error) {
        alert("Error creating about page")
        setIsSubmitting(false)
        return
      }
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit About Page</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="bio">Bio *</Label>
            <Textarea
              id="bio"
              rows={8}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              required
            />
          </div>

          <ImageUpload
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            label="Profile Image"
          />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Information</h3>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
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
