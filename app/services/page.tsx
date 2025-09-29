import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Briefcase } from "lucide-react"
import Link from "next/link"

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: services } = await supabase.from("services").select("*").order("created_at", { ascending: false })

  return (
    <div className="min-h-screen py-24 md:py-32">
      <div className="container px-6 mx-auto">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-primary">Our Services</h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Comprehensive L&D solutions tailored to your professional growth and organizational needs
          </p>
        </div>

        {services && services.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {services.map((service) => (
              <Card
                key={service.id}
                className="flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 hover:border-accent/50"
              >
                {service.image_url && (
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img
                      src={service.image_url || "/placeholder.svg"}
                      alt={service.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                )}
                <CardHeader className="flex-1">
                  <CardTitle className="text-balance text-2xl">{service.title}</CardTitle>
                  {service.price && (
                    <CardDescription className="text-xl font-bold text-accent mt-2">{service.price}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-base text-muted-foreground leading-relaxed">{service.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button asChild className="w-full bg-accent text-primary hover:bg-accent/90 font-semibold h-11">
                    <Link href="/contact">Learn More</Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-8">
              <Briefcase className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-primary">No Services Available</h3>
            <p className="text-lg text-muted-foreground">Check back soon for our service offerings</p>
          </div>
        )}
      </div>
    </div>
  )
}
