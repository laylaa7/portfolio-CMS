"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { 
  Mail, 
  Phone, 
  Linkedin, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Users, 
  Target,
  ArrowRight,
  LogOut
} from "lucide-react"
import Link from "next/link"
import type { About } from "@/lib/types"

export default function AboutPage() {
  const [about, setAbout] = useState<About | null>({
    id: "default",
    bio: "Mohamed Elaghoury is an ATP-certified Learning & Development professional with over 15 years of experience in corporate training, instructional design, and leadership development. He specializes in helping organizations build effective learning cultures and develop their talent through strategic L&D initiatives.",
    image_url: "/placeholder-user.jpg",
    contact_info: {
      email: "mohamed@example.com",
      phone: "+1234567890",
      linkedin: "https://linkedin.com/in/mohamed"
    },
    created_at: new Date().toISOString()
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Set a timeout to force loading to false after 3 seconds
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 3000)

    const fetchAbout = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("about").select("*").single()
        
        if (error) {
          console.error("Error fetching about data:", error)
        } else if (data) {
          setAbout(data)
        }
      } catch (error) {
        console.error("Error fetching about data:", error)
      } finally {
        setLoading(false)
        clearTimeout(timeout)
      }
    }
    
    fetchAbout()
    
    return () => clearTimeout(timeout)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FCF7F7' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p style={{ color: '#0D0A53' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FCF7F7' }}>

      {/* Hero Section */}
      <section id="intro" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight" style={{ color: '#0D0A53' }}>
                  Mohamed
                  <br />
                  <span style={{ color: '#C7A600' }}>Elaghoury</span>
            </h1>
                <p className="text-xl md:text-2xl leading-relaxed" style={{ color: '#0D0A53' }}>
                  Learning & Development Professional
                </p>
                <p className="text-lg leading-relaxed" style={{ color: '#0D0A53' }}>
                  ATP-certified coach and career mentor specializing in elevating L&D professionals and organizational learning capabilities.
                </p>
          </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-white font-medium px-8 py-3" style={{ backgroundColor: '#0D0A53' }}>
                  <Link href="#contact" className="flex items-center">
                    Get in Touch
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-2 font-medium px-8 py-3" style={{ borderColor: '#0D0A53', color: '#0D0A53' }}>
                  <Link href="/services">View Services</Link>
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={about?.image_url || "/placeholder-user.jpg"}
                    alt="Mohamed Elaghoury"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full" style={{ backgroundColor: '#C7A600' }}></div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full" style={{ backgroundColor: '#0D0A53' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section id="journey" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#0D0A53' }}>
              My Journey
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#0D0A53' }}>
              From corporate training to becoming a recognized expert in Learning & Development
            </p>
          </div>

          <div className="space-y-20">
            {/* Timeline Item 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C7A600' }}>
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#0D0A53' }}>2010 - 2015</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold" style={{ color: '#0D0A53' }}>
                  Early Career in Training
                </h3>
                <p className="text-lg leading-relaxed" style={{ color: '#0D0A53' }}>
                  Started my journey in corporate training, developing foundational skills in adult learning principles and instructional design. Worked with diverse teams to create engaging learning experiences.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-80 h-64 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src="/placeholder.jpg"
                    alt="Early career in training"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="flex justify-center lg:order-first">
                <div className="w-80 h-64 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src="/placeholder.jpg"
                    alt="ATP certification journey"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="space-y-6 lg:order-last">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C7A600' }}>
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#0D0A53' }}>2016 - 2020</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold" style={{ color: '#0D0A53' }}>
                  ATP Certification & Expertise
                </h3>
                <p className="text-lg leading-relaxed" style={{ color: '#0D0A53' }}>
                  Earned ATP (Association for Talent Development) certification and specialized in advanced learning methodologies. Led transformation initiatives for Fortune 500 companies.
                </p>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C7A600' }}>
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#0D0A53' }}>2021 - Present</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold" style={{ color: '#0D0A53' }}>
                  Coaching & Mentoring
                </h3>
                <p className="text-lg leading-relaxed" style={{ color: '#0D0A53' }}>
                  Transitioned to coaching and mentoring L&D professionals, helping them advance their careers and develop strategic thinking capabilities. Published insights and best practices.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="w-80 h-64 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src="/placeholder.jpg"
                    alt="Coaching and mentoring"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Tools Section */}
      <section id="skills" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#0D0A53' }}>
              Skills & Expertise
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#0D0A53' }}>
              Comprehensive capabilities across the Learning & Development spectrum
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Target, title: "Strategic Planning", description: "Developing comprehensive L&D strategies aligned with business objectives" },
              { icon: GraduationCap, title: "Instructional Design", description: "Creating engaging and effective learning experiences" },
              { icon: Users, title: "Leadership Development", description: "Building capabilities in current and future leaders" },
              { icon: Briefcase, title: "Change Management", description: "Guiding organizations through transformation initiatives" },
              { icon: Award, title: "Performance Consulting", description: "Identifying and addressing performance gaps" },
              { icon: Target, title: "Talent Development", description: "Building talent pipelines and succession planning" }
            ].map((skill, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-6" style={{ backgroundColor: '#FCF7F7' }}>
                  <skill.icon className="h-8 w-8" style={{ color: '#C7A600' }} />
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: '#0D0A53' }}>
                  {skill.title}
                </h3>
                <p className="leading-relaxed" style={{ color: '#0D0A53' }}>
                  {skill.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold" style={{ color: '#0D0A53' }}>
              My Mission
            </h2>
            <div className="bg-white p-12 rounded-2xl shadow-2xl">
              <blockquote className="text-2xl md:text-3xl leading-relaxed font-medium italic" style={{ color: '#0D0A53' }}>
                "To empower Learning & Development professionals with the strategic thinking, practical skills, and confidence needed to drive meaningful organizational change and advance their careers."
              </blockquote>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#C7A600' }}>500+</div>
                <p className="text-lg" style={{ color: '#0D0A53' }}>Professionals Mentored</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#C7A600' }}>50+</div>
                <p className="text-lg" style={{ color: '#0D0A53' }}>Organizations Served</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2" style={{ color: '#C7A600' }}>15+</div>
                <p className="text-lg" style={{ color: '#0D0A53' }}>Years Experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#0D0A53' }}>
              Let's Connect
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: '#0D0A53' }}>
              Ready to elevate your L&D career or transform your organization's learning capabilities?
            </p>
          </div>

          <div className="bg-white p-12 rounded-2xl shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6" style={{ color: '#0D0A53' }}>
                    Get in Touch
                  </h3>
                  <p className="text-lg leading-relaxed mb-8" style={{ color: '#0D0A53' }}>
                    I'm always interested in connecting with fellow L&D professionals and exploring new opportunities to make an impact.
                  </p>
                </div>

                <div className="space-y-6">
                  {about?.contact_info?.email && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FCF7F7' }}>
                        <Mail className="h-6 w-6" style={{ color: '#C7A600' }} />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#0D0A53' }}>Email</p>
                          <a
                            href={`mailto:${about.contact_info.email}`}
                          className="text-lg hover:opacity-80 transition-opacity"
                          style={{ color: '#0D0A53' }}
                          >
                            {about.contact_info.email}
                          </a>
                      </div>
                        </div>
                      )}

                  {about?.contact_info?.phone && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FCF7F7' }}>
                        <Phone className="h-6 w-6" style={{ color: '#C7A600' }} />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#0D0A53' }}>Phone</p>
                          <a
                            href={`tel:${about.contact_info.phone}`}
                          className="text-lg hover:opacity-80 transition-opacity"
                          style={{ color: '#0D0A53' }}
                          >
                            {about.contact_info.phone}
                          </a>
                      </div>
                        </div>
                      )}

                  {about?.contact_info?.linkedin && (
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FCF7F7' }}>
                        <Linkedin className="h-6 w-6" style={{ color: '#C7A600' }} />
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: '#0D0A53' }}>LinkedIn</p>
                          <a
                            href={about.contact_info.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          className="text-lg hover:opacity-80 transition-opacity"
                          style={{ color: '#0D0A53' }}
                          >
                          Connect with me
                          </a>
                        </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-bold mb-6" style={{ color: '#0D0A53' }}>
                    Ready to Get Started?
                  </h3>
                  <p className="text-lg leading-relaxed mb-8" style={{ color: '#0D0A53' }}>
                    Whether you're looking for career coaching, organizational consulting, or strategic guidance, I'm here to help you achieve your goals.
                  </p>
                </div>

                <div className="space-y-4">
                  <Button asChild size="lg" className="w-full text-white font-medium py-4" style={{ backgroundColor: '#0D0A53' }}>
                    <Link href="/contact" className="flex items-center justify-center">
                      Send a Message
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full border-2 font-medium py-4" style={{ borderColor: '#0D0A53', color: '#0D0A53' }}>
                    <Link href="/services" className="flex items-center justify-center">
                      View Services
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                      </Button>
                    </div>
              </div>
            </div>
            </div>
        </div>
      </section>

    </div>
  )
}
