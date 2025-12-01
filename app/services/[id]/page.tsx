import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: serviceRows } = await supabase.from('services').select('*').eq('id', params.id).limit(1)
  const service = serviceRows && serviceRows.length > 0 ? serviceRows[0] : null

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Service not found</p>
      </div>
    )
  }

  // Use service-specific fields with fallbacks
  const heroTitle = service.title
  const heroSubtitle = service.description
  const longDescription = service.long_description || ''
  const features = Array.isArray(service.features) ? service.features : []
  const outcomes = Array.isArray(service.outcomes) ? service.outcomes : []
  const testimonial = service.testimonial || null
  const ctaText = service.page_cta_text || 'Book a call'
  const ctaLink = service.page_cta_link || '/contact'

  return (
    <div className="min-h-screen py-12 md:py-16" style={{ backgroundColor: '#FCF7F7' }}>
      <div className="container px-6 mx-auto">
        <section className="text-center py-8">
          <h1 className="mb-4 text-3xl md:text-4xl font-bold" style={{ color: '#0D0A53' }}>{heroTitle}</h1>
          <p className="mb-6" style={{ color: '#0D0A53' }}>{heroSubtitle}</p>
          <div className="flex justify-center">
            <a href={ctaLink} className="inline-block px-6 py-3 rounded font-medium" style={{ backgroundColor: '#0D0A53', color: '#fff' }}>{ctaText}</a>
          </div>
        </section>

        <section className="mb-10 max-w-3xl mx-auto bg-white rounded-lg p-6" style={{ border: '1px solid #E6E6F0' }}>
          <div dangerouslySetInnerHTML={{ __html: longDescription }} />
        </section>

        {features && features.length > 0 && (
          <section className="mb-10">
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#0D0A53' }}>Features</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {features.map((f: any, i: number) => (
                <div key={i} className="p-4 rounded-lg bg-white" style={{ border: '1px solid #E6E6F0' }}>
                  <div className="font-semibold" style={{ color: '#0D0A53' }}>{f.title || f.benefit || 'Feature'}</div>
                  <div style={{ color: '#0D0A53' }}>{f.text || f.description}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {outcomes && outcomes.length > 0 && (
          <section className="mb-10">
            <h3 className="text-2xl font-bold mb-4" style={{ color: '#0D0A53' }}>Outcomes</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {outcomes.map((o: any, i: number) => (
                <div key={i} className="p-4 rounded-lg bg-white" style={{ border: '1px solid #E6E6F0' }}>
                  <div className="font-semibold" style={{ color: '#0D0A53' }}>{o.benefit || o.title}</div>
                  <div style={{ color: '#0D0A53' }}>{o.text}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {testimonial && (
          <section className="mb-10 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg p-6" style={{ border: '1px solid #E6E6F0' }}>
              <blockquote className="italic text-lg" style={{ color: '#0D0A53' }}>“{testimonial.quote}”</blockquote>
              <p className="mt-4 font-semibold" style={{ color: '#0D0A53' }}>{testimonial.author} — <span className="font-normal">{testimonial.role}</span></p>
            </div>
          </section>
        )}

        <section className="text-center py-8">
          <a href={ctaLink} className="inline-block px-6 py-3 rounded font-medium" style={{ backgroundColor: '#0D0A53', color: '#fff' }}>{ctaText}</a>
        </section>
      </div>
    </div>
  )
}
