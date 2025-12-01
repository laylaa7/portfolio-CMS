import Link from "next/link"
import {
  Mail,
  Phone,
  Facebook,
  Linkedin,
  Instagram,
  Twitter,
  X as XIcon,
  Github,
  Youtube,
  Slack,
  // note: lucide may not include all platform icons; fall back if missing
} from "lucide-react"
import { createClient } from "@/lib/supabase/server"

function renderIcon(name: string | null | undefined, iconUrl?: string | null) {
  if (iconUrl) {
    return <img src={iconUrl} alt={name || 'icon'} className="h-5 w-5" />
  }

  switch (name) {
    case 'email':
      return <Mail className="h-5 w-5" />
    case 'phone':
      return <Phone className="h-5 w-5" />
    case 'facebook':
      return <Facebook className="h-5 w-5" />
    case 'linkedin':
      return <Linkedin className="h-5 w-5" />
    case 'instagram':
      return <Instagram className="h-5 w-5" />
    case 'twitter':
      return <Twitter className="h-5 w-5" />
    case 'x':
      return <XIcon className="h-5 w-5" />
    case 'github':
      return <Github className="h-5 w-5" />
    case 'youtube':
      return <Youtube className="h-5 w-5" />
    case 'slack':
      return <Slack className="h-5 w-5" />
    default:
      // fallback: show the name text as small label
      if (name) return <span className="text-xs text-muted-foreground">{name}</span>
      return null
  }
}

export async function SiteFooter() {
  try {
    const supabase = await createClient()
    const { data: rows } = await supabase.from('footer').select('*').limit(1)
    const footer = rows && rows.length > 0 ? rows[0] : null

    const quickLinks = footer?.quick_links && Array.isArray(footer.quick_links) ? footer.quick_links : [
      { label: 'Services', url: '/services' },
      { label: 'Events', url: '/events' },
      { label: 'Blog', url: '/blog' },
      { label: 'Resources', url: '/resources' },
    ]

    const aboutLinks = footer?.about_links && Array.isArray(footer.about_links) ? footer.about_links : [
      { label: 'About Mohamed', url: '/about' },
      { label: 'Contact', url: '/contact' },
    ]

    const socialLinks = footer?.social_links && Array.isArray(footer.social_links) ? footer.social_links : []

    return (
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container py-12 mx-[100px] shadow-none">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary">Mohamed Elaghoury</h3>
              {footer?.left_html ? (
                <div className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: footer.left_html }} />
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">ATP-certified coaching and career mentoring for L&D professionals in MENA and beyond.</p>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {quickLinks.map((l: any) => (
                  <li key={l.url + l.label}>
                    <Link href={l.url || '#'} className="text-muted-foreground hover:text-primary transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">About</h4>
              <ul className="space-y-2 text-sm">
                {aboutLinks.map((l: any) => (
                  <li key={l.url + l.label}>
                    <Link href={l.url || '#'} className="text-muted-foreground hover:text-primary transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Connect</h4>
              <div className="flex gap-4">
                {socialLinks.map((s: any) => (
                  <a key={s.id} href={s.url || '#'} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    {renderIcon(s.iconName, s.iconUrl)}
                    <span className="sr-only">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            {footer?.copyright_html ? (
              <div dangerouslySetInnerHTML={{ __html: footer.copyright_html }} />
            ) : (
              <p>&copy; {new Date().getFullYear()} Mohamed Elaghoury. All rights reserved.</p>
            )}
          </div>
        </div>
      </footer>
    )
  } catch (err) {
    // fallback to previous static rendering
    return (
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container py-12 mx-[100px] shadow-none">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary">Mohamed Elaghoury</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">ATP-certified coaching and career mentoring for L&D professionals in MENA and beyond.</p>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">Services</Link>
                </li>
                <li>
                  <Link href="/events" className="text-muted-foreground hover:text-primary transition-colors">Events</Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link>
                </li>
                <li>
                  <Link href="/resources" className="text-muted-foreground hover:text-primary transition-colors">Resources</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">About</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Mohamed</Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Connect</h4>
              <div className="flex gap-4">
                <a href="mailto:contact@example.com" className="text-muted-foreground hover:text-primary transition-colors"><Mail className="h-5 w-5" /></a>
                <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary transition-colors"><Phone className="h-5 w-5" /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Mohamed Elaghoury. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }
}
