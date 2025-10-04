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
      <nav className="container flex h-16 sm:h-20 items-center justify-between px-3 sm:px-4 lg:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Mohamed Elaghoury
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`text-sm xl:text-base font-semibold transition-colors hover:text-accent relative px-2 py-1 ${
                pathname === item.href ? "text-accent" : "text-foreground"
              }`}
            >
              {item.name}
              {pathname === item.href && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full" />
              )}
            </Link>
          ))}
          {/* Auth buttons */}
          {user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs xl:text-sm hidden xl:inline" style={{ color: '#0D0A53' }}>
                {user.user_metadata?.name || user.email}
              </span>
              {isAdmin && (
                <Button asChild size="sm" variant="outline" className="border-2 text-xs xl:text-sm" style={{ borderColor: '#0D0A53', color: '#0D0A53' }}>
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="border-2 text-xs xl:text-sm"
                style={{ borderColor: '#0D0A53', color: '#0D0A53' }}
                onClick={signOut}
              >
                <LogOut className="h-3 w-3 xl:h-4 xl:w-4 mr-1" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          ) : (
            <Button asChild size="sm" variant="outline" className="border-2 text-xs xl:text-sm" style={{ borderColor: '#0D0A53', color: '#0D0A53' }}>
              <Link href="/login">Login</Link>
            </Button>
          )}
          <Button asChild size="sm" className="bg-accent text-primary hover:bg-accent/90 font-semibold text-xs xl:text-sm">
            <Link href="/contact">Contact</Link>
          </Button>
        </div>

        {/* Tablet/Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden hover:bg-accent/10 h-10 w-10"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </nav>

      {/* Mobile/Tablet Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur">
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
