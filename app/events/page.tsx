import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { Calendar, MapPin } from "lucide-react"

export default async function EventsPage() {
  const supabase = await createClient()
  const { data: events } = await supabase.from("events").select("*").order("date", { ascending: true })

  const upcomingEvents = events?.filter((event) => new Date(event.date) >= new Date())
  const pastEvents = events?.filter((event) => new Date(event.date) < new Date())

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Events & Podcasts</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Join our live sessions, workshops, and podcast episodes to connect with the L&D community
        </p>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents && upcomingEvents.length > 0 && (
        <div className="mb-16">
          <h2 className="mb-6 text-2xl font-bold">Upcoming Events</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {upcomingEvents.map((event) => (
              <Card key={event.id} className="transition-shadow hover:shadow-lg">
                {event.image_url && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img
                      src={event.image_url || "/placeholder.svg"}
                      alt={event.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-balance">{event.title}</CardTitle>
                    <Badge className="shrink-0 bg-secondary text-secondary-foreground">Upcoming</Badge>
                  </div>
                  <CardDescription className="flex flex-col gap-2">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents && pastEvents.length > 0 && (
        <div>
          <h2 className="mb-6 text-2xl font-bold">Past Events</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pastEvents.map((event) => (
              <Card key={event.id} className="opacity-75">
                {event.image_url && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img
                      src={event.image_url || "/placeholder.svg"}
                      alt={event.title}
                      className="h-full w-full object-cover grayscale"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-balance">{event.title}</CardTitle>
                  <CardDescription>
                    {new Date(event.date).toLocaleDateString()} • {event.location}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {(!events || events.length === 0) && (
        <div className="text-center py-16">
          <Calendar className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Events Scheduled</h3>
          <p className="text-muted-foreground">Check back soon for upcoming events and sessions</p>
        </div>
      )}
    </div>
  )
}
