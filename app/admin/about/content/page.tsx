import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import dynamic from 'next/dynamic'
import AdminContainer from '@/components/admin/admin-container'

// Dynamically import the client-side AboutEditor to avoid server-side rendering
const AboutEditor = dynamic(() => import('@/components/admin/about-editor'), { ssr: false })

export default async function EditAboutPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <AdminContainer title="Edit About">
      <div className="max-w-4xl">
        {/* New clean About editor (client-side) */}
        <AboutEditor />
      </div>
    </AdminContainer>
  )
}
