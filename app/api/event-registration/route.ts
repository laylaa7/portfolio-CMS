import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { event_id, name, email, phone } = await request.json()

    // Validate required fields
    if (!event_id || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Check if event exists
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, title")
      .eq("id", event_id)
      .single()

    if (eventError || !event) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    // Check if user is already registered for this event
    const { data: existingRegistration } = await supabase
      .from("event_registrations")
      .select("id")
      .eq("event_id", event_id)
      .eq("email", email)
      .single()

    if (existingRegistration) {
      return NextResponse.json(
        { error: "You are already registered for this event" },
        { status: 409 }
      )
    }

    // Insert registration
    const { data, error } = await supabase
      .from("event_registrations")
      .insert([
        {
          event_id,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone ? phone.trim() : null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Registration error:", error)
      return NextResponse.json(
        { error: `Failed to register: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: "Registration successful", 
        registration: data 
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Registration API error:", error)
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    )
  }
}
