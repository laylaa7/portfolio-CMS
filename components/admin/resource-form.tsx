"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useRef } from "react"
import type { Resource } from "@/lib/types"
import { Upload, File, X } from "lucide-react"

export function ResourceForm({ resource }: { resource?: Resource }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    title: resource?.title || "",
    type: resource?.type || "file",
    link: resource?.link || "",
    description: resource?.description || "",
    image_url: resource?.image_url || "",
    visibility: resource?.visibility || "protected",
    file_url: resource?.file_url || "",
    file_name: resource?.file_name || "",
    file_size: resource?.file_size || 0,
  })

  const handleFileUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const supabase = createClient()
      
      // Generate unique filename
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      
      // Upload file to Supabase storage
      const { data, error } = await supabase.storage
        .from("portfolio-files")
        .upload(fileName, file)
      
      if (error) throw error
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from("portfolio-files")
        .getPublicUrl(data.path)
      
      setFormData({
        ...formData,
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_size: file.size,
        type: "file"
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Error uploading file. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const removeFile = () => {
    setFormData({
      ...formData,
      file_url: "",
      file_name: "",
      file_size: 0,
      type: "link"
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const supabase = createClient()
    const dataToSubmit = {
      title: formData.title,
      type: formData.type,
      link: formData.link,
      description: formData.description,
      image_url: formData.image_url,
      visibility: formData.visibility,
      // Only include file fields if it's a file type and has values
      ...(formData.type === "file" && formData.file_url && {
        file_url: formData.file_url,
        file_name: formData.file_name,
        file_size: formData.file_size,
      })
    }

    console.log("Submitting data:", dataToSubmit)

    if (resource) {
      const { error } = await supabase.from("resources").update(dataToSubmit).eq("id", resource.id)

      if (error) {
        console.error("Update error:", error)
        alert(`Error updating resource: ${error.message}`)
        setIsSubmitting(false)
        return
      }
    } else {
      const { error } = await supabase.from("resources").insert([dataToSubmit])

      if (error) {
        console.error("Create error:", error)
        alert(`Error creating resource: ${error.message}`)
        setIsSubmitting(false)
        return
      }
    }

    router.push("/admin/resources")
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{resource ? "Edit Resource" : "Add New Resource"}</CardTitle>
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
            <Label htmlFor="visibility">Visibility *</Label>
            <Select value={formData.visibility} onValueChange={(value: 'public' | 'protected') => setFormData({ ...formData, visibility: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Direct download</SelectItem>
                <SelectItem value="protected">Protected - Requires approval</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {formData.visibility === 'public' 
                ? 'Anyone can download this resource directly' 
                : 'Users must request access and be approved by admin'
              }
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="file">File Upload</SelectItem>
                <SelectItem value="link">External Link</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="template">Template</SelectItem>
                <SelectItem value="tool">Tool</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === "file" ? (
            <div className="space-y-4">
              <Label>File Upload</Label>
              {formData.file_url ? (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <File className="h-4 w-4" />
                      <span className="text-sm font-medium">{formData.file_name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(formData.file_size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeFile}
                      disabled={isUploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload a file</p>
                  <p className="text-sm text-gray-500">PDF, DOC, ZIP, etc.</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                id="file-upload"
                name="file-upload"
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.zip,.rar,.txt,.csv,.xlsx,.pptx"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    {formData.file_url ? "Change File" : "Select File"}
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="link">Link/URL *</Label>
              <Input
                id="link"
                type="url"
                placeholder="https://example.com/resource"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <ImageUpload
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            label="Resource Image"
          />

          <div className="flex gap-4">
            <Button
              type="submit"
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : resource ? "Update Resource" : "Create Resource"}
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
