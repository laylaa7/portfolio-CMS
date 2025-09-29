import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, Calendar, Briefcase, Award } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch latest content
  const { data: services } = await supabase.from("services").select("*").limit(3)
  const { data: events } = await supabase.from("events").select("*").order("date", { ascending: true }).limit(2)
  const { data: blogs } = await supabase.from("blogs").select("*").order("published_at", { ascending: false }).limit(3)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-20 md:py-32">
        <div className="container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-secondary text-secondary-foreground hover:bg-secondary/90">
              ATP-Certified Coach
            </Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl text-balance">
              Empowering Learning Professionals to Thrive
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/90 leading-relaxed text-pretty">
              Custom L&D programs, ATP-certified coaching, and career mentoring for talent development leaders in MENA
              and beyond.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link href="/services">
                  Explore Services <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                <Link href="/events">Join a Live Session</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.05),transparent_50%)]" />
      </section>

      {/* Services Preview */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Featured Services</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground leading-relaxed">
              Tailored programs designed to elevate your L&D career and organizational impact
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {services && services.length > 0 ? (
              services.map((service) => (
                <Card key={service.id} className="transition-shadow hover:shadow-lg">
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
                    <CardTitle>{service.title}</CardTitle>
                    {service.price && (
                      <CardDescription className="text-secondary font-semibold">{service.price}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No services available yet</p>
              </div>
            )}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/services">
                View All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-muted/30 py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Upcoming Events</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground leading-relaxed">
              Join live sessions, workshops, and podcasts to connect with the L&D community
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {events && events.length > 0 ? (
              events.map((event) => (
                <Card key={event.id} className="transition-shadow hover:shadow-lg">
                  {event.image_url && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <img
                        src={event.image_url || "/placeholder.svg"}
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-balance">{event.title}</CardTitle>
                      <Badge variant="secondary" className="shrink-0">
                        <Calendar className="mr-1 h-3 w-3" />
                        {new Date(event.date).toLocaleDateString()}
                      </Badge>
                    </div>
                    <CardDescription>{event.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No upcoming events at the moment</p>
              </div>
            )}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/events">
                View All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">Latest Insights</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground leading-relaxed">
              Thoughts, strategies, and best practices for L&D professionals
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {blogs && blogs.length > 0 ? (
              blogs.map((blog) => (
                <Card key={blog.id} className="transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-balance">
                      <Link href={`/blog/${blog.slug}`} className="hover:text-primary transition-colors">
                        {blog.title}
                      </Link>
                    </CardTitle>
                    <CardDescription>
                      By {blog.author} • {new Date(blog.published_at).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {blog.content.substring(0, 150)}...
                    </p>
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No blog posts available yet</p>
              </div>
            )}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link href="/blog">
                Read All Posts <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Award className="mx-auto mb-6 h-12 w-12 text-secondary" />
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl text-balance">
              Ready to Transform Your L&D Career?
            </h2>
            <p className="mb-8 text-lg text-primary-foreground/90 leading-relaxed text-pretty">
              Get personalized coaching, access exclusive resources, and join a thriving community of learning
              professionals.
            </p>
            <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Link href="/contact">
                Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
