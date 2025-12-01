import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import HomePageForm from "@/components/admin/homepage-form"
import Link from "next/link"
import AdminContainer from "@/components/admin/admin-container"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function EditHomePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <AdminContainer title="Edit Homepage Content">
      <div className="max-w-4xl">
        <HomePageForm />
      </div>
    </AdminContainer>
  )
}
