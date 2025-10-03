import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Calendar, MapPin, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: events } = await supabase.from("events").select("*").order("date", { ascending: true })

  const upcomingEvents = events?.filter((event) => new Date(event.date) >= new Date())
  const pastEvents = events?.filter((event) => new Date(event.date) < new Date())

  return (
    <div className="min-h-screen py-24 md:py-32" style={{ backgroundColor: '#FCF7F7' }}>
      <div className="container px-6 mx-auto">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl" style={{ color: '#0D0A53' }}>
            Events & Podcasts
          </h1>
          <p className="text-lg md:text-xl leading-relaxed" style={{ color: '#0D0A53' }}>
            Join our live sessions, workshops, and podcast episodes to connect with the L&D community
          </p>
        </div>

        {/* All Events */}
        {events && events.length > 0 ? (
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => {
                const isUpcoming = new Date(event.date) >= new Date()
                
                return (
                  <Card
                    key={event.id}
                    className="relative border rounded-lg bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    style={{ borderColor: '#0D0A53' }}
                  >
                    {/* Navy triangle in top-right corner */}
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-b-[20px]" style={{ borderBottomColor: '#0D0A53' }}></div>
                    
                    {/* Event Image */}
                    {event.image_url && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                        <img
                          src={event.image_url || "/placeholder.svg"}
                          alt={event.title}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>
                    )}
                    
                    <CardHeader className="pb-4">
                      <div className="flex flex-col items-start space-y-4">
                        {/* Icon */}
                        <div className="w-12 h-12 rounded flex items-center justify-center" style={{ backgroundColor: '#FCF7F7', border: '2px solid #0D0A53' }}>
                          <Calendar className="h-6 w-6" style={{ color: '#0D0A53' }} />
                        </div>
                        
                        {/* Title & Badge */}
                        <div className="flex items-start justify-between w-full gap-4">
                          <CardTitle className="text-xl font-bold leading-tight flex-1" style={{ color: '#0D0A53' }}>
                            {event.title}
                          </CardTitle>
                          {isUpcoming && (
                            <Badge className="shrink-0 px-3 py-1.5 rounded-full" style={{ backgroundColor: '#C7A600', color: '#0D0A53' }}>
                              Upcoming
                            </Badge>
                          )}
                        </div>
                        
                        {/* Date & Location */}
                        <div className="flex flex-col gap-2 text-sm" style={{ color: '#0D0A53' }}>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" style={{ color: '#C7A600' }} />
                            <span>{new Date(event.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" style={{ color: '#C7A600' }} />
                            <span>{event.location}</span>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <CardDescription className="text-sm leading-relaxed" style={{ color: '#0D0A53' }}>
                          {event.description.length > 120 ? `${event.description.substring(0, 120)}...` : event.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      {/* Tools/Badges */}
                      {event.tools && event.tools.length > 0 && (
                        <div className="mb-6">
                          <div className="flex flex-wrap gap-2">
                            {event.tools.slice(0, 3).map((tool, index) => (
                              <Badge 
                                key={index} 
                                className="text-xs px-2 py-1 rounded-full" 
                                style={{ backgroundColor: '#FCF7F7', color: '#0D0A53', border: '1px solid #0D0A53' }}
                              >
                                {tool}
                              </Badge>
                            ))}
                            {event.tools.length > 3 && (
                              <Badge 
                                className="text-xs px-2 py-1 rounded-full" 
                                style={{ backgroundColor: '#C7A600', color: '#0D0A53' }}
                              >
                                +{event.tools.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {/* CTA Button */}
                      <Button 
                        asChild 
                        className="w-full text-white font-medium h-10 rounded"
                        style={{ backgroundColor: '#0D0A53' }}
                      >
                        <Link href={`/events/${event.id}`} className="flex items-center justify-center hover:opacity-90">
                          Learn More
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-8" style={{ backgroundColor: '#FCF7F7' }}>
              <Calendar className="h-12 w-12" style={{ color: '#0D0A53' }} />
            </div>
            <h3 className="text-2xl font-semibold mb-4" style={{ color: '#0D0A53' }}>No Events Scheduled</h3>
            <p className="text-lg" style={{ color: '#0D0A53' }}>Check back soon for upcoming events and sessions</p>
          </div>
        )}

      </div>
    </div>
  )
}
