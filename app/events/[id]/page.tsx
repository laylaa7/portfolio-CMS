"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, ArrowLeft, Clock, Users } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { EventRegistrationModal } from "@/components/event-registration-modal"

interface EventDetailsPageProps {
  params: {
    id: string
  }
}

export default function EventDetailsPage({ params }: EventDetailsPageProps) {
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false)
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Fetch event data on client side
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`)
        if (response.ok) {
          const eventData = await response.json()
          setEvent(eventData)
        } else {
          notFound()
        }
      } catch (error) {
        console.error("Error fetching event:", error)
        notFound()
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen py-24 md:py-32 flex items-center justify-center" style={{ backgroundColor: '#FCF7F7' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: '#0D0A53' }}>Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    notFound()
  }

  const isUpcoming = new Date(event.date) >= new Date()
  const eventDate = new Date(event.date)

  return (
    <div className="min-h-screen py-24 md:py-32" style={{ backgroundColor: '#FCF7F7' }}>
      <div className="container px-6 mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            asChild 
            variant="outline" 
            className="border-2 font-medium"
            style={{ borderColor: '#0D0A53', color: '#0D0A53' }}
          >
            <Link href="/events" className="flex items-center">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
        </div>

        {/* Event Banner Image */}
        {event.image_url && (
          <div className="mb-12">
            <div className="aspect-video w-full overflow-hidden rounded-lg shadow-lg">
              <img
                src={event.image_url}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-3 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="border rounded-lg bg-white" style={{ borderColor: '#0D0A53' }}>
              <CardHeader className="pb-6">
                <div className="flex flex-col space-y-6">
                  {/* Title & Status Badge */}
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-3xl font-bold leading-tight" style={{ color: '#0D0A53' }}>
                      {event.title}
                    </CardTitle>
                    {isUpcoming && (
                      <Badge className="shrink-0 px-4 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: '#C7A600', color: '#0D0A53' }}>
                        Upcoming
                      </Badge>
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#FCF7F7' }}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0D0A53' }}>
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#0D0A53' }}>Date & Time</p>
                        <p className="text-sm" style={{ color: '#0D0A53' }}>
                          {eventDate.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm" style={{ color: '#0D0A53' }}>
                          {eventDate.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#FCF7F7' }}>
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0D0A53' }}>
                        <MapPin className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: '#0D0A53' }}>Location</p>
                        <p className="text-sm" style={{ color: '#0D0A53' }}>{event.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tools/Badges */}
                  {event.tools && event.tools.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-3" style={{ color: '#0D0A53' }}>Event Resources & Tools</h3>
                      <div className="flex flex-wrap gap-2">
                        {event.tools.map((tool, index) => (
                          <Badge 
                            key={index} 
                            className="text-sm px-3 py-1.5 rounded-full" 
                            style={{ backgroundColor: '#FCF7F7', color: '#0D0A53', border: '1px solid #0D0A53' }}
                          >
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Full Description */}
                <div className="prose prose-lg max-w-none">
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#0D0A53' }}>Event Description</h3>
                  <div className="text-base leading-relaxed" style={{ color: '#0D0A53' }}>
                    {event.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="border rounded-lg bg-white sticky top-8" style={{ borderColor: '#0D0A53' }}>
              <CardHeader>
                <CardTitle className="text-xl font-bold" style={{ color: '#0D0A53' }}>
                  Event Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Info */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" style={{ color: '#C7A600' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#0D0A53' }}>Date</p>
                      <p className="text-sm" style={{ color: '#0D0A53' }}>
                        {eventDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5" style={{ color: '#C7A600' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#0D0A53' }}>Time</p>
                      <p className="text-sm" style={{ color: '#0D0A53' }}>
                        {eventDate.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5" style={{ color: '#C7A600' }} />
                    <div>
                      <p className="text-sm font-medium" style={{ color: '#0D0A53' }}>Location</p>
                      <p className="text-sm" style={{ color: '#0D0A53' }}>{event.location}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4 border-t" style={{ borderColor: '#0D0A53' }}>
                  <Button 
                    onClick={() => setIsRegistrationModalOpen(true)}
                    className="w-full text-white font-medium h-12 rounded"
                    style={{ backgroundColor: '#0D0A53' }}
                  >
                    <Users className="h-5 w-5 mr-2" />
                    Register for Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <EventRegistrationModal
        event={event}
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
      />
    </div>
  )
}
