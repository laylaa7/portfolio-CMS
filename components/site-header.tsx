"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, Settings } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"

const navigation = [
  { name: "Services", href: "/services" },
  { name: "Events", href: "/events" },
  { name: "Blog", href: "/blog" },
  { name: "Resources", href: "/resources" },
  { name: "About", href: "/about" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, isAdmin, signOut, loading } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Mohamed Elaghoury
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm font-semibold transition-colors hover:text-accent relative ${
                pathname === item.href ? "text-accent" : "text-foreground"
              }`}
            >
              {item.name}
              {pathname === item.href && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full" />
              )}
            </Link>
          ))}
          {/* Always show auth buttons - no loading state */}
          {user ? (
            <div className="flex items-center gap-2 mr-2">
              <span className="text-sm" style={{ color: '#0D0A53' }}>
                {user.user_metadata?.name || user.email}
              </span>
              {isAdmin && (
                <Button asChild size="sm" variant="outline" className="border-2" style={{ borderColor: '#0D0A53', color: '#0D0A53' }}>
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                className="border-2" 
                style={{ borderColor: '#0D0A53', color: '#0D0A53' }}
                onClick={signOut}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          ) : (
            <Button asChild size="sm" variant="outline" className="border-2 mr-2" style={{ borderColor: '#0D0A53', color: '#0D0A53' }}>
              <Link href="/login">Login</Link>
            </Button>
          )}
          <Button asChild size="sm" className="bg-accent text-primary hover:bg-accent/90 font-semibold mx-0 text-center">
            <Link href="/contact">Contact</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-accent/10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur">
          <div className="container py-6 space-y-4 px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block py-2 text-base font-semibold transition-colors hover:text-accent ${
                  pathname === item.href ? "text-accent" : "text-foreground"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            {/* Mobile auth buttons - no loading state */}
            {user ? (
              <div className="space-y-2">
                <div className="px-2 py-1 text-sm text-gray-500 border-b">
                  {user.user_metadata?.name || user.email}
                </div>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="block py-2 text-base font-semibold transition-colors hover:text-accent"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className="block py-2 text-base font-semibold transition-colors hover:text-accent text-left w-full"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Button asChild size="sm" variant="outline" className="w-full border-2 mb-2" style={{ borderColor: '#0D0A53', color: '#0D0A53' }}>
                <Link href="/login">Login</Link>
              </Button>
            )}
            <Button asChild size="sm" className="w-full bg-accent text-primary hover:bg-accent/90 font-semibold">
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
