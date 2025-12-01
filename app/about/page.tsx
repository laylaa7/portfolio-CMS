import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

/*
  Restored static-like About page (server-rendered)
  - Three-column layout: Journey (timeline) | Skills (cards) | Mission (rich)
  - Content is read from `about_sections` so it's editable via the admin UI
  - Images intentionally omitted (per your request)
*/

export default async function AboutPage() {
  const supabase = await createClient()

  const { data: rows } = await supabase
    .from("about_sections")
    .select("*")
    .order("position", { ascending: true })

  const sections = rows ?? []

  // Prefer sections by known titles (seed uses these). Fall back to kinds.
  const findByTitle = (title: string) => sections.find((s: any) => s.title === title)
  const journey = findByTitle("My Journey") || sections.find((s: any) => s.kind === "timeline")
  const skills = findByTitle("Skills & Expertise") || sections.find((s: any) => s.kind === "cards")
  const mission = findByTitle("My Mission") || sections.find((s: any) => s.kind === "rich")

  // Helper to safely parse payload
  const parsePayload = (p: any) => (typeof p === "string" ? JSON.parse(p || "{}") : p || {})

  return (
    <main className="min-h-screen py-24 md:py-32" style={{ backgroundColor: '#FCF7F7' }}>
      <div className="container px-6 mx-auto">
        {/* HERO — two-column layout */}
        {/** Use hero section if present (editable via admin). We intentionally do not render images — the right column is a decorative card. */}
        {(() => {
          const hero = sections.find((s: any) => s.kind === 'hero')
          const payload = hero ? parsePayload(hero.payload) : {}
          const main = payload?.title_main || hero?.title || "Hello, I'm"
          const highlight = payload?.title_highlight || ''
          const subtitle = payload?.subtitle || ''
          const ctaLabel = payload?.primary_cta_label || 'Learn More'
          const ctaUrl = payload?.primary_cta_url || '/contact'

          return (
            <section className="mb-20">
              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8">
                <div className="md:col-span-7 lg:col-span-8">
                  <h1 className="mb-6 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
                    <span className="text-[#0D0A53]">{main} </span>
                    {highlight ? <span style={{ color: '#C7A600' }}>{highlight}</span> : null}
                  </h1>
                  {subtitle ? <p className="text-lg md:text-xl mt-4 mb-6 text-[#0D0A53]">{subtitle}</p> : null}
                  <div>
                    <a href={ctaUrl} className="inline-block px-6 py-3 rounded shadow-md font-medium" style={{ backgroundColor: '#0D0A53', color: '#fff' }}>{ctaLabel}</a>
                  </div>
                </div>

                <div className="md:col-span-5 lg:col-span-4 flex justify-center">
                  {/* Decorative card (no image upload) */}
                  <div className="relative w-64 h-80 rounded-xl bg-white shadow-xl flex items-center justify-center" style={{ border: '1px solid rgba(13,10,83,0.06)' }}>
                    <div className="w-36 h-36 rounded-lg bg-gradient-to-br from-gray-100 to-gray-50" />
                    <div className="absolute -bottom-4 right-4 w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C7A600' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#0D0A53" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.973c.3.922-.755 1.688-1.54 1.118l-3.381-2.455a1 1 0 00-1.176 0l-3.381 2.455c-.784.57-1.839-.196-1.54-1.118l1.287-3.973a1 1 0 00-.364-1.118L2.05 9.401c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.974z"/></svg>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )
        })()}

  {/* Three-column area (Journey | Skills | Mission) */}
  <div className="grid gap-8 md:grid-cols-3">
          {/* Journey / Timeline */}
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#0D0A53' }}>{journey?.title || 'My Journey'}</h2>
            <div className="space-y-4">
              {journey && parsePayload(journey.payload).items ? (
                parsePayload(journey.payload).items.map((it: any, i: number) => (
                  <div key={i} className="p-4 rounded border bg-white" style={{ borderColor: '#0D0A53' }}>
                    <div className="text-sm text-gray-500 mb-1">{it.date}</div>
                    <div className="font-semibold" style={{ color: '#0D0A53' }}>{it.title}</div>
                    <div className="mt-2" dangerouslySetInnerHTML={{ __html: it.description || '' }} />
                  </div>
                ))
              ) : (
                <p style={{ color: '#0D0A53' }}>No timeline items yet. Add them via the About editor.</p>
              )}
            </div>
          </div>

          {/* Skills / Cards */}
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#0D0A53' }}>{skills?.title || 'Skills & Expertise'}</h2>
            <div className="grid gap-4">
              {skills && parsePayload(skills.payload).cards ? (
                parsePayload(skills.payload).cards.map((c: any, idx: number) => (
                  <Card key={idx} className="bg-white">
                    <CardHeader>
                      <CardTitle className="text-lg" style={{ color: '#0D0A53' }}>{c.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        <div dangerouslySetInnerHTML={{ __html: c.description || '' }} />
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p style={{ color: '#0D0A53' }}>No skills added yet. Use the About editor to add cards.</p>
              )}
            </div>
          </div>

          {/* Mission / Rich HTML */}
          <div>
            <h2 className="text-xl font-semibold mb-4" style={{ color: '#0D0A53' }}>{mission?.title || 'My Mission'}</h2>
            <div className="prose max-w-none bg-white p-6 rounded" style={{ color: '#0D0A53' }}>
              {mission && parsePayload(mission.payload).html ? (
                <div dangerouslySetInnerHTML={{ __html: parsePayload(mission.payload).html }} />
              ) : (
                <p style={{ color: '#0D0A53' }}>Add a mission statement via the About editor.</p>
              )}
            </div>
          </div>
        </div>

        {/* Render any additional enabled sections (those not part of the three-column defaults) */}
        {(() => {
          const defaultIds = new Set([journey?.id, skills?.id, mission?.id].filter(Boolean))
          const extra = sections.filter((s: any) => s.kind !== 'hero' && (s.payload?.enabled !== false) && !defaultIds.has(s.id))
          if (!extra || extra.length === 0) return null
          return (
            <div className="mt-12 space-y-12">
              {extra.map((s: any) => {
                const payload = parsePayload(s.payload)
                return (
                  <section key={s.id} className="prose max-w-none">
                    {s.title && <h2 className="text-3xl font-bold" style={{ color: '#0D0A53' }}>{s.title}</h2>}
                    <div dangerouslySetInnerHTML={{ __html: payload.html || s.content_html || '' }} />
                  </section>
                )
              })}
            </div>
          )
        })()}
      </div>
    </main>
  )
}
