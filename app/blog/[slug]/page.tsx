import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { notFound } from "next/navigation"
import { Calendar, User } from "lucide-react"

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: blog } = await supabase.from("blogs").select("*").eq("slug", slug).single()

  if (!blog) {
    notFound()
  }

  return (
    <article className="container py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8">
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl text-balance">{blog.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {blog.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(blog.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap leading-relaxed text-foreground">{blog.content}</div>
        </div>
      </div>
    </article>
  )
}
