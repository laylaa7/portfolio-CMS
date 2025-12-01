import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AuthProvider } from "@/contexts/auth-context"
// theme provider removed - dark mode disabled for now
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Mohamed Elaghoury | L&D Professional",
  description: "ATP-certified coaching and career mentoring for Learning & Development professionals",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <div className="flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </Suspense>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
