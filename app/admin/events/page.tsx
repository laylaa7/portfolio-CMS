import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Pencil, ArrowLeft, Calendar, MapPin, Users } from "lucide-react"
import { DeleteEventButton } from "@/components/admin/delete-event-button"
import { EventRegistrations } from "@/components/admin/event-registrations"

export default async function AdminEventsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: events } = await supabase.from("events").select("*").order("date", { ascending: false })

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border/40 bg-background">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">Manage Events</h1>
            </div>
          </div>
          <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Link href="/admin/events/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Link>
          </Button>
        </div>
      </header>

  <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Events Management */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Events Management</h2>
              <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link href="/admin/events/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Event
                </Link>
              </Button>
            </div>
            
            {events && events.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {events.map((event) => (
                  <Card key={event.id}>
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
                        <Badge variant={new Date(event.date) >= new Date() ? "default" : "secondary"} className="shrink-0">
                          {new Date(event.date) >= new Date() ? "Upcoming" : "Past"}
                        </Badge>
                      </div>
                      <CardDescription className="flex flex-col gap-2">
                        <span className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                          <Link href={`/admin/events/${event.id}`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </Button>
                        <DeleteEventButton eventId={event.id} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground mb-4">No events yet</p>
                  <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                    <Link href="/admin/events/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Event
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Event Registrations */}
          <div>
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Event Registrations
            </h2>
            <EventRegistrations />
          </div>
        </div>
      </main>
    </div>
  )
}
