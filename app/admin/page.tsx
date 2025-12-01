import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminContainer from "@/components/admin/admin-container"
import AdminCard from "@/components/admin/admin-card"
import { Edit3, Briefcase, Calendar, BookOpen, FileText, Users, User as UserIcon, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
    <AdminContainer title="Admin Dashboard">
      <div className="mb-8 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">Welcome back!</h2>
          <p className="text-muted-foreground">Manage your portfolio content from here</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-col items-center justify-center pb-2">
              <Briefcase className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-sm font-medium">Services</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold">{servicesCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total services</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col items-center justify-center pb-2">
              <Calendar className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-sm font-medium">Events</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold">{eventsCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col items-center justify-center pb-2">
              <BookOpen className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold">{blogsCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total posts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col items-center justify-center pb-2">
              <FileText className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-sm font-medium">Resources</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold">{resourcesCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total resources</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-col items-center justify-center pb-2">
              <Users className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-sm font-medium">Users</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-2xl font-bold">{usersCount || 0}</div>
              <p className="text-xs text-muted-foreground">Total users</p>
            </CardContent>
          </Card>
        </div>
        {/* Management Links */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <AdminCard
            title="Customize Homepage"
            description="Edit hero content and CTAs"
            href="/admin/home/content"
            icon={<Edit3 className="h-8 w-8 mb-2 text-emerald-600" />}
            buttonText="Customize"
          />

          <AdminCard
            title="Manage Services"
            description="Add, edit, or remove services"
            href="/admin/services"
            icon={<Briefcase className="h-8 w-8 mb-2 text-primary" />}
            buttonText="Manage"
          />

          <AdminCard
            title="Manage Events"
            description="Schedule and manage events"
            href="/admin/events"
            icon={<Calendar className="h-8 w-8 mb-2 text-primary" />}
            buttonText="Manage"
          />

          <AdminCard
            title="Manage Blog"
            description="Create and edit blog posts"
            href="/admin/blogs"
            icon={<BookOpen className="h-8 w-8 mb-2 text-primary" />}
            buttonText="Manage"
          />

          <AdminCard
            title="Manage Resources"
            description="Upload and organize resources"
            href="/admin/resources"
            icon={<FileText className="h-8 w-8 mb-2 text-primary" />}
            buttonText="Manage"
          />

          <AdminCard
            title="Manage Users"
            description="Manage user accounts and roles"
            href="/admin/users"
            icon={<Users className="h-8 w-8 mb-2 text-primary" />}
            buttonText="Manage"
          />

          <AdminCard
            title="Edit About"
            description="Manage About page sections (add / remove / reorder)"
            href="/admin/about/content"
            icon={<UserIcon className="h-8 w-8 mb-2 text-primary" />}
            buttonText="Edit"
          />

          <AdminCard
            title="Edit Footer"
            description="Site footer content and links"
            href="/admin/footer/content"
            icon={<FileText className="h-8 w-8 mb-2 text-sky-600" />}
            buttonText="Edit"
          />
        </div>
    </AdminContainer>
  )
}
