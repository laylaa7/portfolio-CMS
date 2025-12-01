import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Pencil, ArrowLeft } from "lucide-react"
import { DeleteBlogButton } from "@/components/admin/delete-blog-button"

export default async function AdminBlogsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: blogs } = await supabase.from("blogs").select("*").order("published_at", { ascending: false })

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
            <div>
              <h1 className="text-xl font-bold">Manage Blog</h1>
            </div>
          </div>
          <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <Link href="/admin/blogs/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Post
            </Link>
          </Button>
        </div>
      </header>

  <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {blogs && blogs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Card key={blog.id}>
                <CardHeader>
                  <CardTitle className="text-balance">{blog.title}</CardTitle>
                  <CardDescription>
                    By {blog.author} • {new Date(blog.published_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{blog.content.substring(0, 150)}...</p>
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {blog.tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Link href={`/admin/blogs/${blog.id}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <DeleteBlogButton blogId={blog.id} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground mb-4">No blog posts yet</p>
              <Button asChild className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link href="/admin/blogs/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Write Your First Post
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
