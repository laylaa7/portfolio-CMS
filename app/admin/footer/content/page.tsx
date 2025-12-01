import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import FooterForm from "@/components/admin/footer-form"
import AdminContainer from "@/components/admin/admin-container"

export default async function EditFooterPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <AdminContainer title="Edit Footer">
      <div className="max-w-4xl">
        {/* FooterForm is a client component */}
        <FooterForm />
      </div>
    </AdminContainer>
  )
}
