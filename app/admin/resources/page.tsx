import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Pencil, ArrowLeft, ExternalLink, Lock, Unlock, FileText, Users } from "lucide-react"
import { DeleteResourceButton } from "@/components/admin/delete-resource-button"
import { ResourceRequestsManager } from "@/components/admin/resource-requests"

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
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Resource Requests</h2>
            <Button asChild variant="outline">
              <Link href="/admin/resources/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Resource
              </Link>
            </Button>
          </div>
          <ResourceRequestsManager />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">All Resources</h2>
          {resources && resources.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <Card key={resource.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-balance flex items-center gap-2">
                        {resource.visibility === 'public' ? (
                          <Unlock className="h-4 w-4 text-green-600" />
                        ) : (
                          <Lock className="h-4 w-4 text-orange-600" />
                        )}
                        {resource.title}
                      </CardTitle>
                      <div className="flex flex-col gap-1 items-end">
                        <Badge variant="secondary" className="shrink-0">
                          {resource.type}
                        </Badge>
                        <Badge 
                          variant={resource.visibility === 'public' ? 'default' : 'secondary'}
                          className={resource.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                        >
                          {resource.visibility === 'public' ? (
                            <>
                              <Unlock className="h-3 w-3 mr-1" />
                              Public
                            </>
                          ) : (
                            <>
                              <Lock className="h-3 w-3 mr-1" />
                              Protected
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                    {resource.description && <CardDescription>{resource.description}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    {resource.type === 'file' && resource.file_name ? (
                      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-4 w-4" />
                        <span>{resource.file_name}</span>
                        {resource.file_size && (
                          <span>({(resource.file_size / 1024 / 1024).toFixed(2)} MB)</span>
                        )}
                      </div>
                    ) : (
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
                    )}
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
        </div>
      </main>
    </div>
  )
}
