import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ResourceForm } from "@/components/admin/resource-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function NewResourcePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border/40 bg-background">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/resources">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Add New Resource</h1>
        </div>
      </header>

  <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-2xl">
          <ResourceForm />
        </div>
      </main>
    </div>
  )
}
