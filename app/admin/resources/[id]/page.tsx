import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ResourceForm } from "@/components/admin/resource-form"
import Link from "next/link"
import AdminContainer from "@/components/admin/admin-container"

export default async function EditResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: resource } = await supabase.from("resources").select("*").eq("id", id).single()

  if (!resource) {
    notFound()
  }

  return (
    <AdminContainer title="Edit Resource">
      <div className="mx-auto max-w-2xl">
        <ResourceForm resource={resource} />
      </div>
    </AdminContainer>
  )
}
