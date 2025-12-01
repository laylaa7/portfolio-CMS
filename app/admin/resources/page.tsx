import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminContainer from "@/components/admin/admin-container"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Pencil, ExternalLink, Lock, Unlock, Briefcase } from "lucide-react"
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
    <AdminContainer title="Manage Resources">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Resource Requests</h2>
          <Button asChild variant="outline" className="mx-auto">
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
                        {resource.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/admin/resources/${resource.id}`}>
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Link>
                      </Button>
                      <DeleteResourceButton resourceId={resource.id} />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={resource.url}>
                          <ExternalLink className="h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-8">
              <Briefcase className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-xl">No resources yet</p>
          </div>
        )}
      </div>
    </AdminContainer>
  )
}

