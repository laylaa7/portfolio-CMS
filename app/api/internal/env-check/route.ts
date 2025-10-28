import { NextResponse } from 'next/server'

export async function GET() {
  // Return only presence flags, never return secret values
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasAnon = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const hasService = !!process.env.SUPABASE_SERVICE_ROLE_KEY

  return NextResponse.json({
    next_public_supabase_url: hasUrl,
    next_public_supabase_anon_key: hasAnon,
    supabase_service_role_key: hasService,
  })
}
