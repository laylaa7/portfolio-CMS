import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Briefcase, Calendar, BookOpen, FileText, Users, User as UserIcon, LogOut } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Get counts for dashboard stats
  const { count: servicesCount } = await supabase.from("services").select("*", { count: "exact", head: true })
  const { count: eventsCount } = await supabase.from("events").select("*", { count: "exact", head: true })
  const { count: blogsCount } = await supabase.from("blogs").select("*", { count: "exact", head: true })
  const { count: resourcesCount } = await supabase.from("resources").select("*", { count: "exact", head: true })
  
  // Get user count from public.users table
  const { count: usersCount } = await supabase.from("users").select("*", { count: "exact", head: true })

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border/40 bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/">View Site</Link>
            </Button>
            <form action="/api/auth/signout" method="post">
              <Button type="submit" variant="ghost" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">Manage your portfolio content from here</p>
        </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Services</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{servicesCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total services</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{eventsCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogsCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total posts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resources</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resourcesCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total resources</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total users</p>
            </CardContent>
          </Card>
        </div>

                {/* Management Links */}
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Briefcase className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Manage Services</CardTitle>
              <CardDescription>Add, edit, or remove services</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link href="/admin/services">Manage Services</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Calendar className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Manage Events</CardTitle>
              <CardDescription>Schedule and manage events</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link href="/admin/events">Manage Events</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Manage Blog</CardTitle>
              <CardDescription>Create and edit blog posts</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link href="/admin/blogs">Manage Blog</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Manage Resources</CardTitle>
              <CardDescription>Upload and organize resources</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link href="/admin/resources">Manage Resources</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Manage Users</CardTitle>
              <CardDescription>Manage user accounts and roles</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link href="/admin/users">Manage Users</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <UserIcon className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Edit About</CardTitle>
              <CardDescription>Update bio and contact info</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Link href="/admin/about">Edit About</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
