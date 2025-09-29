import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { FileText, ExternalLink, Download } from "lucide-react"

export default async function ResourcesPage() {
  const supabase = await createClient()
  const { data: resources } = await supabase.from("resources").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl mb-16 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl text-balance">Resources</h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Curated tools, templates, and materials to support your L&D journey
          </p>
        </div>

        {resources && resources.length > 0 ? (
          <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((resource) => (
              <Card
                key={resource.id}
                className="flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-accent"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-balance text-xl">{resource.title}</CardTitle>
                    <Badge variant="secondary" className="shrink-0">
                      {resource.type}
                    </Badge>
                  </div>
                  {resource.description && (
                    <CardDescription className="text-base">{resource.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end">
                  <Button asChild className="w-full">
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
          <div className="text-center py-24">
            <FileText className="mx-auto h-20 w-20 text-muted-foreground/50 mb-6" />
            <h3 className="text-2xl font-semibold mb-3">No Resources Available</h3>
            <p className="text-muted-foreground text-lg">Check back soon for helpful resources and materials</p>
          </div>
        )}
      </div>
    </div>
  )
}
