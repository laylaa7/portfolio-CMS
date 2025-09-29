import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { FileText, ExternalLink, Download } from "lucide-react"

export default async function ResourcesPage() {
  const supabase = await createClient()
  const { data: resources } = await supabase.from("resources").select("*").order("created_at", { ascending: false })

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Resources</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Curated tools, templates, and materials to support your L&D journey
        </p>
      </div>

      {resources && resources.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <Card key={resource.id} className="flex flex-col transition-shadow hover:shadow-lg">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-balance">{resource.title}</CardTitle>
                  <Badge variant="secondary" className="shrink-0">
                    {resource.type}
                  </Badge>
                </div>
                {resource.description && <CardDescription>{resource.description}</CardDescription>}
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <a href={resource.link} target="_blank" rel="noopener noreferrer">
                    {resource.type === "file" ? (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </>
                    ) : (
                      <>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Resource
                      </>
                    )}
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <FileText className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Resources Available</h3>
          <p className="text-muted-foreground">Check back soon for helpful resources and materials</p>
        </div>
      )}
    </div>
  )
}
