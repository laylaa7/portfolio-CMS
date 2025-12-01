import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ContactForm from "@/components/admin/contact-form"
import AdminContainer from "@/components/admin/admin-container"

export default async function EditContactPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <AdminContainer title="Edit Contact">
      <div className="max-w-4xl">
        <ContactForm />
      </div>
    </AdminContainer>
  )
}
