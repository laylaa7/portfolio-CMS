export interface Service {
  id: string
  title: string
  description: string
  image_url?: string
  tools?: string[]
  long_description?: string
  features?: Array<{ title?: string; text?: string }>
  outcomes?: Array<{ benefit?: string; text?: string }>
  testimonial?: { quote?: string; author?: string; role?: string }
  page_cta_text?: string
  page_cta_link?: string
  created_at: string
}

export interface Event {
  id: string
  title: string
  date: string
  location: string
  description: string
  image_url?: string
  tools?: string[]
  created_at: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  content: string
  tags?: string[]
  author: string
  image_url?: string
  published_at: string
  created_at: string
}

export interface Resource {
  id: string
  title: string
  type: string
  link: string
  description?: string
  image_url?: string
  visibility: 'public' | 'protected'
  file_url?: string
  file_name?: string
  file_size?: number
  created_at: string
}

export interface ResourceRequest {
  id: string
  user_id: string
  resource_id: string
  status: 'pending' | 'approved' | 'denied'
  expires_at?: string
  admin_notes?: string
  created_at: string
  updated_at: string
  user?: {
    email: string
  }
  resource?: Resource
}

export interface User {
  id: string
  email: string
  role: 'admin' | 'user'
  created_at: string
  updated_at: string
}

export interface About {
  id: string
  bio: string
  image_url?: string
  contact_info?: {
    email?: string
    phone?: string
    linkedin?: string
  }
  created_at: string
}

export interface EventRegistration {
  id: string
  event_id: string
  name: string
  email: string
  phone?: string
  registered_at: string
  created_at: string
  event?: Event
}
