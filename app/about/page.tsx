import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { Mail, Phone, Linkedin } from "lucide-react"
import Link from "next/link"

export default async function AboutPage() {
  const supabase = await createClient()
  const { data: about } = await supabase.from("about").select("*").single()

  return (
    <div className="container py-12 md:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">About Mohamed</h1>
        </div>

        {about ? (
          <div className="space-y-8">
            {about.image_url && (
              <div className="mx-auto w-48 h-48 rounded-full overflow-hidden">
                <img
                  src={about.image_url || "/placeholder.svg"}
                  alt="Mohamed Elaghoury"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <Card>
              <CardContent className="pt-6">
                <div className="prose prose-lg max-w-none">
                  <p className="whitespace-pre-wrap leading-relaxed text-foreground">{about.bio}</p>
                </div>
              </CardContent>
            </Card>

            {about.contact_info && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="mb-4 text-2xl font-bold">Get in Touch</h2>
                  <div className="space-y-4">
                    {about.contact_info.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        <a href={`mailto:${about.contact_info.email}`} className="text-primary hover:underline">
                          {about.contact_info.email}
                        </a>
                      </div>
                    )}
                    {about.contact_info.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-muted-foreground" />
                        <a href={`tel:${about.contact_info.phone}`} className="text-primary hover:underline">
                          {about.contact_info.phone}
                        </a>
                      </div>
                    )}
                    {about.contact_info.linkedin && (
                      <div className="flex items-center gap-3">
                        <Linkedin className="h-5 w-5 text-muted-foreground" />
                        <a
                          href={about.contact_info.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="mt-6">
                    <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      <Link href="/contact">Send a Message</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">About information coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}
