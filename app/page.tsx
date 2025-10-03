import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, Calendar, Briefcase, Award, Sparkles, Users, TrendingUp, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch latest content
  const { data: services } = await supabase.from("services").select("*").limit(3)
  const { data: allEvents } = await supabase.from("events").select("*").order("date", { ascending: true })
  const events = allEvents?.slice(0, 3) || []
  const hasMoreEvents = (allEvents?.length || 0) > 3
  const { data: blogs } = await supabase.from("blogs").select("*").order("published_at", { ascending: false }).limit(3)

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden gradient-primary py-32 md:py-40 lg:py-48">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(199,166,0,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(230,194,0,0.1),transparent_50%)]" />

        <div className="container relative z-10 px-6 mx-auto">
          <div className="mx-auto max-w-5xl text-center">
            <Badge className="mb-8 bg-accent text-primary hover:bg-accent/90 text-sm px-5 py-2 font-semibold inline-flex items-center">
              <Award className="mr-2 h-4 w-4" />
              ATP-Certified Coach
            </Badge>
            <h1 className="mb-8 text-5xl font-bold tracking-tight text-primary-foreground md:text-6xl lg:text-7xl text-balance leading-[1.1]">
              Empowering Learning Professionals to <span className="text-accent">Thrive</span>
            </h1>
            <p className="mb-12 text-xl md:text-2xl text-primary-foreground/90 leading-relaxed text-pretty max-w-3xl mx-auto">
              Custom L&D programs, ATP-certified coaching, and career mentoring for talent development leaders in MENA
              and beyond.
            </p>
            <div className="flex flex-col gap-5 sm:flex-row sm:justify-center sm:gap-6">
              <Button
                asChild
                size="lg"
                className="bg-accent text-primary hover:bg-accent/90 font-semibold text-lg px-10 h-14 shadow-lg hover:shadow-xl transition-all"
              >
                <Link href="/services">
                  Explore Services <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent font-semibold text-lg px-10 h-14"
              >
                <Link href="/events">Join a Live Session</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-b border-border bg-background">
        <div className="container px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
                <Users className="h-10 w-10 text-accent" />
              </div>
              <div className="text-4xl font-bold text-primary mb-3">500+</div>
              <div className="text-base text-muted-foreground font-medium">Professionals Coached</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
                <TrendingUp className="h-10 w-10 text-accent" />
              </div>
              <div className="text-4xl font-bold text-primary mb-3">15+</div>
              <div className="text-base text-muted-foreground font-medium">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6">
                <Sparkles className="h-10 w-10 text-accent" />
              </div>
              <div className="text-4xl font-bold text-primary mb-3">100+</div>
              <div className="text-base text-muted-foreground font-medium">Programs Delivered</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 gradient-mesh">
        <div className="container px-6 mx-auto">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-primary">
              Featured Services
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Tailored programs designed to elevate your L&D career and organizational impact
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {services && services.length > 0 ? (
              services.map((service) => (
                <Card
                  key={service.id}
                  className="relative border rounded-lg bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ borderColor: '#0D0A53' }}
                >
                  {/* Navy triangle in top-right corner */}
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-b-[20px]" style={{ borderBottomColor: '#0D0A53' }}></div>
                  
                  <CardHeader className="pb-4">
                    <div className="flex flex-col items-start space-y-4">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded flex items-center justify-center" style={{ backgroundColor: '#FCF7F7', border: '2px solid #0D0A53' }}>
                        <Briefcase className="h-6 w-6" style={{ color: '#0D0A53' }} />
                      </div>
                      
                      {/* Title */}
                      <CardTitle className="text-xl font-bold leading-tight" style={{ color: '#0D0A53' }}>
                        {service.title}
                      </CardTitle>
                      
                      {/* Price */}
                      {service.price && (
                        <CardDescription className="text-lg font-bold" style={{ color: '#C7A600' }}>
                          {service.price}
                        </CardDescription>
                      )}
                      
                      {/* Description */}
                      <CardDescription className="text-sm leading-relaxed" style={{ color: '#0D0A53' }}>
                        {service.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Tools/Badges */}
                    {service.tools && service.tools.length > 0 && (
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {service.tools.slice(0, 3).map((tool, index) => (
                            <Badge 
                              key={index} 
                              className="text-xs px-2 py-1 rounded-full" 
                              style={{ backgroundColor: '#FCF7F7', color: '#0D0A53', border: '1px solid #0D0A53' }}
                            >
                              {tool}
                            </Badge>
                          ))}
                          {service.tools.length > 3 && (
                            <Badge 
                              className="text-xs px-2 py-1 rounded-full" 
                              style={{ backgroundColor: '#C7A600', color: '#0D0A53' }}
                            >
                              +{service.tools.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* CTA Button */}
                    <Button 
                      asChild 
                      className="w-full text-white font-medium h-10 rounded"
                      style={{ backgroundColor: '#0D0A53' }}
                    >
                      <Link href="/services" className="flex items-center justify-center hover:opacity-90">
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-8">
                  <Briefcase className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-xl">No services available yet</p>
              </div>
            )}
          </div>
          <div className="mt-16 text-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-primary hover:bg-primary hover:text-primary-foreground font-semibold bg-transparent text-base px-8 h-12"
            >
              <Link href="/services">
                View All Services <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-accent/5">
        <div className="container px-6 mx-auto">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-primary">
              Upcoming Events
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Join live sessions, workshops, and podcasts to connect with the L&D community
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 max-w-6xl mx-auto">
            {events && events.length > 0 ? (
              events.map((event) => (
                <Card
                  key={event.id}
                  className="relative border rounded-lg bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ borderColor: '#0D0A53' }}
                >
                  {/* Navy triangle in top-right corner */}
                  <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-b-[20px]" style={{ borderBottomColor: '#0D0A53' }}></div>
                  
                  {/* Event Image */}
                  {event.image_url && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <img
                        src={event.image_url || "/placeholder.svg"}
                        alt={event.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className="flex flex-col items-start space-y-4">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded flex items-center justify-center" style={{ backgroundColor: '#FCF7F7', border: '2px solid #0D0A53' }}>
                        <Calendar className="h-6 w-6" style={{ color: '#0D0A53' }} />
                      </div>
                      
                      {/* Title */}
                      <CardTitle className="text-xl font-bold leading-tight" style={{ color: '#0D0A53' }}>
                        {event.title}
                      </CardTitle>
                      
                      {/* Date & Location */}
                      <div className="flex flex-col gap-2 text-sm" style={{ color: '#0D0A53' }}>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" style={{ color: '#C7A600' }} />
                          <span>{new Date(event.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" style={{ color: '#C7A600' }} />
                          <span>{event.location}</span>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <CardDescription className="text-sm leading-relaxed" style={{ color: '#0D0A53' }}>
                        {event.description.length > 120 ? `${event.description.substring(0, 120)}...` : event.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Tools/Badges */}
                    {event.tools && event.tools.length > 0 && (
                      <div className="mb-6">
                        <div className="flex flex-wrap gap-2">
                          {event.tools.slice(0, 3).map((tool, index) => (
                            <Badge 
                              key={index} 
                              className="text-xs px-2 py-1 rounded-full" 
                              style={{ backgroundColor: '#FCF7F7', color: '#0D0A53', border: '1px solid #0D0A53' }}
                            >
                              {tool}
                            </Badge>
                          ))}
                          {event.tools.length > 3 && (
                            <Badge 
                              className="text-xs px-2 py-1 rounded-full" 
                              style={{ backgroundColor: '#C7A600', color: '#0D0A53' }}
                            >
                              +{event.tools.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* CTA Button */}
                    <Button 
                      asChild 
                      className="w-full text-white font-medium h-10 rounded"
                      style={{ backgroundColor: '#0D0A53' }}
                    >
                      <Link href={`/events/${event.id}`} className="flex items-center justify-center hover:opacity-90">
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-20">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-8">
                  <Calendar className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-xl">No upcoming events at the moment</p>
              </div>
            )}
          </div>
          {hasMoreEvents && (
            <div className="mt-16 text-center">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-primary hover:bg-primary hover:text-primary-foreground font-semibold bg-transparent text-base px-8 h-12"
              >
                <Link href="/events">
                  See More Events <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container px-6 mx-auto">
          <div className="mb-20 text-center max-w-3xl mx-auto">
            <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl text-primary">
              Latest Insights
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Thoughts, strategies, and best practices for L&D professionals
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
            {blogs && blogs.length > 0 ? (
              blogs.map((blog) => (
                <Card
                  key={blog.id}
                  className="transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-2 hover:border-accent/50 flex flex-col"
                >
                  <CardHeader className="flex-1">
                    <CardTitle className="text-balance text-2xl">
                      <Link href={`/blog/${blog.slug}`} className="hover:text-accent transition-colors">
                        {blog.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="text-sm mt-2">
                      By {blog.author} • {new Date(blog.published_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base text-muted-foreground leading-relaxed line-clamp-3 mb-4">
                      {blog.content.substring(0, 150)}...
                    </p>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs border-accent/30 text-accent">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground text-xl">No blog posts available yet</p>
              </div>
            )}
          </div>
          <div className="mt-16 text-center">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-primary hover:bg-primary hover:text-primary-foreground font-semibold bg-transparent text-base px-8 h-12"
            >
              <Link href="/blog">
                Read All Posts <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="gradient-primary py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(199,166,0,0.2),transparent_70%)]" />
        <div className="container px-6 mx-auto relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-accent/20 mb-10">
              <Award className="h-12 w-12 text-accent" />
            </div>
            <h2 className="mb-8 text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl text-balance">
              Ready to Transform Your L&D Career?
            </h2>
            <p className="mb-12 text-xl md:text-2xl text-primary-foreground/90 leading-relaxed text-pretty max-w-3xl mx-auto">
              Get personalized coaching, access exclusive resources, and join a thriving community of learning
              professionals.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-accent text-primary hover:bg-accent/90 font-semibold text-lg px-10 h-14 shadow-lg hover:shadow-xl transition-all"
            >
              <Link href="/contact">
                Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
