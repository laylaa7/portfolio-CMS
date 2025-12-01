import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { 
  GraduationCap, 
  Users, 
  UserCheck, 
  Monitor,
  ArrowRight,
  CheckCircle,
  Briefcase
} from "lucide-react"
import Link from "next/link"

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: services } = await supabase.from("services").select("*").order("created_at", { ascending: false })
  const { data: pageRows } = await supabase.from('services_page').select('*').limit(1)
  const page = pageRows && pageRows.length > 0 ? pageRows[0] : null

  // Icon mapping for different service types
  const getServiceIcon = (title: string) => {
    const titleLower = title.toLowerCase()
    if (titleLower.includes('bootcamp') || titleLower.includes('certification') || titleLower.includes('training')) {
      return GraduationCap
    } else if (titleLower.includes('group') || titleLower.includes('study') || titleLower.includes('collaborative')) {
      return Users
    } else if (titleLower.includes('coaching') || titleLower.includes('mentoring') || titleLower.includes('career')) {
      return UserCheck
    } else if (titleLower.includes('custom') || titleLower.includes('facilitation') || titleLower.includes('workshop')) {
      return Monitor
    }
    return Briefcase // Default icon
  }

  // Parse features from description or create default ones
  const getServiceFeatures = (description: string) => {
    // Try to extract features from description if it contains bullet points
    const lines = description.split('\n').filter(line => line.trim())
    const features = lines.filter(line => 
      line.includes('•') || 
      line.includes('-') || 
      line.includes('*') ||
      line.startsWith('Expert') ||
      line.startsWith('Practice') ||
      line.startsWith('Study') ||
      line.startsWith('Group') ||
      line.startsWith('Personal') ||
      line.startsWith('Custom')
    )
    
    if (features.length > 0) {
      return features.map(feature => feature.replace(/^[•\-\*]\s*/, '').trim())
    }
    
    // Default features based on service type
    return ["Professional guidance", "Expert support", "Quality service", "Personalized approach"]
  }

  // fallbacks / page content (keep hero defaults)
  const heroTitle = page?.hero_title || 'L&D Services Tailored for You'
  const heroSubtitle = page?.hero_subtitle || "Whether you're preparing for ATD certification or scaling your career, we've got a service for that."
  const heroCtaText = page?.hero_cta_text || 'Get Started'
  const heroCtaLink = page?.hero_cta_link || '/contact'

  return (
    <div className="min-h-screen py-24 md:py-32" style={{ backgroundColor: '#FCF7F7' }}>
      <div className="container px-6 mx-auto">
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl" style={{ color: '#0D0A53' }}>
            {heroTitle}
          </h1>
          <p className="text-lg md:text-xl leading-relaxed" style={{ color: '#0D0A53' }}>{heroSubtitle}</p>
          <div className="mt-6 flex justify-center">
            <a href={heroCtaLink} className="inline-block px-6 py-3 rounded font-medium" style={{ backgroundColor: '#0D0A53', color: '#fff' }}>{heroCtaText}</a>
          </div>
        </div>

        {/* SERVICES GRID - simplified: show cards only (like Events page) */}
        {services && services.length > 0 ? (
          <div className="max-w-7xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className="relative border rounded-lg bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ borderColor: '#0D0A53' }}
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

                  <CardHeader className="pb-4">
                    <div className="flex flex-col items-start space-y-4">
                      <div className="w-12 h-12 rounded flex items-center justify-center" style={{ backgroundColor: '#FCF7F7', border: '2px solid #0D0A53' }}>
                        {/* icon placeholder */}
                        <Briefcase className="h-6 w-6" style={{ color: '#0D0A53' }} />
                      </div>

                      <div className="flex items-start justify-between w-full gap-4">
                        <CardTitle className="text-xl font-bold leading-tight flex-1" style={{ color: '#0D0A53' }}>{service.title}</CardTitle>
                      </div>

                      <CardDescription className="text-sm leading-relaxed" style={{ color: '#0D0A53' }}>
                        {service.description && service.description.length > 120 ? `${service.description.substring(0, 120)}...` : service.description}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    {service.tools && service.tools.length > 0 && (
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {service.tools.slice(0, 3).map((tool: string, index: number) => (
                            <Badge
                              key={index}
                              className="text-xs px-2 py-1 rounded-full"
                              style={{ backgroundColor: '#FCF7F7', color: '#0D0A53', border: '1px solid #0D0A53' }}
                            >
                              {tool}
                            </Badge>
                          ))}
                          {service.tools.length > 3 && (
                            <Badge className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#C7A600', color: '#0D0A53' }}>
                              +{service.tools.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <Button
                      asChild
                      className="w-full text-white font-medium h-10 rounded"
                      style={{ backgroundColor: '#0D0A53' }}
                    >
                      <Link href={`/services/${service.id}`} className="flex items-center justify-center hover:opacity-90">
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-8" style={{ backgroundColor: '#FCF7F7' }}>
              <Briefcase className="h-12 w-12" style={{ color: '#0D0A53' }} />
            </div>
            <h3 className="text-2xl font-semibold mb-4" style={{ color: '#0D0A53' }}>No Services Available</h3>
            <p className="text-lg" style={{ color: '#0D0A53' }}>Check back soon for new services and offerings</p>
          </div>
        )}
      </div>
    </div>
  )
}
