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
    <div className="min-h-screen py-24 md:py-32">
      <div className="container px-6 mx-auto">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-primary">
            Events & Podcasts
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Join our live sessions, workshops, and podcast episodes to connect with the L&D community
          </p>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents && upcomingEvents.length > 0 && (
          <div className="mb-20 max-w-6xl mx-auto">
            <h2 className="mb-10 text-3xl font-bold text-center text-primary">Upcoming Events</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {upcomingEvents.map((event) => (
                <Card
                  key={event.id}
                  className="transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 hover:border-accent/50"
                >
                  {event.image_url && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <img
                        src={event.image_url || "/placeholder.svg"}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-balance text-2xl">{event.title}</CardTitle>
                      <Badge className="shrink-0 bg-accent text-primary hover:bg-accent/90 px-3 py-1.5">Upcoming</Badge>
                    </div>
                    <CardDescription className="flex flex-col gap-3 mt-3 text-base">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-accent" />
                        {new Date(event.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        {event.location}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-muted-foreground leading-relaxed">{event.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents && pastEvents.length > 0 && (
          <div className="max-w-7xl mx-auto">
            <h2 className="mb-10 text-3xl font-bold text-center text-primary">Past Events</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <Card key={event.id} className="opacity-75 hover:opacity-90 transition-opacity">
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
                    <CardTitle className="text-balance text-xl">{event.title}</CardTitle>
                    <CardDescription className="text-base">
                      {new Date(event.date).toLocaleDateString()} • {event.location}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {(!events || events.length === 0) && (
          <div className="text-center py-20 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-8">
              <Calendar className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-primary">No Events Scheduled</h3>
            <p className="text-lg text-muted-foreground">Check back soon for upcoming events and sessions</p>
          </div>
        )}
      </div>
    </div>
  )
}
