import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Pencil, ArrowLeft, ExternalLink } from "lucide-react"
import { DeleteResourceButton } from "@/components/admin/delete-resource-button"

export default async function AdminResourcesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: resources } = await supabase.from("resources").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border/40 bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">Manage Resources</h1>
            </div>
          </div>
          <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Link href="/admin/resources/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Resource
            </Link>
          </Button>
        </div>
      </header>

      <main className="container py-8">
        {resources && resources.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <Card key={resource.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-balance">{resource.title}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {resource.type}
                    </Badge>
                  </div>
                  {resource.description && <CardDescription>{resource.description}</CardDescription>}
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <ExternalLink className="h-4 w-4" />
                    <a
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate hover:text-primary"
                    >
                      {resource.link}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Link href={`/admin/resources/${resource.id}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <DeleteResourceButton resourceId={resource.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground mb-4">No resources yet</p>
              <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link href="/admin/resources/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Resource
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
