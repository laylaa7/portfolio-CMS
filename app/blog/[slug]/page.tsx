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
    <article className="min-h-screen py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12 text-center">
            <h1 className="mb-8 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl text-balance">
              {blog.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-base text-muted-foreground">
              <span className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {blog.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {new Date(blog.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                {blog.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap leading-relaxed text-foreground text-lg">{blog.content}</div>
          </div>
        </div>
      </div>
    </article>
  )
}
