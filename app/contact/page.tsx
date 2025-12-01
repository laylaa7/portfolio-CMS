"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, Linkedin } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [contactInfo, setContactInfo] = useState({ email: 'contact@example.com', phone: '+1 (234) 567-890', linkedin: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    let mounted = true
    const supabase = createClient()
    const load = async () => {
      try {
        const { data } = await supabase.from('about').select('contact_info').single()
        if (data?.contact_info && mounted) {
          setContactInfo({
            email: data.contact_info.email || 'contact@example.com',
            phone: data.contact_info.phone || '+1 (234) 567-890',
            linkedin: data.contact_info.linkedin || ''
          })
        }
      } catch (err) {
        console.warn('Failed to load contact_info', err)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) })
      const json = await res.json()
      if (res.ok) {
        setSubmitted(true)
      } else {
        console.error('Contact submit failed', json)
      }
    } catch (err) {
      console.error('Submit error', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Get in Touch</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Have questions about our services? Want to schedule a consultation? We'd love to hear from you.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>Fill out the form below and we'll get back to you soon</CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                      <Mail className="h-6 w-6 text-secondary-foreground" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">Message Sent!</h3>
                    <p className="text-muted-foreground">Thank you for reaching out. We'll respond within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="What's this about?"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more..."
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href={`mailto:${contactInfo.email}`} className="text-sm text-primary hover:underline">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href={`tel:${contactInfo.phone}`} className="text-sm text-primary hover:underline">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Linkedin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">LinkedIn</p>
                    <a
                      href={contactInfo.linkedin || 'https://linkedin.com'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Connect on LinkedIn
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
