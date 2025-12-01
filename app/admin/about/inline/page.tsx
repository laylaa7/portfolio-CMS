import AboutInlineEditor from '@/components/admin/about-inline-editor'
import AdminContainer from '@/components/admin/admin-container'

export const metadata = {
  title: 'Edit About Inline',
}

export default function EditAboutInlinePage() {
  return (
    <AdminContainer>
      <div className="prose">
        <h1>Edit About Page (Inline)</h1>
        <p>Inline editor — hover sections to show controls, edit in place and save.</p>
      </div>

      <div className="mt-6">
        <AboutInlineEditor />
      </div>
    </AdminContainer>
  )
}
