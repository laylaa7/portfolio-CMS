import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Briefcase } from "lucide-react"
import Link from "next/link"

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: services } = await supabase.from("services").select("*").order("created_at", { ascending: false })

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Our Services</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Comprehensive L&D solutions tailored to your professional growth and organizational needs
        </p>
      </div>

      {services && services.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.id} className="flex flex-col transition-shadow hover:shadow-lg">
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
                {service.price && (
                  <CardDescription className="text-lg font-semibold text-secondary">{service.price}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </CardContent>
              <div className="p-6 pt-0">
                <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <Link href="/contact">Learn More</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Briefcase className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Services Available</h3>
          <p className="text-muted-foreground">Check back soon for our service offerings</p>
        </div>
      )}
    </div>
  )
}
