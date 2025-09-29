import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { BlogForm } from "@/components/admin/blog-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: blog } = await supabase.from("blogs").select("*").eq("id", id).single()

  if (!blog) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border/40 bg-background">
        <div className="container flex h-16 items-center gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/blogs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-xl font-bold">Edit Post</h1>
        </div>
      </header>

      <main className="container py-8">
        <div className="mx-auto max-w-3xl">
          <BlogForm blog={blog} />
        </div>
      </main>
    </div>
  )
}
