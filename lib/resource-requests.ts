import { createClient } from "@/lib/supabase/client"
import type { ResourceRequest, Resource } from "@/lib/types"

export async function requestResourceAccess(resourceId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("You must be logged in to request access")
  }

  const { data, error } = await supabase
    .from("resource_requests")
    .insert({
      user_id: user.id,
      resource_id: resourceId,
      status: "pending"
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getUserResourceRequests() {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error("You must be logged in")
  }

  const { data, error } = await supabase
    .from("resource_requests")
    .select(`
      *,
      resource:resources(*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return data as (ResourceRequest & { resource: Resource })[]
}

export async function getResourceAccessStatus(resourceId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return null
  }

  const { data, error } = await supabase
    .from("resource_requests")
    .select("*")
    .eq("user_id", user.id)
    .eq("resource_id", resourceId)
    .single()

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message)
  }

  return data as ResourceRequest | null
}

export async function checkResourceAccess(resourceId: string) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return false
  }

  // Check if user is admin
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single()

  if (userData?.role === "admin") {
    return true
  }

  // Check if user has approved access
  const { data: request } = await supabase
    .from("resource_requests")
    .select("*")
    .eq("user_id", user.id)
    .eq("resource_id", resourceId)
    .eq("status", "approved")
    .gt("expires_at", new Date().toISOString())
    .single()

  return !!request
}

export async function generateSignedUrl(resourceId: string) {
  const supabase = createClient()
  
  // Check if user has access
  const hasAccess = await checkResourceAccess(resourceId)
  if (!hasAccess) {
    throw new Error("You don't have access to this resource")
  }

  // Get resource details
  const { data: resource, error: resourceError } = await supabase
    .from("resources")
    .select("file_url, file_name")
    .eq("id", resourceId)
    .single()

  if (resourceError || !resource?.file_url) {
    throw new Error("Resource not found")
  }

  // Extract file path from URL
  const url = new URL(resource.file_url)
  const filePath = url.pathname.split("/").slice(3).join("/") // Remove /storage/v1/object/public/portfolio-files/

  // Generate signed URL (valid for 1 hour)
  const { data, error } = await supabase.storage
    .from("portfolio-files")
    .createSignedUrl(filePath, 3600) // 1 hour

  if (error) {
    throw new Error("Failed to generate download link")
  }

  return {
    signedUrl: data.signedUrl,
    fileName: resource.file_name
  }
}

