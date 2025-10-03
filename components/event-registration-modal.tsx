"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, CheckCircle } from "lucide-react"
import type { Event } from "@/lib/types"

interface EventRegistrationModalProps {
  event: Event
  isOpen: boolean
  onClose: () => void
}

export function EventRegistrationModal({ event, isOpen, onClose }: EventRegistrationModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      const response = await fetch("/api/event-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: event.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Registration API error:", errorData)
        throw new Error(errorData.error || "Registration failed")
      }

      setIsSuccess(true)
      setFormData({ name: "", email: "", phone: "" })
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsSuccess(false)
    setError("")
    setFormData({ name: "", email: "", phone: "" })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md border rounded-lg bg-white" style={{ borderColor: '#0D0A53' }}>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold" style={{ color: '#0D0A53' }}>
              {isSuccess ? "Registration Successful!" : `Register for ${event.title}`}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {isSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FCF7F7' }}>
                <CheckCircle className="h-8 w-8" style={{ color: '#C7A600' }} />
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#0D0A53' }}>
                Thank you for registering!
              </h3>
              <p className="text-sm mb-6" style={{ color: '#0D0A53' }}>
                You'll receive a confirmation email shortly with event details.
              </p>
              <Button 
                onClick={handleClose}
                className="w-full text-white font-medium"
                style={{ backgroundColor: '#0D0A53' }}
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg text-sm text-red-600 bg-red-50 border border-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="border rounded"
                  style={{ borderColor: '#0D0A53' }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="border rounded"
                  style={{ borderColor: '#0D0A53' }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border rounded"
                  style={{ borderColor: '#0D0A53' }}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 text-white font-medium"
                  style={{ backgroundColor: '#0D0A53' }}
                >
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="border-2"
                  style={{ borderColor: '#0D0A53', color: '#0D0A53' }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
