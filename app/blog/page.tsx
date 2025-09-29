import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { BookOpen } from "lucide-react"
import Link from "next/link"

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: blogs } = await supabase.from("blogs").select("*").order("published_at", { ascending: false })

  return (
    <div className="container py-12 md:py-16">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Blog</h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Insights, strategies, and best practices for Learning & Development professionals
        </p>
      </div>

      {blogs && blogs.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <Card key={blog.id} className="flex flex-col transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle className="text-balance">
                  <Link href={`/blog/${blog.slug}`} className="hover:text-primary transition-colors">
                    {blog.title}
                  </Link>
                </CardTitle>
                <CardDescription>
                  By {blog.author} • {new Date(blog.published_at).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground leading-relaxed line-clamp-4">
                  {blog.content.substring(0, 200)}...
                </p>
                {blog.tags && blog.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <BookOpen className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Blog Posts Yet</h3>
          <p className="text-muted-foreground">Check back soon for insights and articles</p>
        </div>
      )}
    </div>
  )
}
