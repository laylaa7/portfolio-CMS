"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { Download, Users, Calendar, Mail, Phone, User } from "lucide-react"
import type { EventRegistration } from "@/lib/types"

export function EventRegistrations() {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState<string>("all")

  useEffect(() => {
    fetchRegistrations()
  }, [selectedEvent])

  const fetchRegistrations = async () => {
    try {
      const supabase = createClient()
      let query = supabase
        .from("event_registrations")
        .select(`
          *,
          event:events(title, date)
        `)
        .order("registered_at", { ascending: false })

      if (selectedEvent !== "all") {
        query = query.eq("event_id", selectedEvent)
      }

      const { data, error } = await query

      if (error) throw error
      setRegistrations(data || [])
    } catch (error) {
      console.error("Error fetching registrations:", error)
      setRegistrations([])
    } finally {
      setLoading(false)
    }
  }

  const exportToCSV = () => {
    const headers = ["Name", "Email", "Phone", "Event", "Event Date", "Registered At"]
    const csvData = registrations.map(reg => [
      reg.name,
      reg.email,
      reg.phone || "",
      reg.event?.title || "Unknown Event",
      reg.event?.date ? new Date(reg.event.date).toLocaleDateString() : "",
      new Date(reg.registered_at).toLocaleDateString()
    ])

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.map(field => `"${field}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `event-registrations-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const getUniqueEvents = () => {
    const events = new Map()
    registrations.forEach(reg => {
      if (reg.event) {
        events.set(reg.event_id, reg.event)
      }
    })
    return Array.from(events.values())
  }

  if (loading) {
    return <div>Loading registrations...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Event Registrations
            </CardTitle>
            <div className="flex gap-2">
              <Button onClick={exportToCSV} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Event Filter */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">Filter by Event:</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            >
              <option value="all">All Events</option>
              {getUniqueEvents().map((event: any) => (
                <option key={event.id} value={event.id}>
                  {event.title} - {new Date(event.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          {/* Registrations List */}
          {registrations.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No registrations found.
            </p>
          ) : (
            <div className="space-y-4">
              {registrations.map((registration) => (
                <div
                  key={registration.id}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{registration.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span>{registration.email}</span>
                      </div>
                      
                      {registration.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{registration.phone}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{registration.event?.title}</span>
                        <span>•</span>
                        <span>{new Date(registration.registered_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      Registered
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Summary */}
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Total registrations: {registrations.length}</span>
              {selectedEvent !== "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedEvent("all")}
                >
                  Show All Events
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
