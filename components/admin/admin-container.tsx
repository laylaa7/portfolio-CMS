"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Wifi, WifiOff } from "lucide-react"
import { toast, Toaster } from "sonner"
import { createClient } from "@/lib/supabase/client"

type Props = {
  title?: string
  children: React.ReactNode
}

export default function AdminContainer({ title, children }: Props) {
  const [online, setOnline] = useState<boolean>(true)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    setOnline(typeof navigator !== 'undefined' ? navigator.onLine : true)
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border/40 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            {title && <h1 className="ml-2 text-xl font-bold">{title}</h1>}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {online ? (
                <span className="inline-flex items-center gap-1 text-green-600">
                  <Wifi className="h-4 w-4" /> Online
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-red-600">
                  <WifiOff className="h-4 w-4" /> Offline
                </span>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  // Try a small test request to Supabase and show a toast with result
                  try {
                    setChecking(true)
                    const supabase = createClient()
                    // quick lightweight select to verify connectivity
                    const { error } = await supabase.from("homepage").select("id").limit(1)
                    if (error) {
                      toast.error(`Reconnect failed: ${error.message || 'server error'}`)
                      setOnline(false)
                    } else {
                      toast.success("Reconnected to backend")
                      setOnline(true)
                    }
                  } catch (err: any) {
                    toast.error(`Reconnect failed: ${err?.message || String(err)}`)
                    setOnline(false)
                  } finally {
                    setChecking(false)
                  }
                }}
                className="ml-2"
                aria-label="Reconnect"
              >
                {checking ? 'Checking…' : 'Reconnect'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Toasts */}
      <Toaster position="top-right" />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  )
}
