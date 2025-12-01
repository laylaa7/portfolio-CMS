import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ServicesPageForm from "@/components/admin/services-page-form"
import Link from "next/link"
import AdminContainer from "@/components/admin/admin-container"

export default async function EditServicesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <AdminContainer title="Edit Services Page Content">
      <div className="max-w-4xl">
        <ServicesPageForm />
      </div>
    </AdminContainer>
  )
}
