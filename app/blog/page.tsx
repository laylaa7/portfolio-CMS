import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { BookOpen, ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

export default async function BlogPage() {
  const supabase = await createClient()
  const { data: blogs } = await supabase.from("blogs").select("*").order("published_at", { ascending: false })

  return (
    <div className="min-h-screen py-24 md:py-32" style={{ backgroundColor: '#FCF7F7' }}>
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl mb-16 text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl text-balance" style={{ color: '#0D0A53' }}>
            Blog
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed" style={{ color: '#0D0A53' }}>
            Insights, strategies, and best practices for Learning & Development professionals
          </p>
        </div>

        {blogs && blogs.length > 0 ? (
          <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Card
                key={blog.id}
                className="relative border rounded-lg bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ borderColor: '#0D0A53' }}
              >
                {/* Navy triangle in top-right corner */}
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-b-[20px]" style={{ borderBottomColor: '#0D0A53' }}></div>
                
                <CardHeader className="pb-4">
                  <div className="flex flex-col items-start space-y-4">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded flex items-center justify-center" style={{ backgroundColor: '#FCF7F7', border: '2px solid #0D0A53' }}>
                      <BookOpen className="h-6 w-6" style={{ color: '#0D0A53' }} />
                    </div>
                    
                    {/* Title */}
                    <CardTitle className="text-xl font-bold leading-tight" style={{ color: '#0D0A53' }}>
                      <Link href={`/blog/${blog.slug}`} className="hover:opacity-80 transition-opacity">
                        {blog.title}
                      </Link>
                    </CardTitle>
                    
                    {/* Author & Date */}
                    <CardDescription className="text-sm" style={{ color: '#0D0A53' }}>
                      By {blog.author} • {new Date(blog.published_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Content Preview */}
                  <p className="leading-relaxed text-sm mb-4" style={{ color: '#0D0A53' }}>
                    {blog.content.substring(0, 150)}...
                  </p>
                  
                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.map((tag) => (
                        <Badge key={tag} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#FCF7F7', color: '#0D0A53', border: '1px solid #0D0A53' }}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Read More Button */}
                  <Link 
                    href={`/blog/${blog.slug}`}
                    className="inline-flex items-center text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ color: '#0D0A53' }}
                  >
                    Read More
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-8" style={{ backgroundColor: '#FCF7F7' }}>
              <BookOpen className="h-12 w-12" style={{ color: '#0D0A53' }} />
            </div>
            <h3 className="text-2xl font-semibold mb-3" style={{ color: '#0D0A53' }}>No Blog Posts Yet</h3>
            <p className="text-lg" style={{ color: '#0D0A53' }}>Check back soon for insights and articles</p>
          </div>
        )}
      </div>
    </div>
  )
}
