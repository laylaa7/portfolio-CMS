import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Mail, Phone, Linkedin } from "lucide-react"
import Link from "next/link"

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: about } = await supabase.from("about").select("*").single()

  return (
    <div className="min-h-screen py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl text-balance">
              About Mohamed
            </h1>
          </div>

          {about ? (
            <div className="space-y-12">
              {about.image_url && (
                <div className="mx-auto w-56 h-56 rounded-full overflow-hidden ring-4 ring-accent/20">
                  <img
                    src={about.image_url || "/placeholder.svg"}
                    alt="Mohamed Elaghoury"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <Card className="border-2">
                <CardContent className="pt-8 pb-8">
                  <div className="prose prose-lg max-w-none">
                    <p className="whitespace-pre-wrap leading-relaxed text-foreground text-lg">{about.bio}</p>
                  </div>
                </CardContent>
              </Card>

              {about.contact_info && (
                <Card className="border-2">
                  <CardContent className="pt-8 pb-8">
                    <h2 className="mb-6 text-3xl font-bold text-center">Get in Touch</h2>
                    <div className="space-y-6 max-w-md mx-auto">
                      {about.contact_info.email && (
                        <div className="flex items-center gap-4 justify-center">
                          <Mail className="h-6 w-6 text-accent" />
                          <a
                            href={`mailto:${about.contact_info.email}`}
                            className="text-primary hover:text-accent transition-colors text-lg"
                          >
                            {about.contact_info.email}
                          </a>
                        </div>
                      )}
                      {about.contact_info.phone && (
                        <div className="flex items-center gap-4 justify-center">
                          <Phone className="h-6 w-6 text-accent" />
                          <a
                            href={`tel:${about.contact_info.phone}`}
                            className="text-primary hover:text-accent transition-colors text-lg"
                          >
                            {about.contact_info.phone}
                          </a>
                        </div>
                      )}
                      {about.contact_info.linkedin && (
                        <div className="flex items-center gap-4 justify-center">
                          <Linkedin className="h-6 w-6 text-accent" />
                          <a
                            href={about.contact_info.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-accent transition-colors text-lg"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="mt-8 text-center">
                      <Button asChild size="lg" className="px-8">
                        <Link href="/contact">Send a Message</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-muted-foreground text-lg">About information coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
