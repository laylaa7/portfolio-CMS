import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Plus, Pencil, ArrowLeft } from "lucide-react"
import { DeleteServiceButton } from "@/components/admin/delete-service-button"

export default async function AdminServicesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: services } = await supabase.from("services").select("*").order("created_at", { ascending: false })

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
              <h1 className="text-xl font-bold">Manage Services</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/services/content">Edit Services Page</Link>
            </Button>
            <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link href="/admin/services/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Link>
            </Button>
          </div>
        </div>
      </header>

  <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {services && services.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id} className="relative border rounded-lg bg-white hover:shadow-lg transition-transform transform hover:-translate-y-1">
                {service.image_url && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img
                      src={service.image_url || "/placeholder.svg"}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-balance">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{service.description}</p>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Link href={`/admin/services/${service.id}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <DeleteServiceButton serviceId={service.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground mb-4">No services yet</p>
              <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link href="/admin/services/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Service
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
