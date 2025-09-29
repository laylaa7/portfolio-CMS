import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { BookOpen } from "lucide-react"
import Link from "next/link"

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: blogs } = await supabase.from("blogs").select("*").order("published_at", { ascending: false })

  return (
    <div className="min-h-screen py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl mb-16 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl text-balance">Blog</h1>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Insights, strategies, and best practices for Learning & Development professionals
          </p>
        </div>

        {blogs && blogs.length > 0 ? (
          <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Card
                key={blog.id}
                className="flex flex-col transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-accent"
              >
                <CardHeader>
                  <CardTitle className="text-balance text-xl">
                    <Link href={`/blog/${blog.slug}`} className="hover:text-accent transition-colors">
                      {blog.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-base">
                    By {blog.author} • {new Date(blog.published_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground leading-relaxed line-clamp-4 text-base">
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
          <div className="text-center py-24">
            <BookOpen className="mx-auto h-20 w-20 text-muted-foreground/50 mb-6" />
            <h3 className="text-2xl font-semibold mb-3">No Blog Posts Yet</h3>
            <p className="text-muted-foreground text-lg">Check back soon for insights and articles</p>
          </div>
        )}
      </div>
    </div>
  )
}
