import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EventForm } from "@/components/admin/event-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: event } = await supabase.from("events").select("*").eq("id", id).single()

  if (!event) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border/40 bg-background">
        <div className="container flex h-16 items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Edit Event</h1>
        </div>
      </header>

      <main className="container py-8">
        <div className="mx-auto max-w-2xl">
          <EventForm event={event} />
        </div>
      </main>
    </div>
  )
}
