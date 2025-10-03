import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { FileText, ExternalLink, Download, Lock, Unlock, Clock, CheckCircle, ArrowRight } from "lucide-react"
import { ResourceCard } from "@/components/resource-card"

export default async function ResourcesPage() {
  const supabase = await createClient()
  const { data: resources } = await supabase.from("resources").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen py-24 md:py-32" style={{ backgroundColor: '#FCF7F7' }}>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl mb-16 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl text-balance" style={{ color: '#0D0A53' }}>
            Resources
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed" style={{ color: '#0D0A53' }}>
            Curated tools, templates, and materials to support your L&D journey
          </p>
        </div>

        {resources && resources.length > 0 ? (
          <>
            <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Button 
                className="text-white px-8 py-3 rounded"
                style={{ backgroundColor: '#0D0A53' }}
              >
                View Full Library
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-8" style={{ backgroundColor: '#FCF7F7' }}>
              <FileText className="h-12 w-12" style={{ color: '#0D0A53' }} />
            </div>
            <h3 className="text-2xl font-semibold mb-3" style={{ color: '#0D0A53' }}>No Resources Available</h3>
            <p className="text-lg" style={{ color: '#0D0A53' }}>Check back soon for helpful resources and materials</p>
          </div>
        )}
      </div>
    </div>
  )
}
